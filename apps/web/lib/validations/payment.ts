import { z } from 'zod'

export const mpesaPaymentSchema = z.object({
  projectId: z.string().min(1),
  amountKES: z.coerce.number().min(100, 'Minimum deposit is KES 100').max(500_000, 'Amounts above KES 500,000 need to go through Stripe or a bank transfer'),
  phone: z
    .string()
    .min(9)
    .regex(/^[0-9+\s-]+$/, 'Phone number contains invalid characters'),
})

export const stripePaymentSchema = z.object({
  projectId: z.string().min(1),
  amountUSD: z.coerce.number().min(1, 'Minimum deposit is $1').max(50_000, 'Amounts above $50,000 need to go through a different process — contact us directly'),
})
