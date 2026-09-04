'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { estimatorSchema, type EstimatorFormValues } from '@/lib/validations/estimator'
import {
  PROJECT_TYPES,
  INDUSTRIES,
  ADD_ON_FEATURES,
  BUDGET_RANGES,
  calculateEstimate,
} from '@/lib/estimator-pricing'

const STEPS = ['Project', 'Features', 'Budget', 'You'] as const

export default function EstimatorForm() {
  const [step, setStep] = useState(0)
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<EstimatorFormValues>({
    resolver: zodResolver(estimatorSchema),
    defaultValues: { addOns: [] },
    mode: 'onChange',
  })

  const projectType = watch('projectType')
  const addOns = watch('addOns') || []
  const estimate = calculateEstimate({ projectType: projectType ?? null, addOns: addOns as any })

  const stepFields: Record<number, (keyof EstimatorFormValues)[]> = {
    0: ['projectType'],
    1: ['industry'],
    2: ['budgetRange'],
    3: ['name', 'email', 'phone'],
  }

  async function goNext() {
    const valid = await trigger(stepFields[step])
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function toggleAddOn(id: string) {
    const current = new Set(addOns)
    current.has(id) ? current.delete(id) : current.add(id)
    setValue('addOns', Array.from(current), { shouldValidate: true })
  }

  async function onSubmit(values: EstimatorFormValues) {
    setSubmitState('loading')
    setErrorMessage(null)
    try {
      const res = await fetch('/api/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok) {
        setErrorMessage(json.error || 'Something went wrong. Please try again.')
        setSubmitState('error')
        return
      }
      setSubmitState('success')
    } catch {
      setErrorMessage('Could not reach the server. Check your connection and try again.')
      setSubmitState('error')
    }
  }

  if (submitState === 'success') {
    return (
      <div className="border border-gold-hairline bg-ink p-10 text-center text-bone">
        <Check className="mx-auto h-8 w-8 text-gold" />
        <h3 className="mt-4 font-display text-2xl">Request received.</h3>
        <p className="mt-2 text-sm text-bone/70">
          We'll follow up within one business day with a firm proposal. In the
          meantime, your estimated range was{' '}
          <span className="tabular-figure text-gold">
            KES {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}
          </span>
          .
        </p>
        <a
          href="/book"
          className="mt-6 inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90"
        >
          Skip the wait — book a discovery call
        </a>
      </div>
    )
  }

  return (
    <div className="border border-gold-hairline bg-parchment">
      {/* Step indicator, ledger-style: numbered entries with a running rule */}
      <div className="ledger-rule flex border-gold-hairline">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`flex-1 border-r border-gold-hairline px-4 py-3 text-center text-xs last:border-r-0 ${
              i === step ? 'bg-ink text-gold' : i < step ? 'text-emerald' : 'text-slate-soft'
            }`}
          >
            {String(i + 1).padStart(2, '0')} — {label}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8">
        {step === 0 && (
          <fieldset>
            <legend className="font-display text-xl text-ink">What are we building?</legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {PROJECT_TYPES.map((type) => (
                <label
                  key={type.id}
                  className={`cursor-pointer border p-4 text-sm transition ${
                    projectType === type.id
                      ? 'border-gold bg-ink text-bone'
                      : 'border-gold-hairline text-slate hover:border-gold/50'
                  }`}
                >
                  <input
                    type="radio"
                    value={type.id}
                    {...register('projectType')}
                    className="sr-only"
                  />
                  {type.label}
                </label>
              ))}
            </div>
            {errors.projectType && (
              <p className="mt-2 text-xs text-red-600">{errors.projectType.message}</p>
            )}
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="font-display text-xl text-ink">Industry & features</legend>

            <label className="mt-6 block text-sm text-slate">Industry</label>
            <select
              {...register('industry')}
              className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm text-ink"
              defaultValue=""
            >
              <option value="" disabled>
                Select an industry
              </option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            {errors.industry && <p className="mt-2 text-xs text-red-600">{errors.industry.message}</p>}

            <p className="mb-3 mt-6 text-sm text-slate">Features you want (optional)</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {ADD_ON_FEATURES.map((feature) => (
                <label
                  key={feature.id}
                  className={`flex cursor-pointer items-center justify-between border p-3 text-sm transition ${
                    addOns.includes(feature.id)
                      ? 'border-gold bg-ink text-bone'
                      : 'border-gold-hairline text-slate hover:border-gold/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addOns.includes(feature.id)}
                      onChange={() => toggleAddOn(feature.id)}
                      className="sr-only"
                    />
                    {feature.label}
                  </span>
                  <span className="tabular-figure text-xs opacity-70">
                    +{feature.priceKES.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="font-display text-xl text-ink">Budget range</legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {BUDGET_RANGES.map((range) => (
                <label
                  key={range.id}
                  className={`cursor-pointer border p-4 text-sm transition ${
                    watch('budgetRange') === range.id
                      ? 'border-gold bg-ink text-bone'
                      : 'border-gold-hairline text-slate hover:border-gold/50'
                  }`}
                >
                  <input type="radio" value={range.id} {...register('budgetRange')} className="sr-only" />
                  {range.label}
                </label>
              ))}
            </div>
            {errors.budgetRange && (
              <p className="mt-2 text-xs text-red-600">{errors.budgetRange.message}</p>
            )}
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="font-display text-xl text-ink">Where should we send it?</legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm text-slate">Full name</label>
                <input
                  {...register('name')}
                  className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-sm text-slate">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm text-slate">Phone</label>
                <input
                  {...register('phone')}
                  placeholder="+254 7XX XXX XXX"
                  className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-slate">Company (optional)</label>
                <input
                  {...register('companyName')}
                  className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
                />
              </div>
            </div>

            {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
          </fieldset>
        )}

        {/* Live estimate — always visible so the effect of each choice is immediate */}
        {estimate.min > 0 && (
          <div className="ledger-rule mt-8 flex items-center justify-between border-t pt-6">
            <span className="eyebrow text-emerald">Estimated range</span>
            <span className="tabular-figure text-xl text-emerald">
              KES {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}
            </span>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-sm text-slate-soft disabled:opacity-0"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm text-bone hover:bg-emerald-deep"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitState === 'loading'}
              className="inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-60"
            >
              {submitState === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Get my estimate
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
