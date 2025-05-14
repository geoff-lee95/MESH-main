"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, CheckCircle, XCircle, PlayCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateIntentStatus, deleteIntent } from "@/app/actions/intent-actions"
import { toast } from "@/components/ui/use-toast"

interface IntentStatusActionsProps {
  intent: any
}

export function IntentStatusActions({ intent }: IntentStatusActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusUpdate = async (status: string) => {
    try {
      setIsLoading(true)
      const result = await updateIntentStatus(intent.id, status)

      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Intent status has been updated to ${status.replace("_", " ")}.`,
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating intent status:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this intent? This action cannot be undone.")) {
      return
    }

    try {
      setIsLoading(true)
      const result = await deleteIntent(intent.id)

      if (result.success) {
        toast({
          title: "Intent Deleted",
          description: "The intent has been deleted successfully.",
        })
        router.push("/dashboard/intents")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete intent",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting intent:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {intent.status === "open" && (
          <DropdownMenuItem onClick={() => handleStatusUpdate("in_progress")}>
            <PlayCircle className="mr-2 h-4 w-4 text-blue-500" />
            Mark as In Progress
          </DropdownMenuItem>
        )}

        {(intent.status === "open" || intent.status === "in_progress") && (
          <DropdownMenuItem onClick={() => handleStatusUpdate("completed")}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Mark as Completed
          </DropdownMenuItem>
        )}

        {intent.status !== "cancelled" && (
          <DropdownMenuItem onClick={() => handleStatusUpdate("cancelled")}>
            <XCircle className="mr-2 h-4 w-4 text-red-500" />
            Cancel Intent
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
          Delete Intent
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
