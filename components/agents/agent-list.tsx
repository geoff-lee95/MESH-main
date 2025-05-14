"use client"
import { useState } from "react"
import Link from "next/link"
import { Activity, AlertCircle, Code2, MoreHorizontal, Star, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Database } from "@/types/supabase"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type Agent = Database["public"]["Tables"]["agents"]["Row"]

interface AgentListProps {
  agents: Agent[]
}

export function AgentList({ agents: initialAgents }: AgentListProps) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDeleteClick = (agent: Agent) => {
    setAgentToDelete(agent)
    setDeleteDialogOpen(true)
  }

  const deleteAgent = async () => {
    if (!agentToDelete) return

    setIsDeleting(true)
    
    try {
      const supabase = createBrowserClient()
      const { error } = await supabase
        .from("agents")
        .delete()
        .eq("id", agentToDelete.id)

      if (error) {
        throw error
      }

      // Update local state
      setAgents(agents.filter(agent => agent.id !== agentToDelete.id))
      
      toast({
        title: "Agent deleted",
        description: `${agentToDelete.name} has been successfully deleted.`,
      })
    } catch (error) {
      console.error("Error deleting agent:", error)
      toast({
        title: "Error",
        description: "Failed to delete agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setAgentToDelete(null)
      router.refresh() // Refresh the page to get updated data
    }
  }

  if (!agents.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Code2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-light">No agents found</h3>
        <p className="text-muted-foreground mt-2">You haven&apos;t created any agents yet.</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/agents/create">Create Your First Agent</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4">
        {agents.map((agent) => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onDeleteClick={handleDeleteClick} 
          />
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Agent
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {agentToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAgent}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Agent"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function AgentCard({ agent, onDeleteClick }: { agent: Agent; onDeleteClick: (agent: Agent) => void }) {
  // Mock data for UI purposes
  const reputation = 4.5
  const tasks = { completed: 15, total: 20 }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex items-center justify-center p-6 bg-gradient-to-br from-green-900 to-emerald-900 md:w-48">
            <div className="flex flex-col items-center text-white">
              <Code2 className="h-16 w-16 mb-2" />
              <div className="text-lg font-light">{agent.name}</div>
              <div className="text-xs opacity-80">{agent.id.substring(0, 8)}</div>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="rounded-sm">
                    Active
                  </Badge>
                  <Badge variant="outline" className="rounded-sm">
                    {agent.agent_type}
                  </Badge>
                  {agent.is_public && (
                    <Badge variant="secondary" className="rounded-sm">
                      Public
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-sm">{agent.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {agent.capabilities.map((capability) => (
                    <Badge key={capability} variant="outline" className="bg-background/50">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/agents/${agent.id}`}>
                    <Activity className="mr-2 h-4 w-4" />
                    Monitor
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/agents/${agent.id}/edit`}>Edit Agent</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/agents/${agent.id}/tasks`}>View Tasks</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/agents/${agent.id}/logs`}>View Logs</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Deactivate</DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive flex items-center" 
                      onClick={() => onDeleteClick(agent)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Agent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-sm font-light">Reputation</div>
                <div className="flex items-center mt-1">
                  <div className="text-lg font-light">{reputation}</div>
                  <Star className="ml-1 h-4 w-4 fill-primary text-primary" />
                </div>
              </div>
              <div>
                <div className="text-sm font-light">Task Completion</div>
                <div className="mt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-muted-foreground">
                      {tasks.completed}/{tasks.total} tasks
                    </div>
                    <div className="text-xs font-light">{Math.round((tasks.completed / tasks.total) * 100)}%</div>
                  </div>
                  <Progress value={(tasks.completed / tasks.total) * 100} className="h-2" />
                </div>
              </div>
              <div>
                <div className="text-sm font-light">Last Active</div>
                <div className="text-sm mt-1">{new Date(agent.updated_at).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
