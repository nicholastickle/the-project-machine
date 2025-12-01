/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily keep disabled for Design Sprint - will fix properly later
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: false,
  },
}

export default nextConfig
