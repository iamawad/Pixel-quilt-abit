/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
  experimental: { typedRoutes: true },
};
export default nextConfig;
