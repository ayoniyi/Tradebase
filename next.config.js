/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
    // domains: ["cryptologos.cc"],
    // domains: [
    //   "firebasestorage.googleapis.com/v0/b/tradebase-720bc.appspot.com/",
    // ],
  },
};

// export default nextConfig;
module.exports = nextConfig;
