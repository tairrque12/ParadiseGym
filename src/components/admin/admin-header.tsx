'use client'

import { Logo } from '@/components/Logo'

type AdminHeaderProps = {
  onLogout: () => void
  isLoggingOut?: boolean
}

export function AdminHeader({ onLogout, isLoggingOut }: AdminHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Logo className="text-white" />
        <p className="mt-2 text-sm text-white/55">Owner dashboard</p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="inline-flex items-center justify-center border border-white/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-neon hover:text-neon disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoggingOut ? 'Logging out...' : 'Log Out'}
      </button>
    </header>
  )
}
