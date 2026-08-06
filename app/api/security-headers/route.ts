import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns/promises";

export const runtime = "nodejs";

const BLOCKED_HOSTNAMES = /^(localhost|.*\.local|.*\.internal|.*\.lan|.*\.arpa)$/i;

function ipToLong(ip: string): number | null {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return null;
  return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

function isPrivateIPv4(ip: string): boolean {
  const long = ipToLong(ip);
  if (long === null) return false;
  const ranges: [string, string][] = [
    ["10.0.0.0", "10.255.255.255"],
    ["172.16.0.0", "172.31.255.255"],
    ["192.168.0.0", "192.168.255.255"],
    ["127.0.0.0", "127.255.255.255"],
    ["169.254.0.0", "169.254.255.255"],
    ["0.0.0.0", "0.255.255.255"],
    ["100.64.0.0", "100.127.255.255"],
  ];
  return ranges.some(([start, end]) => {
    const s = ipToLong(start)!;
    const e = ipToLong(end)!;
    return long >= s && long <= e;
  });
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80") || lower.startsWith("::ffff:127.");
}

async function assertPublicHost(hostname: string) {
  if (BLOCKED_HOSTNAMES.test(hostname)) throw new Error("blocked_host");
  const addresses = await dns.lookup(hostname, { all: true });
  if (addresses.length === 0) throw new Error("no_address");
  for (const { address, family } of addresses) {
    if (family === 4 && isPrivateIPv4(address)) throw new Error("blocked_host");
    if (family === 6 && isPrivateIPv6(address)) throw new Error("blocked_host");
  }
}

async function safeFetch(url: URL, hopsLeft: number): Promise<Response> {
  await assertPublicHost(url.hostname);
  const res = await fetch(url.toString(), {
    method: "GET",
    redirect: "manual",
    signal: AbortSignal.timeout(8000),
    headers: { "user-agent": "BizShieldPro-SecurityHeadersChecker/1.0 (+https://bizshieldpro.co/tools/security-headers-checker)" },
  });
  const isRedirect = res.status >= 300 && res.status < 400;
  const location = res.headers.get("location");
  if (isRedirect && location && hopsLeft > 0) {
    const next = new URL(location, url);
    if (next.protocol !== "http:" && next.protocol !== "https:") return res;
    return safeFetch(next, hopsLeft - 1);
  }
  return res;
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const raw = (body.url || "").trim();
  if (!raw) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  let target: URL;
  try {
    target = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return NextResponse.json({ error: "That doesn't look like a valid URL" }, { status: 400 });
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json({ error: "Only http/https URLs are supported" }, { status: 400 });
  }

  try {
    const res = await safeFetch(target, 3);
    const headers: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return NextResponse.json({ status: res.status, finalUrl: res.url || target.toString(), headers });
  } catch (e) {
    if (e instanceof Error && e.message === "blocked_host") {
      return NextResponse.json({ error: "This host can't be checked" }, { status: 400 });
    }
    return NextResponse.json({ error: "Couldn't reach that site — check the URL and try again" }, { status: 502 });
  }
}
