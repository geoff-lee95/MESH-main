"use client"

import { useEffect, useState } from "react"
import React from "react"
import Link from "next/link"
import { ArrowLeft, Download, Filter, Loader2, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAgentById } from "@/app/actions/agent-actions"

// Define proper types for the params and logs
type PageParams = {
  id: string;
}

type LogLevel = 'info' | 'warning' | 'error' | 'debug';

type LogEntry = {
  id: string;
  agent_id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

// Mock data for initial development
const MOCK_LOGS: LogEntry[] = [
  {
    id: '1',
    agent_id: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    level: 'info',
    message: 'Agent started successfully',
    metadata: { source: 'system' }
  },
  {
    id: '2',
    agent_id: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), // 4 minutes ago
    level: 'info',
    message: 'Processing task #123',
    metadata: { task_id: '123', source: 'agent' }
  },
  {
    id: '3',
    agent_id: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3 minutes ago
    level: 'warning',
    message: 'API rate limit approaching',
    metadata: { limit: '100/hour', current: '85/hour', source: 'external' }
  },
  {
    id: '4',
    agent_id: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
    level: 'error',
    message: 'Failed to connect to external service',
    metadata: { service: 'data-provider', error_code: 'ECONNREFUSED', source: 'external' }
  },
  {
    id: '5',
    agent_id: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(), // 1 minute ago
    level: 'debug',
    message: 'Memory usage: 256MB, CPU: 15%',
    metadata: { memory: '256MB', cpu: '15%', source: 'system' }
  },
  {
    id: '6',
    agent_id: '',
    timestamp: new Date().toISOString(), // Now
    level: 'info',
    message: 'Task #123 completed successfully',
    metadata: { task_id: '123', duration: '240s', source: 'agent' }
  },
];

export default function AgentLogsPage({ params }: { params: PageParams | Promise<PageParams> }) {
  // Unwrap params with React.use() if it's a promise
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const { id } = unwrappedParams;
  
  const [agent, setAgent] = useState<any>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  useEffect(() => {
    async function loadAgentAndLogs() {
      try {
        // Load agent data
        const result = await getAgentById(id)
        if (result.success) {
          setAgent(result.data)
          
          // In a real implementation, you would fetch logs from your database
          // For now, we'll use the mock data and set the agent_id
          const logsWithAgentId = MOCK_LOGS.map(log => ({
            ...log,
            agent_id: id
          }));
          setLogs(logsWithAgentId);
          setFilteredLogs(logsWithAgentId);
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

    loadAgentAndLogs()
  }, [id])

  // Filter logs when search term or level filter changes
  useEffect(() => {
    let filtered = logs;
    
    // Apply level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter(log => log.level === levelFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(term) || 
        JSON.stringify(log.metadata).toLowerCase().includes(term)
      );
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter]);

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'info':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Info</Badge>
      case 'warning':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Warning</Badge>
      case 'error':
        return <Badge variant="outline" className="text-red-500 border-red-500">Error</Badge>
      case 'debug':
        return <Badge variant="outline" className="text-green-500 border-green-500">Debug</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
  }

  const downloadLogs = () => {
    const content = filteredLogs.map(log => {
      return `[${formatTime(log.timestamp)}] [${log.level.toUpperCase()}] ${log.message} ${log.metadata ? JSON.stringify(log.metadata) : ''}`;
    }).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-${id}-logs.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/agents/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{agent.name} Logs</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={downloadLogs}>
            <Download className="h-4 w-4" /> Export Logs
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Log Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Time</th>
                  <th scope="col" className="px-6 py-3">Level</th>
                  <th scope="col" className="px-6 py-3">Message</th>
                  <th scope="col" className="px-6 py-3">Metadata</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTime(log.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        {getLevelBadge(log.level)}
                      </td>
                      <td className="px-6 py-4">{log.message}</td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {log.metadata && (
                          <pre className="max-w-xs overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">
                      No logs found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 