import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { GymFacts } from '@/components/sections/GymFacts'
import { Amenities } from '@/components/sections/Amenities'
import { Gallery } from '@/components/sections/Gallery'
import { Pricing } from '@/components/sections/Pricing'
import { Reviews } from '@/components/sections/Reviews'
import { HoursLocation } from '@/components/sections/HoursLocation'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-carbon text-white">
        <Hero />
        <GymFacts />
        <Amenities />
        <Gallery />
        <Pricing />
        <Reviews />
        <HoursLocation />
      </main>
      <Footer />
    </>
  )
}
