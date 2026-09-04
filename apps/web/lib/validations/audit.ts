import { z } from 'zod'

export const auditSchema = z.object({
  url: z.string().url('Enter a valid URL, including https://'),
  email: z.string().email('Enter a valid email address'),
})

export type AuditFormValues = z.infer<typeof auditSchema>
