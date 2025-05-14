import { Suspense } from "react"
import { getIntentById } from "@/app/actions/intent-actions"
import { IntentDetailContent } from "@/components/intents/intent-detail-content"
import { MatchingAgents } from "@/components/intents/matching-agents"

interface IntentDetailPageProps {
  params: {
    id: string
  }
}

export default async function IntentDetailPage({ params }: IntentDetailPageProps) {
  const id = params.id
  const { success, data: intent, error } = await getIntentById(id)

  if (!success || !intent) {
    return (
      <div className="container mx-auto py-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="text-lg font-semibold text-red-800">Error</h2>
          <p className="text-red-600">{error || "Failed to load intent details"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Suspense fallback={<div>Loading intent details...</div>}>
        <IntentDetailContent intent={intent} />
      </Suspense>

      <Suspense fallback={<div>Loading matching agents...</div>}>
        <MatchingAgents intentId={id} intentStatus={intent.status} />
      </Suspense>
    </div>
  )
}
