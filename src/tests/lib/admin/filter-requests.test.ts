import { describe, it, expect } from 'vitest'
import {
  countRequestsByStatus,
  filterRequestsBySearch,
} from '@/lib/admin/filter-requests'

const sample = [
  {
    id: '1',
    first_name: 'Marcus',
    last_name: 'Torres',
    email: 'marcus@example.com',
    status: 'new',
  },
  {
    id: '2',
    first_name: 'Elena',
    last_name: 'Rivera',
    email: 'elena@example.com',
    status: 'contacted',
  },
  {
    id: '3',
    first_name: 'Alex',
    last_name: 'Nguyen',
    email: 'alex.nguyen@example.com',
    status: 'new',
  },
]

describe('filterRequestsBySearch', () => {
  it('filters by first name', () => {
    expect(filterRequestsBySearch(sample, 'marcus')).toHaveLength(1)
  })

  it('filters by email', () => {
    expect(filterRequestsBySearch(sample, 'elena@example.com')).toHaveLength(1)
    expect(filterRequestsBySearch(sample, 'ELENA@EXAMPLE')).toHaveLength(1)
  })

  it('returns all rows when query is empty', () => {
    expect(filterRequestsBySearch(sample, '')).toHaveLength(3)
    expect(filterRequestsBySearch(sample, '   ')).toHaveLength(3)
  })
})

describe('countRequestsByStatus', () => {
  it('counts rows with a given status', () => {
    expect(countRequestsByStatus(sample, 'new')).toBe(2)
    expect(countRequestsByStatus(sample, 'contacted')).toBe(1)
    expect(countRequestsByStatus(sample, 'closed')).toBe(0)
  })
})
