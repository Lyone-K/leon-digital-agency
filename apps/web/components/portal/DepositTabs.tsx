'use client'

import { useState } from 'react'
import StripeDepositForm from './StripeDepositForm'
import MpesaDepositForm from './MpesaDepositForm'

export default function DepositTabs({ projectId }: { projectId: string }) {
  const [method, setMethod] = useState<'mpesa' | 'stripe'>('mpesa')

  return (
    <div>
      <div className="ledger-rule mb-6 flex border-b border-gold-hairline">
        <button
          onClick={() => setMethod('mpesa')}
          className={`px-4 py-3 text-sm ${method === 'mpesa' ? 'border-b-2 border-gold text-ink' : 'text-slate-soft'}`}
        >
          M-Pesa
        </button>
        <button
          onClick={() => setMethod('stripe')}
          className={`px-4 py-3 text-sm ${method === 'stripe' ? 'border-b-2 border-gold text-ink' : 'text-slate-soft'}`}
        >
          Card (Stripe)
        </button>
      </div>

      {method === 'mpesa' ? (
        <MpesaDepositForm projectId={projectId} />
      ) : (
        <StripeDepositForm projectId={projectId} />
      )}
    </div>
  )
}
