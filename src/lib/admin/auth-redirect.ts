export function getAdminAuthRedirect(
  pathname: string,
  isAuthenticated: boolean
): string | null {
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  if (!isAdminRoute) return null

  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage && isAuthenticated) return '/admin'
  if (!isLoginPage && !isAuthenticated) return '/admin/login'

  return null
}
