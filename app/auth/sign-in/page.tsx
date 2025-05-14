import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthRedirect } from "@/components/auth/auth-redirect"

export default function SignInPage() {
  return (
    <AuthRedirect>
      <SignInForm />
    </AuthRedirect>
  )
}
