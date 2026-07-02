import { z } from 'zod'
import { isFutureDate, isValidUsPhone } from '@/lib/validations/shared'

export const tourRequestSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .refine(isValidUsPhone, 'Enter a valid US phone number'),
  preferred_date: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
      'Enter a valid date'
    )
    .refine(
      (value) => !value || isFutureDate(value),
      'Preferred date must be today or in the future'
    ),
  preferred_time: z.string().trim().optional(),
})

export type TourRequestInput = z.infer<typeof tourRequestSchema>
