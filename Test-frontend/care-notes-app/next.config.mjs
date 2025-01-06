/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for the container image.
  output: 'standalone',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
