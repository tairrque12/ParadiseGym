import { z } from 'zod'
import { MEMBERSHIP_TYPES } from '@/lib/membership-options'
import { isValidUsPhone } from '@/lib/validations/shared'

export { MEMBERSHIP_TYPES }

export const membershipRequestSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .refine(isValidUsPhone, 'Enter a valid US phone number'),
  age: z.coerce
    .number({ message: 'Age is required' })
    .int('Age must be a whole number')
    .min(13, 'Must be at least 13')
    .max(100, 'Must be 100 or younger'),
  membership_type: z
    .string({ message: 'Select a membership type' })
    .min(1, 'Select a membership type')
    .refine(
      (value): value is (typeof MEMBERSHIP_TYPES)[number] =>
        MEMBERSHIP_TYPES.includes(
          value as (typeof MEMBERSHIP_TYPES)[number]
        ),
      'Select a membership type'
    ),
})

export type MembershipRequestInput = z.infer<typeof membershipRequestSchema>
