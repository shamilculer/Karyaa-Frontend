/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      // 💡 NEW ADDITION: Allow fetching images from your local development server
      {
        protocol: "http", // Use http since localhost usually runs on http
        hostname: "localhost",
        port: "3000", // Specify the port your app is running on
        pathname: "/categories/**", // Optional: restrict to a path pattern
      },
      // 💡 ADDITIONAL FIX for the banner images, since they are absolute URLs
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
