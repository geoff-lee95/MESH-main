"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Clock, FileText, Filter, Info, RefreshCw, Search, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for activity feed
const initialActivities = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    type: "intent",
    level: "info",
    message: "Received new intent 'Market Analysis' from user 3E4F...7A8B",
    agent: "Market Analyzer",
    agentId: "agent1",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: "system",
    level: "error",
    message: "Agent 'Data Processor' encountered an error: Out of memory",
    agent: "Data Processor",
    agentId: "agent2",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: "intent",
    level: "success",
    message: "Successfully processed intent 'Data Analysis' from user 7XB3...9F4D",
    agent: "Data Processor",
    agentId: "agent2",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: "system",
    level: "warning",
    message: "Agent 'Market Analyzer' is approaching resource limit (85%)",
    agent: "Market Analyzer",
    agentId: "agent1",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: "system",
    level: "info",
    message: "Agent 'News Aggregator' started successfully",
    agent: "News Aggregator",
    agentId: "agent3",
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    type: "intent",
    level: "success",
    message: "Successfully processed intent 'News Summary' from user 1A2B...3C4D",
    agent: "News Aggregator",
    agentId: "agent3",
  },
  {
    id: "7",
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    type: "system",
    level: "info",
    message: "Agent 'Data Processor' restarted due to inactivity",
    agent: "Data Processor",
    agentId: "agent2",
  },
  {
    id: "8",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    type: "intent",
    level: "warning",
    message: "Intent 'Complex Analysis' processing taking longer than expected",
    agent: "Data Processor",
    agentId: "agent2",
  },
  {
    id: "9",
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    type: "system",
    level: "success",
    message: "Agent 'Market Analyzer' deployed successfully",
    agent: "Market Analyzer",
    agentId: "agent1",
  },
  {
    id: "10",
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    type: "intent",
    level: "info",
    message: "Received new intent 'News Summary' from user 1A2B...3C4D",
    agent: "News Aggregator",
    agentId: "agent3",
  },
]

export function ActivityFeed() {
  const [activities, setActivities] = useState(initialActivities)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [levelFilters, setLevelFilters] = useState<string[]>([])
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [agentFilters, setAgentFilters] = useState<string[]>([])

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      // Add a new random activity at the top
      const newActivity = {
        id: `new-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: Math.random() > 0.5 ? "intent" : "system",
        level: ["info", "success", "warning", "error"][Math.floor(Math.random() * 4)],
        message: `New activity at ${new Date().toLocaleTimeString()}`,
        agent: ["Market Analyzer", "Data Processor", "News Aggregator"][Math.floor(Math.random() * 3)],
        agentId: ["agent1", "agent2", "agent3"][Math.floor(Math.random() * 3)],
      }
      setActivities([newActivity, ...activities])
      setRefreshing(false)
    }, 1000)
  }

  const handleLevelFilterChange = (level: string) => {
    setLevelFilters((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const handleTypeFilterChange = (type: string) => {
    setTypeFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleAgentFilterChange = (agent: string) => {
    setAgentFilters((prev) => (prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent]))
  }

  const clearFilters = () => {
    setLevelFilters([])
    setTypeFilters([])
    setAgentFilters([])
    setSearchQuery("")
  }

  const filteredActivities = activities.filter((activity) => {
    // Apply search filter
    if (searchQuery && !activity.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Apply level filter
    if (levelFilters.length > 0 && !levelFilters.includes(activity.level)) {
      return false
    }

    // Apply type filter
    if (typeFilters.length > 0 && !typeFilters.includes(activity.type)) {
      return false
    }

    // Apply agent filter
    if (agentFilters.length > 0 && !agentFilters.includes(activity.agentId)) {
      return false
    }

    return true
  })

  const uniqueAgents = Array.from(new Set(activities.map((a) => a.agent))).map((name) => {
    const agent = activities.find((a) => a.agent === name)
    return { name, id: agent?.agentId || "" }
  })

  const hasActiveFilters = levelFilters.length > 0 || typeFilters.length > 0 || agentFilters.length > 0 || searchQuery

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>Real-time agent activity and events</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search activities..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 font-medium">Level</div>
              <DropdownMenuCheckboxItem
                checked={levelFilters.includes("info")}
                onCheckedChange={() => handleLevelFilterChange("info")}
              >
                Info
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={levelFilters.includes("success")}
                onCheckedChange={() => handleLevelFilterChange("success")}
              >
                Success
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={levelFilters.includes("warning")}
                onCheckedChange={() => handleLevelFilterChange("warning")}
              >
                Warning
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={levelFilters.includes("error")}
                onCheckedChange={() => handleLevelFilterChange("error")}
              >
                Error
              </DropdownMenuCheckboxItem>

              <div className="p-2 font-medium">Type</div>
              <DropdownMenuCheckboxItem
                checked={typeFilters.includes("intent")}
                onCheckedChange={() => handleTypeFilterChange("intent")}
              >
                Intent
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={typeFilters.includes("system")}
                onCheckedChange={() => handleTypeFilterChange("system")}
              >
                System
              </DropdownMenuCheckboxItem>

              <div className="p-2 font-medium">Agent</div>
              {uniqueAgents.map((agent) => (
                <DropdownMenuCheckboxItem
                  key={agent.id}
                  checked={agentFilters.includes(agent.id)}
                  onCheckedChange={() => handleAgentFilterChange(agent.id)}
                >
                  {agent.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {levelFilters.map((level) => (
              <Badge key={level} variant="secondary" className="flex items-center gap-1">
                {level}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleLevelFilterChange(level)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {typeFilters.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleTypeFilterChange(type)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {agentFilters.map((agentId) => {
              const agent = uniqueAgents.find((a) => a.id === agentId)
              return (
                <Badge key={agentId} variant="secondary" className="flex items-center gap-1">
                  {agent?.name || agentId}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleAgentFilterChange(agentId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )
            })}

            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                "{searchQuery}"
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}

        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No activities found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

interface ActivityItemProps {
  activity: {
    id: string
    timestamp: string
    type: string
    level: string
    message: string
    agent: string
  }
}

function ActivityItem({ activity }: ActivityItemProps) {
  const getIcon = () => {
    if (activity.type === "intent") {
      if (activity.level === "success") return <CheckCircle className="h-5 w-5 text-green-500" />
      if (activity.level === "warning") return <Clock className="h-5 w-5 text-amber-500" />
      if (activity.level === "error") return <AlertCircle className="h-5 w-5 text-red-500" />
      return <FileText className="h-5 w-5 text-blue-500" />
    } else {
      if (activity.level === "success") return <CheckCircle className="h-5 w-5 text-green-500" />
      if (activity.level === "warning") return <AlertCircle className="h-5 w-5 text-amber-500" />
      if (activity.level === "error") return <AlertCircle className="h-5 w-5 text-red-500" />
      return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBadgeVariant = () => {
    if (activity.level === "success") return "default"
    if (activity.level === "warning") return "warning"
    if (activity.level === "error") return "destructive"
    return "secondary"
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="flex gap-3 p-3 border rounded-lg">
      <div className="flex-shrink-0 mt-1">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-medium">{activity.agent}</span>
          <Badge variant={getBadgeVariant()} className="capitalize">
            {activity.level}
          </Badge>
          <Badge variant="outline">{activity.type}</Badge>
          <span className="text-xs text-muted-foreground ml-auto">{formatTimestamp(activity.timestamp)}</span>
        </div>
        <p className="text-sm">{activity.message}</p>
      </div>
    </div>
  )
}
