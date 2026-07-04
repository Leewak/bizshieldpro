import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bizshieldpro.co" }],
        destination: "https://bizshieldpro.co/:path*",
        permanent: true,
      },
      { source: "/blog/best-vpn-for-small-business", destination: "/blog/best-vpn-small-business", permanent: true },
      { source: "/blog/password-manager-for-teams", destination: "/blog/best-password-manager-teams", permanent: true },
      { source: "/blog/how-to-prevent-phishing-attacks-small-business", destination: "/blog/how-to-prevent-phishing-attacks", permanent: true },
    ];
  },
};

export default nextConfig;
