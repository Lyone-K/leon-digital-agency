import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const client = await prisma.client.findUnique({ where: { clerkUserId: userId } })
  if (!client) return NextResponse.json({ error: 'No client record found' }, { status: 404 })

  // Ownership check — a client should only ever be able to poll the status of
  // their own payments.
  const payment = await prisma.payment.findFirst({ where: { id: params.id, clientId: client.id } })
  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

  return NextResponse.json({ status: payment.status })
}
