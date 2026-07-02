import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MembershipRequestsTable } from '@/components/admin/membership-requests-table'

describe('MembershipRequestsTable', () => {
  it('renders membership_type in human-readable form', () => {
    render(
      <MembershipRequestsTable
        requests={[
          {
            id: '1',
            created_at: '2026-07-02T12:00:00Z',
            first_name: 'Marcus',
            last_name: 'Torres',
            email: 'marcus@example.com',
            phone: '956-244-6692',
            age: 28,
            membership_type: '12_month_contract',
            status: 'new',
          },
          {
            id: '2',
            created_at: '2026-07-02T12:05:00Z',
            first_name: 'Elena',
            last_name: 'Rivera',
            email: 'elena@example.com',
            phone: '956-244-6692',
            age: 31,
            membership_type: 'week_pass',
            status: 'contacted',
          },
        ]}
      />
    )

    expect(screen.getByText('12 Month Contract')).toBeInTheDocument()
    expect(screen.getByText('Week Pass')).toBeInTheDocument()
    expect(screen.queryByText('12_month_contract')).not.toBeInTheDocument()
    expect(screen.queryByText('week_pass')).not.toBeInTheDocument()
  })
})
