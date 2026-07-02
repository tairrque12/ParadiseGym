import { getMembershipTypeLabel } from '@/lib/membership-options'

export type MembershipRequestRow = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  age: number
  membership_type: string
  status: string
}

export function formatMembershipTypeForDisplay(slug: string): string {
  return getMembershipTypeLabel(slug)
}

type MembershipRequestsTableProps = {
  requests: MembershipRequestRow[]
}

export function MembershipRequestsTable({
  requests,
}: MembershipRequestsTableProps) {
  return (
    <table className="w-full min-w-[720px] border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-white/50">
          <th className="px-4 py-3 font-semibold">Name</th>
          <th className="px-4 py-3 font-semibold">Email</th>
          <th className="px-4 py-3 font-semibold">Phone</th>
          <th className="px-4 py-3 font-semibold">Membership Type</th>
          <th className="px-4 py-3 font-semibold">Status</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id} className="border-b border-white/5">
            <td className="px-4 py-3 text-white">
              {request.first_name} {request.last_name}
            </td>
            <td className="px-4 py-3 text-white/75">{request.email}</td>
            <td className="px-4 py-3 text-white/75">{request.phone}</td>
            <td className="px-4 py-3 text-white">
              {formatMembershipTypeForDisplay(request.membership_type)}
            </td>
            <td className="px-4 py-3 capitalize text-white/75">{request.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
