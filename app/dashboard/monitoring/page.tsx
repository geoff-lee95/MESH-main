import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import Link from "next/link"

export default async function MonitoringPage() {
  const supabase = await createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get the user's agents
  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light">Agent Monitoring</h1>
          <p className="text-muted-foreground">Real-time monitoring and analytics for your deployed agents</p>
        </div>
      </div>

      {/* Basic Agent Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Status</CardTitle>
          <CardDescription>Real-time status of your deployed agents</CardDescription>
        </CardHeader>
        <CardContent>
          {agents && agents.length > 0 ? (
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">ID: {agent.id.substring(0, 8)}...</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Active
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/agents/${agent.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No agents found</h3>
              <p className="text-muted-foreground mt-2">You haven&apos;t created any agents yet.</p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/agents/create">
                  Create Your First Agent
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
