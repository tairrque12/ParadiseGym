import { JsonLd } from '@/components/json-ld'
import { Navbar } from '@/components/sections/Navbar'
import { McAllenHero } from '@/components/sections/McAllenHero'
import { McAllenPricing } from '@/components/sections/McAllenPricing'
import { Amenities } from '@/components/sections/Amenities'
import { Reviews } from '@/components/sections/Reviews'
import { HoursLocation } from '@/components/sections/HoursLocation'
import { Footer } from '@/components/sections/Footer'
import { LOCATIONS } from '@/lib/locations'
import { healthClubJsonLd, mcallenMetadata } from '@/lib/seo'

export const metadata = mcallenMetadata

export default function McAllenPage() {
  const mcallen = LOCATIONS.mcallen

  return (
    <>
      <JsonLd data={healthClubJsonLd(mcallen)} />
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
