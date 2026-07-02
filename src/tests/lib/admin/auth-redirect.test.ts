import { describe, it, expect } from 'vitest'
import { getAdminAuthRedirect } from '@/lib/admin/auth-redirect'

describe('getAdminAuthRedirect', () => {
  it('redirects unauthenticated users from /admin to login', () => {
    expect(getAdminAuthRedirect('/admin', false)).toBe('/admin/login')
  })

  it('redirects unauthenticated users from nested admin routes to login', () => {
    expect(getAdminAuthRedirect('/admin/settings', false)).toBe('/admin/login')
  })

  it('allows authenticated users to access /admin', () => {
    expect(getAdminAuthRedirect('/admin', true)).toBeNull()
  })

  it('redirects authenticated users away from /admin/login', () => {
    expect(getAdminAuthRedirect('/admin/login', true)).toBe('/admin')
  })

  it('allows unauthenticated users to access /admin/login', () => {
    expect(getAdminAuthRedirect('/admin/login', false)).toBeNull()
  })

  it('ignores non-admin routes', () => {
    expect(getAdminAuthRedirect('/', false)).toBeNull()
    expect(getAdminAuthRedirect('/pricing', true)).toBeNull()
  })

  it('allows login access when auth is unavailable', () => {
    expect(getAdminAuthRedirect('/admin/login', false)).toBeNull()
  })

  it('blocks dashboard access when auth is unavailable', () => {
    expect(getAdminAuthRedirect('/admin', false)).toBe('/admin/login')
  })
})
