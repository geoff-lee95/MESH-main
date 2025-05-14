"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Network } from "lucide-react"

export function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { updatePassword, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetCode = searchParams.get('code')

  // Verify that we have a code parameter, meaning this is a valid reset request
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check for the code parameter to make sure we have a valid reset request
    if (!resetCode) {
      setError("Invalid password reset link. Please request a new link.")
    } else {
      console.log("Reset code found in URL:", resetCode.substring(0, 6) + "..." + resetCode.substring(resetCode.length - 6))
    }
  }, [resetCode])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      const { error, data } = await updatePassword(password)

      if (error) {
        setError(error.message)
        console.error("Password update error:", error)
      } else {
        setSuccess(true)
        console.log("Password updated successfully")
        // Auto-redirect to dashboard after successful password reset
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      }
    } catch (err) {
      console.error("Unexpected error in password update:", err)
      setError("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Network className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-light">Create new password</CardTitle>
          <CardDescription>
            Enter and confirm your new password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>
                  Your password has been successfully reset! Redirecting you to the dashboard...
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={success || !resetCode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={success || !resetCode}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || success || !resetCode}
            >
              {isLoading ? "Updating..." : "Reset Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 