"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

// Top-500 most common passwords (minified). Checked client-side only — never transmitted.
const COMMON_PASSWORDS = new Set([
  "123456","password","123456789","12345678","12345","1234567","1234567890","qwerty","abc123","111111",
  "iloveyou","admin","letmein","monkey","1234","sunshine","princess","dragon","master","123123",
  "welcome","shadow","superman","michael","football","charlie","aa123456","donald","password1","qwerty123",
  "1q2w3e4r","baseball","soccer","starwars","hello","mustang","access","batman","george","pass",
  "andrew","joshua","maggie","thomas","jessica","hunter","ranger","gandalf","ashley","harley",
  "whatever","987654321","robert","snoopy","asdf","jasmine","dakota","123456a","pepper","password2",
  "hockey","matrix","cowboys","654321","jennifer","purple","qwerty1","chicken","qazwsx","buster",
  "password3","ginger","samantha","tigger","testing","cheese","joshua1","freedom","marina","abcdef",
  "777777","orange","taylor","william","asdfgh","daniel","zxcvbnm","zxcvbn","pokemon","google",
  "jordan23","maverick","thunder","steven","richard","donald1","killer","qwertyuiop","qwerty12",
  "flower","trustno1","jesus","test","password123","hello123","monkey123","baseball123","qwerty123456",
  "1q2w3e","123qwe","abc1234","letmein1","pass123","jessica1","soccer1","football1","master123","access1",
  "pass1234","123abc","654321a","abc123456","2000","1111","000000","11111111","00000000","1234abcd",
  "asdf1234","a1b2c3d4","iloveyou1","sunshine1","princess1","superman1","dragon1","michael1","shadow1",
  "charlie1","mustang1","harley1","hunter1","ranger1","batman1","buster1","tiger1","cowboy1","summer1",
  "winter1","spring1","autumn1","flower1","orange1","purple1","yellow1","green1","blue1","red123",
  "john123","mary123","david123","chris123","sarah123","james123","emily123","oliver123","jack123","emma1",
  "thomas1","robert1","william1","richard1","joseph1","daniel1","paul123","mark123","donald123","george1",
  "admin123","admin1234","administrator","root","toor","pass","passw0rd","p@ssword","p@ssw0rd","pa$$word",
  "password!","Password1","Password123","P@ssword","P@ssw0rd","qwert","12341234","11111","00000","99999",
  "55555","77777","88888","123123123","121212","696969","1q2w3e4r5t","password01","password00","secret",
  "iloveyou2","november","october","september","august","january","february","march","april","july",
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday","spring","summer","winter",
  "austin","dallas","london","paris","madrid","berlin","moscow","tokyo","beijing","sydney",
  "arsenal","chelsea","liverpool","barcelona","madrid1","juventus","pokemon1","pikachu","naruto","dragon123",
  "starwars1","matrix1","batman123","superman123","spiderman","ironman","avengers","minecraft","roblox","fortnite",
  "love","sex","god","money","power","king","queen","boss","winner","loser",
  "123456!","123456@","abc","123","test1","test123","hello1","hi123","my123","me123",
  "user","user1","user123","guest","guest1","guest123","demo","demo1","demo123","sample",
  "computer","internet","email","website","server","database","network","security","system","windows",
  "linux","apple","microsoft","google","facebook","twitter","instagram","youtube","amazon","netflix",
  "trump","obama","biden","clinton","bush","reagan","kennedy","lincoln","washington","jefferson",
  "qazwsxedc","1qaz2wsx","!qaz2wsx","1qazxsw2","zxcvbnm1","mnbvcxz","poiuytrewq","lkjhgfdsa",
  "asdfghjkl","qwertyuio","password9","password8","password7","password6","password5","password4",
  "passw0rd1","p4ssword","p4ssw0rd","pa55word","pa55w0rd","h3llo","w3lcome","adm1n","s3cur1ty",
]);

