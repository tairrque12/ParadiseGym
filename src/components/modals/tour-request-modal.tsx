'use client'

import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  formatTourDateLabel,
  groupTimeSlots,
  tourTimeChoices,
  upcomingTourDates,
} from '@/lib/gym-hours'
import { trackTourFormSubmit } from '@/lib/analytics'
import type { LocationId } from '@/lib/locations'
import {
  tourRequestSchema,
  type TourRequestInput,
} from '@/lib/validations/tour'

type TourRequestModalProps = {
  open: boolean
  location: LocationId
  onOpenChange: (open: boolean) => void
}

const fieldClassName =
  'h-11 rounded-sm border-white/15 bg-[#141414] text-white focus-visible:border-neon focus-visible:ring-neon/40'

const choiceClassName =
  'inline-flex min-h-11 items-center justify-center rounded-sm border border-white/20 px-3 text-sm text-white aria-pressed:border-neon aria-pressed:bg-neon aria-pressed:text-carbon'

function locationCopy(location: LocationId) {
  if (location === 'mcallen') {
    return 'This request is for McAllen. That gym is not open yet, so the tour is of the open Harlingen floor.'
  }

  return 'This tour is for the Harlingen gym.'
}

export function TourRequestModal({
  open,
  location,
  onOpenChange,
}: TourRequestModalProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  )
  const tourDays = useMemo(() => upcomingTourDates(), [])

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TourRequestInput>({
    resolver: zodResolver(tourRequestSchema),
    defaultValues: {
      location,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      preferred_date: '',
      preferred_time: '',
    },
  })

  const preferredDate = useWatch({ control, name: 'preferred_date' })
  const timeSlotGroups = useMemo(
    () => (preferredDate ? groupTimeSlots(tourTimeChoices(preferredDate)) : []),
    [preferredDate]
  )

  useEffect(() => {
    if (!open) {
      setStatus('idle')
      return
    }

    reset({
      location,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      preferred_date: '',
      preferred_time: '',
    })
  }, [open, location, reset])

  useEffect(() => {
    const currentTime = getValues('preferred_time')
    if (!preferredDate || !currentTime) return
    const stillValid = tourTimeChoices(preferredDate).includes(currentTime)
    if (!stillValid) {
      setValue('preferred_time', '', { shouldValidate: true })
    }
  }, [preferredDate, getValues, setValue])

  const handleOpenChange = (next: boolean) => {
    if (!next && status === 'submitting') return
    onOpenChange(next)
  }

  const onSubmit = handleSubmit(async (values) => {
    setStatus('submitting')

    try {
      const response = await fetch('/api/tour-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        setStatus('error')
        return
      }

      trackTourFormSubmit({ location })
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
          <div role="status" aria-live="polite" className="space-y-4 py-6 text-center">
            <h2 className="font-heading text-3xl uppercase tracking-tight text-neon">
              Tour requested
            </h2>
            <p className="text-sm text-white/80">
              We&apos;ll text you to confirm your tour.
            </p>
            <button
              type="button"
              className="mt-2 inline-flex min-h-11 items-center justify-center bg-neon px-6 text-sm font-semibold text-carbon"
              onClick={() => onOpenChange(false)}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-3xl uppercase tracking-tight text-white">
                Book a free tour
              </DialogTitle>
              <DialogDescription className="text-white/70">
                {locationCopy(location)}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="grid gap-4">
              <input type="hidden" {...register('location')} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tour-first-name">First name</Label>
                  <Input
                    id="tour-first-name"
                    className={fieldClassName}
                    aria-invalid={!!errors.first_name}
                    {...register('first_name')}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-red-400">{errors.first_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tour-last-name">Last name</Label>
                  <Input
                    id="tour-last-name"
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
                <Label htmlFor="tour-phone">Phone</Label>
                <Input
                  id="tour-phone"
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
                <Label htmlFor="tour-email">Email (optional)</Label>
                <Input
                  id="tour-email"
                  type="email"
                  className={fieldClassName}
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <Controller
                control={control}
                name="preferred_date"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label id="tour-preferred-day-label">Preferred day</Label>
                    <div
                      role="group"
                      aria-labelledby="tour-preferred-day-label"
                      className="flex flex-wrap gap-2"
                    >
                      {tourDays.map((day) => (
                        <button
                          key={day}
                          type="button"
                          aria-pressed={field.value === day}
                          className={choiceClassName}
                          onClick={() => field.onChange(day)}
                        >
                          {formatTourDateLabel(day)}
                        </button>
                      ))}
                    </div>
                    {errors.preferred_date && (
                      <p className="text-xs text-red-400">{errors.preferred_date.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="preferred_time"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label id="tour-preferred-time-label">Preferred time</Label>
                    {preferredDate ? (
                      <div
                        role="group"
                        aria-labelledby="tour-preferred-time-label"
                        className="grid gap-3"
                      >
                        {timeSlotGroups.map((group) => (
                          <div key={group.label}>
                            <p className="mb-2 text-sm text-white/70">{group.label}</p>
                            <div className="flex flex-wrap gap-2">
                              {group.slots.map((slot) => (
                                <button
                                  key={slot}
                                  type="button"
                                  aria-pressed={field.value === slot}
                                  className={choiceClassName}
                                  onClick={() => field.onChange(slot)}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-white/70">Choose a day first.</p>
                    )}
                    {errors.preferred_time && (
                      <p className="text-xs text-red-400">{errors.preferred_time.message}</p>
                    )}
                  </div>
                )}
              />

              <p className="text-sm text-white/80">
                We&apos;ll text you to confirm your tour.
              </p>

              {status === 'error' && (
                <p className="text-sm text-red-400">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-2 inline-flex min-h-11 w-full items-center justify-center bg-neon px-4 text-sm font-semibold text-carbon transition hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Submitting...' : 'Request tour'}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
