import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <SignUp path="/portal/sign-up" routing="path" signInUrl="/portal/sign-in" fallbackRedirectUrl="/portal" />
    </div>
  )
}
