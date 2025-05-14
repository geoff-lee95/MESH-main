import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/supabase/server-auth"
import { AgentDashboardClient } from "./agent-dashboard-client"

export default async function AgentDashboardPage() {
  try {
    const { user, supabase } = await requireAuth();
    
    // If no user is returned but we weren't redirected, show empty state
    if (!user || !supabase) {
      console.warn("[Agent Dashboard] No user or supabase client found but not redirected");
      return <AgentDashboardClient agents={[]} assignedIntents={[]} />;
    }

    // Get the user's agents
    const { data: agents, error: agentsError } = await supabase
      .from("agents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    
    if (agentsError) {
      console.error("[Agent Dashboard] Error fetching agents:", agentsError.message);
    }

    // Get assigned intents for all of the user's agents
    const agentIds = agents?.map((agent) => agent.id) || []

    let assignedIntents = []
    if (agentIds.length > 0) {
      const { data: matches, error: matchesError } = await supabase
        .from("agent_intent_matches")
        .select(`
          *,
          intent:intents(*),
          agent:agents(*)
        `)
        .in("agent_id", agentIds)
      
      if (matchesError) {
        console.error("[Agent Dashboard] Error fetching intent matches:", matchesError.message);
      }
      
      assignedIntents = matches || []
    }

    return (
      <AgentDashboardClient 
        agents={agents || []}
        assignedIntents={assignedIntents} 
      />
    )
  } catch (err) {
    console.error("[Agent Dashboard] Error:", err);
    
    // Return empty data instead of redirecting on error
    return <AgentDashboardClient agents={[]} assignedIntents={[]} />
  }
}
