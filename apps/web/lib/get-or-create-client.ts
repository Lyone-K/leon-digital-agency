import { currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

/**
 * The Client table is keyed by clerkUserId. Rather than requiring a webhook to
 * pre-provision the row (extra infra, another thing that can silently fail),
 * we lazily create it the first time someone completes sign-in and hits the
 * portal. Every call after that just reads the existing row.
 */
export async function getOrCreatePortalClient() {
  const user = await currentUser()
  if (!user) return null

  const email = user.emailAddresses[0]?.emailAddress ?? ''

  const existing = await prisma.client.findUnique({ where: { clerkUserId: user.id } })
  if (existing) return existing

  return prisma.client.create({
    data: {
      clerkUserId: user.id,
      email,
      contactName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || email,
      companyName: (user.publicMetadata?.companyName as string) || 'Not set',
    },
  })
}
