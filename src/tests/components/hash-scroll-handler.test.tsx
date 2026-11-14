import '@/tests/mocks/react'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { HashScrollHandler } from '@/components/hash-scroll-handler'

vi.mock('next/navigation', () => ({ usePathname: () => '/mcallen' }))

describe('HashScrollHandler', () => {
  it('scrolls to the current McAllen hash without pushing history', () => {
    const target = document.createElement('section')
    target.id = 'pricing'
    target.scrollIntoView = vi.fn()
    document.body.appendChild(target)
    window.history.replaceState(null, '', '/mcallen#pricing')
    const pushState = vi.spyOn(window.history, 'pushState')

    render(<HashScrollHandler />)

    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'start',
    })
    expect(pushState).not.toHaveBeenCalled()
    expect(window.location.hash).toBe('#pricing')

    pushState.mockRestore()
    target.remove()
  })

  it('drops a tour hash and keeps the query string', () => {
    window.history.replaceState(null, '', '/mcallen?utm_source=email#tour')
    const replaceState = vi.spyOn(window.history, 'replaceState')

    render(<HashScrollHandler />)

    expect(replaceState).toHaveBeenCalledWith(null, '', '/mcallen?utm_source=email')
    expect(window.location.search).toBe('?utm_source=email')
    expect(window.location.hash).toBe('')

    replaceState.mockRestore()
  })
})
