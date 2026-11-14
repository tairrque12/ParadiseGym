import { Navbar } from '@/components/sections/Navbar'
import { Gallery } from '@/components/sections/Gallery'
import { Footer } from '@/components/sections/Footer'
import { galleryMetadata } from '@/lib/seo'

export const metadata = galleryMetadata

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
