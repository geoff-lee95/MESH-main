"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { verifyTransaction, getTransactionDetails } from "@/lib/solana"

interface PaymentData {
  intentId: string
  agentId: string
  transactionSignature: string
  amount: number
}

export async function processPayment(data: PaymentData) {
  try {
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

    // Verify the transaction
    const isValid = await verifyTransaction(data.transactionSignature)

    if (!isValid) {
      return {
        success: false,
        error: "Transaction verification failed",
      }
    }

    // Get transaction details
    const txDetails = await getTransactionDetails(data.transactionSignature)

    if (!txDetails) {
      return {
        success: false,
        error: "Failed to fetch transaction details",
      }
    }

    // Create payment record
    const { error: paymentError } = await supabase.from("payments").insert({
      user_id: user.id,
      intent_id: data.intentId,
      agent_id: data.agentId,
      transaction_signature: data.transactionSignature,
      amount: data.amount,
      status: "completed",
      metadata: {
        transaction_details: txDetails,
      },
    })

    if (paymentError) {
      console.error("Error creating payment record:", paymentError)
      return {
        success: false,
        error: paymentError.message,
      }
    }

    // Update intent status to "paid"
    const { error: intentError } = await supabase
      .from("intents")
      .update({
        status: "paid",
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
        title: "Payment Received",
        message: `You have received a payment of ${data.amount} SOL for your agent "${agent.name}" completing the intent "${intent.title}".`,
        type: "payment_received",
        metadata: {
          intent_id: data.intentId,
          agent_id: data.agentId,
          transaction_signature: data.transactionSignature,
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
    revalidatePath("/dashboard/payments")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error processing payment:", error)
    return {
      success: false,
      error: "Failed to process payment",
    }
  }
}

export async function getPaymentsByUser() {
  try {
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

    // Get payments made by the user
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*, intent:intents(*), agent:agents(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching payments:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: payments,
    }
  } catch (error) {
    console.error("Error fetching payments:", error)
    return {
      success: false,
      error: "Failed to fetch payments",
    }
  }
}

export async function getPaymentsForAgent(agentId: string) {
  try {
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

    // Verify that the agent belongs to the user
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .eq("user_id", user.id)
      .single()

    if (agentError) {
      return {
        success: false,
        error: "Agent not found or you don't have permission to view it",
      }
    }

    // Get payments for the agent
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*, intent:intents(*)")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching payments for agent:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: payments,
    }
  } catch (error) {
    console.error("Error fetching payments for agent:", error)
    return {
      success: false,
      error: "Failed to fetch payments for agent",
    }
  }
}
