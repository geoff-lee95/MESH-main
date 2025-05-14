"use client"

import Link from "next/link"
import { Download, Network, RefreshCw, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AgentPerformanceChart, 
  AgentReputationChart, 
  IntentDistributionChart, 
  IntentFulfillmentChart, 
  NetworkActivityChart 
} from "@/components/ui/chart-mockups"

export default function AnalyticsPage() {
  return (
    <>
      <main className="grid gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light">Analytics Dashboard</h1>
              <p className="text-muted-foreground font-light">Monitor your agents' performance and network activity</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="30d">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-light">Total Intents Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light">24</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">↑ 12%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-light">Intents Fulfilled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light">18</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">↑ 8%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-light">Total SOL Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light">245.8 SOL</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">↑ 15%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="performance">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">Agent Performance</TabsTrigger>
              <TabsTrigger value="intents">Intent Analytics</TabsTrigger>
              <TabsTrigger value="network">Network Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="performance" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Performance Over Time</CardTitle>
                    <CardDescription>Task completion rate and response time</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="aspect-[4/3] w-full rounded-lg">
                      <AgentPerformanceChart />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="text-sm text-muted-foreground">
                      Average response time: <span className="font-light">1.2s</span>
                    </div>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Reputation</CardTitle>
                    <CardDescription>Reputation scores across all agents</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="aspect-[4/3] w-full rounded-lg">
                      <AgentReputationChart />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="text-sm text-muted-foreground">
                      Average reputation: <span className="font-light">4.7/5.0</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="intents" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Intent Distribution by Type</CardTitle>
                    <CardDescription>Breakdown of intent categories</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="aspect-[4/3] w-full rounded-lg">
                      <IntentDistributionChart />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="text-sm text-muted-foreground">
                      Most common type: <span className="font-light">Data Analysis (42%)</span>
                    </div>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Intent Fulfillment Timeline</CardTitle>
                    <CardDescription>Time to fulfill intents by complexity</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="aspect-[4/3] w-full rounded-lg">
                      <IntentFulfillmentChart />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="text-sm text-muted-foreground">
                      Average fulfillment time: <span className="font-light">3.5 hours</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="network" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Network Activity</CardTitle>
                  <CardDescription>P2P connections and message volume over time</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="aspect-[4/3] w-full rounded-lg">
                    <NetworkActivityChart />
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="text-sm text-muted-foreground">
                    Peak connections: <span className="font-light">1,245</span> | Messages: <span className="font-light">45,678</span>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Intent Activity Heatmap</CardTitle>
              <CardDescription>Daily agent activity and successful intent fulfillment tracking over the past year</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="flex text-xs text-muted-foreground justify-start">
                  {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((month) => (
                    <div key={month} style={{ width: 'calc(100% / 12)' }} className="text-left">{month}</div>
                  ))}
                </div>
                <div className="grid" style={{ 
                  gridTemplateColumns: 'repeat(52, 1fr)',
                  gap: '2px',
                  width: '100%'
                }}>
                  {Array.from({ length: 52 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[2px]">
                      {Array.from({ length: 7 }).map((_, dayIndex) => {
                        // Simulate relative activity scaling
                        const maxActivity = 10;
                        const activity = Math.floor(Math.random() * maxActivity);
                        const intensity = activity === 0 ? 0 
                          : activity <= 2 ? 1
                          : activity <= 5 ? 2
                          : activity <= 8 ? 3
                          : 4;
                        
                        return (
                          <div
                            key={dayIndex}
                            className={`h-[10px] w-[10px] rounded-sm ${
                              intensity === 0
                                ? "bg-muted/30"
                                : intensity === 1
                                  ? "bg-emerald-900/30"
                                  : intensity === 2
                                    ? "bg-emerald-800/40"
                                    : intensity === 3
                                      ? "bg-emerald-700/60"
                                      : "bg-emerald-600"
                            }`}
                            title={`${activity} activities`}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div>Less</div>
                <div className="h-[10px] w-[10px] rounded-sm bg-muted/30" />
                <div className="h-[10px] w-[10px] rounded-sm bg-emerald-900/30" />
                <div className="h-[10px] w-[10px] rounded-sm bg-emerald-800/40" />
                <div className="h-[10px] w-[10px] rounded-sm bg-emerald-700/60" />
                <div className="h-[10px] w-[10px] rounded-sm bg-emerald-600" />
                <div>More</div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  )
}
