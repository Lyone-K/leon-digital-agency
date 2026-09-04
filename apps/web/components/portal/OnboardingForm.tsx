'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { onboardingSchema, type OnboardingFormValues } from '@/lib/validations/onboarding'
import { INDUSTRIES, PROJECT_TYPES } from '@/lib/estimator-pricing'

export default function OnboardingForm() {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({ resolver: zodResolver(onboardingSchema) })

  async function onSubmit(values: OnboardingFormValues) {
    setState('loading')
    setErrorMessage(null)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok) {
        setErrorMessage(json.error || 'Something went wrong.')
        setState('error')
        return
      }
      router.push('/portal')
      router.refresh()
    } catch {
      setErrorMessage('Could not reach the server. Check your connection and try again.')
      setState('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-gold-hairline bg-parchment p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm text-slate">Project name</label>
          <input
            {...register('projectName')}
            placeholder="e.g. JT Malika Website Rebuild"
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
          {errors.projectName && <p className="mt-1 text-xs text-red-600">{errors.projectName.message}</p>}
        </div>

        <div>
          <label className="text-sm text-slate">Industry</label>
          <select
            {...register('industry')}
            defaultValue=""
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          >
            <option value="" disabled>Select an industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          {errors.industry && <p className="mt-1 text-xs text-red-600">{errors.industry.message}</p>}
        </div>

        <div>
          <label className="text-sm text-slate">Project type</label>
          <select
            {...register('projectType')}
            defaultValue=""
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          >
            <option value="" disabled>Select a type</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          {errors.projectType && <p className="mt-1 text-xs text-red-600">{errors.projectType.message}</p>}
        </div>

        <div>
          <label className="text-sm text-slate">Budget estimate (KES, optional)</label>
          <input
            type="number"
            {...register('budgetEstimate')}
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-slate">Target launch date (optional)</label>
          <input
            type="date"
            {...register('targetLaunch')}
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm text-slate">Anything else we should know? (optional)</label>
          <textarea
            rows={4}
            {...register('notes')}
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
        </div>
      </div>

      {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="mt-6 inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-60"
      >
        {state === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
        Start my project
      </button>
    </form>
  )
}
