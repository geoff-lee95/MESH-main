import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/supabase/server-auth"
import { IntentsClient } from "./intents-client"

export default async function IntentsPage() {
  try {
    const { user, supabase } = await requireAuth();
    
    // If no user is returned but we weren't redirected, show empty state
    if (!user || !supabase) {
      console.warn("[Intents Page] No user or supabase client found but not redirected");
      return (
        <IntentsClient 
          marketplaceIntents={[]}
          myIntents={[]}
          savedIntentsList={[]}
          userAgents={[]}
          savedIntentIds={[]}
        />
      );
    }

    // Get marketplace intents
    const { data: marketplaceIntents, error: marketError } = await supabase
      .from("intents")
      .select("*")
      .neq("user_id", user.id)
      .eq("status", "open")
      .order("created_at", { ascending: false })
    
    if (marketError) {
      console.error("[Intents Page] Error fetching marketplace intents:", marketError.message);
    }

    // Get user's intents
    const { data: myIntents, error: myIntentsError } = await supabase
      .from("intents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    
    if (myIntentsError) {
      console.error("[Intents Page] Error fetching user intents:", myIntentsError.message);
    }

    // Get saved intents IDs
    const { data: savedIntents, error: savedIntentsError } = await supabase
      .from("saved_intents")
      .select("intent_id")
      .eq("user_id", user.id)
    
    if (savedIntentsError) {
      console.error("[Intents Page] Error fetching saved intents:", savedIntentsError.message);
    }

    const savedIntentIds = savedIntents?.map((item) => item.intent_id) || []

    // Get full saved intents data
    let savedIntentsList = []
    if (savedIntentIds.length > 0) {
      const { data: savedIntentsData, error: savedIntentsDataError } = await supabase
        .from("intents")
        .select("*")
        .in("id", savedIntentIds)
        .order("created_at", { ascending: false })
      
      if (savedIntentsDataError) {
        console.error("[Intents Page] Error fetching saved intents data:", savedIntentsDataError.message);
      }

      savedIntentsList = savedIntentsData || []
    }

    // Get user agents for fulfilling intents
    const { data: userAgents, error: userAgentsError } = await supabase
      .from("agents")
      .select("*")
      .eq("user_id", user.id)
    
    if (userAgentsError) {
      console.error("[Intents Page] Error fetching user agents:", userAgentsError.message);
    }

    return (
      <IntentsClient 
        marketplaceIntents={marketplaceIntents || []}
        myIntents={myIntents || []}
        savedIntentsList={savedIntentsList}
        userAgents={userAgents || []}
        savedIntentIds={savedIntentIds}
      />
    )
  } catch (err) {
    console.error("[Intents Page] Error:", err);
    
    // Return empty data instead of redirecting on error
    return (
      <IntentsClient 
        marketplaceIntents={[]}
        myIntents={[]}
        savedIntentsList={[]}
        userAgents={[]}
        savedIntentIds={[]}
      />
    )
  }
}
