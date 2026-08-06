"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";

const CHARSETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

const AMBIGUOUS = "il1Lo0O";

function generatePassword(length: number, opts: { lower: boolean; upper: boolean; digits: boolean; symbols: boolean; excludeAmbiguous: boolean }) {
  let pool = "";
  if (opts.lower) pool += CHARSETS.lower;
  if (opts.upper) pool += CHARSETS.upper;
  if (opts.digits) pool += CHARSETS.digits;
  if (opts.symbols) pool += CHARSETS.symbols;
  if (opts.excludeAmbiguous) pool = pool.split("").filter((c) => !AMBIGUOUS.includes(c)).join("");
  if (!pool) return "";

  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) out += pool[bytes[i] % pool.length];
  return out;
}

function entropyBits(length: number, opts: { lower: boolean; upper: boolean; digits: boolean; symbols: boolean; excludeAmbiguous: boolean }) {
  let size = 0;
  if (opts.lower) size += 26;
  if (opts.upper) size += 26;
  if (opts.digits) size += 10;
  if (opts.symbols) size += CHARSETS.symbols.length;
  if (opts.excludeAmbiguous) size = Math.max(1, size - AMBIGUOUS.length);
  if (!size) return 0;
  return Math.round(length * Math.log2(size));
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const opts = { lower, upper, digits, symbols, excludeAmbiguous };
  const bits = useMemo(() => entropyBits(length, opts), [length, lower, upper, digits, symbols, excludeAmbiguous]);
  const anyChecked = lower || upper || digits || symbols;

  const regenerate = useCallback(() => {
    setPassword(generatePassword(length, opts));
    setCopied(false);
  }, [length, lower, upper, digits, symbols, excludeAmbiguous]);

  if (!password && anyChecked && typeof window !== "undefined") {
    setPassword(generatePassword(length, opts));
  }

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const strengthLabel = bits >= 80 ? { l: "Excellent", c: "#8B5CF6" } : bits >= 60 ? { l: "Strong", c: "#10B981" } : bits >= 40 ? { l: "Good", c: "#3B82F6" } : { l: "Weak", c: "#EF4444" };

  return (
    <div className="pt-10 pb-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
          <Link href="/" className="hover:text-bz-blue">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-bz-blue">Free Tools</Link>
          <span>/</span>
          <span style={{ color: "#3A4570" }}>Password Generator</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          Secure Password Generator
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: "#8A94C0" }}>
          Instantly generate a strong, truly random password using your browser&apos;s built-in cryptographic random number generator. <strong style={{ color: "#10B981" }}>Nothing is ever sent to a server.</strong>
        </p>

        <div className="flex items-center gap-2 mb-6 text-xs px-3 py-2 rounded-lg w-fit" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}>
          <span>🔒</span> Generated with Web Crypto API — never transmitted or logged
        </div>

        {/* Output */}
        <div className="relative mb-6">
          <div
            className="w-full px-5 py-4 rounded-xl text-lg break-all select-all"
            style={{ background: "#0D1020", border: `2px solid ${anyChecked ? strengthLabel.c + "60" : "#1D2340"}`, color: "#EEF2FF", fontFamily: "monospace", minHeight: "3.5rem" }}
          >
            {anyChecked ? password : "Select at least one character type below"}
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={regenerate} disabled={!anyChecked} type="button"
              className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all disabled:opacity-40"
              style={{ background: "#2563EB", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
              ↻ Generate New
            </button>
            <button onClick={copy} disabled={!password} type="button"
              className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all disabled:opacity-40"
              style={{ background: copied ? "#10B981" : "#1D2340", color: "#EEF2FF" }}>
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Length */}
        <div className="p-5 rounded-xl mb-4" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: "#CBD5F0" }}>Length</span>
            <span className="text-sm font-bold" style={{ color: strengthLabel.c }}>{length} characters</span>
          </div>
          <input type="range" min={8} max={64} value={length}
            onChange={(e) => { setLength(Number(e.target.value)); setTimeout(regenerate, 0); }}
            className="w-full" />
          <div className="flex justify-between text-xs mt-2" style={{ color: "#3A4570" }}>
            <span>8</span><span>64</span>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Lowercase (a-z)", checked: lower, set: setLower },
            { label: "Uppercase (A-Z)", checked: upper, set: setUpper },
            { label: "Numbers (0-9)", checked: digits, set: setDigits },
            { label: "Symbols (!@#...)", checked: symbols, set: setSymbols },
          ].map((o) => (
            <label key={o.label} className="flex items-center gap-2 p-3 rounded-lg cursor-pointer text-sm" style={{ background: "#0D1020", border: "1px solid #1D2340", color: "#8A94C0" }}>
              <input type="checkbox" checked={o.checked} onChange={(e) => { o.set(e.target.checked); setTimeout(regenerate, 0); }} />
              {o.label}
            </label>
          ))}
          <label className="col-span-2 flex items-center gap-2 p-3 rounded-lg cursor-pointer text-sm" style={{ background: "#0D1020", border: "1px solid #1D2340", color: "#8A94C0" }}>
            <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => { setExcludeAmbiguous(e.target.checked); setTimeout(regenerate, 0); }} />
            Exclude ambiguous characters (i, l, 1, L, o, 0, O)
          </label>
        </div>

        {anyChecked && (
          <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: strengthLabel.c + "12", border: `1px solid ${strengthLabel.c}40` }}>
            <span className="text-sm font-semibold" style={{ color: strengthLabel.c }}>{strengthLabel.l} — {bits} bits of entropy</span>
            <span className="text-xs" style={{ color: "#5B6899" }}>12+ chars, all types recommended</span>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose-bz">
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Why Random Generation Beats Anything You&apos;d Think Up</h2>
          <p style={{ color: "#8A94C0" }}>
            Humans are bad at picking randomness — patterns, keyboard walks, and personal references always leak in. This generator uses <code>crypto.getRandomValues()</code>, the same cryptographically secure random number source browsers use for encryption keys, so every character is drawn independently with no bias attackers can model.
          </p>
          <p style={{ color: "#8A94C0" }}>
            A 16-character password using all four character types has roughly 100 bits of entropy — effectively uncrackable by brute force with current or foreseeable computing power. Length matters more than complexity: a 20-character lowercase-only password can still beat a 10-character mixed one.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Generate, Then Store — Don&apos;t Memorize</h2>
          <p style={{ color: "#8A94C0" }}>
            A random 16+ character password isn&apos;t meant to be memorized — it&apos;s meant to be saved in a password manager and reused nowhere else. Generate a unique one for every account. If you need to check how strong an existing password is instead, try our{" "}
            <Link href="/tools/password-strength-checker" style={{ color: "#3B82F6" }}>Password Strength Checker</Link>{" "}
            or check whether it&apos;s already been exposed in a breach with our{" "}
            <Link href="/tools/leaked-password-checker" style={{ color: "#3B82F6" }}>Leaked Password Checker</Link>.
          </p>
        </div>

        <div className="mt-8 p-5 rounded-xl" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "#3B82F6" }}>Best Overall</p>
          <p className="font-bold mb-2" style={{ color: "#EEF2FF" }}>1Password Teams</p>
          <p className="text-sm mb-3" style={{ color: "#8A94C0" }}>Built-in generator plus secure storage and sharing for your whole team.</p>
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
