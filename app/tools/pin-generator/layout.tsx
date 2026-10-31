import type { Metadata } from "next";
import { toolMetadata } from "@/lib/tools";

export const metadata: Metadata = toolMetadata("pin-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
