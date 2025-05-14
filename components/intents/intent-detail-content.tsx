"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, Tag, Coins, Users, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IntentStatusActions } from "@/components/intents/intent-status-actions"
import { PaymentDialog } from "@/components/intents/payment-dialog"
import { toast } from "@/components/ui/use-toast"

interface IntentDetailContentProps {
  intent: any
}

export function IntentDetailContent({ intent }: IntentDetailContentProps) {
  const router = useRouter()
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  const metadata = intent.metadata || {}
  const tags = metadata.tags || []
  const deadline = intent.deadline ? new Date(intent.deadline) : null
  const isCompleted = intent.status === "completed"
  const isPaid = intent.status === "paid"
  const needsPayment = isCompleted && !isPaid

  const handlePaymentComplete = () => {
    toast({
      title: "Payment successful",
      description: "Your payment has been processed successfully.",
    })
    router.refresh()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{intent.title}</CardTitle>
              <CardDescription className="mt-2">
                <Badge variant={getStatusVariant(intent.status)}>{formatStatus(intent.status)}</Badge>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {needsPayment && (
                <Button onClick={() => setIsPaymentDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Coins className="mr-2 h-4 w-4" />
                  Pay {intent.reward} SOL
                </Button>
              )}
              {isPaid && (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  <span>Paid</span>
                </div>
              )}
              <IntentStatusActions intent={intent} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{intent.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Reward</span>
              <span className="flex items-center font-semibold">
                <Coins className="mr-2 h-4 w-4 text-yellow-500" />
                {intent.reward} SOL
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Deadline</span>
              <span className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                {deadline ? format(deadline, "PPP") : "No deadline"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Complexity</span>
              <span className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-purple-500" />
                {metadata.complexity ? `${metadata.complexity}/10` : "Not specified"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Multiple Agents</span>
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-green-500" />
                {metadata.allowMultipleAgents ? "Allowed" : "Not allowed"}
              </span>
            </div>
          </div>

          {metadata.successCriteria && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Success Criteria</h3>
              <p className="text-gray-700 dark:text-gray-300">{metadata.successCriteria}</p>
            </div>
          )}

          {tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="flex items-center">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {metadata.requiredCapabilities && metadata.requiredCapabilities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Required Capabilities</h3>
              <div className="flex flex-wrap gap-2">
                {metadata.requiredCapabilities.map((capability: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created: {format(new Date(intent.created_at), "PPP")}
            {intent.updated_at && intent.updated_at !== intent.created_at && (
              <> • Updated: {format(new Date(intent.updated_at), "PPP")}</>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Payment Dialog */}
      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        intent={intent}
        onComplete={handlePaymentComplete}
      />
    </>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case "open":
      return "default"
    case "assigned":
      return "secondary"
    case "in_progress":
      return "blue"
    case "completed":
      return "success"
    case "paid":
      return "green"
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

function formatStatus(status: string) {
  switch (status) {
    case "in_progress":
      return "In Progress"
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}
