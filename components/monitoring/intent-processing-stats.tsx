"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for intent processing stats
const intentsByTypeData = [
  { name: "Data Analysis", value: 35 },
  { name: "Market Research", value: 25 },
  { name: "Content Creation", value: 20 },
  { name: "Automation", value: 15 },
  { name: "Other", value: 5 },
]

const intentsByStatusData = [
  { name: "Completed", value: 65 },
  { name: "In Progress", value: 15 },
  { name: "Pending", value: 10 },
  { name: "Failed", value: 10 },
]

const processingTimeData = [
  { category: "<1s", count: 15 },
  { category: "1-5s", count: 25 },
  { category: "5-10s", count: 20 },
  { category: "10-30s", count: 15 },
  { category: "30-60s", count: 10 },
  { category: ">60s", count: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export function IntentProcessingStats() {
  const [timeRange, setTimeRange] = useState("daily")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Intent Processing Statistics</CardTitle>
          <CardDescription>Analysis of intent processing performance</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Today</SelectItem>
            <SelectItem value="weekly">This Week</SelectItem>
            <SelectItem value="monthly">This Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="by-type">
          <TabsList className="mb-4">
            <TabsTrigger value="by-type">By Type</TabsTrigger>
            <TabsTrigger value="by-status">By Status</TabsTrigger>
            <TabsTrigger value="processing-time">Processing Time</TabsTrigger>
          </TabsList>

          <TabsContent value="by-type" className="h-80">
            <div className="flex items-center justify-center h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={intentsByTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {intentsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="by-status" className="h-80">
            <div className="flex items-center justify-center h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={intentsByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {intentsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="processing-time" className="h-80">
            <ChartContainer
              config={{
                count: {
                  label: "Number of Intents",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processingTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" name="Number of Intents" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
