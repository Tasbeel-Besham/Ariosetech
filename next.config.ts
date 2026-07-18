import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'ariosetech.com' },
      { protocol: 'https', hostname: 'image.thum.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    // Permanently redirect leftover WordPress URLs so they stop wasting crawl
    // budget and pass any residual authority to real pages. 301 = permanent.
    return [
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/contact-us/:path*', destination: '/contact', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/our-services', destination: '/services', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-of-service', permanent: true },
      { source: '/category/stories', destination: '/portfolio', permanent: true },
      { source: '/category/stories/:path*', destination: '/portfolio', permanent: true },
      { source: '/category/:slug*', destination: '/blog', permanent: true },
      { source: '/laprima', destination: '/portfolio', permanent: true },
      { source: '/laprima/:path*', destination: '/portfolio', permanent: true },
      { source: '/tag/:slug*', destination: '/blog', permanent: true },
      { source: '/author/:slug*', destination: '/blog', permanent: true },
      { source: '/wp-content/:path*', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
