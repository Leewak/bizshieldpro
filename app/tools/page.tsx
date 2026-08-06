import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Cybersecurity Tools for Small Business",
  description: "Free browser-based security tools for small businesses. Check passwords, scan for breaches, verify email authentication, assess risk, and more — 100% client-side, nothing is ever transmitted.",
  alternates: { canonical: "https://bizshieldpro.co/tools" },
};

const tools = [
  {
    href: "/tools/password-strength-checker",
    title: "Password Strength Checker",
    description: "Instantly score any password using entropy calculation, pattern detection, and a common-password database. Your password never leaves your browser.",
    icon: "🔐",
    color: "#8B5CF6",
  },
  {
    href: "/tools/password-generator",
    title: "Password Generator",
    description: "Generate strong, truly random passwords with the Web Crypto API. Choose length and character types — nothing is ever transmitted.",
    icon: "🎲",
    color: "#3B82F6",
  },
  {
    href: "/tools/leaked-password-checker",
    title: "Leaked Password Checker",
    description: "Check if a password has appeared in a known data breach using HaveIBeenPwned's k-anonymity API. Only a partial hash is ever sent.",
    icon: "🕵️",
    color: "#F97316",
  },
  {
    href: "/tools/phishing-email-analyzer",
    title: "Phishing Email Analyzer",
    description: "Paste any suspicious email and get an instant red-flag score. Checks for urgency language, credential requests, suspicious links, and 40+ phishing patterns.",
    icon: "🎣",
    color: "#EF4444",
  },
  {
    href: "/tools/phishing-url-checker",
    title: "Phishing URL Checker",
    description: "Paste any link before you click it. Scans for IP-literal hosts, punycode lookalikes, brand impersonation, and link shorteners.",
    icon: "🔗",
    color: "#EAB308",
  },
  {
    href: "/tools/dmarc-spf-checker",
    title: "SPF, DKIM & DMARC Checker",
    description: "Check any domain's email authentication setup instantly. Missing records let attackers spoof your domain and hurt deliverability.",
    icon: "📧",
    color: "#10B981",
  },
  {
    href: "/tools/security-headers-checker",
    title: "Security Headers Checker",
    description: "Check any website's HTTP security headers — HSTS, CSP, X-Frame-Options — and get a letter grade with fixes for what's missing.",
    icon: "🛡️",
    color: "#3B82F6",
  },
  {
    href: "/tools/cybersecurity-risk-assessment",
    title: "Cybersecurity Risk Self-Assessment",
    description: "15-question scored quiz covering passwords, backups, phishing readiness, and access control. Get an instant risk score and action list.",
    icon: "📋",
    color: "#8B5CF6",
  },
  {
    href: "/tools/data-breach-cost-calculator",
    title: "Data Breach Cost Calculator",
    description: "Estimate what a breach could cost your business based on records exposed, industry, and detection time.",
    icon: "💰",
    color: "#EF4444",
  },
];

export default function ToolsPage() {
  return (
    <div className="pt-12 pb-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <p className="text-sm font-semibold mb-3" style={{ color: "#3B82F6", letterSpacing: "0.08em", textTransform: "uppercase" }}>Free Tools</p>
        <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          Free Cybersecurity Tools for Small Business
        </h1>
        <p className="text-lg mb-10" style={{ color: "#8A94C0" }}>
          100% browser-based. No account required. Nothing you type is ever sent to a server.
        </p>

        <div className="grid gap-5">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}
              className="block p-6 rounded-2xl transition-all hover:scale-[1.01]"
              style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
              <div className="flex items-start gap-4">
                <div className="text-3xl shrink-0">{tool.icon}</div>
                <div>
                  <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>{tool.title}</h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#8A94C0" }}>{tool.description}</p>
                  <span className="inline-block mt-4 text-sm font-semibold" style={{ color: tool.color }}>
                    Launch tool →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1D2340", color: "#5B6899" }}>
          <strong style={{ color: "#8A94C0" }}>Privacy note:</strong> All processing happens entirely in your browser using JavaScript. No passwords, email text, or other input is transmitted to any server, stored, or logged. These tools are designed for small business owners who need quick security checks without the risk of exposing sensitive information.
        </div>
      </div>
    </div>
  );
}
