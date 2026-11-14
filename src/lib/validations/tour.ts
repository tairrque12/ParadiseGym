import { z } from 'zod'
import { isValidTimeSlotForDate } from '@/lib/gym-hours'
import { isFutureDate, isValidUsPhone } from '@/lib/validations/shared'

export const TOUR_LOCATIONS = ['harlingen', 'mcallen'] as const

export const tourRequestSchema = z
  .object({
    location: z.enum(TOUR_LOCATIONS),
    first_name: z.string().trim().min(1, 'First name is required'),
    last_name: z.string().trim().min(1, 'Last name is required'),
    email: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || z.email().safeParse(value).success,
        'Enter a valid email address'
      ),
    phone: z
      .string()
      .trim()
      .refine(isValidUsPhone, 'Enter a valid US phone number'),
    preferred_date: z
      .string()
      .trim()
      .min(1, 'Choose a day')
      .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), 'Enter a valid date')
      .refine(
        (value) => isFutureDate(value),
        'Preferred date must be today or in the future'
      ),
    preferred_time: z.string().trim().min(1, 'Choose a time'),
  })
  .superRefine((data, ctx) => {
    if (!isValidTimeSlotForDate(data.preferred_date, data.preferred_time)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select a valid time for the chosen date',
        path: ['preferred_time'],
      })
    }
  })

export type TourRequestInput = z.infer<typeof tourRequestSchema>
