import type { Metadata } from "next";
import { toolMetadata } from "@/lib/tools";

export const metadata: Metadata = toolMetadata("what-is-my-ip");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
