export const GALLERY_IMAGE_SIZES =
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

export const GALLERY_IMAGES = [
  {
    src: '/images/gallery/gym-floor.png',
    alt: 'Paradise Gym weight floor with custom equipment and neon green accents',
    span: 'wide' as const,
    priority: true,
  },
  {
    src: '/images/gallery/dumbbell-rack.png',
    alt: 'Premier dumbbell rack along the mirror wall at Paradise Gym',
    span: 'tall' as const,
    priority: true,
  },
  {
    src: '/images/gallery/training-floor.png',
    alt: 'Strength machines and Welcome to Paradise banner on the training floor',
    span: 'default' as const,
  },
  {
    src: '/images/gallery/gym-overview.png',
    alt: 'Wide view of Paradise Gym showing the full weight room layout',
    span: 'wide' as const,
  },
  {
    src: '/images/gallery/cable-station.png',
    alt: 'Cable machines and free weights in the Paradise Gym training area',
    span: 'default' as const,
  },
] as const
