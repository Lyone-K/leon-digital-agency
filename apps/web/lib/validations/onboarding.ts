import { z } from 'zod'

export const onboardingSchema = z.object({
  projectName: z.string().min(2, 'Give your project a name'),
  industry: z.string().min(1, 'Select an industry'),
  projectType: z.enum(['new-website', 'redesign', 'ecommerce', 'web-app']),
  budgetEstimate: z.coerce.number().min(0).optional(),
  targetLaunch: z.string().optional(), // ISO date string from a date input
  notes: z.string().optional(),
})

export type OnboardingFormValues = z.infer<typeof onboardingSchema>
