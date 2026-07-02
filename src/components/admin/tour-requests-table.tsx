import { formatRelativeTime } from '@/lib/admin/format-relative-time'
import type { TourRequestRecord } from '@/lib/admin/requests'
import { StatusBadge } from '@/components/admin/status-badge'
import { StatusSelect } from '@/components/admin/status-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type TourRequestsTableProps = {
  requests: TourRequestRecord[]
  updatingId?: string | null
  onStatusChange: (id: string, status: string) => void
}

export function TourRequestsTable({
  requests,
  updatingId,
  onStatusChange,
}: TourRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-white/15 px-4 py-10 text-center text-sm text-white/60">
        No tour requests yet.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Preferred Date</TableHead>
          <TableHead>Preferred Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium text-white">
              {request.first_name} {request.last_name}
            </TableCell>
            <TableCell>{request.email}</TableCell>
            <TableCell>{request.phone}</TableCell>
            <TableCell>{request.preferred_date ?? '—'}</TableCell>
            <TableCell>{request.preferred_time ?? '—'}</TableCell>
            <TableCell>
              <StatusBadge status={request.status} />
            </TableCell>
            <TableCell className="text-white/60">
              {formatRelativeTime(request.created_at)}
            </TableCell>
            <TableCell>
              <StatusSelect
                value={request.status}
                disabled={updatingId === request.id}
                onChange={(status) => onStatusChange(request.id, status)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
