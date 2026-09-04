'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Search } from 'lucide-react'
import { auditSchema, type AuditFormValues } from '@/lib/validations/audit'
import type { PageSpeedResult } from '@/lib/audit/pagespeed'
import type { AiAuditSummary } from '@/lib/audit/ai-analysis'

type Result = { scores: PageSpeedResult; aiSummary: AiAuditSummary }

type NumericScoreKey = 'performanceScore' | 'seoScore' | 'accessibilityScore' | 'bestPracticesScore'

const SCORE_LABELS: { key: NumericScoreKey; label: string }[] = [
  { key: 'performanceScore', label: 'Performance' },
  { key: 'seoScore', label: 'SEO' },
  { key: 'accessibilityScore', label: 'Accessibility' },
  { key: 'bestPracticesScore', label: 'Best Practices' },
]

function scoreColor(score: number) {
  if (score >= 90) return 'text-emerald'
  if (score >= 50) return 'text-gold'
  return 'text-red-600'
}

export default function AuditToolForm() {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuditFormValues>({ resolver: zodResolver(auditSchema) })

  async function onSubmit(values: AuditFormValues) {
    setState('loading')
    setErrorMessage(null)
    setResult(null)
    try {
      const res = await fetch('/api/audit', {
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
      setResult({ scores: json.scores, aiSummary: json.aiSummary })
      setState('idle')
    } catch {
      setErrorMessage('Could not reach the server. Check your connection and try again.')
      setState('error')
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 border border-gold-hairline bg-parchment p-6 sm:flex-row sm:items-start"
      >
        <div className="flex-1">
          <input
            {...register('url')}
            placeholder="https://yourwebsite.com"
            className="w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
          {errors.url && <p className="mt-1 text-xs text-red-600">{errors.url.message}</p>}
        </div>
        <div className="flex-1">
          <input
            {...register('email')}
            placeholder="you@company.com"
            className="w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <button
          type="submit"
          disabled={state === 'loading'}
          className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-sm text-bone hover:bg-emerald-deep disabled:opacity-60"
        >
          {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {state === 'loading' ? 'Scanning…' : 'Run audit'}
        </button>
      </form>

      {state === 'loading' && (
        <p className="mt-4 text-sm text-slate-soft">
          This takes 15–30 seconds — we're running a full Lighthouse scan and writing up the analysis.
        </p>
      )}

      {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}

      {result && (
        <div className="mt-10 border border-gold-hairline bg-parchment p-8">
          <h3 className="font-display text-2xl text-ink">{result.aiSummary.headline}</h3>
          <p className="mt-3 text-slate">{result.aiSummary.summary}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gold-hairline pt-6 sm:grid-cols-4">
            {SCORE_LABELS.map(({ key, label }) => (
              <div key={key}>
                <p className={`tabular-figure text-3xl ${scoreColor(result.scores[key] as number)}`}>
                  {result.scores[key]}
                </p>
                <p className="text-xs text-slate-soft">{label}</p>
              </div>
            ))}
          </div>

          {result.aiSummary.recommendations.length > 0 && (
            <div className="mt-8 border-t border-gold-hairline pt-6">
              <p className="eyebrow mb-3 text-emerald">Top recommendations</p>
              <ol className="space-y-2 text-sm text-slate">
                {result.aiSummary.recommendations.map((r, i) => (
                  <li key={i}>
                    {i + 1}. {r}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <a
            href="/book"
            className="mt-8 inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90"
          >
            Book a call to fix this
          </a>
        </div>
      )}
    </div>
  )
}
