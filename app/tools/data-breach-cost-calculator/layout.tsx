import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Breach Cost Calculator for Small Business",
  description: "Estimate what a data breach could cost your business based on records exposed, industry, and detection time. Based on IBM Cost of a Data Breach research averages.",
  alternates: { canonical: "https://bizshieldpro.co/tools/data-breach-cost-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
