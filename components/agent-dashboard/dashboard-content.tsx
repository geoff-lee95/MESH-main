"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, Code2, Inbox, Loader2, MoreHorizontal, RefreshCw, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateIntentMatchStatus } from "@/app/actions/intent-actions"
import { toast } from "@/components/ui/use-toast"
import { ProgressUpdateDialog } from "@/components/agent-dashboard/progress-update-dialog"

interface AgentDashboardContentProps {
  agents: any[]
  assignedIntents: any[]
}

export function AgentDashboardContent({ agents, assignedIntents }: AgentDashboardContentProps) {
  const router = useRouter()
  const [selectedAgent, setSelectedAgent] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
  const [selectedIntent, setSelectedIntent] = useState<any>(null)

  // Filter intents based on selected agent and status
  const filteredIntents = assignedIntents.filter((item) => {
    const agentMatch = selectedAgent === "all" || item.agent_id === selectedAgent
    const statusMatch = selectedStatus === "all" || item.intent.status === selectedStatus
    return agentMatch && statusMatch
  })

  const handleStatusUpdate = async (matchId: string, newStatus: string) => {
    setIsUpdating(matchId)
    try {
      const result = await updateIntentMatchStatus(matchId, newStatus)
      if (result.success) {
        toast({
          title: "Status updated",
          description: `Intent status has been updated to ${newStatus}`,
        })
        router.refresh()
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.error || "Failed to update status",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An unexpected error occurred",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const openProgressDialog = (intent: any) => {
    setSelectedIntent(intent)
    setProgressDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <Badge variant="outline">Open</Badge>
      case "assigned":
        return <Badge variant="secondary">Assigned</Badge>
      case "in_progress":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Assigned Intents</CardTitle>
              <CardDescription>Intents assigned to your agents</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => router.refresh()} title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredIntents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-light">No assigned intents</h3>
              <p className="text-muted-foreground font-light mt-2">
                {agents.length === 0
                  ? "You haven't created any agents yet."
                  : "Your agents haven't been assigned any intents yet."}
              </p>
              {agents.length === 0 && (
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/agents/create">Create Your First Agent</Link>
                </Button>
              )}
              {agents.length > 0 && (
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/intents">Browse Available Intents</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIntents.map((item) => {
                const intent = item.intent
                const agent = agents.find((a) => a.id === item.agent_id)
                const metadata = intent.metadata || {}

                return (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-900 to-indigo-900 md:w-48">
                          <div className="flex flex-col items-center text-white">
                            <Code2 className="h-16 w-16 mb-2" />
                            <div className="text-lg font-bold">{agent?.name || "Unknown Agent"}</div>
                            <div className="text-xs opacity-80">{agent?.id.substring(0, 8) || ""}</div>
                          </div>
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/dashboard/intents/${intent.id}`}
                                  className="text-lg font-medium hover:underline"
                                >
                                  {intent.title}
                                </Link>
                                {getStatusBadge(intent.status)}
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground font-light">{intent.description}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {metadata.requiredCapabilities?.map((capability: string) => (
                                  <Badge key={capability} variant="outline" className="bg-background/50">
                                    {capability}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {intent.status === "assigned" && (
                                <Button
                                  onClick={() => handleStatusUpdate(item.id, "in_progress")}
                                  disabled={isUpdating === item.id}
                                >
                                  {isUpdating === item.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="mr-2 h-4 w-4" />
                                      Start Work
                                    </>
                                  )}
                                </Button>
                              )}
                              {intent.status === "in_progress" && (
                                <Button onClick={() => openProgressDialog(item)} disabled={isUpdating === item.id}>
                                  {isUpdating === item.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Update Progress
                                    </>
                                  )}
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/intents/${intent.id}`}>View Intent Details</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {intent.status === "in_progress" && (
                                    <DropdownMenuItem
                                      onClick={() => handleStatusUpdate(item.id, "completed")}
                                      disabled={isUpdating === item.id}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                      Mark as Completed
                                    </DropdownMenuItem>
                                  )}
                                  {(intent.status === "assigned" || intent.status === "in_progress") && (
                                    <DropdownMenuItem
                                      onClick={() => handleStatusUpdate(item.id, "cancelled")}
                                      disabled={isUpdating === item.id}
                                      className="text-destructive"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Cancel Assignment
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <div className="mt-4 grid gap-4 md:grid-cols-3">
                            <div>
                              <div className="text-sm font-medium">Reward</div>
                              <div className="text-lg font-bold">{intent.reward} SOL</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Deadline</div>
                              <div className="text-sm">
                                {intent.deadline ? new Date(intent.deadline).toLocaleDateString() : "No deadline"}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Client</div>
                              <div className="text-sm">User {intent.user_id.substring(0, 8)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ProgressUpdateDialog
        open={progressDialogOpen}
        onOpenChange={setProgressDialogOpen}
        intent={selectedIntent}
        onComplete={() => {
          setProgressDialogOpen(false)
          router.refresh()
        }}
      />
    </>
  )
}
