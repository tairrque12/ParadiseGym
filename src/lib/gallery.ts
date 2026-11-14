export const GALLERY_IMAGES = [
  {
    src: '/images/gallery/gym-floor.png',
    alt: 'Paradise Gym weight floor with custom equipment and neon green accents',
    span: 'wide' as const,
    priority: false,
  },
  {
    src: '/images/gallery/dumbbell-rack.png',
    alt: 'Premier dumbbell rack along the mirror wall at Paradise Gym',
    span: 'tall' as const,
    // Largest painted photo on /gallery at phone and desktop widths.
    priority: true,
  },
  {
    src: '/images/gallery/training-floor.png',
    alt: 'Strength machines and Welcome to Paradise banner on the training floor',
    span: 'default' as const,
    priority: false,
  },
  {
    src: '/images/gallery/gym-overview.png',
    alt: 'Wide view of Paradise Gym showing the full weight room layout',
    span: 'wide' as const,
    priority: false,
  },
  {
    src: '/images/gallery/cable-station.png',
    alt: 'Cable machines and free weights in the Paradise Gym training area',
    span: 'default' as const,
    priority: false,
  },
] as const
