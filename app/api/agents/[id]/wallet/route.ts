import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const agentId = params.id

    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Get the agent's wallet address
    const { data: agent, error } = await supabase.from("agents").select("wallet_address").eq("id", agentId).single()

    if (error) {
      return NextResponse.json({ error: "Failed to fetch agent wallet address" }, { status: 500 })
    }

    if (!agent || !agent.wallet_address) {
      return NextResponse.json({ error: "Agent wallet address not found" }, { status: 404 })
    }

    return NextResponse.json({ walletAddress: agent.wallet_address })
  } catch (error) {
    console.error("Error fetching agent wallet address:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
