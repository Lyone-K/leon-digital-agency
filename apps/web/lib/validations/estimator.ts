import { z } from 'zod'

export const estimatorSchema = z.object({
  projectType: z.enum(['new-website', 'redesign', 'ecommerce', 'web-app'], {
    required_error: 'Select a project type',
  }),
  industry: z.string().min(1, 'Select an industry'),
  addOns: z.array(z.string()).default([]),
  budgetRange: z.enum(['under-150k', '150k-350k', '350k-750k', 'over-750k'], {
    required_error: 'Select a budget range',
  }),
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email address'),
  phone: z
    .string()
    .min(9, 'Enter a valid phone number')
    .regex(/^[0-9+\s-]+$/, 'Phone number contains invalid characters'),
  companyName: z.string().optional(),
})

export type EstimatorFormValues = z.infer<typeof estimatorSchema>
