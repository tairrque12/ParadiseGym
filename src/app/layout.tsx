import type { Metadata } from 'next'
import { Anton, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-heading',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Paradise Gym | Where Strength Meets Aesthetics',
  description:
    'Premium gym in Harlingen, TX — 7,500 sq ft of custom-built equipment, infrared saunas, and a posing room included with every membership.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-carbon font-sans text-white antialiased',
          anton.variable,
          spaceGrotesk.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
