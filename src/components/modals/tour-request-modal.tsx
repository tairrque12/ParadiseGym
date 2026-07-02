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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  generateTimeSlotsForDate,
  isValidTimeSlotForDate,
} from '@/lib/gym-hours'
import {
  tourRequestSchema,
  type TourRequestInput,
} from '@/lib/validations/tour'

type TourRequestModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SUCCESS_CLOSE_DELAY_MS = 1500

const fieldClassName =
  'h-11 rounded-sm border-white/15 bg-[#141414] text-white focus-visible:border-neon focus-visible:ring-neon/40'

export function TourRequestModal({
  open,
  onOpenChange,
}: TourRequestModalProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  )

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
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      preferred_date: '',
      preferred_time: '',
    },
  })

  const preferredDate = useWatch({ control, name: 'preferred_date' })
  const timeSlots = useMemo(
    () => (preferredDate ? generateTimeSlotsForDate(preferredDate) : []),
    [preferredDate]
  )

  useEffect(() => {
    if (!open) {
      setStatus('idle')
      return
    }

    reset({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      preferred_date: '',
      preferred_time: '',
    })
  }, [open, reset])

  useEffect(() => {
    const currentTime = getValues('preferred_time')

    if (!preferredDate) {
      if (currentTime) {
        setValue('preferred_time', '', { shouldValidate: true })
      }
      return
    }

    if (currentTime && !isValidTimeSlotForDate(preferredDate, currentTime)) {
      setValue('preferred_time', '', { shouldValidate: true })
    }
  }, [preferredDate, getValues, setValue])

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

    const payload = {
      ...values,
      preferred_date: values.preferred_date || undefined,
      preferred_time: values.preferred_time || undefined,
    }

    try {
      const response = await fetch('/api/tour-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
              Tour Requested
            </h2>
            <p className="text-sm text-white/70">
              We&apos;ll be in touch to schedule your visit to Paradise Gym.
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
                Free Gym Tour
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Book a walkthrough of the gym and see the floor for yourself.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="grid gap-4">
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
                <Label htmlFor="tour-email">Email</Label>
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tour-preferred-date">Preferred date (optional)</Label>
                  <Input
                    id="tour-preferred-date"
                    type="date"
                    className={fieldClassName}
                    aria-invalid={!!errors.preferred_date}
                    {...register('preferred_date')}
                  />
                  {errors.preferred_date && (
                    <p className="text-xs text-red-400">
                      {errors.preferred_date.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tour-preferred-time">Preferred time (optional)</Label>
                  <Controller
                    control={control}
                    name="preferred_time"
                    render={({ field }) => (
                      <Select
                        value={field.value ? field.value : null}
                        onValueChange={(value) => field.onChange(value ?? '')}
                        disabled={!preferredDate || timeSlots.length === 0}
                      >
                        <SelectTrigger
                          id="tour-preferred-time"
                          className={`h-11 w-full rounded-sm border-white/15 bg-[#141414] text-white focus-visible:border-neon focus-visible:ring-neon/40`}
                          aria-invalid={!!errors.preferred_time}
                        >
                          <SelectValue
                            placeholder={
                              preferredDate ? 'Select a time' : 'Select a date first'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#141414] text-white">
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.preferred_time && (
                    <p className="text-xs text-red-400">
                      {errors.preferred_time.message}
                    </p>
                  )}
                </div>
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
                {status === 'submitting' ? 'Submitting...' : 'Request Tour'}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
