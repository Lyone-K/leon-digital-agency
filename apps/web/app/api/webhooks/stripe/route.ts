import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  const rawBody = await req.text()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event
  try {
    // constructEvent verifies the signature against the *raw* body — this is
    // what actually proves the request came from Stripe and not an attacker
    // who found the endpoint URL. Never skip this check.
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as { id: string; metadata: { paymentId?: string } }

    const payment = await prisma.payment.findFirst({ where: { providerRef: intent.id } })
    if (!payment) {
      console.warn(`Stripe webhook for unknown PaymentIntent: ${intent.id}`)
      return NextResponse.json({ received: true })
    }

    // Idempotency: Stripe redelivers events on retry / if we're slow to ack.
    // Don't reprocess a payment we've already resolved.
    if (payment.status === 'SUCCESS' || payment.status === 'FAILED') {
      return NextResponse.json({ received: true, note: 'already processed' })
    }

    const newStatus = event.type === 'payment_intent.succeeded' ? 'SUCCESS' : 'FAILED'
    await prisma.payment.update({ where: { id: payment.id }, data: { status: newStatus } })

    // On the first successful deposit for a project still in onboarding, move
    // it into design — a reasonable default handoff point. The agency can
    // always override project status manually later; this just avoids every
    // paid project sitting stuck at "onboarding" until someone remembers to
    // update it by hand.
    if (newStatus === 'SUCCESS' && payment.projectId) {
      const project = await prisma.project.findUnique({ where: { id: payment.projectId } })
      if (project?.status === 'ONBOARDING') {
        await prisma.project.update({ where: { id: project.id }, data: { status: 'DESIGN' } })
      }
    }
  }

  return NextResponse.json({ received: true })
}
