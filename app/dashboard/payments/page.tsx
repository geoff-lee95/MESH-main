import { Suspense } from "react"
import { getPaymentsByUser } from "@/app/actions/payment-actions"
import { PaymentsHistory } from "@/components/payments/payments-history"

export default async function PaymentsPage() {
  const { success, data: payments, error } = await getPaymentsByUser()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-light mb-6">Payment History</h1>

      {!success ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="text-lg font-light text-red-800">Error</h2>
          <p className="text-red-600">{error || "Failed to load payment history"}</p>
        </div>
      ) : (
        <Suspense fallback={<div>Loading payment history...</div>}>
          <PaymentsHistory payments={payments || []} />
        </Suspense>
      )}
    </div>
  )
}
