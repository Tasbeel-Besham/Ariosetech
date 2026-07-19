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
      // ── From the GSC 404 export (Jul 2026) ──
      // Old top-level service pages → new /services/* structure
      { source: '/wordpress', destination: '/services/wordpress', permanent: true },
      { source: '/wordpress/:path*', destination: '/services/wordpress', permanent: true },
      { source: '/woocommerce', destination: '/services/woocommerce', permanent: true },
      { source: '/woocommerce/:path*', destination: '/services/woocommerce', permanent: true },
      { source: '/shopify', destination: '/services/shopify', permanent: true },
      { source: '/shopify/:path*', destination: '/services/shopify', permanent: true },
      { source: '/seo', destination: '/services/seo', permanent: true },
      { source: '/seo/:path*', destination: '/services/seo', permanent: true },
      // Theme detectors used to live at the root → now under /tools
      { source: '/wordpress-theme-detector', destination: '/tools/wordpress-theme-detector', permanent: true },
      { source: '/wordpress-theme-detector/:path*', destination: '/tools/wordpress-theme-detector', permanent: true },
      { source: '/shopify-theme-detector', destination: '/tools/shopify-theme-detector', permanent: true },
      { source: '/shopify-theme-detector/:path*', destination: '/tools/shopify-theme-detector', permanent: true },
      // Old two-level portfolio URLs (/portfolio/wordpress/project-name)
      { source: '/portfolio/:category/:slug+', destination: '/portfolio', permanent: true },
      // Blog slugs that never existed on this build
      { source: '/blog/woocommerce-payment-gateways-guide', destination: '/blog', permanent: true },
      { source: '/blog/shopify-vs-woocommerce-for-fashion', destination: '/blog', permanent: true },
      // Discovered via GSC referring-pages: old WP service pages named "*-ariosetech"
      { source: '/wordpress-services-ariosetech', destination: '/services/wordpress', permanent: true },
      { source: '/wordpress-services-ariosetech/:path*', destination: '/services/wordpress', permanent: true },
      { source: '/:slug(.*\\-ariosetech)', destination: '/services', permanent: true },
      // ── Full legacy-WordPress taxonomy sweep ──
      // Date archives (/2023/05/some-post/, /2024/, /2024/11/)
      { source: '/:year(\\d{4})/:month(\\d{2})/:slug*', destination: '/blog', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})', destination: '/blog', permanent: true },
      { source: '/:year(\\d{4})', destination: '/blog', permanent: true },
      // RSS/Atom feeds
      { source: '/feed', destination: '/blog', permanent: true },
      { source: '/feed/:path*', destination: '/blog', permanent: true },
      { source: '/comments/feed', destination: '/blog', permanent: true },
      // WP core paths that bots and stale links still hit
      { source: '/wp-admin/:path*', destination: '/', permanent: true },
      { source: '/wp-includes/:path*', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: true },
      { source: '/xmlrpc.php', destination: '/', permanent: true },
      // Paginated archives (/page/2, /blog/page/3)
      { source: '/page/:num(\\d+)', destination: '/blog', permanent: true },
      { source: '/blog/page/:num(\\d+)', destination: '/blog', permanent: true },
      // Common WP leftovers
      { source: '/sample-page', destination: '/', permanent: true },
      { source: '/hello-world', destination: '/blog', permanent: true },
      { source: '/portfolio-item/:slug*', destination: '/portfolio', permanent: true },
      // Query-string permalinks (?p=123 / ?page_id=7) on the root
      { source: '/', has: [{ type: 'query', key: 'p' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'page_id' }], destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
