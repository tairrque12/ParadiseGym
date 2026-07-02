import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { CONTACT, HOURS } from '@/lib/contact'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-carbon py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              Harlingen&apos;s premium training floor — built for lifters who
              demand more from their gym.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-neon">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                <a href={CONTACT.phoneHref} className="hover:text-neon">
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={CONTACT.emailHref} className="hover:text-neon">
                  {CONTACT.email}
                </a>
              </li>
              <li>{CONTACT.address}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-neon">
              Hours
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {HOURS.map((row) => (
                <li key={row.days}>
                  <span className="text-white/50">{row.days}: </span>
                  {row.time}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-neon">
              Follow
            </h3>
            <div className="mt-4 flex gap-4">
              <Link
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Paradise Gym on Instagram"
                className="text-white/70 transition-colors hover:text-neon"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link
                href={CONTACT.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Paradise Gym on TikTok"
                className="text-white/70 transition-colors hover:text-neon"
              >
                <TikTokIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-white/10" role="separator" />

        <p className="text-center text-xs text-white/40">
          &copy; {year} Paradise Gym. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
