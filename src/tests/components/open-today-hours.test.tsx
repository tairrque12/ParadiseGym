import '@/tests/mocks/react'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { OpenTodayHours } from '@/components/open-today-hours'
import { openTodayLabel, POSTED_HOURS_SUMMARY } from '@/lib/contact'

describe('OpenTodayHours', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the posted weekly hours before mount', () => {
    const html = renderToString(<OpenTodayHours />)

    expect(html).toContain(POSTED_HOURS_SUMMARY)
    expect(html).not.toContain('Open today')
  })

  it('shows the Chicago day hours after mount', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-15T18:00:00Z'))

    render(<OpenTodayHours />)

    expect(screen.getByTestId('open-today-hours')).toHaveTextContent(
      openTodayLabel(new Date('2026-11-15T18:00:00Z'))
    )
    expect(screen.getByTestId('open-today-hours')).toHaveTextContent(
      'Open today 9am – 5pm'
    )
  })
})
