"use client"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { updateIntentProgress } from "@/app/actions/intent-actions"
import { toast } from "@/components/ui/use-toast"

interface ProgressUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  intent: any
  onComplete: () => void
}

export function ProgressUpdateDialog({ open, onOpenChange, intent, onComplete }: ProgressUpdateDialogProps) {
  const [progress, setProgress] = useState(50)
  const [notes, setNotes] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!intent) return

    setIsSubmitting(true)
    try {
      const result = await updateIntentProgress(intent.id, {
        progress,
        notes,
        isComplete,
      })

      if (result.success) {
        toast({
          title: isComplete ? "Intent completed" : "Progress updated",
          description: isComplete
            ? "The intent has been marked as completed"
            : "Progress has been updated successfully",
        })
        onComplete()
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.error || "Failed to update progress",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setProgress(50)
      setNotes("")
      setIsComplete(false)
    }
    onOpenChange(open)
  }

  if (!intent) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>
            Update the progress for this intent and provide any notes for the client.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Progress ({progress}%)</label>
            <Slider value={[progress]} onValueChange={(value) => setProgress(value[0])} min={0} max={100} step={5} />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Progress Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Provide details about your progress, challenges, or questions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="complete"
              checked={isComplete}
              onChange={(e) => setIsComplete(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="complete" className="text-sm font-medium">
              Mark intent as completed
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isComplete ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Intent
              </>
            ) : (
              "Update Progress"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
