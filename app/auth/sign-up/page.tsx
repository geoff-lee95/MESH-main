import { SignUpForm } from "@/components/auth/sign-up-form"
import { AuthRedirect } from "@/components/auth/auth-redirect"

export default function SignUpPage() {
  return (
    <AuthRedirect>
      <SignUpForm />
    </AuthRedirect>
  )
}
