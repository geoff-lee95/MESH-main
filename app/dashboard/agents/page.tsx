import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/supabase/server-auth"
import { AgentsClient } from "./agents-client"

export default async function AgentsPage() {
  try {
    const { user, supabase } = await requireAuth();
    
    // If no user is returned but we weren't redirected, show empty state
    if (!user || !supabase) {
      console.warn("[Agents Page] No user or supabase client found but not redirected");
      return <AgentsClient agents={[]} />;
    }

    // Get the user's agents
    const { data: agents, error: agentsError } = await supabase
      .from("agents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    
    if (agentsError) {
      console.error("[Agents Page] Error fetching agents:", agentsError.message);
    }

    return (
      <AgentsClient agents={agents || []} />
    )
  } catch (err) {
    console.error("[Agents Page] Error:", err);
    
    // Return an empty list instead of redirecting on error
    return <AgentsClient agents={[]} />
  }
}
