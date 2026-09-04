'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Loader2, Smartphone, XCircle } from 'lucide-react'

type Phase = 'form' | 'awaiting-phone-confirmation' | 'success' | 'error'

export default function MpesaDepositForm({ projectId }: { projectId: string }) {
  const [phase, setPhase] = useState<Phase>('form')
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    setPhase('awaiting-phone-confirmation')

    try {
      const res = await fetch('/api/payments/mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, amountKES: Number(amount), phone }),
      })
      const json = await res.json()
      if (!res.ok) {
        setErrorMessage(json.error || 'Could not start the payment.')
        setPhase('error')
        return
      }

      // STK push confirmation is asynchronous — the person approves it on their
      // phone, then Safaricom calls our webhook, which updates the Payment row.
      // We poll here rather than waiting on a websocket for something this
      // infrequent and short-lived (max ~2 minutes before the prompt times out).
      let attempts = 0
      pollRef.current = setInterval(async () => {
        attempts += 1
        const statusRes = await fetch(`/api/payments/${json.paymentId}/status`)
        const statusJson = await statusRes.json()

        if (statusJson.status === 'SUCCESS') {
          if (pollRef.current) clearInterval(pollRef.current)
          setPhase('success')
        } else if (statusJson.status === 'FAILED' || attempts > 40) {
          // ~2 minutes at 3s intervals, matching the STK push prompt's own timeout
          if (pollRef.current) clearInterval(pollRef.current)
          setErrorMessage(attempts > 40 ? 'The payment prompt timed out. Please try again.' : 'The payment was declined or failed.')
          setPhase('error')
        }
      }, 3000)
    } catch {
      setErrorMessage('Could not reach the server. Check your connection and try again.')
      setPhase('error')
    }
  }

  if (phase === 'success') {
    return (
      <div className="border border-gold-hairline bg-ink p-8 text-center text-bone">
        <Check className="mx-auto h-8 w-8 text-gold" />
        <h3 className="mt-3 font-display text-xl">Payment received.</h3>
        <p className="mt-2 text-sm text-bone/70">Your deposit has been confirmed.</p>
      </div>
    )
  }

  if (phase === 'awaiting-phone-confirmation') {
    return (
      <div className="border border-gold-hairline bg-parchment p-8 text-center">
        <Smartphone className="mx-auto h-8 w-8 animate-pulse text-emerald" />
        <h3 className="mt-3 font-display text-xl text-ink">Check your phone</h3>
        <p className="mt-2 text-sm text-slate-soft">
          Enter your M-Pesa PIN on the prompt sent to {phone} to complete the payment.
        </p>
        <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-slate-soft" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gold-hairline bg-parchment p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-slate">Amount (KES)</label>
          <input
            type="number"
            min={100}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-slate">M-Pesa phone number</label>
          <input
            required
            placeholder="07XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full border border-gold-hairline bg-parchment px-4 py-3 text-sm"
          />
        </div>
      </div>

      {phase === 'error' && errorMessage && (
        <p className="mt-4 flex items-center gap-2 text-sm text-red-600">
          <XCircle className="h-4 w-4" /> {errorMessage}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90"
      >
        Send M-Pesa prompt
      </button>
    </form>
  )
}
