"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AgentList } from "@/components/agents/agent-list"

interface AgentsClientProps {
  agents: any[]
}

export function AgentsClient({ agents }: AgentsClientProps) {
  const [currentTime, setCurrentTime] = useState("")
  
  useEffect(() => {
    // Set the time when the component mounts
    setCurrentTime(new Date().toLocaleTimeString())
    
    // Debug log that we've rendered
    console.log("AgentsClient rendered", {
      timestamp: new Date().toISOString(),
      agentCount: agents.length
    })
  }, [agents.length])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light">My Agents</h1>
          <p className="text-muted-foreground">Manage your autonomous agents</p>
          {/* Debug visibility marker */}
          <div className="mt-2 p-1 text-xs bg-green-500/10 border border-green-500/20 rounded text-green-500">
            Agents page loaded successfully at {currentTime}
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/agents/create">
            <Plus className="mr-2 h-4 w-4" /> Create New Agent
          </Link>
        </Button>
      </div>

      <AgentList agents={agents} />
    </div>
  )
} 