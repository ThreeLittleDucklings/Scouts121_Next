const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.scouts121.be',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/Verhuur/:id',
        destination: '/verhuur/:id',
        permanent: true,
      },
    ]
  },
}

export default nextConfig