import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phishing URL Checker",
  description: "Paste any link to check it for common phishing red flags — IP-literal hosts, punycode lookalikes, brand impersonation, URL shorteners, and more. 100% client-side.",
  alternates: { canonical: "https://bizshieldpro.co/tools/phishing-url-checker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
