"use client"

import { useState, useEffect } from "react"
import { AgentDashboardContent } from "@/components/agent-dashboard/dashboard-content"

interface AgentDashboardClientProps {
  agents: any[]
  assignedIntents: any[]
}

export function AgentDashboardClient({ agents, assignedIntents }: AgentDashboardClientProps) {
  const [currentTime, setCurrentTime] = useState("")
  
  useEffect(() => {
    // Set the time when the component mounts
    setCurrentTime(new Date().toLocaleTimeString())
    
    // Debug log that we've rendered
    console.log("AgentDashboardClient rendered", {
      timestamp: new Date().toISOString(),
      agentCount: agents.length,
      assignedIntentCount: assignedIntents.length
    })
  }, [agents.length, assignedIntents.length])

  return (
    <div className="relative">
      {/* Debug visibility marker */}
      <div className="absolute top-0 right-0 mt-2 mr-2 p-1 text-xs bg-green-500/10 border border-green-500/20 rounded text-green-500 z-10">
        Agent Dashboard loaded at {currentTime}
      </div>
      
      <AgentDashboardContent agents={agents} assignedIntents={assignedIntents} />
    </div>
  )
} 