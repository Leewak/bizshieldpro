import type { NextConfig } from "next";

// Kept permissive on script/style (unsafe-inline) rather than nonce-based CSP:
// nonces require every page to render dynamically (no SSG/ISR), which would
// gut this content site's performance and Vercel CDN caching. connect-src
// includes cloudflare-dns.com + api.pwnedpasswords.com for the DMARC and
// leaked-password checker tools' client-side lookups. bauval.org is the
// Adsterra ad domain (blog-farm account); if Adsterra moves domains, update here.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://bauval.org https://abscloud.org https://www.clarity.ms https://scripts.clarity.ms https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://adservice.google.com https://www.google.com https://*.adtrafficquality.google https://fundingchoicesmessages.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://bauval.org https://abscloud.org https://araplhn.org https://cdn.show-sb.com https://cdn.show-creative1.com https://*.clarity.ms https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://cloudflare-dns.com https://api.pwnedpasswords.com;
  frame-src 'self' https://bauval.org https://abscloud.org https://araplhn.org https://cdn.show-sb.com https://cdn.show-creative1.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://fundingchoicesmessages.google.com https://*.adtrafficquality.google;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
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
