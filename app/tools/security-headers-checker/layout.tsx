import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Headers Checker",
  description: "Check any website's HTTP security headers — HSTS, CSP, X-Frame-Options, and more — and get a letter grade with fixes for what's missing.",
  alternates: { canonical: "https://bizshieldpro.co/tools/security-headers-checker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
