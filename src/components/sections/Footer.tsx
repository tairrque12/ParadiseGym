import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { TrackedPhoneLink } from '@/components/tracked-phone-link'
import { CONTACT } from '@/lib/contact'
import { LOCATIONS, type GymLocation } from '@/lib/locations'
import { GALLERY_PATH } from '@/lib/sections'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
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
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  )
}

const columnLabel = 'text-xs font-medium tracking-[0.08em] text-text-3'

export function Footer({
  location = LOCATIONS.harlingen,
}: {
  location?: GymLocation
}) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-carbon py-16 max-lg:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-text-2">
              The Rio Grande Valley&apos;s premium training floor — built for
              lifters who demand more from their gym.
            </p>
            <nav aria-label="Footer" className="mt-5">
              <Link
                href={GALLERY_PATH}
                className="inline-flex min-h-11 items-center text-sm text-white underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:decoration-neon motion-reduce:transition-none"
              >
                Gallery
              </Link>
            </nav>
          </div>

          <div>
            <h3 className={columnLabel}>Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-text-2">
              <li>
                <TrackedPhoneLink
                  href={CONTACT.phoneHref}
                  location={location.id}
                  placement="footer"
                  className="inline-flex min-h-11 items-center text-white transition-colors duration-200 hover:text-neon motion-reduce:transition-none"
                >
                  {CONTACT.phone}
                </TrackedPhoneLink>
              </li>
              <li className="leading-relaxed">
                <span className="text-text-2">{location.name}: </span>
                {location.address}
              </li>
            </ul>
          </div>

          <div>
            <h3 className={columnLabel}>Hours</h3>
            {location.hours ? (
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-text-2">
                {location.hours.map((row) => (
                  <li key={row.days}>
                    <span className="text-text-2">{row.days}: </span>
                    {row.time}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-text-2">Hours coming soon.</p>
            )}
          </div>

          <div>
            <h3 className={columnLabel}>Follow</h3>
            <div className="mt-4 flex gap-2">
              <Link
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Paradise Gym on Instagram"
                className="inline-flex size-11 items-center justify-center text-white transition-colors duration-200 hover:text-neon motion-reduce:transition-none"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link
                href={CONTACT.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Paradise Gym on TikTok"
                className="inline-flex size-11 items-center justify-center text-white transition-colors duration-200 hover:text-neon motion-reduce:transition-none"
              >
                <TikTokIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <p className="text-xs text-text-2">
            &copy; {year} Paradise Gym. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
