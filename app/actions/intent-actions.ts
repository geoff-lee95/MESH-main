"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"

export interface IntentData {
  title: string
  description: string
  category: string
  reward: number
  deadline: Date
  complexity: number
  isPrivate: boolean
  successCriteria: string
  tags: string[]
  maxBudget: number
  allowMultipleAgents: boolean
  requiredCapabilities: string[]
}

export async function createIntent(data: IntentData) {
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

    console.log("Server action: createIntent called with data:", data)

    // Create the intent in the database
    const { data: intent, error } = await supabase
      .from("intents")
      .insert({
        user_id: user.id,
        title: data.title,
        description: data.description,
        reward: data.reward,
        status: "open",
        deadline: data.deadline,
        metadata: {
          category: data.category,
          complexity: data.complexity,
          isPrivate: data.isPrivate,
          successCriteria: data.successCriteria,
          tags: data.tags,
          maxBudget: data.maxBudget,
          allowMultipleAgents: data.allowMultipleAgents,
          requiredCapabilities: data.requiredCapabilities,
        },
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating intent:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log("Intent created successfully:", intent)

    // Match agents to the intent
    await matchAgentsToIntent(intent.id, data.requiredCapabilities)

    // Revalidate the intents page
    revalidatePath("/dashboard/intents")

    return {
      success: true,
      data: intent,
    }
  } catch (error) {
    console.error("Error creating intent:", error)
    return {
      success: false,
      error: "Failed to create intent",
    }
  }
}

async function matchAgentsToIntent(intentId: string, requiredCapabilities: string[]) {
  try {
    const supabase = await createServerClient()

    // Find agents that match the required capabilities
    const { data: matchingAgents, error: agentsError } = await supabase
      .from("agents")
      .select("*")
      .eq("is_public", true)
      .contains("capabilities", requiredCapabilities)

    if (agentsError) {
      console.error("Error finding matching agents:", agentsError)
      return
    }

    console.log(`Found ${matchingAgents?.length || 0} matching agents for intent ${intentId}`)

    if (!matchingAgents || matchingAgents.length === 0) {
      return
    }

    // Check if the intent_agent_matches table exists and is accessible
    const { error: tableCheckError } = await supabase.from("intent_agent_matches").select("id").limit(1)

    if (tableCheckError) {
      console.error("Error checking intent_agent_matches table:", tableCheckError)
      return
    }

    // Create matches for each agent
    for (const agent of matchingAgents) {
      // Calculate match score based on how many capabilities match
      const agentCapabilities = agent.capabilities || []
      const matchingCapabilitiesCount = agentCapabilities.filter((cap: string) =>
        requiredCapabilities.includes(cap),
      ).length
      const matchScore = Math.round((matchingCapabilitiesCount / requiredCapabilities.length) * 100)

      // Insert the match
      const { error: matchError } = await supabase.from("intent_agent_matches").insert({
        intent_id: intentId,
        agent_id: agent.id,
        status: "matched",
        match_score: matchScore,
      })

      if (matchError) {
        console.error(`Error creating match for agent ${agent.id}:`, matchError)
        continue
      }

      // Check if the notifications table exists and is accessible
      const { error: notifTableCheckError } = await supabase.from("notifications").select("id").limit(1)

      if (notifTableCheckError) {
        console.error("Error checking notifications table:", notifTableCheckError)
        continue
      }

      // Create a notification for the agent owner
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: agent.user_id,
        title: "New Intent Match",
        message: `Your agent "${agent.name}" matches a new intent.`,
        type: "intent_match",
        metadata: {
          intent_id: intentId,
          agent_id: agent.id,
          match_score: matchScore,
        },
      })

      if (notificationError) {
        console.error(`Error creating notification for user ${agent.user_id}:`, notificationError)
      }
    }
  } catch (error) {
    console.error("Error matching agents to intent:", error)
  }
}

export async function getIntents() {
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

    // Get the user's intents
    const { data: intents, error } = await supabase
      .from("intents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching intents:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: intents,
    }
  } catch (error) {
    console.error("Error fetching intents:", error)
    return {
      success: false,
      error: "Failed to fetch intents",
    }
  }
}

export async function getMarketplaceIntents() {
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

    // Get public intents from other users
    const { data: intents, error } = await supabase
      .from("intents")
      .select("*")
      .neq("user_id", user.id)
      .eq("status", "open")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching marketplace intents:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: intents,
    }
  } catch (error) {
    console.error("Error fetching marketplace intents:", error)
    return {
      success: false,
      error: "Failed to fetch marketplace intents",
    }
  }
}

