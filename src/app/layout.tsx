import { Barlow_Condensed, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { rootMetadata } from '@/lib/seo'

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-heading',
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = rootMetadata

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
          display.variable,
          sans.variable
        )}
      >
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
