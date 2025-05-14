"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SupabaseTest() {
  const [status, setStatus] = useState<string>("Not tested")
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    try {
      setStatus("Testing...")
      setError(null)

      const supabase = createBrowserClient()
      console.log("Supabase client created")

      // Try a simple query to test the connection
      const { data, error } = await supabase.from("profiles").select("*").limit(1)

      if (error) {
        console.error("Supabase query error:", error)
        setStatus("Failed")
        setError(error.message)
        return
      }

      console.log("Supabase query successful:", data)
      setStatus("Connected")
    } catch (err) {
      console.error("Unexpected error testing Supabase connection:", err)
      setStatus("Error")
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  // Log environment variables on mount
  useEffect(() => {
    console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set")
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set")
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p>
            Status: <strong>{status}</strong>
          </p>
          {error && <p className="text-red-500">Error: {error}</p>}
        </div>
        <Button onClick={testConnection}>Test Supabase Connection</Button>
      </CardContent>
    </Card>
  )
}
