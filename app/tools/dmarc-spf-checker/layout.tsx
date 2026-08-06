import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SPF, DKIM & DMARC Record Checker",
  description: "Check any domain's SPF and DMARC email authentication records instantly. Look up DKIM by selector. Queries public DNS only — no login, no software to install.",
  alternates: { canonical: "https://bizshieldpro.co/tools/dmarc-spf-checker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
