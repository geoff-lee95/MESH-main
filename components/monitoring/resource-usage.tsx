"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for resource usage
const cpuData = [
  { time: "00:00", value: 25 },
  { time: "04:00", value: 15 },
  { time: "08:00", value: 45 },
  { time: "12:00", value: 65 },
  { time: "16:00", value: 55 },
  { time: "20:00", value: 35 },
]

const memoryData = [
  { time: "00:00", value: 128 },
  { time: "04:00", value: 156 },
  { time: "08:00", value: 245 },
  { time: "12:00", value: 315 },
  { time: "16:00", value: 280 },
  { time: "20:00", value: 210 },
]

const networkData = [
  { time: "00:00", value: 5 },
  { time: "04:00", value: 3 },
  { time: "08:00", value: 12 },
  { time: "12:00", value: 18 },
  { time: "16:00", value: 15 },
  { time: "20:00", value: 8 },
]

const resourceAllocationData = [
  { name: "Agent 1", value: 35 },
  { name: "Agent 2", value: 25 },
  { name: "Agent 3", value: 20 },
  { name: "Agent 4", value: 15 },
  { name: "Others", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function ResourceUsage() {
  const [agentFilter, setAgentFilter] = useState("all")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Resource Usage</CardTitle>
          <CardDescription>CPU, memory, and network usage</CardDescription>
        </div>
        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            <SelectItem value="agent1">Agent 1</SelectItem>
            <SelectItem value="agent2">Agent 2</SelectItem>
            <SelectItem value="agent3">Agent 3</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cpu">
          <TabsList className="mb-4">
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
          </TabsList>

          <TabsContent value="cpu" className="h-72">
            <ChartContainer
              config={{
                value: {
                  label: "CPU Usage (%)",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    fillOpacity={0.3}
                    name="CPU Usage (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="memory" className="h-72">
            <ChartContainer
              config={{
                value: {
                  label: "Memory Usage (MB)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={memoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    fillOpacity={0.3}
                    name="Memory Usage (MB)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="network" className="h-72">
            <ChartContainer
              config={{
                value: {
                  label: "Network Usage (MB/s)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={networkData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    fillOpacity={0.3}
                    name="Network Usage (MB/s)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="allocation" className="h-72">
            <div className="flex items-center justify-center h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {resourceAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
