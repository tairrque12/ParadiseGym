type SearchableRequest = {
  first_name: string
  last_name: string
  email: string
}

export function filterRequestsBySearch<T extends SearchableRequest>(
  requests: T[],
  query: string
): T[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return requests

  return requests.filter((request) => {
    const fullName = `${request.first_name} ${request.last_name}`.toLowerCase()
    return (
      fullName.includes(normalized) ||
      request.email.toLowerCase().includes(normalized)
    )
  })
}

export function countRequestsByStatus<T extends { status: string }>(
  requests: T[],
  status: string
): number {
  return requests.filter((request) => request.status === status).length
}
