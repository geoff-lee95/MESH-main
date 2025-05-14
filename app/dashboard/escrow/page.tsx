import { Suspense } from "react"
import { getEscrowsByUser } from "@/app/actions/escrow-actions"
import { EscrowList } from "@/components/escrow/escrow-list"

export default async function EscrowPage() {
  console.log("Rendering EscrowPage")
  
  try {
    const { success, data: escrows, error } = await getEscrowsByUser()
    console.log("Escrow data fetched:", { success, escrowsCount: escrows?.length, error })

    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-light">Escrow Accounts</h1>
          <p className="text-muted-foreground font-light">
            Manage your escrow accounts for secure transactions between intent owners and agents.
          </p>
        </div>

        <Suspense fallback={<div>Loading escrow accounts...</div>}>
          {success ? (
            <EscrowList escrows={escrows || []} />
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h2 className="text-lg font-light text-red-800">Error</h2>
              <p className="text-red-600">{error || "Failed to load escrow accounts"}</p>
            </div>
          )}
        </Suspense>
      </div>
    )
  } catch (err) {
    console.error("Error in EscrowPage:", err)
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-light">Escrow Accounts</h1>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="text-lg font-light text-red-800">Error</h2>
          <p className="text-red-600">An unexpected error occurred while loading escrow accounts.</p>
        </div>
      </div>
    )
  }
}