export async function getIntentById(id: string) {
  try {
    const supabase = await createServerClient()

    // Get the intent
    const { data: intent, error } = await supabase.from("intents").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching intent:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: intent,
    }
  } catch (error) {
    console.error("Error fetching intent:", error)
    return {
      success: false,
      error: "Failed to fetch intent",
    }
  }
}

export async function getIntentMatches(intentId: string) {
  try {
    const supabase = await createServerClient()

    // Get matches for the intent
    const { data: matches, error: matchesError } = await supabase
      .from("intent_agent_matches")
      .select("*")
      .eq("intent_id", intentId)

    if (matchesError) {
      console.error("Error fetching intent matches:", matchesError)
      return {
        success: false,
        error: matchesError.message,
      }
    }

    // Get agent details for each match
    const agentIds = matches.map((match) => match.agent_id)

    if (agentIds.length === 0) {
      return {
        success: true,
        data: [],
      }
    }

    const { data: agents, error: agentsError } = await supabase.from("agents").select("*").in("id", agentIds)

    if (agentsError) {
      console.error("Error fetching agents:", agentsError)
      return {
        success: false,
        error: agentsError.message,
      }
    }

    // Combine match and agent data
    const matchesWithAgents = matches.map((match) => {
      const agent = agents.find((a) => a.id === match.agent_id)
      return {
        ...match,
        agent,
      }
    })

    return {
      success: true,
      data: matchesWithAgents,
    }
  } catch (error) {
    console.error("Error fetching intent matches:", error)
    return {
      success: false,
      error: "Failed to fetch intent matches",
    }
  }
}

