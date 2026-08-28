import type { Metadata } from 'next'
import { Navbar } from '@/components/sections/Navbar'
import { McAllenHero } from '@/components/sections/McAllenHero'
import { McAllenPricing } from '@/components/sections/McAllenPricing'
import { Amenities } from '@/components/sections/Amenities'
import { Reviews } from '@/components/sections/Reviews'
import { HoursLocation } from '@/components/sections/HoursLocation'
import { Footer } from '@/components/sections/Footer'
import { LOCATIONS } from '@/lib/locations'

export const metadata: Metadata = {
  title: 'Paradise Gym McAllen | Founding Member Pre-Sale',
  description:
    'Paradise Gym is coming to McAllen, TX — 20,000 sq ft of custom-built training. Lock in founding member pricing during the pre-sale.',
}

export default function McAllenPage() {
  const mcallen = LOCATIONS.mcallen

  return (
    <>
      <Navbar />
      <main className="bg-carbon text-white">
        <McAllenHero />
        <McAllenPricing />
        <Amenities />
        <Reviews />
        <HoursLocation location={mcallen} />
      </main>
      <Footer location={mcallen} />
    </>
  )
}
