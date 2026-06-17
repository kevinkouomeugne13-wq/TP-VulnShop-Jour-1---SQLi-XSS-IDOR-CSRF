/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ On force Next.js à traiter alasql comme un package externe au serveur
  serverExternalPackages: ["alasql"],
};

export default nextConfig;

