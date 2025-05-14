"use client"

import { useState, useEffect } from "react"
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
import { assignIntentToAgent } from "@/app/actions/intent-actions"
import { createEscrowRecord } from "@/app/actions/escrow-actions"
import { initializeEscrow } from "@/lib/escrow"

interface EscrowDepositDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  intentId: string
  agentId: string
  intentTitle: string
  agentName: string
  amount: number
  onComplete: () => void
}

enum DepositStep {
  Connect = "connect",
  Confirm = "confirm",
  Processing = "processing",
  Success = "success",
  Error = "error",
}

export function EscrowDepositDialog({
  open,
  onOpenChange,
  intentId,
  agentId,
  intentTitle,
  agentName,
  amount,
  onComplete,
}: EscrowDepositDialogProps) {
  const wallet = useWallet()
  const [step, setStep] = useState<DepositStep>(DepositStep.Connect)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agentWalletAddress, setAgentWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setStep(wallet.connected ? DepositStep.Confirm : DepositStep.Connect)
      setError(null)
      setIsSubmitting(false)

      // Fetch agent wallet address
      const fetchAgentWallet = async () => {
        try {
          const response = await fetch(`/api/agents/${agentId}/wallet`)
          const data = await response.json()
          if (data.success && data.walletAddress) {
            setAgentWalletAddress(data.walletAddress)
          } else {
            setError("Could not retrieve agent wallet address. Please try again.")
            setStep(DepositStep.Error)
          }
        } catch (error) {
          console.error("Error fetching agent wallet:", error)
          setError("Could not retrieve agent wallet address. Please try again.")
          setStep(DepositStep.Error)
        }
      }

      fetchAgentWallet()
    }
  }, [open, wallet.connected, agentId])

  useEffect(() => {
    // Update step when wallet connection changes
    if (wallet.connected && step === DepositStep.Connect) {
      setStep(DepositStep.Confirm)
    }
  }, [wallet.connected, step])

  const handleDeposit = async () => {
    if (!wallet.connected || !wallet.publicKey || !agentWalletAddress) {
      setError("Wallet not connected or agent wallet address not available")
      setStep(DepositStep.Error)
      return
    }

    setIsSubmitting(true)
    setStep(DepositStep.Processing)

    try {
      // Initialize escrow on Solana
      const escrowResult = await initializeEscrow(wallet, intentId, amount, agentWalletAddress)

      if (!escrowResult.success) {
        throw new Error(escrowResult.error || "Failed to initialize escrow")
      }

      // Create escrow record in database
      const dbResult = await createEscrowRecord({
        intentId,
        agentId,
        escrowAddress: escrowResult.escrowAddress!,
        amount,
        status: "deposited",
        transactionSignature: escrowResult.signature!,
      })

      if (!dbResult.success) {
        throw new Error(dbResult.error || "Failed to create escrow record")
      }

      // Assign intent to agent with escrow
      const assignResult = await assignIntentToAgent(intentId, agentId, true)

      if (!assignResult.success) {
        throw new Error(assignResult.error || "Failed to assign intent")
      }

      // Success
      setStep(DepositStep.Success)
      setTimeout(() => {
        onOpenChange(false)
        onComplete()
      }, 2000)
    } catch (error: any) {
      console.error("Escrow deposit error:", error)
      setError(error.message || "An error occurred during the escrow deposit")
      setStep(DepositStep.Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case DepositStep.Connect:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-center text-muted-foreground mb-4">
              Please connect your Solana wallet to continue with the escrow deposit.
            </p>
            <Button onClick={() => wallet.select && wallet.select("")}>Connect Wallet</Button>
          </div>
        )

      case DepositStep.Confirm:
        return (
          <>
            <DialogDescription>
              You are about to deposit {amount} SOL into an escrow account for this intent.
            </DialogDescription>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p>
                  <strong>Intent:</strong> {intentTitle}
                </p>
                <p>
                  <strong>Agent:</strong> {agentName}
                </p>
                <p>
                  <strong>Amount:</strong> {amount} SOL
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
                  Funds will be held in a secure escrow smart contract and will only be released when you approve the
                  completed work.
                </AlertDescription>
              </Alert>
            </div>
          </>
        )

      case DepositStep.Processing:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processing Deposit</h3>
            <p className="text-center text-muted-foreground">
              Please approve the transaction in your wallet and wait for confirmation.
            </p>
          </div>
        )

      case DepositStep.Success:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Deposit Successful</h3>
            <p className="text-center text-muted-foreground">
              Your funds have been securely deposited into the escrow account.
            </p>
          </div>
        )

      case DepositStep.Error:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-center text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={() => setStep(DepositStep.Confirm)}>
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
          <DialogTitle>Escrow Deposit</DialogTitle>
        </DialogHeader>

        {renderStepContent()}

        {step === DepositStep.Confirm && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleDeposit} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Deposit Funds"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
