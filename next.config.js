/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

// Allow the preview origin for dev assets/HMR
if (process.env.BASE44_PREVIEW_MODE === '1' && process.env.BASE44_PUBLIC_HOST_SUFFIX) {
  const origins = [`https://3000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}`];
  nextConfig.allowedDevOrigins = origins;
}

module.exports = nextConfig;
