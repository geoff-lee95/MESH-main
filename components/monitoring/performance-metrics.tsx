"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for performance metrics
const dailyData = [
  { day: "Mon", intents: 12, success: 10, failure: 2 },
  { day: "Tue", intents: 19, success: 15, failure: 4 },
  { day: "Wed", intents: 15, success: 13, failure: 2 },
  { day: "Thu", intents: 22, success: 18, failure: 4 },
  { day: "Fri", intents: 28, success: 24, failure: 4 },
  { day: "Sat", intents: 16, success: 14, failure: 2 },
  { day: "Sun", intents: 10, success: 9, failure: 1 },
]

const weeklyData = [
  { week: "Week 1", intents: 85, success: 72, failure: 13 },
  { week: "Week 2", intents: 102, success: 88, failure: 14 },
  { week: "Week 3", intents: 120, success: 105, failure: 15 },
  { week: "Week 4", intents: 110, success: 95, failure: 15 },
]

const monthlyData = [
  { month: "Jan", intents: 320, success: 280, failure: 40 },
  { month: "Feb", intents: 350, success: 310, failure: 40 },
  { month: "Mar", intents: 410, success: 370, failure: 40 },
  { month: "Apr", intents: 450, success: 400, failure: 50 },
  { month: "May", intents: 480, success: 430, failure: 50 },
]

const responseTimeData = [
  { time: "00:00", value: 120 },
  { time: "04:00", value: 90 },
  { time: "08:00", value: 150 },
  { time: "12:00", value: 210 },
  { time: "16:00", value: 180 },
  { time: "20:00", value: 110 },
]

export function PerformanceMetrics() {
  const [timeRange, setTimeRange] = useState("daily")

  const data = timeRange === "daily" ? dailyData : timeRange === "weekly" ? weeklyData : monthlyData

  const xKey = timeRange === "daily" ? "day" : timeRange === "weekly" ? "week" : "month"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Intent processing performance over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="intents">
          <TabsList className="mb-4">
            <TabsTrigger value="intents">Intents Processed</TabsTrigger>
            <TabsTrigger value="response">Response Time</TabsTrigger>
          </TabsList>

          <TabsContent value="intents" className="h-72">
            <ChartContainer
              config={{
                intents: {
                  label: "Total Intents",
                  color: "hsl(var(--chart-1))",
                },
                success: {
                  label: "Successful",
                  color: "hsl(var(--chart-2))",
                },
                failure: {
                  label: "Failed",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xKey} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="success" stackId="a" fill="var(--color-success)" name="Successful" />
                  <Bar dataKey="failure" stackId="a" fill="var(--color-failure)" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="response" className="h-72">
            <ChartContainer
              config={{
                value: {
                  label: "Response Time (ms)",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    name="Response Time (ms)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
