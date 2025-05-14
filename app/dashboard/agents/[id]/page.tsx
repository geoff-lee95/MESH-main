"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import React from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart,
  Code2,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FileBarChart,
  Loader2,
  MoreHorizontal,
  Network,
  Play,
  Square,
  Timer,
  Trash,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAgentById, deleteAgent, updateAgent } from "@/app/actions/agent-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

// Define proper types for the params
type PageParams = {
  id: string;
}

// Mock analytics data
type AnalyticsData = {
  totalIntents: number;
  successRate: number;
  averageResponseTime: number;
  intentsPerDay: { date: string; count: number }[];
  responseTimeDistribution: { time: string; count: number }[];
  intentCategories: { category: string; count: number }[];
  resourceUtilization: number;
  activeUsers: number;
}

export default function AgentDetailPage({ params }: { params: PageParams | Promise<PageParams> }) {
  const router = useRouter()
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [lastStartTime, setLastStartTime] = useState<Date | null>(null)
  const { toast } = useToast()
  
  // Unwrap params with React.use() if it's a promise
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const { id } = unwrappedParams;

  // Generate mock analytics data
  const generateAnalyticsData = () => {
    return {
      totalIntents: Math.floor(Math.random() * 100) + 50,
      successRate: Math.floor(Math.random() * 30) + 70, // 70-99%
      averageResponseTime: Math.floor(Math.random() * 400) + 100, // 100-500ms
      intentsPerDay: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 20) + 1
      })),
      responseTimeDistribution: [
        { time: "0-100ms", count: Math.floor(Math.random() * 20) + 10 },
        { time: "100-200ms", count: Math.floor(Math.random() * 30) + 20 },
        { time: "200-300ms", count: Math.floor(Math.random() * 20) + 15 },
        { time: "300-400ms", count: Math.floor(Math.random() * 10) + 5 },
        { time: "400ms+", count: Math.floor(Math.random() * 5) + 1 },
      ],
      intentCategories: [
        { category: "Data Analysis", count: Math.floor(Math.random() * 30) + 10 },
        { category: "Content Generation", count: Math.floor(Math.random() * 25) + 5 },
        { category: "Task Scheduling", count: Math.floor(Math.random() * 15) + 5 },
        { category: "User Queries", count: Math.floor(Math.random() * 20) + 10 },
        { category: "Other", count: Math.floor(Math.random() * 10) + 5 },
      ],
      resourceUtilization: Math.floor(Math.random() * 40) + 30, // 30-70%
      activeUsers: Math.floor(Math.random() * 15) + 5,
    }
  }

  // Initialize isRunning state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedAgentStatus = localStorage.getItem(`agent_running_${id}`);
        if (storedAgentStatus) {
          const parsedStatus = JSON.parse(storedAgentStatus);
          setIsRunning(parsedStatus.isRunning);
          if (parsedStatus.startTime) {
            setLastStartTime(new Date(parsedStatus.startTime));
          }
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    }
  }, [id]);

  useEffect(() => {
    async function loadAgent() {
      try {
        const result = await getAgentById(id)
        if (result.success) {
          setAgent(result.data)
          
          // Sync with agent state from database if different from localStorage
          // In a real implementation, the server would provide is_running property
          // For now, we're just using localStorage
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

    loadAgent()
  }, [id])

  // Update localStorage when isRunning changes
  useEffect(() => {
    if (typeof window !== 'undefined' && agent) {
      try {
        localStorage.setItem(`agent_running_${id}`, JSON.stringify({
          isRunning,
          startTime: isRunning ? (lastStartTime ? lastStartTime.toISOString() : new Date().toISOString()) : null
        }));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [isRunning, id, agent, lastStartTime]);

  // Update analytics data when agent is running
  useEffect(() => {
    if (isRunning) {
      setAnalyticsData(generateAnalyticsData())
      
      // Set start time if it's not already set
      if (!lastStartTime) {
        setLastStartTime(new Date());
      }
      
      // Simulate real-time data updates
      const interval = setInterval(() => {
        setAnalyticsData(prev => {
          if (!prev) return generateAnalyticsData()
          
          return {
            ...prev,
            totalIntents: prev.totalIntents + Math.floor(Math.random() * 3),
            successRate: Math.min(99, Math.max(70, prev.successRate + (Math.random() > 0.5 ? 1 : -1))),
            averageResponseTime: Math.max(100, Math.min(500, prev.averageResponseTime + (Math.random() > 0.5 ? 10 : -10))),
            resourceUtilization: Math.max(20, Math.min(80, prev.resourceUtilization + (Math.random() > 0.5 ? 3 : -3))),
            activeUsers: Math.max(1, Math.min(30, prev.activeUsers + (Math.random() > 0.7 ? 1 : Math.random() > 0.7 ? -1 : 0))),
          }
        })
      }, 5000)
      
      return () => clearInterval(interval)
    } else {
      setAnalyticsData(null)
    }
  }, [isRunning, lastStartTime])

  const handleDeleteAgent = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteAgent(id)
      if (result.success) {
        // Clear the localStorage state for this agent
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`agent_running_${id}`);
        }
        router.push("/dashboard/agents")
      } else {
        setError(result.error || "Failed to delete agent")
        setDeleteDialogOpen(false)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleAgentVisibility = async () => {
    if (!agent) return

    try {
      const result = await updateAgent(id, {
        isPublic: !agent.is_public,
      })

      if (result.success) {
        setAgent({
          ...agent,
          is_public: !agent.is_public,
        })
      } else {
        setError(result.error || "Failed to update agent visibility")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    }
  }

  const toggleAgentRunning = async () => {
    try {
      // Toggle the state first for immediate UI feedback
      const newRunningState = !isRunning;
      setIsRunning(newRunningState);
      
      if (newRunningState) {
        setLastStartTime(new Date());
        toast({
          title: "Agent Started",
          description: "Your agent is now running and processing intents.",
        });
      } else {
        toast({
          title: "Agent Stopped",
          description: "Your agent has been stopped successfully.",
        });
      }
      
      // In a real implementation, this would call an API to start/stop the agent
      // and update the database
      // For example:
      // const result = await updateAgent(id, { isRunning: newRunningState })
      // if (!result.success) {
      //   setIsRunning(!newRunningState); // Revert on failure
      //   setError(result.error || "Failed to update agent running state")
      // }
    } catch (err) {
      // Revert state in case of error
      setIsRunning(!isRunning);
      setError("An unexpected error occurred");
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update agent status. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Calculate uptime based on lastStartTime
  const getUptime = () => {
    if (!isRunning || !lastStartTime) return "00:00:00";
    
    const now = new Date();
    const diff = now.getTime() - lastStartTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
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
            <Link href="/dashboard/agents">Back to Agents</Link>
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

  // Default values for metadata fields
  const autonomyLevel = 5
  const deploymentEnvironment = "development"
  
  // Calculate real uptime
  const uptime = getUptime();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/agents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{agent.name}</h1>
          <Badge variant={agent.is_public ? "default" : "outline"}>{agent.is_public ? "Public" : "Private"}</Badge>
          {isRunning && <Badge variant="outline" className="border-gray-500 bg-gray-500/20 text-gray-300">Running</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant={isRunning ? "destructive" : "default"} onClick={toggleAgentRunning} className="gap-2">
            {isRunning ? (
              <>
                <Square className="h-4 w-4" /> Stop Agent
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Start Agent
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Agent Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/agents/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Agent
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleAgentVisibility}>
                {agent.is_public ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" /> Make Private
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" /> Make Public
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash className="mr-2 h-4 w-4" /> Delete Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <Card>
              <CardHeader>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="overview" className="space-y-8">
                  <div className="p-2">
                    <h3 className="text-lg font-medium mb-3">Description</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{agent.description}</p>
                  </div>

                  <Separator className="my-2" />

                  <div className="p-2">
                    <h3 className="text-lg font-medium mb-3">Capabilities</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {agent.capabilities.map((capability: string) => (
                        <Badge key={capability} variant="outline" className="px-3 py-1 text-sm">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="grid gap-6 md:grid-cols-2 p-2">
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Agent Type</h3>
                      <p className="mt-2 text-muted-foreground font-medium">{agent.agent_type}</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Resource Limit</h3>
                      <p className="mt-2 text-muted-foreground font-medium">{agent.resource_limit} tokens</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Autonomy Level</h3>
                      <p className="mt-2 text-muted-foreground font-medium">{autonomyLevel}</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Deployment Environment</h3>
                      <p className="mt-2 text-muted-foreground font-medium capitalize">{deploymentEnvironment}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="space-y-6">
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between border-b bg-muted px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4" />
                        <span className="text-sm font-medium">agent.js</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="overflow-auto p-4 text-sm">
                      <code>{agent.custom_code || "// No custom code provided"}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="logs" className="space-y-6">
                  <div className="rounded-md border bg-black p-4">
                    <pre className="text-xs text-green-400">
                      <code>
                        {isRunning ? (
                          <>
                            [2025-05-11 09:15:23] INFO: Agent started
                            <br />
                            [2025-05-11 09:15:24] INFO: Connecting to MESH network...
                            <br />
                            [2025-05-11 09:15:25] INFO: Connected to MESH network
                            <br />
                            [2025-05-11 09:15:26] INFO: Listening for intents...
                            <br />
                            {lastStartTime && (
                              <>[{new Date(lastStartTime).toLocaleString()}] INFO: Agent restarted by user<br /></>
                            )}
                          </>
                        ) : (
                          "[2025-05-11 09:15:23] INFO: Agent is not running"
                        )}
                      </code>
                    </pre>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline">Clear Logs</Button>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  {isRunning && analyticsData ? (
                    <div className="space-y-6">
                      {/* Analytics Dashboard */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <AnalyticCard 
                          title="Total Intents"
                          value={analyticsData.totalIntents.toString()}
                          icon={<FileBarChart className="h-4 w-4 text-gray-400" />}
                        />
                        <AnalyticCard 
                          title="Success Rate"
                          value={`${analyticsData.successRate}%`}
                          icon={<ArrowUpRight className="h-4 w-4 text-gray-400" />}
                        />
                        <AnalyticCard 
                          title="Avg Response"
                          value={`${analyticsData.averageResponseTime}ms`}
                          icon={<Timer className="h-4 w-4 text-gray-400" />}
                        />
                        <AnalyticCard 
                          title="Active Users"
                          value={analyticsData.activeUsers.toString()}
                          icon={<Users className="h-4 w-4 text-gray-400" />}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Intent Volume Chart */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Intent Volume (Last 7 Days)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[200px] flex items-end gap-2">
                              {analyticsData.intentsPerDay.map((day, i) => (
                                <div key={i} className="relative flex-1 flex flex-col items-center">
                                  <div 
                                    className="w-full bg-gray-600/80 rounded-t"
                                    style={{ 
                                      height: `${(day.count / Math.max(...analyticsData.intentsPerDay.map(d => d.count))) * 150}px` 
                                    }}
                                  ></div>
                                  <span className="text-xs mt-1">{day.date}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Intent Categories */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Intent Categories</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {analyticsData.intentCategories.map((category, i) => {
                                const total = analyticsData.intentCategories.reduce((sum, cat) => sum + cat.count, 0);
                                const percentage = Math.round((category.count / total) * 100);
                                
                                return (
                                  <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>{category.category}</span>
                                      <span>{percentage}%</span>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Resource Utilization */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Resource Utilization</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <span className="text-sm font-medium">
                                  {analyticsData.resourceUtilization}% of allocated resources
                                </span>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Network className="h-4 w-4 mr-1" />
                                  <span>Real-time utilization</span>
                                </div>
                              </div>
                              <Badge variant={analyticsData.resourceUtilization > 80 ? "destructive" : (analyticsData.resourceUtilization > 60 ? "outline" : "outline")}>
                                {analyticsData.resourceUtilization > 80 ? "High" : (analyticsData.resourceUtilization > 60 ? "Medium" : "Low")}
                              </Badge>
                            </div>
                            <Progress value={analyticsData.resourceUtilization} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Response Time Distribution */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Response Time Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] flex items-end gap-2">
                            {analyticsData.responseTimeDistribution.map((item, i) => (
                              <div key={i} className="relative flex-1 flex flex-col items-center">
                                <div 
                                  className="w-full bg-gray-500/80 rounded-t"
                                  style={{ 
                                    height: `${(item.count / Math.max(...analyticsData.responseTimeDistribution.map(d => d.count))) * 150}px` 
                                  }}
                                ></div>
                                <span className="text-xs mt-1">{item.time}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="rounded-md border p-6">
                      <div className="text-center">
                        <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No analytics data available yet</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Start the agent to begin collecting analytics data
                        </p>
                        <Button onClick={toggleAgentRunning} className="mt-4">
                          <Play className="h-4 w-4 mr-2" /> Start Agent
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${isRunning ? "bg-gray-400 animate-pulse" : "bg-gray-500"}`} />
                <span>{isRunning ? "Running" : "Stopped"}</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm">{uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Memory Usage</span>
                  <span className="text-sm">{isRunning ? "128 MB" : "0 MB"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">CPU Usage</span>
                  <span className="text-sm">{isRunning ? "2.4%" : "0%"}</span>
                </div>
                {lastStartTime && isRunning && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Started At</span>
                    <span className="text-sm">{new Date(lastStartTime).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isRunning ? (
                <div className="space-y-4">
                  <div className="rounded-md border p-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Intent Received</span>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Received intent "Data Analysis" from user 7XB3...9F4D
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Intent Processed</span>
                      <span className="text-xs text-muted-foreground">5 min ago</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Successfully processed intent "Market Analysis" from user 3E4F...7A8B
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground mt-2">Start the agent to begin processing intents</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{new Date(agent.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm">{new Date(agent.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Agent ID</span>
                  <span className="text-sm font-mono">{agent.id.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Logging Level</span>
                  <span className="text-sm capitalize">info</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Auto Restart</span>
                  <span className="text-sm">Enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this agent? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAgent} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Agent"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Analytics card component for displaying high-level metrics
function AnalyticCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between">
        {icon}
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </div>
  );
}
