import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  message: z.string().min(10, 'Tell us a little more about what you need (10 characters min)'),
})

export type ContactFormValues = z.infer<typeof contactSchema>
