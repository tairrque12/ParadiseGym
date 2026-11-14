import '@/tests/mocks/react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JoinAction, TourAction } from '@/components/join-actions'

describe('join and tour actions', () => {
  it('fills only the join action with neon and outlines the tour', () => {
    render(
      <>
        <JoinAction href="https://example.com/join">Join today</JoinAction>
        <TourAction>Not ready? Book a free tour</TourAction>
      </>
    )

    const join = screen.getByRole('link', { name: 'Join today' })
    const tour = screen.getByRole('button', { name: /book a free tour/i })
    expect(join).toHaveClass('bg-neon')
    expect(join).toHaveClass('h-[52px]')
    expect(tour).not.toHaveClass('bg-neon')
    expect(tour).toHaveClass('border-line-strong')
  })
})
