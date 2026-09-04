'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Check, Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message || 'Payment failed. Please check your details and try again.')
      setSubmitting(false)
      return
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="mt-6 inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Pay deposit
      </button>
    </form>
  )
}

export default function StripeDepositForm({ projectId }: { projectId: string }) {
  const [amount, setAmount] = useState('')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function startPayment() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payments/stripe/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, amountUSD: Number(amount) }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Could not start the payment.')
        setLoading(false)
        return
      }
      setClientSecret(json.clientSecret)
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="border border-gold-hairline bg-ink p-8 text-center text-bone">
        <Check className="mx-auto h-8 w-8 text-gold" />
        <h3 className="mt-3 font-display text-xl">Payment received.</h3>
        <p className="mt-2 text-sm text-bone/70">
          Your deposit is processing — the confirmation email will follow shortly.
        </p>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="border border-gold-hairline bg-parchment p-6">
        <label className="text-sm text-slate">Amount (USD)</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          onClick={startPayment}
          disabled={loading || !amount}
          className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm text-bone hover:bg-emerald-deep disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Continue
        </button>
      </div>
    )
  }

  return (
    <div className="border border-gold-hairline bg-parchment p-6">
      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
        <CheckoutForm onSuccess={() => setSuccess(true)} />
      </Elements>
    </div>
  )
}
