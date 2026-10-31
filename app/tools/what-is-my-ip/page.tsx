"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ToolShell, { box, mono } from "@/components/ToolShell";

export default function Page() {
  const [v4, setV4] = useState("checking…");
  const [v6, setV6] = useState("checking…");
  const [info, setInfo] = useState<[string, string][]>([]);
  useEffect(() => {
    fetch("https://api.ipify.org?format=json").then((r) => r.json()).then((d) => setV4(d.ip)).catch(() => setV4("not available"));
    fetch("https://api64.ipify.org?format=json").then((r) => r.json()).then((d) => setV6(d.ip.includes(":") ? d.ip : "no IPv6 connection")).catch(() => setV6("not available"));
    const n = navigator as Navigator & { doNotTrack?: string; deviceMemory?: number };
    setInfo([
      ["Browser", n.userAgent],
      ["Languages", (n.languages || [n.language]).join(", ")],
      ["Time zone", Intl.DateTimeFormat().resolvedOptions().timeZone],
      ["Screen", `${screen.width} × ${screen.height} (${window.devicePixelRatio}x)`],
      ["CPU cores", String(n.hardwareConcurrency ?? "unknown")],
      ["Do Not Track", n.doNotTrack === "1" ? "on" : "off"],
      ["Cookies enabled", n.cookieEnabled ? "yes" : "no"],
    ]);
  }, []);
  return (
    <ToolShell slug="what-is-my-ip" privacy="Your IP is looked up via api.ipify.org; nothing is stored by us"
      intro={<p>This is the public IP address websites see when you visit them, plus the details your browser shares automatically. If you use a VPN, the address below should belong to the VPN provider, not your internet provider.</p>}
      howTo={[
        { h: "What your IP address reveals", p: <p>Your public IP usually points to your internet provider and an approximate location, often the city or region rather than your street. Websites, ad networks and anyone running a server you connect to can log it. A VPN or Tor hides it from the sites you visit, while your VPN provider can then see your traffic instead — so choose one you trust. See our guide to <Link href="/category/tools" style={{ color: "#3B82F6" }}>security tools for small business</Link>.</p> },
        { h: "Fingerprinting: more than your IP", p: <p>Even without cookies, the combination of browser version, language, time zone, screen size and other details can make a device recognisable. Keeping your browser updated and using privacy-focused settings reduces how unique you look.</p> },
      ]}
      faq={[
        { q: "Why do I have two IP addresses?", a: "Many connections have both an IPv4 and an IPv6 address. Websites use whichever your connection and their server both support." },
        { q: "Does a VPN change my IP?", a: "Yes. With a VPN connected, sites see the VPN server's IP. If this page still shows your provider's address, the VPN is not routing your traffic." },
        { q: "Is my IP address private information?", a: "It can be linked to you by your internet provider, and in the EU it is treated as personal data. It is visible to every site you visit, so it is not secret." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {[["IPv4", v4], ["IPv6", v6]].map(([k, v]) => (
          <div key={k} className="p-5 rounded-xl" style={box}>
            <div className="text-xs mb-1" style={{ color: "#5B6899" }}>Your public {k}</div>
            <div className="text-lg break-all" style={{ ...mono, color: "#EEF2FF" }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={box}>
        {info.map(([k, v]) => (
          <div key={k} className="flex gap-4 px-4 py-2.5 text-sm" style={{ borderBottom: "1px solid #1D2340" }}>
            <span className="w-36 shrink-0" style={{ color: "#5B6899" }}>{k}</span><span className="break-all" style={{ color: "#CBD5F0" }}>{v}</span>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
