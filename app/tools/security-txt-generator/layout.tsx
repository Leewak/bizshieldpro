import type { Metadata } from "next";
import { toolMetadata } from "@/lib/tools";

export const metadata: Metadata = toolMetadata("security-txt-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
