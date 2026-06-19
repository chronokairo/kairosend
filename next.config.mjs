/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Kairosend is a local-first desktop client. Each user supplies their own
  // Resend API key (stored locally); there is no shared server secret.
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
