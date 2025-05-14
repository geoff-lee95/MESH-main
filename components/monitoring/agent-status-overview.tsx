"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Code2,
  ExternalLink,
  PauseCircle,
  Play,
  RefreshCw,
  Square,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Database } from "@/types/supabase"

type Agent = Database["public"]["Tables"]["agents"]["Row"]

interface AgentStatusOverviewProps {
  agents: Agent[]
}

export function AgentStatusOverview({ agents }: AgentStatusOverviewProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [agentStatuses, setAgentStatuses] = useState<Record<string, "running" | "stopped" | "error">>(() => {
    // Initialize with random statuses for demo purposes
    const statuses: Record<string, "running" | "stopped" | "error"> = {}
    agents.forEach((agent) => {
      statuses[agent.id] = Math.random() > 0.7 ? "error" : Math.random() > 0.5 ? "running" : "stopped"
    })
    return statuses
  })

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      // Update with new random statuses for demo
      const newStatuses = { ...agentStatuses }
      agents.forEach((agent) => {
        if (Math.random() > 0.8) {
          newStatuses[agent.id] = Math.random() > 0.7 ? "error" : Math.random() > 0.5 ? "running" : "stopped"
        }
      })
      setAgentStatuses(newStatuses)
      setRefreshing(false)
    }, 1000)
  }

  const toggleAgentStatus = (agentId: string) => {
    setAgentStatuses((prev) => ({
      ...prev,
      [agentId]: prev[agentId] === "running" ? "stopped" : "running",
    }))
  }

  const runningCount = Object.values(agentStatuses).filter((status) => status === "running").length
  const stoppedCount = Object.values(agentStatuses).filter((status) => status === "stopped").length
  const errorCount = Object.values(agentStatuses).filter((status) => status === "error").length

  if (!agents.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Status</CardTitle>
          <CardDescription>Real-time status of your deployed agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Code2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No agents found</h3>
            <p className="text-muted-foreground mt-2">You haven&apos;t created any agents yet.</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/agents/create">Create Your First Agent</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Agent Status</CardTitle>
          <CardDescription>Real-time status of your deployed agents</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="text-2xl font-bold">{runningCount}</div>
              <div className="text-sm text-muted-foreground">Running</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 mb-2">
                <PauseCircle className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
              <div className="text-2xl font-bold">{stoppedCount}</div>
              <div className="text-sm text-muted-foreground">Stopped</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-2">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <div className="text-2xl font-bold">{errorCount}</div>
              <div className="text-sm text-muted-foreground">Error</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Agents</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
            <TabsTrigger value="stopped">Stopped</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {agents.map((agent) => (
              <AgentStatusCard
                key={agent.id}
                agent={agent}
                status={agentStatuses[agent.id] || "stopped"}
                onToggleStatus={() => toggleAgentStatus(agent.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="running" className="space-y-4">
            {agents
              .filter((agent) => agentStatuses[agent.id] === "running")
              .map((agent) => (
                <AgentStatusCard
                  key={agent.id}
                  agent={agent}
                  status="running"
                  onToggleStatus={() => toggleAgentStatus(agent.id)}
                />
              ))}
          </TabsContent>

          <TabsContent value="stopped" className="space-y-4">
            {agents
              .filter((agent) => agentStatuses[agent.id] === "stopped")
              .map((agent) => (
                <AgentStatusCard
                  key={agent.id}
                  agent={agent}
                  status="stopped"
                  onToggleStatus={() => toggleAgentStatus(agent.id)}
                />
              ))}
          </TabsContent>

          <TabsContent value="error" className="space-y-4">
            {agents
              .filter((agent) => agentStatuses[agent.id] === "error")
              .map((agent) => (
                <AgentStatusCard
                  key={agent.id}
                  agent={agent}
                  status="error"
                  onToggleStatus={() => toggleAgentStatus(agent.id)}
                />
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface AgentStatusCardProps {
  agent: Agent
  status: "running" | "stopped" | "error"
  onToggleStatus: () => void
}

function AgentStatusCard({ agent, status, onToggleStatus }: AgentStatusCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={`h-3 w-3 rounded-full ${
            status === "running" ? "bg-green-500 animate-pulse" : status === "error" ? "bg-red-500" : "bg-amber-500"
          }`}
        />
        <div>
          <div className="font-medium">{agent.name}</div>
          <div className="text-xs text-muted-foreground">ID: {agent.id.substring(0, 8)}...</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={status === "running" ? "default" : status === "error" ? "destructive" : "outline"}>
          {status === "running" ? "Running" : status === "error" ? "Error" : "Stopped"}
        </Badge>

        <Button variant="outline" size="sm" onClick={onToggleStatus} disabled={status === "error"}>
          {status === "running" ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start
            </>
          )}
        </Button>

        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/agents/${agent.id}`}>
            <Activity className="h-4 w-4" />
          </Link>
        </Button>

        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/agents/${agent.id}`}>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
