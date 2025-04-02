/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  webpack: (config: { resolve: { fallback: { fs: boolean; net: boolean; tls: boolean; }; }; }) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false 
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.google.com",
              "connect-src 'self' https://maps.googleapis.com https://maps.google.com",
              "style-src 'self' 'unsafe-inline' https://maps.googleapis.com https://fonts.googleapis.com",
              "style-src-elem 'self' 'unsafe-inline' https://maps.googleapis.com https://fonts.googleapis.com",
              "img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com",
              "font-src 'self' https://fonts.gstatic.com",
            ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;