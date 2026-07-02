import React from 'react'

vi.mock('next/image', () => ({
  default: function MockImage({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ''} {...props} />
  },
}))

vi.mock('next/link', () => ({
  default: function MockLink({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    children: React.ReactNode
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  },
}))

vi.mock('framer-motion', async () => {
  const React = await import('react')
  const motion = new Proxy(
    {},
    {
      get: (_target, prop: string) =>
        React.forwardRef(function MotionStub(
          {
            children,
            style,
            ...props
          }: React.PropsWithChildren<Record<string, unknown>>,
          ref: React.Ref<HTMLElement>
        ) {
          const domProps = { ...props } as Record<string, unknown>
          for (const key of [
            'initial',
            'animate',
            'whileInView',
            'whileHover',
            'transition',
            'viewport',
            'variants',
          ]) {
            delete domProps[key]
          }
          const Tag = prop as keyof JSX.IntrinsicElements
          return React.createElement(
            Tag,
            { ref, style: style as React.CSSProperties, ...domProps },
            children
          )
        }),
    }
  )

  return {
    motion,
    useScroll: () => ({ scrollY: { get: () => 0, on: () => () => {} } }),
    useTransform: () => '0%',
    useInView: () => true,
    useMotionValue: (initial: number) => ({
      get: () => initial,
      set: vi.fn(),
    }),
    useSpring: (value: { get: () => number }) => value,
    animate: vi.fn(),
  }
})
