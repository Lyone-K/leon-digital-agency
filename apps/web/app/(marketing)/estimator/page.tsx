import type { Metadata } from 'next'
import EstimatorForm from '@/components/estimator/EstimatorForm'

export const metadata: Metadata = {
  title: 'Project Estimator',
  description: 'Get a live price range for your website or web application project in minutes.',
}

export default function EstimatorPage() {
  return (
    <section className="bg-ink text-bone">
      <div className="mx-auto max-w-content px-6 pb-20 pt-16 md:pt-24">
        <p className="eyebrow mb-6">Project estimator</p>
        <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
          See your number <span className="italic text-gold">before we ever talk.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-bone/70">
          Four short steps. No sales call required to get a working range — just an
          honest estimate based on what you actually need.
        </p>

        <div className="mt-12">
          <EstimatorForm />
        </div>
      </div>
    </section>
  )
}
