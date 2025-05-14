"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Clock, MoreHorizontal, Tag, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { applyToFulfillIntent, saveIntentForLater } from "@/app/actions/intent-actions"
import type { Database } from "@/types/supabase"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Update the Intent type to include metadata
type Intent = Database["public"]["Tables"]["intents"]["Row"] & {
  metadata?: {
    category?: string
    tags?: string[]
    complexity?: number
    isPrivate?: boolean
    successCriteria?: string
    maxBudget?: number
    allowMultipleAgents?: boolean
    requiredCapabilities?: string[]
  }
}

interface IntentListProps {
  intents: Intent[]
  showPublisher?: boolean
  userAgents?: any[]
  savedIntentIds?: string[]
}

export function IntentList({ intents, showPublisher = false, userAgents = [], savedIntentIds = [] }: IntentListProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null)
  const [showApplyDialog, setShowApplyDialog] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string>("")
  
  // Use useMemo to create a stable savedIntents value
  const savedIntents = useMemo(() => {
    return new Set(savedIntentIds);
  }, [savedIntentIds]);
  
  const handleApplyToFulfill = (intent: Intent) => {
    setSelectedIntent(intent)
    setShowApplyDialog(true)
  }

  const handleSaveForLater = async (intent: Intent) => {
    try {
      setIsLoading(true)
      const result = await saveIntentForLater(intent.id)

      if (result.success && result.data) {
        // We'll use router.refresh() to reload data from the server
        // rather than manually updating local state
        toast({
          title: result.data.saved ? "Intent Saved" : "Intent Removed",
          description: result.data.saved 
            ? "Intent has been saved for later" 
            : "Intent has been removed from saved items",
        })
        
        // Refresh the page to get the updated savedIntentIds from the server
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save/unsave intent",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving intent:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const submitApplication = async () => {
    if (!selectedIntent || !selectedAgentId) {
      toast({
        title: "Error",
        description: "Please select an agent to proceed",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const result = await applyToFulfillIntent(selectedIntent.id, selectedAgentId)

      if (result.success) {
        toast({
          title: "Application Submitted",
          description: "Your agent has applied to fulfill this intent",
        })
        setShowApplyDialog(false)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to apply",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error applying to intent:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!intents.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-light">No intents found</h3>
        <p className="text-muted-foreground font-light mt-2">There are no intents available at the moment.</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/intents/create">Publish an Intent</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Intent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reward</TableHead>
            <TableHead>Deadline</TableHead>
            {showPublisher && <TableHead>Publisher</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {intents.map((intent) => {
            const metadata = intent.metadata || {}
            const deadline = intent.deadline ? new Date(intent.deadline) : null
            const isDeadlinePassed = deadline ? deadline < new Date() : false
            const isSaved = savedIntents.has(intent.id)

            return (
              <TableRow key={intent.id}>
                <TableCell className="font-light">
                  <div>
                    <div className="flex items-center gap-2">
                      <div>{intent.title}</div>
                      {metadata.category && (
                        <Badge variant="outline" className="capitalize">
                          {metadata.category}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      <span>{intent.id.substring(0, 8)}</span>
                      {metadata.tags && metadata.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {metadata.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="bg-muted px-1 rounded text-[10px]">
                              {tag}
                            </span>
                          ))}
                          {metadata.tags.length > 2 && <span className="text-[10px]">+{metadata.tags.length - 2}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      intent.status === "open"
                        ? "outline"
                        : intent.status === "in_progress"
                          ? "secondary"
                          : intent.status === "completed"
                            ? "default"
                            : "destructive"
                    }
                  >
                    {intent.status}
                  </Badge>
                </TableCell>
                <TableCell>{intent.reward ? `${intent.reward} SOL` : "N/A"}</TableCell>
                <TableCell>
                  {deadline ? (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span className={isDeadlinePassed ? "text-destructive" : ""}>
                        {format(deadline, "MMM d, yyyy")}
                      </span>
                    </div>
                  ) : (
                    "No deadline"
                  )}
                </TableCell>
                {showPublisher && <TableCell>User {intent.user_id.substring(0, 6)}</TableCell>}
                <TableCell className="text-right">
                  {/* Wrap in a div to ensure the DropdownMenu doesn't create unexpected state updates */}
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/intents/${intent.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        {intent.status === "open" && userAgents && userAgents.length > 0 && (
                          <DropdownMenuItem onClick={() => handleApplyToFulfill(intent)}>
                            Apply to Fulfill
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleSaveForLater(intent)}
                          className={cn(
                            "group",
                            isSaved ? "text-green-600 hover:text-green-700 hover:bg-green-50" : ""
                          )}
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck className="mr-2 h-4 w-4 text-green-500 transition-transform duration-200 group-hover:scale-110" />
                              <span>Remove from Saved</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-500" />
                              <span>Save for Later</span>
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply to Fulfill Intent</DialogTitle>
            <DialogDescription>
              Select which of your agents should apply to fulfill this intent.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {userAgents.length === 0 ? (
                  <SelectItem value="no-agents" disabled>
                    You don't have any agents yet
                  </SelectItem>
                ) : (
                  userAgents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {userAgents.length === 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>You need to create an agent before you can apply to fulfill intents.</p>
                <Button variant="outline" className="mt-2" size="sm" asChild>
                  <Link href="/dashboard/agents/create">Create an Agent</Link>
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={submitApplication} disabled={!selectedAgentId || isLoading}>
              {isLoading ? "Applying..." : "Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
