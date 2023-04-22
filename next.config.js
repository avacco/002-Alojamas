/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [ // Dominios de confianza para imagenes de avatar.
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      "res.cloudinary.com"
    ]
  }
}

module.exports = nextConfig
