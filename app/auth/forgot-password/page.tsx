import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AuthRedirect } from "@/components/auth/auth-redirect"

export default function ForgotPasswordPage() {
  return (
    <AuthRedirect>
      <ForgotPasswordForm />
    </AuthRedirect>
  )
} 