"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  const isResetPasswordPage = pathname?.includes('/auth/reset-password')

  useEffect(() => {
    // Don't redirect from reset-password page, even if authenticated
    if (isResetPasswordPage) {
      return
    }
    
    // If user is already authenticated, redirect to dashboard
    if (!isLoading && session) {
      router.push("/dashboard")
    }
  }, [session, isLoading, router, pathname, isResetPasswordPage])

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  // If not authenticated or on reset password page, render the children (auth form)
  return <>{children}</>
}
