import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"
  
  // Check if this is a password reset flow
  const isPasswordReset = requestUrl.href.includes('/reset-password')

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = await createServerClient()
      await supabase.auth.exchangeCodeForSession(code)
      
      // If it's a password reset flow, don't redirect yet - let the reset form handle it
      if (isPasswordReset) {
        console.log("Password reset flow detected, redirecting to reset page")
        return NextResponse.redirect(requestUrl.origin + "/auth/reset-password?code=" + code)
      }
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      // Return to sign-in page with error
      return NextResponse.redirect(requestUrl.origin + "/auth/sign-in?error=auth_callback_failed")
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + next)
}
