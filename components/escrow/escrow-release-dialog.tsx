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
import { updateEscrowStatus } from "@/app/actions/escrow-actions"
import { releaseFunds } from "@/lib/escrow"

interface EscrowReleaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  escrow: any
}

enum ReleaseStep {
  Connect = "connect",
  Confirm = "confirm",
  Processing = "processing",
  Success = "success",
  Error = "error",
}

export function EscrowReleaseDialog({ open, onOpenChange, escrow }: EscrowReleaseDialogProps) {
  const router = useRouter()
  const wallet = useWallet()
  const [step, setStep] = useState<ReleaseStep>(ReleaseStep.Connect)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRelease = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError("Wallet not connected")
      setStep(ReleaseStep.Error)
      return
    }

    setIsSubmitting(true)
    setStep(ReleaseStep.Processing)

    try {
      // Release funds on Solana
      const releaseResult = await releaseFunds(wallet, escrow.intent_id, escrow.agent.wallet_address)

      if (!releaseResult.success) {
        throw new Error(releaseResult.error || "Failed to release funds")
      }

      // Update escrow status in database
      const dbResult = await updateEscrowStatus(escrow.id, "released", releaseResult.signature)

      if (!dbResult.success) {
        throw new Error(dbResult.error || "Failed to update escrow status")
      }

      // Success
      setStep(ReleaseStep.Success)
      setTimeout(() => {
        onOpenChange(false)
        router.refresh()
      }, 2000)
    } catch (error: any) {
      console.error("Escrow release error:", error)
      setError(error.message || "An error occurred during the fund release")
      setStep(ReleaseStep.Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case ReleaseStep.Connect:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-center text-muted-foreground mb-4">
              Please connect your Solana wallet to release the funds.
            </p>
            <Button onClick={() => wallet.select && wallet.select("")}>Connect Wallet</Button>
          </div>
        )

      case ReleaseStep.Confirm:
        return (
          <>
            <DialogDescription>
              You are about to release {escrow.amount} SOL from escrow to the agent.
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
                <p>
                  <strong>Your wallet:</strong> {wallet.publicKey?.toString().slice(0, 8)}...
                  {wallet.publicKey?.toString().slice(-8)}
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This action is irreversible. Only release funds if you are satisfied with the completed work.
                </AlertDescription>
              </Alert>
            </div>
          </>
        )

      case ReleaseStep.Processing:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processing Release</h3>
            <p className="text-center text-muted-foreground">
              Please approve the transaction in your wallet and wait for confirmation.
            </p>
          </div>
        )

      case ReleaseStep.Success:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Funds Released</h3>
            <p className="text-center text-muted-foreground">The funds have been successfully released to the agent.</p>
          </div>
        )

      case ReleaseStep.Error:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-center text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={() => setStep(ReleaseStep.Confirm)}>
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
          <DialogTitle>Release Escrow Funds</DialogTitle>
        </DialogHeader>

        {renderStepContent()}

        {step === ReleaseStep.Confirm && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleRelease} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Release Funds"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
