"use client";

import { useState } from "react";
import Link from "next/link";

async function sha1Hex(text: string) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-1", enc);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

type Status = "idle" | "loading" | "safe" | "found" | "error";

export default function LeakedPasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [count, setCount] = useState(0);

  const check = async () => {
    if (!password) return;
    setStatus("loading");
    try {
      const hash = await sha1Hex(password);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!res.ok) throw new Error("bad response");
      const text = await res.text();
      const match = text.split("\n").find((line) => line.split(":")[0] === suffix);
      if (match) {
        setCount(parseInt(match.split(":")[1].trim(), 10) || 0);
        setStatus("found");
      } else {
        setStatus("safe");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="pt-10 pb-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
          <Link href="/" className="hover:text-bz-blue">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-bz-blue">Free Tools</Link>
          <span>/</span>
          <span style={{ color: "#3A4570" }}>Leaked Password Checker</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          Leaked Password Checker
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: "#8A94C0" }}>
          Check whether a password has appeared in a known data breach, powered by HaveIBeenPwned&apos;s database of 12+ billion breached credentials.
        </p>

        <div className="flex items-center gap-2 mb-6 text-xs px-3 py-2 rounded-lg w-fit" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}>
          <span>🔒</span> Only a partial hash (5 characters) is sent — your full password never leaves your browser
        </div>

        <div className="relative mb-4">
          <input
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setStatus("idle"); }}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="Type or paste a password to check..."
            className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all"
            style={{ background: "#0D1020", border: "2px solid #1D2340", color: "#EEF2FF", fontFamily: "monospace", letterSpacing: password && !showPwd ? "0.2em" : "normal" }}
            autoComplete="new-password"
            spellCheck={false}
          />
          <button onClick={() => setShowPwd((v) => !v)} type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#5B6899" }}>
            {showPwd ? "Hide" : "Show"}
          </button>
        </div>

        <button onClick={check} disabled={!password || status === "loading"} type="button"
          className="w-full text-sm font-semibold px-4 py-3.5 rounded-lg transition-all disabled:opacity-40 mb-6"
          style={{ background: "#2563EB", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
          {status === "loading" ? "Checking…" : "Check Password"}
        </button>

        {status === "found" && (
          <div className="p-5 rounded-xl flex items-start gap-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold mb-1" style={{ color: "#FCA5A5" }}>This password has been exposed</p>
              <p className="text-sm" style={{ color: "#FCA5A5" }}>
                It has appeared <strong>{count.toLocaleString()}</strong> time{count === 1 ? "" : "s"} in known data breaches. Change it immediately on any account where it&apos;s used, and never reuse it.
              </p>
            </div>
          </div>
        )}

        {status === "safe" && (
          <div className="p-5 rounded-xl flex items-start gap-3" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)" }}>
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-bold mb-1" style={{ color: "#6EE7B7" }}>Not found in known breaches</p>
              <p className="text-sm" style={{ color: "#6EE7B7" }}>
                This password wasn&apos;t found in the breach database. That doesn&apos;t guarantee it&apos;s strong — check its strength with our{" "}
                <Link href="/tools/password-strength-checker" style={{ textDecoration: "underline" }}>Password Strength Checker</Link>.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="p-5 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-sm" style={{ color: "#FCA5A5" }}>Couldn&apos;t reach the breach database right now. Try again in a moment.</p>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose-bz">
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>How the K-Anonymity Check Protects Your Password</h2>
          <p style={{ color: "#8A94C0" }}>
            This tool never sends your actual password anywhere. Your browser hashes it locally with SHA-1, then sends only the first 5 characters of that hash to HaveIBeenPwned&apos;s API. The API returns every breached password hash sharing that same 5-character prefix — typically hundreds of them — and the match is found locally in your browser. HaveIBeenPwned never sees your full hash or password, a technique called k-anonymity.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>What to Do If Your Password Is Exposed</h2>
          <p style={{ color: "#8A94C0" }}>
            Change it immediately everywhere it&apos;s used — attackers run breached password lists against every major login page automatically (credential stuffing), so exposure on one site puts every account sharing that password at risk. Generate a fresh, unique replacement with our{" "}
            <Link href="/tools/password-generator" style={{ color: "#3B82F6" }}>Password Generator</Link>, and store it in a password manager so you&apos;re never tempted to reuse it.
          </p>
        </div>

        <div className="mt-8 p-5 rounded-xl" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "#3B82F6" }}>Best Overall</p>
          <p className="font-bold mb-2" style={{ color: "#EEF2FF" }}>1Password Teams</p>
          <p className="text-sm mb-3" style={{ color: "#8A94C0" }}>Automatically alerts you when a saved password appears in a new breach.</p>
          <a href="https://1password.com/teams/" target="_blank" rel="noopener sponsored"
            className="inline-block text-sm font-semibold px-5 py-2.5 rounded-lg"
            style={{ background: "#2563EB", color: "#fff" }}>
            Try 1Password Free for 14 Days →
          </a>
        </div>
      </div>
    </div>
  );
}
