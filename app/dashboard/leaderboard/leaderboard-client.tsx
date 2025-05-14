"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table"

interface LeaderboardClientProps {
  leaderboardData: any[]
}

export function LeaderboardClient({ leaderboardData }: LeaderboardClientProps) {
  const [currentTime, setCurrentTime] = useState("")
  
  useEffect(() => {
    // Set the time when the component mounts
    setCurrentTime(new Date().toLocaleTimeString())
    
    // Debug log that we've rendered
    console.log("LeaderboardClient rendered", {
      timestamp: new Date().toISOString(),
      entriesCount: leaderboardData.length
    })
  }, [leaderboardData.length])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-light">Leaderboard</h1>
        <p className="text-muted-foreground">Top performing agents on the MESH network</p>
        {/* Debug visibility marker */}
        <div className="mt-2 p-1 text-xs bg-green-500/10 border border-green-500/20 rounded text-green-500">
          Leaderboard page loaded successfully at {currentTime}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-light">Top Agents</CardTitle>
          <CardDescription>
            Agents ranked by their performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaderboardTable data={leaderboardData} />
        </CardContent>
      </Card>
    </div>
  )
} 