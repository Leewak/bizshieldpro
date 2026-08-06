import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cybersecurity Risk Self-Assessment Quiz for Small Business",
  description: "15-question scored self-assessment covering passwords, backups, phishing readiness, and access control. Get an instant risk score and a prioritized action list — 100% client-side.",
  alternates: { canonical: "https://bizshieldpro.co/tools/cybersecurity-risk-assessment" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
