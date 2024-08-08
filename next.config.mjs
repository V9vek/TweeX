/** @type {import('next').NextConfig} */

/**
 * In NextJS 15, Client side router does not cache pages at client side, for like 30 sec
 * It was not likely, as user will see STALE data for like 30 seconds
 * But in this project, we are using React Query to refresh the feed, and the other data is not changing
 * much, so enabling that client side router caching
 */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;
