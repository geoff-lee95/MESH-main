"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Create an escrow account
export async function createEscrowAccount(data: {
  intentId: string
  agentId: string
  escrowAccountPubkey: string
  amount: number
  depositTransactionSignature: string
}) {
  console.log("createEscrowAccount called", data)
  const supabase = await createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Create the escrow account
  const { data: escrowAccount, error } = await supabase
    .from("escrow_accounts")
    .insert({
      intent_id: data.intentId,
      agent_id: data.agentId,
      escrow_account_pubkey: data.escrowAccountPubkey,
      amount: data.amount,
      status: "deposited",
      deposit_transaction_signature: data.depositTransactionSignature,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating escrow account:", error)
    return { success: false, error: error.message }
  }

  // Update the intent to mark it as using escrow
  const { error: intentError } = await supabase
    .from("intents")
    .update({ escrow_enabled: true })
    .eq("id", data.intentId)

  if (intentError) {
    console.error("Error updating intent:", intentError)
    return { success: false, error: intentError.message }
  }

  // Create a notification for the agent
  const { data: agent } = await supabase.from("agents").select("user_id").eq("id", data.agentId).single()

  if (agent) {
    await supabase.from("notifications").insert({
      user_id: agent.user_id,
      title: "Escrow Deposit",
      message: `An intent owner has deposited funds in escrow for your agent.`,
      type: "escrow_deposit",
      metadata: {
        intent_id: data.intentId,
        agent_id: data.agentId,
        escrow_account_id: escrowAccount.id,
      },
    })
  }

  // Revalidate the intent page
  revalidatePath(`/dashboard/intents/${data.intentId}`)

  return { success: true, data: escrowAccount }
}

// Release funds from escrow
export async function releaseFundsFromEscrow(data: {
  escrowAccountId: string
  releaseTransactionSignature: string
}) {
  console.log("releaseFundsFromEscrow called", data)
  const supabase = await createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Get the escrow account
  const { data: escrowAccount, error: fetchError } = await supabase
    .from("escrow_accounts")
    .select("*, intents(*), agents(*)")
    .eq("id", data.escrowAccountId)
    .single()

  if (fetchError || !escrowAccount) {
    console.error("Error fetching escrow account:", fetchError)
    return { success: false, error: fetchError?.message || "Escrow account not found" }
  }

  // Check if the user is the intent owner
  if (escrowAccount.intents.user_id !== user.id) {
    return { success: false, error: "Only the intent owner can release funds" }
  }

  // Update the escrow account
  const { error } = await supabase
    .from("escrow_accounts")
    .update({
      status: "released",
      release_transaction_signature: data.releaseTransactionSignature,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.escrowAccountId)

  if (error) {
    console.error("Error updating escrow account:", error)
    return { success: false, error: error.message }
  }

  // Update the intent status to paid
  const { error: intentError } = await supabase
    .from("intents")
    .update({ status: "paid" })
    .eq("id", escrowAccount.intent_id)

  if (intentError) {
    console.error("Error updating intent:", intentError)
    return { success: false, error: intentError.message }
  }

  // Create a notification for the agent
  await supabase.from("notifications").insert({
    user_id: escrowAccount.agents.user_id,
    title: "Payment Released",
    message: `The intent owner has released payment for your completed work.`,
    type: "payment_released",
    metadata: {
      intent_id: escrowAccount.intent_id,
      agent_id: escrowAccount.agent_id,
      escrow_account_id: escrowAccount.id,
      amount: escrowAccount.amount,
    },
  })

  // Revalidate the intent page
  revalidatePath(`/dashboard/intents/${escrowAccount.intent_id}`)
  revalidatePath(`/dashboard/escrow`)

  return { success: true, data: escrowAccount }
}

// Create a dispute for an escrow account
export async function createEscrowDispute(data: {
  escrowAccountId: string
  reason: string
}) {
  console.log("createEscrowDispute called", data)
  const supabase = await createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Get the escrow account
  const { data: escrowAccount, error: fetchError } = await supabase
    .from("escrow_accounts")
    .select("*, intents(*), agents(*)")
    .eq("id", data.escrowAccountId)
    .single()

  if (fetchError || !escrowAccount) {
    console.error("Error fetching escrow account:", fetchError)
    return { success: false, error: fetchError?.message || "Escrow account not found" }
  }

  // Check if the user is either the intent owner or the agent owner
  const isIntentOwner = escrowAccount.intents.user_id === user.id
  const isAgentOwner = escrowAccount.agents.user_id === user.id

  if (!isIntentOwner && !isAgentOwner) {
    return { success: false, error: "Only the intent owner or agent owner can create a dispute" }
  }

  // Update the escrow account status
  const { error: updateError } = await supabase
    .from("escrow_accounts")
    .update({
      status: "disputed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.escrowAccountId)

  if (updateError) {
    console.error("Error updating escrow account:", updateError)
    return { success: false, error: updateError.message }
  }

  // Create the dispute
  const { data: dispute, error } = await supabase
    .from("escrow_disputes")
    .insert({
      escrow_account_id: data.escrowAccountId,
      intent_id: escrowAccount.intent_id,
      agent_id: escrowAccount.agent_id,
      initiator_id: user.id,
      reason: data.reason,
      status: "open",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating dispute:", error)
    return { success: false, error: error.message }
  }

  // Create notifications for both parties
  const notifyUserId = isIntentOwner ? escrowAccount.agents.user_id : escrowAccount.intents.user_id

  await supabase.from("notifications").insert({
    user_id: notifyUserId,
    title: "Escrow Dispute Created",
    message: `A dispute has been created for an escrow account.`,
    type: "escrow_dispute",
    metadata: {
      intent_id: escrowAccount.intent_id,
      agent_id: escrowAccount.agent_id,
      escrow_account_id: escrowAccount.id,
      dispute_id: dispute.id,
    },
  })

  // Revalidate the intent page
  revalidatePath(`/dashboard/intents/${escrowAccount.intent_id}`)
  revalidatePath(`/dashboard/escrow`)

  return { success: true, data: dispute }
}

// Get escrow accounts for the current user
export async function getEscrowAccounts() {
  const supabase = await createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Get escrow accounts where the user is either the intent owner or the agent owner
  const { data, error } = await supabase
    .from("escrow_accounts")
    .select(`
      *,
      intents!inner(*),
      agents!inner(*)
    `)
    .or(`intents.user_id.eq.${user.id},agents.user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching escrow accounts:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// Get escrow account by ID
export async function getEscrowAccountById(id: string) {
  const supabase = await createServerClient()

  // Get the escrow account
  const { data, error } = await supabase
    .from("escrow_accounts")
    .select(`
      *,
      intents(*),
      agents(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching escrow account:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// Add the missing exports that are referenced elsewhere in the code
export interface EscrowData {
  intentId: string
  agentId: string
  escrowAddress: string
  amount: number
  status: string
  transactionSignature: string
}

export async function createEscrowRecord(data: EscrowData) {
  console.log("Creating escrow record with data:", data)
  const supabase = await createServerClient()

  const { data: userSession, error: userError } = await supabase.auth.getUser()

  if (!userSession) {
    return {
      success: false,
      error: "User not authenticated",
    }
  }

  // Create escrow record
  const { error } = await supabase.from("escrow_accounts").insert({
    intent_id: data.intentId,
    agent_id: data.agentId,
    escrow_account_pubkey: data.escrowAddress,
    amount: data.amount,
    status: data.status,
    deposit_transaction_signature: data.transactionSignature,
  })

  if (error) {
    console.error("Error creating escrow record:", error)
    return {
      success: false,
      error: error.message,
    }
  }

  // Update intent status to "funded"
  const { error: intentError } = await supabase
    .from("intents")
    .update({
      status: "funded",
      escrow_enabled: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.intentId)

  if (intentError) {
    console.error("Error updating intent status:", intentError)
    return {
      success: false,
      error: intentError.message,
    }
  }

  // Get the intent and agent details for notifications
  const { data: intent, error: intentFetchError } = await supabase
    .from("intents")
    .select("title")
    .eq("id", data.intentId)
    .single()

  if (intentFetchError) {
    console.error("Error fetching intent details:", intentFetchError)
    // Continue anyway, this is not critical
  }

  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("name, user_id")
    .eq("id", data.agentId)
    .single()

  if (agentError) {
    console.error("Error fetching agent details:", agentError)
    // Continue anyway, this is not critical
  }

  // Create notifications for the agent owner
  if (intent && agent) {
    const { error: notificationError } = await supabase.from("notifications").insert({
      user_id: agent.user_id,
      title: "Escrow Funded",
      message: `The intent "${intent.title}" has been funded with ${data.amount} SOL in escrow. You can now start working on it.`,
      type: "escrow_funded",
      metadata: {
        intent_id: data.intentId,
        agent_id: data.agentId,
        escrow_address: data.escrowAddress,
        amount: data.amount,
      },
    })

    if (notificationError) {
      console.error("Error creating notification:", notificationError)
      // Continue anyway, this is not critical
    }
  }

  // Revalidate the relevant pages
  revalidatePath("/dashboard/intents")
  revalidatePath(`/dashboard/intents/${data.intentId}`)
  revalidatePath("/dashboard/agent-dashboard")
  revalidatePath("/dashboard/escrow")

  return {
    success: true,
  }
}

export async function updateEscrowStatus(escrowId: string, status: string, transactionSignature?: string) {
  console.log(`Updating escrow ${escrowId} to status ${status}`)
  const supabase = await createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: "User not authenticated",
    }
  }

  // Update escrow status
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (transactionSignature) {
    if (status === "released") {
      updateData.release_transaction_signature = transactionSignature
    } else if (status === "refunded") {
      updateData.refund_transaction_signature = transactionSignature
    }
  }

  const { error } = await supabase.from("escrow_accounts").update(updateData).eq("id", escrowId)

  if (error) {
    console.error("Error updating escrow status:", error)
    return {
      success: false,
      error: error.message,
    }
  }

  // Get the escrow details
  const { data: escrow, error: escrowError } = await supabase
    .from("escrow_accounts")
    .select("intent_id, agent_id, amount")
    .eq("id", escrowId)
    .single()

  if (escrowError) {
    console.error("Error fetching escrow details:", escrowError)
    return {
      success: false,
      error: escrowError.message,
    }
  }

  // Update intent status based on escrow status
  let intentStatus = "funded"
  if (status === "released") {
    intentStatus = "paid"
  } else if (status === "refunded") {
    intentStatus = "open"
  } else if (status === "disputed") {
    intentStatus = "disputed"
  }

  const { error: intentError } = await supabase
    .from("intents")
    .update({
      status: intentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", escrow.intent_id)

  if (intentError) {
    console.error("Error updating intent status:", intentError)
    return {
      success: false,
      error: intentError.message,
    }
  }

  // Get the intent and agent details for notifications
  const { data: intent, error: intentFetchError } = await supabase
    .from("intents")
    .select("title, user_id")
    .eq("id", escrow.intent_id)
    .single()

  if (intentFetchError) {
    console.error("Error fetching intent details:", intentFetchError)
    // Continue anyway, this is not critical
  }

  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("name, user_id")
    .eq("id", escrow.agent_id)
    .single()

  if (agentError) {
    console.error("Error fetching agent details:", agentError)
    // Continue anyway, this is not critical
  }

  // Create notifications based on status
  if (intent && agent) {
    if (status === "released") {
      // Notify agent owner
      await supabase.from("notifications").insert({
        user_id: agent.user_id,
        title: "Payment Released",
        message: `You have received ${escrow.amount} SOL for completing the intent "${intent.title}".`,
        type: "escrow_completed",
        metadata: {
          intent_id: escrow.intent_id,
          agent_id: escrow.agent_id,
          amount: escrow.amount,
        },
      })

      // Notify intent owner
      await supabase.from("notifications").insert({
        user_id: intent.user_id,
        title: "Payment Sent",
        message: `You have released ${escrow.amount} SOL to the agent for completing the intent "${intent.title}".`,
        type: "escrow_completed",
        metadata: {
          intent_id: escrow.intent_id,
          agent_id: escrow.agent_id,
          amount: escrow.amount,
        },
      })
    } else if (status === "refunded") {
      // Notify agent owner
      await supabase.from("notifications").insert({
        user_id: agent.user_id,
        title: "Escrow Refunded",
        message: `The escrow for intent "${intent.title}" has been refunded to the intent owner.`,
        type: "escrow_refunded",
        metadata: {
          intent_id: escrow.intent_id,
          agent_id: escrow.agent_id,
          amount: escrow.amount,
        },
      })

      // Notify intent owner
      await supabase.from("notifications").insert({
        user_id: intent.user_id,
        title: "Escrow Refunded",
        message: `Your escrow of ${escrow.amount} SOL for intent "${intent.title}" has been refunded.`,
        type: "escrow_refunded",
        metadata: {
          intent_id: escrow.intent_id,
          agent_id: escrow.agent_id,
          amount: escrow.amount,
        },
      })
    } else if (status === "disputed") {
      // Notify agent owner
      await supabase.from("notifications").insert({
        user_id: agent.user_id,
        title: "Dispute Created",
        message: `A dispute has been created for the intent "${intent.title}".`,
        type: "escrow_disputed",
        metadata: {
          intent_id: escrow.intent_id,
          agent_id: escrow.agent_id,
          amount: escrow.amount,
        },
      })

      // Notify intent owner
      await supabase.from("notifications").insert({
        user_id: intent.user_id,
        title: "Dispute Created",
        message: `A dispute has been created for the intent "${intent.title}".`,
        type: "escrow_disputed",
        metadata: {
          intent_id: escrow.intent_id,
          agent_id: escrow.agent_id,
          amount: escrow.amount,
        },
      })
    }
  }

  // Revalidate the relevant pages
  revalidatePath("/dashboard/intents")
  revalidatePath(`/dashboard/intents/${escrow.intent_id}`)
  revalidatePath("/dashboard/agent-dashboard")
  revalidatePath("/dashboard/escrow")

  return {
    success: true,
  }
}

export async function getEscrowsByUser() {
  console.log("getEscrowsByUser called")
  try {
    const supabase = await createServerClient()

    // Get the current user
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      }
    }

    // First, get the IDs of intents created by the user
    const { data: userIntents, error: intentsError } = await supabase
      .from("intents")
      .select("id")
      .eq("user_id", user.id)

    if (intentsError) {
      console.error("Error fetching user intents:", intentsError)
      throw new Error(intentsError.message)
    }

    // Then, get the IDs of agents owned by the user
    const { data: userAgents, error: agentsError } = await supabase
      .from("agents")
      .select("id")
      .eq("user_id", user.id)

    if (agentsError) {
      console.error("Error fetching user agents:", agentsError)
      throw new Error(agentsError.message)
    }

    // If user has no intents and no agents, return empty array
    if (!userIntents?.length && !userAgents?.length) {
      return {
        success: true,
        data: [],
      }
    }

    // Extract just the ID values
    const intentIds = userIntents.map(intent => intent.id)
    const agentIds = userAgents.map(agent => agent.id)

    // Prepare two separate queries and combine results
    const escrows = []

    // Query escrows by intent IDs if there are any
    if (intentIds.length > 0) {
      const { data: intentEscrows, error: intentEscrowsError } = await supabase
        .from("escrow_accounts")
        .select(`
          *,
          intents(*),
          agents(*)
        `)
        .in("intent_id", intentIds)
        .order("created_at", { ascending: false })

      if (intentEscrowsError) {
        console.error("Error fetching escrows by intents:", intentEscrowsError)
        throw new Error(intentEscrowsError.message)
      }

      if (intentEscrows) {
        escrows.push(...intentEscrows)
      }
    }

    // Query escrows by agent IDs if there are any
    if (agentIds.length > 0) {
      const { data: agentEscrows, error: agentEscrowsError } = await supabase
        .from("escrow_accounts")
        .select(`
          *,
          intents(*),
          agents(*)
        `)
        .in("agent_id", agentIds)
        .order("created_at", { ascending: false })

      if (agentEscrowsError) {
        console.error("Error fetching escrows by agents:", agentEscrowsError)
        throw new Error(agentEscrowsError.message)
      }

      if (agentEscrows) {
        escrows.push(...agentEscrows)
      }
    }

    // Deduplicate by escrow ID
    const uniqueEscrows = Array.from(
      new Map(escrows.map(escrow => [escrow.id, escrow])).values()
    )

    return {
      success: true,
      data: uniqueEscrows,
    }
  } catch (err) {
    console.error("Error fetching escrows:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    }
  }
}
