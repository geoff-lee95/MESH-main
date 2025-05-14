"use client"

import { useEffect, useState } from "react"
import React from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Check, Clock, Loader2, Plus, RefreshCw, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAgentById } from "@/app/actions/agent-actions"
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

// Define proper types for the params and tasks
type PageParams = {
  id: string;
}

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

type Task = {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: number;
  created_at: string;
  updated_at: string;
  deadline?: string;
}

// Mock data for initial development
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    agent_id: '',
    title: 'Process new user data',
    description: 'Analyze and categorize incoming user profiles',
    status: 'completed',
    priority: 2,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: '2',
    agent_id: '',
    title: 'Schedule follow-up communications',
    description: 'Create a sequence of follow-up messages based on user activity',
    status: 'in_progress',
    priority: 1,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: '3',
    agent_id: '',
    title: 'Monitor system resources',
    description: 'Track CPU and memory usage, alert if thresholds are exceeded',
    status: 'pending',
    priority: 3,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
  },
  {
    id: '4',
    agent_id: '',
    title: 'Generate weekly report',
    description: 'Compile metrics and create visualization for management review',
    status: 'failed',
    priority: 2,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
];

export default function AgentTasksPage({ params }: { params: PageParams | Promise<PageParams> }) {
  // Unwrap params with React.use() if it's a promise
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const { id } = unwrappedParams;
  
  const [agent, setAgent] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function loadAgentAndTasks() {
      try {
        // Load agent data
        const result = await getAgentById(id)
        if (result.success) {
          setAgent(result.data)
          
          // In a real implementation, you would fetch tasks from your database
          // For now, we'll use the mock data and set the agent_id
          const tasksWithAgentId = MOCK_TASKS.map(task => ({
            ...task,
            agent_id: id
          }));
          setTasks(tasksWithAgentId);
        } else {
          setError(result.error || "Failed to load agent")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadAgentAndTasks()
  }, [id])

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task)
    setDeleteDialogOpen(true)
  }

  const deleteTask = async () => {
    if (!taskToDelete) return

    setIsDeleting(true)
    
    try {
      // In a real implementation, you would call your API or Supabase
      // For now, we'll just remove it from the local state
      setTasks(tasks.filter(task => task.id !== taskToDelete.id))
      
      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been successfully deleted.`,
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setTaskToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href={`/dashboard/agents/${id}`}>Back to Agent</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertTitle>Agent Not Found</AlertTitle>
          <AlertDescription>The requested agent could not be found.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/dashboard/agents">Back to Agents</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/agents/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{agent.name} Tasks</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Task
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <Card>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="all" className="space-y-4">
              <TaskList 
                tasks={tasks} 
                onDeleteClick={handleDeleteClick} 
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="pending" className="space-y-4">
              <TaskList 
                tasks={tasks.filter(task => task.status === 'pending')} 
                onDeleteClick={handleDeleteClick} 
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="in_progress" className="space-y-4">
              <TaskList 
                tasks={tasks.filter(task => task.status === 'in_progress')} 
                onDeleteClick={handleDeleteClick} 
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="completed" className="space-y-4">
              <TaskList 
                tasks={tasks.filter(task => task.status === 'completed' || task.status === 'failed')} 
                onDeleteClick={handleDeleteClick} 
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTask}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Task"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function TaskList({ 
  tasks, 
  onDeleteClick,
  getStatusBadge
}: { 
  tasks: Task[],
  onDeleteClick: (task: Task) => void,
  getStatusBadge: (status: TaskStatus) => React.ReactNode
}) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <CardDescription className="mt-1">{task.description}</CardDescription>
              </div>
              {getStatusBadge(task.status)}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
              </div>
              {task.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>Priority: {task.priority}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div></div>
            <div className="flex gap-2">
              {task.status !== 'completed' && (
                <Button variant="outline" size="sm" className="gap-1">
                  <Check className="h-4 w-4" /> Mark Complete
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive gap-1"
                onClick={() => onDeleteClick(task)}
              >
                <Trash className="h-4 w-4" /> Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 