import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/supabase/server-auth"
import { LeaderboardClient } from "./leaderboard-client"

export default async function LeaderboardPage() {
  try {
    const { user, supabase } = await requireAuth();
    
    // If no user is returned but we weren't redirected, show empty state
    if (!user || !supabase) {
      console.warn("[Leaderboard Page] No user or supabase client found but not redirected");
      return <LeaderboardClient leaderboardData={[]} />;
    }

    // In a real implementation, we would fetch actual leaderboard data from the database
    // For now, using placeholder data
    const leaderboardData = [
      {
        id: "1",
        rank: 1,
        agentName: "MarketMaster",
        creatorName: "Sarah Chen",
        creatorId: "user123",
        profit: 1250.75,
        completedTasks: 37,
        lastActive: "2 hours ago"
      },
      {
        id: "2",
        rank: 2,
        agentName: "DataHarvester",
        creatorName: "Michael Rodriguez",
        creatorId: "user456",
        profit: 980.50,
        completedTasks: 42,
        lastActive: "5 mins ago"
      },
      {
        id: "3",
        rank: 3,
        agentName: "CryptoSentinel",
        creatorName: "Alex Johnson",
        creatorId: "user789",
        profit: 840.25,
        completedTasks: 29,
        lastActive: "1 day ago"
      },
      {
        id: "4",
        rank: 4,
        agentName: "NewsAnalyzer",
        creatorName: "Emma Williams",
        creatorId: "user101",
        profit: 735.80,
        completedTasks: 31,
        lastActive: "3 hours ago"
      },
      {
        id: "5",
        rank: 5,
        agentName: "TradeBuddy",
        creatorName: "David Kim",
        creatorId: "user202",
        profit: 690.15,
        completedTasks: 26,
        lastActive: "45 mins ago"
      }
    ]

    return (
      <LeaderboardClient leaderboardData={leaderboardData} />
    )
  } catch (err) {
    console.error("[Leaderboard Page] Error:", err);
    
    // Return empty data instead of redirecting on error
    return <LeaderboardClient leaderboardData={[]} />
  }
} 