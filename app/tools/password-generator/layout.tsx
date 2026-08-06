import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Password Generator",
  description: "Generate strong, random passwords instantly. Choose length and character types — everything runs in your browser using the Web Crypto API, nothing is ever transmitted.",
  alternates: { canonical: "https://bizshieldpro.co/tools/password-generator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
