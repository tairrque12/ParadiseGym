'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
  'h-12 rounded-none border-white/15 bg-white/[0.03] px-3 text-base text-white transition-colors duration-200 placeholder:text-white/30 focus-visible:border-neon/80 focus-visible:ring-1 focus-visible:ring-neon/40 md:text-base motion-reduce:transition-none'

const choiceClassName =
  'inline-flex min-h-11 w-full items-center justify-center border border-white/15 px-2 text-sm text-white transition-colors duration-200 hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 aria-pressed:border-neon aria-pressed:bg-neon aria-pressed:text-carbon motion-reduce:transition-none'

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
  const scrollRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    const node = scrollRef.current?.querySelector('[data-field-error]')
    node?.scrollIntoView?.({ block: 'nearest' })
  }, [errors])

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
        layout="sheet"
        showCloseButton={status !== 'submitting'}
      >
        {status === 'success' ? (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-1 flex-col items-center justify-center px-5 py-12 text-center"
          >
            <h2 className="font-sans text-[1.75rem] font-medium tracking-[-0.02em] text-white">
              Tour requested
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-2">
              We&apos;ll text you to confirm your tour.
            </p>
            <button
              type="button"
              className="mt-8 inline-flex h-11 items-center justify-center bg-neon px-8 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 motion-reduce:transition-none"
              onClick={() => onOpenChange(false)}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <DialogHeader className="shrink-0 border-b border-white/10 px-5 pt-[max(1rem,env(safe-area-inset-top))] pr-16 pb-4">
              <DialogTitle className="font-sans text-[1.625rem] font-medium leading-tight tracking-[-0.02em] text-white">
                Book a free tour
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-text-2">
                {locationCopy(location)}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
              <div
                ref={scrollRef}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4"
              >
                <div className="grid gap-4">
                  <input type="hidden" {...register('location')} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tour-first-name" className="text-[13px] font-medium text-text-2">
                        First name
                      </Label>
                      <Input
                        id="tour-first-name"
                        className={fieldClassName}
                        aria-invalid={!!errors.first_name}
                        {...register('first_name')}
                      />
                      {errors.first_name && (
                        <p data-field-error="" className="text-xs text-red-400">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tour-last-name" className="text-[13px] font-medium text-text-2">
                        Last name
                      </Label>
                      <Input
                        id="tour-last-name"
                        className={fieldClassName}
                        aria-invalid={!!errors.last_name}
                        {...register('last_name')}
                      />
                      {errors.last_name && (
                        <p data-field-error="" className="text-xs text-red-400">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tour-phone" className="text-[13px] font-medium text-text-2">
                      Phone
                    </Label>
                    <Input
                      id="tour-phone"
                      type="tel"
                      className={fieldClassName}
                      aria-invalid={!!errors.phone}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p data-field-error="" className="text-xs text-red-400">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tour-email" className="text-[13px] font-medium text-text-2">
                      Email (optional)
                    </Label>
                    <Input
                      id="tour-email"
                      type="email"
                      className={fieldClassName}
                      aria-invalid={!!errors.email}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p data-field-error="" className="text-xs text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <Controller
                    control={control}
                    name="preferred_date"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label id="tour-preferred-day-label" className="text-[13px] font-medium text-text-2">
                          Preferred day
                        </Label>
                        <div
                          role="group"
                          aria-labelledby="tour-preferred-day-label"
                          className="grid grid-cols-2 gap-2"
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
                          <p data-field-error="" className="text-xs text-red-400">
                            {errors.preferred_date.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="preferred_time"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label id="tour-preferred-time-label" className="text-[13px] font-medium text-text-2">
                          Preferred time
                        </Label>
                        {preferredDate ? (
                          <div
                            role="group"
                            aria-labelledby="tour-preferred-time-label"
                            className="grid gap-3"
                          >
                            {timeSlotGroups.map((group) => (
                              <div key={group.label}>
                                <p className="mb-2 text-xs font-medium text-text-3">{group.label}</p>
                                <div className="grid grid-cols-3 gap-2">
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
                          <p className="text-sm text-white/75">Choose a day first.</p>
                        )}
                        {errors.preferred_time && (
                          <p data-field-error="" className="text-xs text-red-400">
                            {errors.preferred_time.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <p className="text-sm leading-relaxed text-text-2">
                    We&apos;ll text you to confirm your tour.
                  </p>

                  {status === 'error' && (
                    <p data-field-error="" className="text-sm text-red-400">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 border-t border-white/10 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex h-12 w-full items-center justify-center bg-neon px-4 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
                >
                  {status === 'submitting' ? 'Submitting...' : 'Request tour'}
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