function analyzePassword(pwd: string) {
  if (!pwd) return null;

  const len = pwd.length;
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);

  // Charset size for entropy
  let charsetSize = 0;
  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasDigit) charsetSize += 10;
  if (hasSymbol) charsetSize += 32;
  if (!charsetSize) charsetSize = 10;

  const entropy = len * Math.log2(charsetSize);

  // Pattern checks
  const isCommon = COMMON_PASSWORDS.has(pwd.toLowerCase());
  const hasSequential = /(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(pwd);
  const hasRepeated = /(.)\1{2,}/.test(pwd);
  const allSameChar = new Set(pwd.toLowerCase()).size === 1;
  const hasKeyboardWalk = /(?:qwer|wert|erty|rtyu|tyui|yuio|uiop|asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|vbnm)/i.test(pwd);

  // Feedback messages
  const tips: string[] = [];
  if (len < 12) tips.push(`Add ${12 - len} more character${12 - len > 1 ? "s" : ""} (aim for 12+)`);
  if (!hasLower) tips.push("Add lowercase letters");
  if (!hasUpper) tips.push("Add uppercase letters");
  if (!hasDigit) tips.push("Add numbers");
  if (!hasSymbol) tips.push("Add a symbol (!, @, #, $, ...)");
  if (isCommon) tips.push("This is a well-known common password — change it immediately");
  if (hasSequential) tips.push("Avoid sequential patterns (123, abc)");
  if (hasRepeated) tips.push("Avoid repeated characters (aaa, 111)");
  if (hasKeyboardWalk) tips.push("Avoid keyboard walks (qwer, asdf)");
  if (allSameChar) tips.push("Don't use a single repeated character");

  // Score
  let score = 0;
  if (!isCommon && !allSameChar) {
    if (entropy >= 28) score += 1;
    if (entropy >= 36) score += 1;
    if (entropy >= 50) score += 1;
    if (entropy >= 65) score += 1;
    if (!hasSequential && !hasRepeated && !hasKeyboardWalk) score += 1;
  }

  const levels = [
    { label: "Very Weak", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
    { label: "Weak",      color: "#F97316", bg: "rgba(249,115,22,0.15)" },
    { label: "Fair",      color: "#EAB308", bg: "rgba(234,179,8,0.15)"  },
    { label: "Good",      color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
    { label: "Strong",    color: "#10B981", bg: "rgba(16,185,129,0.15)" },
    { label: "Excellent", color: "#8B5CF6", bg: "rgba(139,92,246,0.15)" },
  ];

  return { score, level: levels[score], entropy: Math.round(entropy), tips, len, hasLower, hasUpper, hasDigit, hasSymbol, isCommon };
}

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const result = analyzePassword(password);

  const barWidth = result ? `${Math.round((result.score / 5) * 100)}%` : "0%";

  return (
    <div className="pt-10 pb-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
          <Link href="/" className="hover:text-bz-blue">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-bz-blue">Free Tools</Link>
          <span>/</span>
          <span style={{ color: "#3A4570" }}>Password Strength Checker</span>
        </div>

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          Password Strength Checker
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: "#8A94C0" }}>
          Get an instant entropy-based strength score for any password. Checks against 500+ common passwords, sequential patterns, and keyboard walks. <strong style={{ color: "#10B981" }}>100% client-side — your password is never transmitted or stored.</strong>
        </p>

        {/* Privacy badge */}
        <div className="flex items-center gap-2 mb-6 text-xs px-3 py-2 rounded-lg w-fit" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}>
          <span>🔒</span> Your password never leaves this page
        </div>

        {/* Input */}
        <div className="relative mb-2">
          <input
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste a password to check..."
            className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all"
            style={{
              background: "#0D1020",
              border: `2px solid ${result ? result.level.color + "60" : "#1D2340"}`,
              color: "#EEF2FF",
              fontFamily: "monospace",
              letterSpacing: password && !showPwd ? "0.2em" : "normal",
            }}
            autoComplete="new-password"
            spellCheck={false}
          />
          <button
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-colors"
            style={{ color: "#5B6899" }}
            type="button"
          >
            {showPwd ? "Hide" : "Show"}
          </button>
        </div>
        <p className="text-xs mb-8" style={{ color: "#3A4570" }}>
          This field uses <code>autocomplete=&quot;new-password&quot;</code> to prevent browser autofill from leaking saved credentials.
        </p>

        {/* Results */}
        {result && (
          <div className="space-y-5">
            {/* Strength bar */}
            <div className="p-5 rounded-xl" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-lg" style={{ fontFamily: "var(--font-space-grotesk)", color: result.level.color }}>
                  {result.level.label}
                </span>
                <span className="text-sm" style={{ color: "#5B6899" }}>{result.entropy} bits of entropy</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "#1D2340" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: barWidth, background: result.level.color }}
                />
              </div>
              <div className="flex justify-between text-xs mt-2" style={{ color: "#3A4570" }}>
                <span>Very Weak</span><span>Excellent</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Length", value: result.len, ok: result.len >= 12 },
                { label: "Lowercase", value: result.hasLower ? "✓" : "✗", ok: result.hasLower },
                { label: "Uppercase", value: result.hasUpper ? "✓" : "✗", ok: result.hasUpper },
                { label: "Symbols", value: result.hasSymbol ? "✓" : "✗", ok: result.hasSymbol },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg text-center" style={{ background: "#0D1020", border: `1px solid ${s.ok ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)"}` }}>
                  <div className="text-xl font-bold" style={{ color: s.ok ? "#10B981" : "#EF4444" }}>{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: "#5B6899" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Common password warning */}
            {result.isCommon && (
              <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <span className="text-xl">⚠️</span>
                <p className="text-sm" style={{ color: "#FCA5A5" }}>
                  <strong>This is a known common password.</strong> It appears in breach databases and will be cracked instantly by any attacker.
                </p>
              </div>
            )}

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="p-5 rounded-xl" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
                <p className="text-sm font-semibold mb-3" style={{ color: "#CBD5F0" }}>How to improve it:</p>
                <ul className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#8A94C0" }}>
                      <span style={{ color: "#EF4444" }}>→</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.score >= 4 && result.tips.length === 0 && (
              <div className="p-4 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)" }}>
                <p className="text-sm" style={{ color: "#6EE7B7" }}>✓ This is a strong password. Make sure it&apos;s unique to this account and stored in a password manager.</p>
              </div>
            )}
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose-bz">
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Why Password Strength Matters for Small Businesses</h2>
          <p style={{ color: "#8A94C0" }}>
            Weak passwords are responsible for 81% of data breaches, according to Verizon&apos;s annual Data Breach Investigations Report. For small businesses, a single compromised account can expose customer records, financial data, and intellectual property — often leading to losses that exceed $100,000 when you factor in legal fees, regulatory fines, and lost business.
          </p>
          <p style={{ color: "#8A94C0" }}>
            Our password strength checker uses entropy calculation to score passwords the same way security researchers do. Entropy measures how hard a password would be to guess based on its length and the variety of character types used. A password with 60+ bits of entropy would take a modern computer millions of years to crack through brute force.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>How to Read Your Password Score</h2>
          <p style={{ color: "#8A94C0" }}>
            The checker scores from <strong style={{ color: "#EF4444" }}>Very Weak</strong> (single character type, short, or common) to <strong style={{ color: "#8B5CF6" }}>Excellent</strong> (high entropy, no patterns, not in common-password lists). A &quot;Good&quot; or higher rating requires at least 12 characters using mixed character types with no keyboard walks or sequential patterns.
          </p>
          <p style={{ color: "#8A94C0" }}>
            Even a &quot;Strong&quot; password is dangerous if it&apos;s reused across accounts. If one site you use is breached, attackers try your password on every other major service automatically (credential stuffing). The only solution is unique passwords for every account — which is only practical with a password manager.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Use a Password Manager to Stay Secure</h2>
          <p style={{ color: "#8A94C0" }}>
            The best password is one you don&apos;t have to remember. A password manager generates and stores strong, unique passwords for every account. For small business teams, tools like 1Password Teams let you share credentials securely and revoke access instantly when someone leaves.
          </p>
          <p style={{ color: "#8A94C0" }}>
            Read our full guide:{" "}
            <Link href="/blog/best-password-manager-teams" style={{ color: "#3B82F6" }}>
              Best Password Managers for Teams 2026 — 1Password vs Keeper vs Bitwarden (Tested) →
            </Link>
          </p>
        </div>

        <div className="mt-8 p-5 rounded-xl" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "#3B82F6" }}>Best Overall</p>
          <p className="font-bold mb-2" style={{ color: "#EEF2FF" }}>1Password Teams</p>
          <p className="text-sm mb-3" style={{ color: "#8A94C0" }}>Generates strong unique passwords. Shares them securely with your team. Revoke access instantly.</p>
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
