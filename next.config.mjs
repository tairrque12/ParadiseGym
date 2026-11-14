/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/tour', destination: '/', permanent: true },
      { source: '/tours', destination: '/', permanent: true },
      { source: '/book-a-tour', destination: '/', permanent: true },
      { source: '/book-tour', destination: '/', permanent: true },
      { source: '/free-tour', destination: '/', permanent: true },
      { source: '/mcallen/tour', destination: '/mcallen', permanent: true },
      { source: '/mcallen/tours', destination: '/mcallen', permanent: true },
    ]
  },
}

export default nextConfig
