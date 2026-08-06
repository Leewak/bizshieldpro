import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaked Password Checker — Have I Been Pwned Lookup",
  description: "Check if your password has appeared in a known data breach. Uses HaveIBeenPwned's k-anonymity API — only a partial hash is ever sent, your full password never leaves your browser.",
  alternates: { canonical: "https://bizshieldpro.co/tools/leaked-password-checker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
