import { Navbar } from '@/components/sections/Navbar'
import { Gallery } from '@/components/sections/Gallery'
import { Footer } from '@/components/sections/Footer'

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="bg-carbon text-white">
        <Gallery />
      </main>
      <Footer />
    </>
  )
}
