"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import { PublicKey } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/components/wallet/wallet-provider"
import { createPaymentTransaction, SOLANA_NETWORK } from "@/lib/solana"
import { processPayment } from "@/app/actions/payment-actions"
import { toast } from "@/components/ui/use-toast"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  intent: any
  onComplete: () => void
}

export function PaymentDialog({ open, onOpenChange, intent, onComplete }: PaymentDialogProps) {
  const router = useRouter()
  const { wallet, connected, connect } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"initial" | "processing" | "success" | "error">("initial")

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setError(null)
      setTxSignature(null)
      setPaymentStatus("initial")
    }
    onOpenChange(open)
  }

  // Handle payment
  const handlePayment = async () => {
    if (!wallet || !connected) {
      try {
        await connect()
        return // Return after connecting, user will need to click pay again
      } catch (error) {
        setError("Failed to connect wallet. Please try again.")
        return
      }
    }

    if (!intent || !intent.agent || !intent.reward) {
      setError("Invalid intent or missing payment information.")
      return
    }

    try {
      setIsProcessing(true)
      setPaymentStatus("processing")
      setError(null)

      // Get recipient address from agent owner's wallet
      const recipientAddress = intent.agent.wallet_address

      if (!recipientAddress) {
        throw new Error("Agent owner has not set up a wallet address for payments.")
      }

      // Create transaction
      const transaction = await createPaymentTransaction(
        wallet.publicKey!,
        new PublicKey(recipientAddress),
        intent.reward,
      )

      // Sign transaction
      const signedTransaction = await wallet.signTransaction(transaction)

      // Send transaction
      const connection = new (await import("@solana/web3.js")).Connection(
        SOLANA_NETWORK === "mainnet-beta" ? "https://api.mainnet-beta.solana.com" : "https://api.devnet.solana.com",
        "confirmed",
      )

      const signature = await connection.sendRawTransaction(signedTransaction.serialize())
      setTxSignature(signature)

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed")

      // Process payment on server
      const result = await processPayment({
        intentId: intent.id,
        agentId: intent.agent.id,
        transactionSignature: signature,
        amount: intent.reward,
      })

      if (result.success) {
        setPaymentStatus("success")
        toast({
          title: "Payment successful",
          description: `You have successfully paid ${intent.reward} SOL for this intent.`,
        })

        // Wait a moment before closing
        setTimeout(() => {
          handleOpenChange(false)
          onComplete()
        }, 2000)
      } else {
        throw new Error(result.error || "Failed to process payment on server.")
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      setError(error.message || "An error occurred during payment. Please try again.")
      setPaymentStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  // Get explorer URL for transaction
  const getExplorerUrl = (signature: string) => {
    return `https://explorer.solana.com/tx/${signature}${SOLANA_NETWORK !== "mainnet-beta" ? `?cluster=${SOLANA_NETWORK}` : ""}`
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pay for Completed Intent</DialogTitle>
          <DialogDescription>Complete the payment to finalize this intent and reward the agent.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Payment details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Intent</p>
              <p className="text-lg">{intent?.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Amount</p>
              <p className="text-lg font-bold">{intent?.reward} SOL</p>
            </div>
          </div>

          {/* Agent details */}
          <div>
            <p className="text-sm font-medium">Agent</p>
            <p className="text-lg">{intent?.agent?.name}</p>
          </div>

          {/* Wallet connection status */}
          {!connected && (
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet not connected</AlertTitle>
              <AlertDescription>Please connect your Solana wallet to proceed with the payment.</AlertDescription>
            </Alert>
          )}

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success message */}
          {paymentStatus === "success" && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Payment successful</AlertTitle>
              <AlertDescription className="text-green-600">
                Your payment has been processed successfully.
                {txSignature && (
                  <a
                    href={getExplorerUrl(txSignature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline mt-2"
                  >
                    View transaction <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing || paymentStatus === "success"}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : connected ? (
              `Pay ${intent?.reward} SOL`
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
