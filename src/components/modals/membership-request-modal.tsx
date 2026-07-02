'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useMembershipForm } from '@/context/membership-form-context'
import {
  MEMBERSHIP_TYPES,
  membershipRequestSchema,
} from '@/lib/validations/membership'
import { PRICING_TIERS } from '@/lib/pricing'

type MembershipRequestModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SUCCESS_CLOSE_DELAY_MS = 1500

const fieldClassName =
  'h-11 rounded-sm border-white/15 bg-[#141414] text-white focus-visible:border-neon focus-visible:ring-neon/40'

type MembershipRequestFormInput = z.input<typeof membershipRequestSchema>

export function MembershipRequestModal({
  open,
  onOpenChange,
}: MembershipRequestModalProps) {
  const { selectedTier } = useMembershipForm()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MembershipRequestFormInput>({
    resolver: zodResolver(membershipRequestSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      age: '',
      membership_type: '',
    },
  })

  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (!open) {
      setStatus('idle')
      wasOpenRef.current = false
      return
    }

    if (wasOpenRef.current) return
    wasOpenRef.current = true

    reset({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      age: '',
      membership_type:
        selectedTier &&
        (MEMBERSHIP_TYPES as readonly string[]).includes(selectedTier)
          ? selectedTier
          : '',
    })
  }, [open, selectedTier, reset])

  useEffect(() => {
    if (status !== 'success') return

    const timer = window.setTimeout(() => {
      onOpenChange(false)
      setStatus('idle')
    }, SUCCESS_CLOSE_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [status, onOpenChange])

  const handleOpenChange = (next: boolean) => {
    if (!next && status === 'submitting') return
    onOpenChange(next)
  }

  const onSubmit = handleSubmit(async (values) => {
    setStatus('submitting')

    try {
      const response = await fetch('/api/membership-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setStatus('error')
    }
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={status !== 'submitting'}
        className="max-h-[92svh] overflow-y-auto border border-white/10 bg-[#0A0A0A] text-white sm:max-h-none sm:max-w-lg sm:rounded-sm md:top-1/2 md:max-w-xl"
      >
        {status === 'success' ? (
          <div className="space-y-4 py-6 text-center">
            <h2 className="font-heading text-3xl uppercase tracking-tight text-neon">
              Request Received
            </h2>
            <p className="text-sm text-white/70">
              We&apos;ll reach out shortly to help you join Paradise Gym.
            </p>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center bg-neon px-6 py-3 text-sm font-semibold uppercase tracking-wider text-carbon"
              onClick={() => onOpenChange(false)}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-3xl uppercase tracking-tight text-white">
                Request Membership
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Tell us about yourself and we&apos;ll follow up to get you on
                the floor.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="membership-first-name">First name</Label>
                  <Input
                    id="membership-first-name"
                    className={fieldClassName}
                    aria-invalid={!!errors.first_name}
                    {...register('first_name')}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-red-400">{errors.first_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="membership-last-name">Last name</Label>
                  <Input
                    id="membership-last-name"
                    className={fieldClassName}
                    aria-invalid={!!errors.last_name}
                    {...register('last_name')}
                  />
                  {errors.last_name && (
                    <p className="text-xs text-red-400">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="membership-email">Email</Label>
                <Input
                  id="membership-email"
                  type="email"
                  className={fieldClassName}
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="membership-phone">Phone</Label>
                  <Input
                    id="membership-phone"
                    type="tel"
                    className={fieldClassName}
                    aria-invalid={!!errors.phone}
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400">{errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="membership-age">Age</Label>
                  <Input
                    id="membership-age"
                    type="number"
                    className={fieldClassName}
                    aria-invalid={!!errors.age}
                    {...register('age')}
                  />
                  {errors.age && (
                    <p className="text-xs text-red-400">{errors.age.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="membership-type">Membership type</Label>
                <select
                  id="membership-type"
                  aria-label="Membership type"
                  className={cn(fieldClassName, 'w-full px-3')}
                  aria-invalid={!!errors.membership_type}
                  {...register('membership_type')}
                >
                  <option value="">Select a plan</option>
                  {PRICING_TIERS.map((tier) => (
                    <option key={tier.slug} value={tier.slug}>
                      {tier.name}
                    </option>
                  ))}
                </select>
                {errors.membership_type && (
                  <p className="text-xs text-red-400">
                    {errors.membership_type.message}
                  </p>
                )}
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-400">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-2 inline-flex w-full items-center justify-center bg-neon px-4 py-3 text-sm font-semibold uppercase tracking-wider text-carbon transition hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
