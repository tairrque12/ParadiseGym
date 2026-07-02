'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const fieldClassName =
  'h-11 rounded-sm border-white/15 bg-[#141414] text-white focus-visible:border-neon focus-visible:ring-neon/40'

export function AdminLoginForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    let supabase

    try {
      supabase = createSupabaseBrowserClient()
    } catch {
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/admin')
        router.refresh()
      }
    })
  }, [router])

  const onSubmit = handleSubmit(async (values) => {
    setAuthError(null)
    setIsSubmitting(true)

    try {
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error || !data.session) {
        setAuthError('Invalid email or password. Please try again.')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (error) {
      if (error instanceof Error && error.message.includes('not configured')) {
        setAuthError('Admin sign-in is not configured yet. Contact support.')
        return
      }

      setAuthError('Unable to sign in right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          type="email"
          autoComplete="email"
          className={fieldClassName}
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          className={fieldClassName}
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        ) : null}
      </div>

      {authError ? <p className="text-sm text-red-400">{authError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center bg-neon px-4 py-3 text-sm font-semibold uppercase tracking-wider text-carbon transition hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
