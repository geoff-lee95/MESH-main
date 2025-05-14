"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ExternalLink, ChevronDown, ChevronUp, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EscrowReleaseDialog } from "@/components/escrow/escrow-release-dialog"
import { EscrowDisputeDialog } from "@/components/escrow/escrow-dispute-dialog"

interface EscrowListProps {
  escrows: any[]
}

export function EscrowList({ escrows }: EscrowListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false)
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false)
  const [selectedEscrow, setSelectedEscrow] = useState<any>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleReleaseClick = (escrow: any) => {
    setSelectedEscrow(escrow)
    setReleaseDialogOpen(true)
  }

  const handleDisputeClick = (escrow: any) => {
    setSelectedEscrow(escrow)
    setDisputeDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "deposited":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Deposited
          </Badge>
        )
      case "released":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Released
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Refunded
          </Badge>
        )
      case "disputed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Disputed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (escrows.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-light mb-2">No Escrow Accounts</h3>
          <p className="text-center text-muted-foreground font-light mb-4">
            You don't have any escrow accounts yet. When you assign an intent with escrow, it will appear here.
          </p>
          <Button asChild>
            <Link href="/dashboard/intents">Browse Intents</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {escrows.map((escrow) => (
          <Card key={escrow.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{escrow.intent.title}</CardTitle>
                  <CardDescription>
                    Escrow ID: {escrow.id.slice(0, 8)}...{escrow.id.slice(-8)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(escrow.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(escrow.id)}
                    aria-label={expandedId === escrow.id ? "Collapse" : "Expand"}
                  >
                    {expandedId === escrow.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-light">{escrow.amount} SOL</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Agent</p>
                  <p className="font-light">{escrow.agent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-light">{format(new Date(escrow.created_at), "PPP")}</p>
                </div>
              </div>

              {expandedId === escrow.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-light mb-1">Escrow Account</h4>
                      <p className="text-sm flex items-center">
                        {escrow.escrow_account_pubkey}
                        <a
                          href={`https://explorer.solana.com/address/${escrow.escrow_account_pubkey}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-light mb-1">Deposit Transaction</h4>
                      <p className="text-sm flex items-center">
                        {escrow.deposit_transaction_signature}
                        <a
                          href={`https://explorer.solana.com/tx/${escrow.deposit_transaction_signature}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    </div>

                    {escrow.release_transaction_signature && (
                      <div>
                        <h4 className="text-sm font-light mb-1">Release Transaction</h4>
                        <p className="text-sm flex items-center">
                          {escrow.release_transaction_signature}
                          <a
                            href={`https://explorer.solana.com/tx/${escrow.release_transaction_signature}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </p>
                      </div>
                    )}

                    {escrow.refund_transaction_signature && (
                      <div>
                        <h4 className="text-sm font-light mb-1">Refund Transaction</h4>
                        <p className="text-sm flex items-center">
                          {escrow.refund_transaction_signature}
                          <a
                            href={`https://explorer.solana.com/tx/${escrow.refund_transaction_signature}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-2">
                      {escrow.status === "deposited" && (
                        <>
                          <Button variant="outline" onClick={() => handleDisputeClick(escrow)}>
                            Create Dispute
                          </Button>
                          <Button onClick={() => handleReleaseClick(escrow)}>Release Funds</Button>
                        </>
                      )}
                      <Button variant="outline" asChild>
                        <Link href={`/dashboard/intents/${escrow.intent_id}`}>View Intent</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedEscrow && (
        <>
          <EscrowReleaseDialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen} escrow={selectedEscrow} />
          <EscrowDisputeDialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen} escrow={selectedEscrow} />
        </>
      )}
    </>
  )
}
