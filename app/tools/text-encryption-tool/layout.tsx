import type { Metadata } from "next";
import { toolMetadata } from "@/lib/tools";

export const metadata: Metadata = toolMetadata("text-encryption-tool");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
