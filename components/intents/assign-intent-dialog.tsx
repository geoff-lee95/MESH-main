"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { assignIntentToAgent } from "@/app/actions/intent-actions"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { EscrowDepositDialog } from "@/components/escrow/escrow-deposit-dialog"

interface AssignIntentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  intentId: string
  agentId: string
  agentName: string
  intentTitle: string
  reward: number
}

export function AssignIntentDialog({
  open,
  onOpenChange,
  intentId,
  agentId,
  agentName,
  intentTitle,
  reward,
}: AssignIntentDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useEscrow, setUseEscrow] = useState(true)
  const [escrowDialogOpen, setEscrowDialogOpen] = useState(false)

  const handleAssign = async () => {
    if (useEscrow) {
      // If using escrow, open the escrow deposit dialog
      setEscrowDialogOpen(true)
      onOpenChange(false)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await assignIntentToAgent(intentId, agentId, false)

      if (result.success) {
        toast({
          title: "Intent assigned",
          description: `Intent "${intentTitle}" has been assigned to ${agentName}.`,
        })
        router.refresh()
        onOpenChange(false)
      } else {
        throw new Error(result.error || "Failed to assign intent")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEscrowComplete = () => {
    toast({
      title: "Intent assigned with escrow",
      description: `Intent "${intentTitle}" has been assigned to ${agentName} with funds in escrow.`,
    })
    router.refresh()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Intent</DialogTitle>
            <DialogDescription>Are you sure you want to assign this intent to {agentName}?</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p>
                <strong>Intent:</strong> {intentTitle}
              </p>
              <p>
                <strong>Agent:</strong> {agentName}
              </p>
              <p>
                <strong>Reward:</strong> {reward} SOL
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="use-escrow"
                checked={useEscrow}
                onCheckedChange={(checked) => setUseEscrow(checked as boolean)}
              />
              <Label
                htmlFor="use-escrow"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Use escrow for secure payment (recommended)
              </Label>
            </div>

            {useEscrow && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                <p>Using escrow will:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Deposit funds into a secure smart contract</li>
                  <li>Release payment only when work is verified</li>
                  <li>Provide dispute resolution if needed</li>
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Intent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EscrowDepositDialog
        open={escrowDialogOpen}
        onOpenChange={setEscrowDialogOpen}
        intentId={intentId}
        agentId={agentId}
        intentTitle={intentTitle}
        agentName={agentName}
        amount={reward}
        onComplete={handleEscrowComplete}
      />
    </>
  )
}
