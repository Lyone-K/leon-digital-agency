'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader2 } from 'lucide-react'
import { contactSchema, type ContactFormValues } from '@/lib/validations/contact'

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) })

  async function onSubmit(values: ContactFormValues) {
    setState('loading')
    setErrorMessage(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok) {
        setErrorMessage(json.error || 'Something went wrong. Please try again.')
        setState('error')
        return
      }
      setState('success')
    } catch {
      setErrorMessage('Could not reach the server. Check your connection and try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="border border-gold-hairline bg-ink p-10 text-center text-bone">
        <Check className="mx-auto h-8 w-8 text-gold" />
        <h3 className="mt-4 font-display text-2xl">Message sent.</h3>
        <p className="mt-2 text-sm text-bone/70">
          We'll get back to you within one business day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-gold-hairline bg-parchment p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
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
          <label className="text-sm text-slate">Phone (optional)</label>
          <input
            {...register('phone')}
            placeholder="+254 7XX XXX XXX"
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-slate">Company (optional)</label>
          <input
            {...register('companyName')}
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-slate">What do you need?</label>
          <textarea
            rows={5}
            {...register('message')}
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
        </div>
      </div>

      {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="mt-6 inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-60"
      >
        {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send message
      </button>
    </form>
  )
}
