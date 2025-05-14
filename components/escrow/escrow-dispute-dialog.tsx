"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { updateEscrowStatus } from "@/app/actions/escrow-actions"
import { createDispute } from "@/lib/escrow"

interface EscrowDisputeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  escrow: any
}

enum DisputeStep {
  Connect = "connect",
  Form = "form",
  Processing = "processing",
  Success = "success",
  Error = "error",
}

export function EscrowDisputeDialog({ open, onOpenChange, escrow }: EscrowDisputeDialogProps) {
  const router = useRouter()
  const wallet = useWallet()
  const [step, setStep] = useState<DisputeStep>(DisputeStep.Connect)
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitDispute = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError("Wallet not connected")
      setStep(DisputeStep.Error)
      return
    }

    if (!reason.trim()) {
      setError("Please provide a reason for the dispute")
      return
    }

    setIsSubmitting(true)
    setStep(DisputeStep.Processing)

    try {
      // Create dispute on Solana
      const disputeResult = await createDispute(wallet, escrow.intent_id, reason)

      if (!disputeResult.success) {
        throw new Error(disputeResult.error || "Failed to create dispute")
      }

      // Update escrow status in database
      const dbResult = await updateEscrowStatus(escrow.id, "disputed", disputeResult.signature)

      if (!dbResult.success) {
        throw new Error(dbResult.error || "Failed to update escrow status")
      }

      // Success
      setStep(DisputeStep.Success)
      setTimeout(() => {
        onOpenChange(false)
        router.refresh()
      }, 2000)
    } catch (error: any) {
      console.error("Escrow dispute error:", error)
      setError(error.message || "An error occurred during the dispute creation")
      setStep(DisputeStep.Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case DisputeStep.Connect:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-center text-muted-foreground mb-4">
              Please connect your Solana wallet to create a dispute.
            </p>
            <Button onClick={() => wallet.select && wallet.select("")}>Connect Wallet</Button>
          </div>
        )

      case DisputeStep.Form:
        return (
          <>
            <DialogDescription>
              Create a dispute for the escrow account related to intent "{escrow.intent.title}".
            </DialogDescription>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p>
                  <strong>Intent:</strong> {escrow.intent.title}
                </p>
                <p>
                  <strong>Agent:</strong> {escrow.agent.name}
                </p>
                <p>
                  <strong>Amount:</strong> {escrow.amount} SOL
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Dispute</Label>
                <Textarea
                  id="reason"
                  placeholder="Please explain why you are creating this dispute..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Creating a dispute will freeze the funds in escrow until the dispute is resolved. This should only be
                  used if there are serious issues with the completed work.
                </AlertDescription>
              </Alert>
            </div>
          </>
        )

      case DisputeStep.Processing:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">Creating Dispute</h3>
            <p className="text-center text-muted-foreground">
              Please approve the transaction in your wallet and wait for confirmation.
            </p>
          </div>
        )

      case DisputeStep.Success:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dispute Created</h3>
            <p className="text-center text-muted-foreground">
              Your dispute has been successfully created. Our team will review it and contact you soon.
            </p>
          </div>
        )

      case DisputeStep.Error:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-center text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={() => setStep(DisputeStep.Form)}>
              Try Again
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Dispute</DialogTitle>
        </DialogHeader>

        {renderStepContent()}

        {step === DisputeStep.Form && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitDispute} disabled={isSubmitting || !reason.trim()}>
              {isSubmitting ? "Processing..." : "Create Dispute"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
