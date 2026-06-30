import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "BizShield Pro — Cybersecurity Made Simple for Small Business", template: "%s | BizShield Pro" },
  description: "Cybersecurity for Small Business",
  metadataBase: new URL("https://bizshieldpro.co"),
};

const navLinks = [
  { label: "Threats", href: "/category/threats" },
  { label: "Tools", href: "/category/tools" },
  { label: "Compliance", href: "/category/compliance" },
  { label: "Checklists", href: "/category/checklists" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* GA4 — plain <script> tags so they appear in raw HTML for Google's tag detector */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6QS5CNX8F7" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-6QS5CNX8F7');` }} />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9394532963824272" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script id="clarity-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","xf0yrcuihu");` }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased" style={{ background: "#0A0C14", color: "#EEF2FF" }}>
        <header style={{ background: "rgba(13,16,32,0.95)", borderBottom: "1px solid #1D2340", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
          <nav className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
            <a href="/" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, color: "#EEF2FF", fontSize: "1rem", letterSpacing: "-0.02em" }}>
              BizShield<span style={{ color: "#3B82F6" }}>Pro</span>
            </a>
            <div className="hidden md:flex items-center gap-5">
              {navLinks.map(({ label, href }) => (
                <a key={label} href={href} className="text-sm transition-colors" style={{ color: "#5B6899" }}>{label}</a>
              ))}
            </div>
            <a href="/blog" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: "#2563EB", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
              All Guides
            </a>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer style={{ background: "#0D1020", borderTop: "1px solid #1D2340" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mb-6">
              {[["Privacy Policy","/privacy"],["Cookie Policy","/cookie-policy"],["Affiliate Disclosure","/affiliate-disclosure"],["Disclaimer","/disclaimer"],["Terms of Use","/terms"],["Contact","/contact"]].map(([label,href])=>(
                <a key={label} href={href} className="text-xs transition-colors" style={{ color: "#3A4570" }}>{label}</a>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-bold" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>
                BizShield<span style={{ color: "#3B82F6" }}>Pro</span>
              </span>
              <p className="text-xs" style={{ color: "#1D2340" }}>
                &copy; {new Date().getFullYear()} BizShieldPro. Some links may be affiliate links.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
