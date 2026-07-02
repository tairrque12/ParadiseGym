// PLACEHOLDER: Client will confirm real membership pricing before launch.
export const PRICING_TIERS = [
  {
    name: 'Essential',
    slug: 'essential',
    price: '$49',
    period: '/mo',
    features: [
      'Full gym floor access',
      'Locker room & showers',
      'Member app check-in',
      'Guest pass — 1/mo',
    ],
    popular: false,
  },
  {
    name: 'Performance',
    slug: 'performance',
    price: '$79',
    period: '/mo',
    features: [
      'Everything in Essential',
      'Infrared sauna access',
      'Posing room priority',
      'Unlimited guest passes',
    ],
    popular: true,
  },
  {
    name: 'Elite',
    slug: 'elite',
    price: '$119',
    period: '/mo',
    features: [
      'Everything in Performance',
      'Dedicated storage locker',
      'Recovery zone access',
      'Priority tour scheduling',
    ],
    popular: false,
  },
] as const
