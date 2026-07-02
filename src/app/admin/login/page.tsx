import { AdminLoginForm } from '@/components/admin/admin-login-form'

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-carbon px-4 py-10">
      <div className="w-full max-w-md border border-white/10 bg-[#111111] p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.22em] text-neon">
            Paradise Gym
          </p>
          <h1 className="mt-2 font-heading text-3xl uppercase tracking-tight text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Sign in to review membership and tour requests.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
