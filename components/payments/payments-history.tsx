"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ExternalLink, Search, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SOLANA_NETWORK } from "@/lib/solana"

interface PaymentsHistoryProps {
  payments: any[]
}

export function PaymentsHistory({ payments }: PaymentsHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPayments = payments.filter(
    (payment) =>
      payment.intent?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.agent?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transaction_signature?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get explorer URL for transaction
  const getExplorerUrl = (signature: string) => {
    return `https://explorer.solana.com/tx/${signature}${SOLANA_NETWORK !== "mainnet-beta" ? `?cluster=${SOLANA_NETWORK}` : ""}`
  }

  if (!payments.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-light">No payments found</h3>
        <p className="text-muted-foreground font-light mt-2">There are no payments available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search payments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredPayments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
                          <h3 className="text-lg font-light">No payments found</h3>
        <p className="text-muted-foreground font-light mt-2">
            {payments.length === 0 ? "You haven't made any payments yet." : "No payments match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-light">{format(new Date(payment.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {payment.intent ? (
                      <Link href={`/dashboard/intents/${payment.intent.id}`} className="text-blue-600 hover:underline">
                        {payment.intent.title}
                      </Link>
                    ) : (
                      "Unknown Intent"
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.agent ? (
                      <Link href={`/dashboard/agents/${payment.agent.id}`} className="text-blue-600 hover:underline">
                        {payment.agent.name}
                      </Link>
                    ) : (
                      "Unknown Agent"
                    )}
                  </TableCell>
                  <TableCell>{payment.amount} SOL</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "completed" ? "outline" : "default"}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={getExplorerUrl(payment.transaction_signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      {payment.transaction_signature.slice(0, 8)}...
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
