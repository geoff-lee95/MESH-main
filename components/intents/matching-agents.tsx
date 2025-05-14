"use client"

import { useState, useEffect } from "react"
import { Loader2, Bot, Award, AlertCircle, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getMatchingAgentsForIntent } from "@/app/actions/intent-actions"
import { AssignIntentDialog } from "./assign-intent-dialog"

interface MatchingAgentsProps {
  intentId: string
  intentStatus: string
}

export function MatchingAgents({ intentId, intentStatus }: MatchingAgentsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState<{ id: string; name: string } | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  const isIntentAssignable = intentStatus === "open"

  useEffect(() => {
    async function loadMatchingAgents() {
      try {
        setIsLoading(true)
        const result = await getMatchingAgentsForIntent(intentId)

        if (result.success) {
          setMatches(result.data)
        } else {
          setError(result.error || "Failed to load matching agents")
        }
      } catch (err) {
        console.error("Error loading matching agents:", err)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    loadMatchingAgents()
  }, [intentId])

  const handleAssignClick = (agentId: string, agentName: string) => {
    setSelectedAgent({ id: agentId, name: agentName })
    setIsAssignDialogOpen(true)
  }

  const handleAssignSuccess = () => {
    // Reload the page to reflect the updated status
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Matching Agents</CardTitle>
          <CardDescription>No agents match the requirements for this intent yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              We're looking for agents that match your requirements. Check back soon!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Matching Agents ({matches.length})</CardTitle>
          <CardDescription>These agents match the requirements for your intent.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches.map((match) => {
              const isAssigned = match.status === "assigned"

              return (
                <div key={match.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{match.agent.name}</h3>
                        <Badge variant="outline">{match.agent.agent_type}</Badge>
                        {match.match_score >= 90 && (
                          <Badge variant="default" className="bg-green-500">
                            <Award className="h-3 w-3 mr-1" /> Perfect Match
                          </Badge>
                        )}
                        {isAssigned && (
                          <Badge variant="default" className="bg-blue-500">
                            <Check className="h-3 w-3 mr-1" /> Assigned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{match.agent.description}</p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {match.agent.capabilities.map((capability: string) => (
                          <Badge key={capability} variant="secondary" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Match Score</div>
                      <div className="text-2xl font-bold text-primary">{match.match_score}%</div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View Agent
                    </Button>
                    {isIntentAssignable && !isAssigned ? (
                      <Button size="sm" onClick={() => handleAssignClick(match.agent.id, match.agent.name)}>
                        Assign Intent
                      </Button>
                    ) : isAssigned ? (
                      <Button size="sm" variant="outline" disabled>
                        <Check className="h-3 w-3 mr-1" /> Assigned
                      </Button>
                    ) : (
                      <Button size="sm" disabled>
                        Intent {intentStatus}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedAgent && (
        <AssignIntentDialog
          intentId={intentId}
          agentId={selectedAgent.id}
          agentName={selectedAgent.name}
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          onSuccess={handleAssignSuccess}
        />
      )}
    </>
  )
}
