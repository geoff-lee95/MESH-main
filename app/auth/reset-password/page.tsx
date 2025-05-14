import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AuthRedirect } from "@/components/auth/auth-redirect"

export default function ResetPasswordPage() {
  return (
    <AuthRedirect>
      <ResetPasswordForm />
    </AuthRedirect>
  )
} 