export async function updateIntentStatus(id: string, status: string) {
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

    // Update the intent status
    const { error } = await supabase
      .from("intents")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error updating intent status:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate the intents page
    revalidatePath("/dashboard/intents")
    revalidatePath(`/dashboard/intents/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating intent status:", error)
    return {
      success: false,
      error: "Failed to update intent status",
    }
  }
}

export async function deleteIntent(id: string) {
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

    // Delete the intent
    const { error } = await supabase.from("intents").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting intent:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate the intents page
    revalidatePath("/dashboard/intents")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting intent:", error)
    return {
      success: false,
      error: "Failed to delete intent",
    }
  }
}

export async function getMatchingAgentsForIntent(intentId: string) {
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

    // Get the intent to check ownership
    const { data: intent, error: intentError } = await supabase
      .from("intents")
      .select("*")
      .eq("id", intentId)
      .eq("user_id", user.id)
      .single()

    if (intentError) {
      return {
        success: false,
        error: "Intent not found or you don't have permission to view it",
      }
    }

    // Get matching agents for this intent
    const { data: matches, error: matchesError } = await supabase
      .from("intent_agent_matches")
      .select("*")
      .eq("intent_id", intentId)

    if (matchesError) {
      console.error("Error fetching intent matches:", matchesError)
      return {
        success: false,
        error: matchesError.message,
      }
    }

    // If we have matches, fetch the corresponding agents
    let matchesWithAgents = []
    if (matches && matches.length > 0) {
      // For each match, get the agent details
      matchesWithAgents = await Promise.all(
        matches.map(async (match) => {
          const { data: agent } = await supabase.from("agents").select("*").eq("id", match.agent_id).single()

          return {
            ...match,
            agent: agent,
          }
        }),
      )
    }

    return {
      success: true,
      data: matchesWithAgents || [],
    }
  } catch (error) {
    console.error("Error fetching matching agents:", error)
    return {
      success: false,
      error: "Failed to fetch matching agents",
    }
  }
}

export async function assignIntentToAgent(intentId: string, matchId: string, agentId: string) {
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

    // Start a transaction
    // First, update the intent status
    const { error: intentError } = await supabase
      .from("intents")
      .update({
        status: "assigned",
        updated_at: new Date().toISOString(),
      })
      .eq("id", intentId)
      .eq("user_id", user.id)

    if (intentError) {
      console.error("Error updating intent status:", intentError)
      return {
        success: false,
        error: intentError.message,
      }
    }

    // Update the match status
    const { error: matchError } = await supabase
      .from("intent_agent_matches")
      .update({
        status: "assigned",
        updated_at: new Date().toISOString(),
      })
      .eq("id", matchId)
      .eq("intent_id", intentId)

    if (matchError) {
      console.error("Error updating match status:", matchError)
      // Try to revert the intent status
      await supabase
        .from("intents")
        .update({
          status: "open",
          updated_at: new Date().toISOString(),
        })
        .eq("id", intentId)
        .eq("user_id", user.id)

      return {
        success: false,
        error: matchError.message,
      }
    }

    // Get the agent details to create a notification
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("user_id, name")
      .eq("id", agentId)
      .single()

    if (agentError) {
      console.error("Error fetching agent details:", agentError)
      // Continue anyway, this is not critical
    }

    // Get the intent details for the notification
    const { data: intent, error: intentFetchError } = await supabase
      .from("intents")
      .select("title")
      .eq("id", intentId)
      .single()

    if (intentFetchError) {
      console.error("Error fetching intent details:", intentFetchError)
      // Continue anyway, this is not critical
    }

    // Create a notification for the agent owner
    if (agent && intent) {
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: agent.user_id,
        title: "Intent Assigned",
        message: `Your agent "${agent.name}" has been assigned to the intent "${intent.title}".`,
        type: "intent_assigned",
        metadata: {
          intent_id: intentId,
          agent_id: agentId,
        },
      })

      if (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Continue anyway, this is not critical
      }
    }

    // Revalidate the relevant pages
    revalidatePath("/dashboard/intents")
    revalidatePath(`/dashboard/intents/${intentId}`)
    revalidatePath("/dashboard/agent-dashboard")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error assigning intent to agent:", error)
    return {
      success: false,
      error: "Failed to assign intent to agent",
    }
  }
}

export async function updateIntentMatchStatus(matchId: string, status: string) {
  try {
    const supabase = await createServerClient()

    // Get the match details
    const { data: match, error: matchError } = await supabase
      .from("intent_agent_matches")
      .select("intent_id, agent_id")
      .eq("id", matchId)
      .single()

    if (matchError) {
      console.error("Error fetching match details:", matchError)
      return {
        success: false,
        error: matchError.message,
      }
    }

    // Update the match status
    const { error: updateError } = await supabase
      .from("intent_agent_matches")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", matchId)

    if (updateError) {
      console.error("Error updating match status:", updateError)
      return {
        success: false,
        error: updateError.message,
      }
    }

    // Update the intent status if needed
    if (status === "in_progress" || status === "completed" || status === "cancelled") {
      const intentStatus = status === "in_progress" ? "in_progress" : status === "completed" ? "completed" : "open" // If cancelled, revert to open

      const { error: intentError } = await supabase
        .from("intents")
        .update({
          status: intentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", match.intent_id)

      if (intentError) {
        console.error("Error updating intent status:", intentError)
        // Continue anyway, we've already updated the match
      }
    }

    // Get the intent and agent details for notifications
    const { data: intent, error: intentError } = await supabase
      .from("intents")
      .select("title, user_id")
      .eq("id", match.intent_id)
      .single()

    if (intentError) {
      console.error("Error fetching intent details:", intentError)
      // Continue anyway, this is not critical
    }

    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("name, user_id")
      .eq("id", match.agent_id)
      .single()

    if (agentError) {
      console.error("Error fetching agent details:", agentError)
      // Continue anyway, this is not critical
    }

    // Create notifications for both parties
    if (intent && agent) {
      // Notification for the intent owner
      const { error: intentOwnerNotifError } = await supabase.from("notifications").insert({
        user_id: intent.user_id,
        title: `Intent ${status === "in_progress" ? "Started" : status === "completed" ? "Completed" : "Cancelled"}`,
        message: `Agent "${agent.name}" has ${
          status === "in_progress"
            ? "started working on"
            : status === "completed"
              ? "completed"
              : "cancelled their assignment for"
        } your intent "${intent.title}".`,
        type: `intent_${status}`,
        metadata: {
          intent_id: match.intent_id,
          agent_id: match.agent_id,
        },
      })

      if (intentOwnerNotifError) {
        console.error("Error creating notification for intent owner:", intentOwnerNotifError)
        // Continue anyway, this is not critical
      }

      // Notification for the agent owner (if different from intent owner)
      if (agent.user_id !== intent.user_id) {
        const { error: agentOwnerNotifError } = await supabase.from("notifications").insert({
          user_id: agent.user_id,
          title: `Intent ${status === "in_progress" ? "Started" : status === "completed" ? "Completed" : "Cancelled"}`,
          message: `You have ${
            status === "in_progress"
              ? "started working on"
              : status === "completed"
                ? "completed"
                : "cancelled your assignment for"
          } the intent "${intent.title}".`,
          type: `intent_${status}`,
          metadata: {
            intent_id: match.intent_id,
            agent_id: match.agent_id,
          },
        })

        if (agentOwnerNotifError) {
          console.error("Error creating notification for agent owner:", agentOwnerNotifError)
          // Continue anyway, this is not critical
        }
      }
    }

    // Revalidate the relevant pages
    revalidatePath("/dashboard/intents")
    revalidatePath(`/dashboard/intents/${match.intent_id}`)
    revalidatePath("/dashboard/agent-dashboard")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating intent match status:", error)
    return {
      success: false,
      error: "Failed to update intent match status",
    }
  }
}

export async function updateIntentProgress(
  matchId: string,
  data: { progress: number; notes: string; isComplete: boolean },
) {
  try {
    const supabase = await createServerClient()

    // Get the match details
    const { data: match, error: matchError } = await supabase
      .from("intent_agent_matches")
      .select("intent_id, agent_id, status")
      .eq("id", matchId)
      .single()

    if (matchError) {
      console.error("Error fetching match details:", matchError)
      return {
        success: false,
        error: matchError.message,
      }
    }

    // Update the match with progress information
    const { error: updateError } = await supabase
      .from("intent_agent_matches")
      .update({
        status: data.isComplete ? "completed" : match.status,
        updated_at: new Date().toISOString(),
        metadata: {
          progress: data.progress,
          progress_notes: data.notes,
          last_update: new Date().toISOString(),
        },
      })
      .eq("id", matchId)

    if (updateError) {
      console.error("Error updating match progress:", updateError)
      return {
        success: false,
        error: updateError.message,
      }
    }

    // If marked as complete, update the intent status
    if (data.isComplete) {
      const { error: intentError } = await supabase
        .from("intents")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", match.intent_id)

      if (intentError) {
        console.error("Error updating intent status:", intentError)
        // Continue anyway, we've already updated the match
      }
    }

    // Get the intent and agent details for notifications
    const { data: intent, error: intentError } = await supabase
      .from("intents")
      .select("title, user_id")
      .eq("id", match.intent_id)
      .single()

    if (intentError) {
      console.error("Error fetching intent details:", intentError)
      // Continue anyway, this is not critical
    }

    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("name, user_id")
      .eq("id", match.agent_id)
      .single()

    if (agentError) {
      console.error("Error fetching agent details:", agentError)
      // Continue anyway, this is not critical
    }

    // Create a notification for the intent owner
    if (intent && agent) {
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: intent.user_id,
        title: data.isComplete ? "Intent Completed" : "Intent Progress Update",
        message: data.isComplete
          ? `Agent "${agent.name}" has completed your intent "${intent.title}".`
          : `Agent "${agent.name}" has updated progress (${data.progress}%) on your intent "${intent.title}".`,
        type: data.isComplete ? "intent_completed" : "intent_progress",
        metadata: {
          intent_id: match.intent_id,
          agent_id: match.agent_id,
          progress: data.progress,
          notes: data.notes,
        },
      })

      if (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Continue anyway, this is not critical
      }
    }

    // Revalidate the relevant pages
    revalidatePath("/dashboard/intents")
    revalidatePath(`/dashboard/intents/${match.intent_id}`)
    revalidatePath("/dashboard/agent-dashboard")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating intent progress:", error)
    return {
      success: false,
      error: "Failed to update intent progress",
    }
  }
}

export async function applyToFulfillIntent(intentId: string, agentId: string) {
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

    // Check if the agent belongs to the user
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .eq("user_id", user.id)
      .single()

    if (agentError || !agent) {
      console.error("Error fetching agent:", agentError)
      return {
        success: false,
        error: "Agent not found or you don't have permission to use this agent",
      }
    }

    // Check if the intent exists and is open
    const { data: intent, error: intentError } = await supabase
      .from("intents")
      .select("*")
      .eq("id", intentId)
      .eq("status", "open")
      .single()

    if (intentError || !intent) {
      console.error("Error fetching intent:", intentError)
      return {
        success: false,
        error: "Intent not found or is no longer open for applications",
      }
    }

    // Check if the agent has already applied to this intent
    const { data: existingApplication, error: existingError } = await supabase
      .from("intent_agent_matches")
      .select("*")
      .eq("intent_id", intentId)
      .eq("agent_id", agentId)
      .single()

    if (existingApplication) {
      return {
        success: false,
        error: "This agent has already applied to fulfill this intent",
      }
    }

    // Create a new application
    const { data: application, error: applicationError } = await supabase
      .from("intent_agent_matches")
      .insert({
        intent_id: intentId,
        agent_id: agentId,
        status: "applied",
        match_score: 0, // This will be calculated or set by the system
      })
      .select()
      .single()

    if (applicationError) {
      console.error("Error creating application:", applicationError)
      return {
        success: false,
        error: applicationError.message,
      }
    }

    // Create a notification for the intent owner
    const { error: notificationError } = await supabase.from("notifications").insert({
      user_id: intent.user_id,
      title: "New Agent Application",
      message: `An agent has applied to fulfill your intent "${intent.title}".`,
      type: "intent_application",
      metadata: {
        intent_id: intentId,
        agent_id: agentId,
        application_id: application.id,
      },
    })

    if (notificationError) {
      console.error("Error creating notification:", notificationError)
    }

    // Revalidate the relevant paths
    revalidatePath("/dashboard/intents")
    revalidatePath(`/dashboard/intents/${intentId}`)
    revalidatePath("/dashboard/agent-dashboard")

    return {
      success: true,
      data: application,
    }
  } catch (error) {
    console.error("Error applying to fulfill intent:", error)
    return {
      success: false,
      error: "Failed to apply to fulfill intent",
    }
  }
}

export async function saveIntentForLater(intentId: string) {
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

    // Check if intent exists
    const { data: intent, error: intentError } = await supabase
      .from("intents")
      .select("id, title, user_id")
      .eq("id", intentId)
      .single()

    if (intentError || !intent) {
      console.error("Error fetching intent:", intentError)
      return {
        success: false,
        error: "Intent not found",
      }
    }

    // Check if the intent is already saved
    const { data: existingSaved, error: existingError } = await supabase
      .from("saved_intents")
      .select("id")
      .eq("intent_id", intentId)
      .eq("user_id", user.id)
      .single()

    if (existingSaved) {
      // If already saved, remove it (toggle functionality)
      const { error: deleteError } = await supabase
        .from("saved_intents")
        .delete()
        .eq("id", existingSaved.id)

      if (deleteError) {
        console.error("Error removing saved intent:", deleteError)
        return {
          success: false,
          error: deleteError.message,
        }
      }

      return {
        success: true,
        data: {
          saved: false,
          message: "Intent removed from saved items",
        },
      }
    }

    // If not saved, save it
    const { data: saved, error: saveError } = await supabase
      .from("saved_intents")
      .insert({
        intent_id: intentId,
        user_id: user.id,
        saved_at: new Date().toISOString(),
      })
      .select()

    if (saveError) {
      console.error("Error saving intent:", saveError)
      return {
        success: false,
        error: saveError.message,
      }
    }

    // Revalidate the saved intents page
    revalidatePath("/dashboard/saved-intents")
    revalidatePath("/dashboard/intents")

    return {
      success: true,
      data: {
        saved: true,
        message: "Intent saved for later",
      },
    }
  } catch (error) {
    console.error("Error saving intent for later:", error)
    return {
      success: false,
      error: "Failed to save intent for later",
    }
  }
}

export async function getSavedIntents() {
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

    // Get saved intent IDs
    const { data: savedIntents, error: savedError } = await supabase
      .from("saved_intents")
      .select("intent_id")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false })

    if (savedError) {
      console.error("Error fetching saved intents:", savedError)
      return {
        success: false,
        error: savedError.message,
      }
    }

    if (!savedIntents || savedIntents.length === 0) {
      return {
        success: true,
        data: [],
      }
    }

    // Get full intent details
    const intentIds = savedIntents.map(item => item.intent_id)
    const { data: intents, error: intentsError } = await supabase
      .from("intents")
      .select("*")
      .in("id", intentIds)

    if (intentsError) {
      console.error("Error fetching intent details:", intentsError)
      return {
        success: false,
        error: intentsError.message,
      }
    }

    // Sort intents to match the order in savedIntents
    const sortedIntents = intentIds.map(id => 
      intents.find(intent => intent.id === id)
    ).filter(Boolean)

    return {
      success: true,
      data: sortedIntents,
    }
  } catch (error) {
    console.error("Error fetching saved intents:", error)
    return {
      success: false,
      error: "Failed to fetch saved intents",
    }
  }
}
