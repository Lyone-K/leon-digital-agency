import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <SignIn path="/portal/sign-in" routing="path" signUpUrl="/portal/sign-up" fallbackRedirectUrl="/portal" />
    </div>
  )
}
