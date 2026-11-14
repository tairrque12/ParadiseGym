import { JsonLd } from '@/components/json-ld'
import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { GymFacts } from '@/components/sections/GymFacts'
import { Amenities } from '@/components/sections/Amenities'
import { Pricing } from '@/components/sections/Pricing'
import { Reviews } from '@/components/sections/Reviews'
import { HoursLocation } from '@/components/sections/HoursLocation'
import { Footer } from '@/components/sections/Footer'
import { LOCATIONS } from '@/lib/locations'
import { healthClubJsonLd } from '@/lib/seo'

export default function Home() {
  return (
    <>
      <JsonLd data={healthClubJsonLd(LOCATIONS.harlingen)} />
      <Navbar />
      <main className="bg-carbon text-white">
        <Hero />
        <GymFacts />
        <Amenities />
        <Pricing />
        <Reviews />
        <HoursLocation />
      </main>
      <Footer />
    </>
  )
}
