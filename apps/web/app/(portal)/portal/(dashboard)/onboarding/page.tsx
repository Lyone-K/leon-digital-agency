import OnboardingForm from '@/components/portal/OnboardingForm'

export default function OnboardingPage() {
  return (
    <div>
      <p className="eyebrow mb-2 text-emerald">Kickoff</p>
      <h1 className="font-display text-3xl text-ink">Tell us about the project</h1>
      <p className="mt-2 max-w-xl text-sm text-slate-soft">
        This creates your project record and starting timeline. We'll fill in
        real dates and details after our kickoff call.
      </p>

      <div className="mt-8">
        <OnboardingForm />
      </div>
    </div>
  )
}
