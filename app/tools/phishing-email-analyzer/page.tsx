"use client";

import { useState } from "react";
import Link from "next/link";

interface Flag {
  category: string;
  description: string;
  severity: "high" | "medium" | "low";
  matches: string[];
}

const RULES: { category: string; severity: "high" | "medium" | "low"; description: string; patterns: RegExp[] }[] = [
  {
    category: "Urgency & Pressure",
    severity: "high",
    description: "Creates artificial time pressure to bypass rational thinking",
    patterns: [
      /act (now|immediately|urgently)/i,
      /urgent(ly)?[\s!]/i,
      /within \d+\s*(hour|minute|day)/i,
      /expire[sd]?\s+in/i,
      /last (chance|warning|notice)/i,
      /immediate(ly)?\s+(action|response|attention)/i,
      /account.{0,20}(suspend|terminat|clos|disabl)/i,
      /limited time/i,
      /respond (within|by|before)/i,
      /failure to (respond|verify|confirm)/i,
    ],
  },
  {
    category: "Credential Request",
    severity: "high",
    description: "Legitimate services never ask for passwords or login info via email",
    patterns: [
      /verify your (password|credentials|account|identity|details|information)/i,
      /confirm your (password|login|account|personal)/i,
      /enter your (password|username|login|credentials)/i,
      /update your (password|payment|billing|card)/i,
      /provide your (password|ssn|social security|bank|credit card)/i,
      /click (here|below).{0,30}(verify|log in|sign in|confirm)/i,
      /re-?enter your/i,
      /validate your/i,
    ],
  },
  {
    category: "Wire Transfer / Financial",
    severity: "high",
    description: "Business Email Compromise (BEC) — CEO/vendor impersonation for fraudulent payments",
    patterns: [
      /wire transfer/i,
      /gift card/i,
      /send \$\d+/i,
      /purchase.{0,20}(itunes|amazon|google play|steam)/i,
      /bank transfer/i,
      /process.{0,20}payment/i,
      /keep this (confidential|private|secret)/i,
      /(ceo|president|director|manager) (is|has) (request|asked)/i,
    ],
  },
  {
    category: "Suspicious Sender / Domain Spoofing",
    severity: "high",
    description: "Email domains that mimic legitimate companies",
    patterns: [
      /from:.{0,60}@(?!.*\.(gov|edu))[a-z0-9-]+\.(xyz|top|click|online|site|info|biz|tech|loan|work|party|review|win|bid|stream)/i,
      /noreply@(?!.*(google|microsoft|amazon|apple|paypal|bank))/i,
      /(paypa1|g00gle|amaz0n|microsfot|suppport|helpdesk)\./i,
      /security-alert@/i,
      /do-not-reply@.{0,20}\.(com|net|org).{5}/i,
    ],
  },
  {
    category: "Suspicious Links",
    severity: "high",
    description: "URLs that don't match the claimed sender or use URL shorteners",
    patterns: [
      /https?:\/\/(bit\.ly|tinyurl|goo\.gl|t\.co|ow\.ly|buff\.ly|shorturl|rb\.gy)/i,
      /click (here|this link|below)/i,
      /http:\/\//i,
      /\[click here\]/i,
      /login\.(php|asp|aspx|html?)\?/i,
      /verify\.php\?/i,
    ],
  },
  {
    category: "Generic / Mass-Target Greeting",
    severity: "medium",
    description: "Personalized legitimate emails use your name, not generic salutations",
    patterns: [
      /dear (customer|user|account holder|valued member|client|subscriber|sir|madam)/i,
      /^(hello|hi|greetings),?\s*$/im,
      /dear (friend|beneficiary|winner)/i,
      /attention (user|customer|account)/i,
    ],
  },
  {
    category: "Too-Good-To-Be-True Offers",
    severity: "medium",
    description: "Lottery wins, inheritance, prize claims — classic advance-fee fraud",
    patterns: [
      /you (have (won|been selected)|are (the winner|eligible))/i,
      /(million|billion)\s*(dollar|usd|euro|pound)/i,
      /lottery|jackpot|inheritance|beneficiary/i,
      /unclaimed (funds|money|prize)/i,
      /free (iphone|gift card|prize|reward|money)/i,
      /congratulations.{0,40}(won|selected|chosen|winner)/i,
    ],
  },
  {
    category: "Malware / Attachment Risk",
    severity: "high",
    description: "Encourages opening dangerous file types or enabling macros",
    patterns: [
      /open (the )?attached?/i,
      /download (the )?attached?/i,
      /enable (macros|editing|content)/i,
      /\.(exe|zip|doc|docm|xlsm|js|vbs|bat|cmd|scr)[\s"]/i,
      /scan.{0,20}(attached|document|file)/i,
      /invoice.{0,30}attached/i,
    ],
  },
  {
    category: "Impersonation",
    severity: "medium",
    description: "Claims to be from a trusted institution to lower your guard",
    patterns: [
      /\b(IRS|FBI|CIA|INTERPOL|police|court|attorney general)\b/i,
      /this is (amazon|paypal|microsoft|apple|google|your bank|your provider)/i,
      /from the desk of/i,
      /official notice/i,
      /(microsoft|apple|amazon|google|paypal).{0,30}support/i,
    ],
  },
  {
    category: "Grammar & Formatting Anomalies",
    severity: "low",
    description: "Typos and poor formatting that professional companies don't send",
    patterns: [
      /\b(kindly|dearest|revert back|do the needful|i am (mr|mrs|dr|prof)\.?)\b/i,
      /(!!+|\?\?+|\.\.\.+)/,
      /[A-Z]{4,}\s+[A-Z]{4,}/,
    ],
  },
];

function analyzeEmail(text: string): { flags: Flag[]; score: number; verdict: string; color: string } {
  if (!text.trim()) return { flags: [], score: 0, verdict: "", color: "" };

  const flags: Flag[] = [];

  for (const rule of RULES) {
    const matches: string[] = [];
    for (const pattern of rule.patterns) {
      const found = text.match(pattern);
      if (found) {
        const m = found[0].trim().slice(0, 60);
        if (!matches.includes(m)) matches.push(m);
      }
    }
    if (matches.length > 0) {
      flags.push({ category: rule.category, description: rule.description, severity: rule.severity, matches });
    }
  }

  const highCount = flags.filter((f) => f.severity === "high").length;
  const medCount = flags.filter((f) => f.severity === "medium").length;
  const lowCount = flags.filter((f) => f.severity === "low").length;

  const rawScore = highCount * 30 + medCount * 15 + lowCount * 5;
  const score = Math.min(100, rawScore);

  let verdict = "";
  let color = "";
  if (score === 0) { verdict = "No red flags detected"; color = "#10B981"; }
  else if (score < 20) { verdict = "Low risk — minor suspicious signals"; color = "#EAB308"; }
  else if (score < 45) { verdict = "Moderate risk — treat with caution"; color = "#F97316"; }
  else if (score < 70) { verdict = "High risk — likely phishing"; color = "#EF4444"; }
  else { verdict = "Very high risk — almost certainly phishing"; color = "#DC2626"; }

  return { flags, score, verdict, color };
}

const SEVERITY_COLORS = { high: "#EF4444", medium: "#F97316", low: "#EAB308" };
const SEVERITY_BG = { high: "rgba(239,68,68,0.08)", medium: "rgba(249,115,22,0.08)", low: "rgba(234,179,8,0.08)" };

export default function PhishingEmailAnalyzer() {
  const [emailText, setEmailText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const result = analyzed ? analyzeEmail(emailText) : null;

  return (
    <div className="pt-10 pb-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
          <Link href="/" className="hover:text-bz-blue">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-bz-blue">Free Tools</Link>
          <span>/</span>
          <span style={{ color: "#3A4570" }}>Phishing Email Analyzer</span>
        </div>

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          Phishing Email Analyzer
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: "#8A94C0" }}>
          Paste any suspicious email and get an instant red-flag score based on 40+ heuristic patterns — urgency language, credential requests, suspicious links, impersonation tactics, and more. <strong style={{ color: "#10B981" }}>100% client-side — your email text never leaves this page.</strong>
        </p>

        {/* Privacy badge */}
        <div className="flex items-center gap-2 mb-6 text-xs px-3 py-2 rounded-lg w-fit" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}>
          <span>🔒</span> Email text is analyzed locally in your browser — nothing is transmitted
        </div>

        {/* Textarea */}
        <textarea
          value={emailText}
          onChange={(e) => { setEmailText(e.target.value); setAnalyzed(false); }}
          placeholder="Paste the email body, headers, or both here..."
          rows={10}
          className="w-full px-5 py-4 rounded-xl text-sm outline-none resize-y transition-all"
          style={{
            background: "#0D1020",
            border: "2px solid #1D2340",
            color: "#CBD5F0",
            fontFamily: "monospace",
            lineHeight: "1.6",
            minHeight: 200,
          }}
          spellCheck={false}
        />

        <button
          onClick={() => setAnalyzed(true)}
          disabled={!emailText.trim()}
          className="mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: emailText.trim() ? "#2563EB" : "#1D2340",
            color: emailText.trim() ? "#fff" : "#3A4570",
            cursor: emailText.trim() ? "pointer" : "not-allowed",
          }}
        >
          Analyze Email →
        </button>

        {/* Results */}
        {analyzed && result && (
          <div className="mt-8 space-y-5">
            {/* Score card */}
            <div className="p-6 rounded-xl" style={{ background: "#0D1020", border: `2px solid ${result.color}40` }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#5B6899" }}>Risk Score</p>
                  <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)", color: result.color }}>{result.score}<span className="text-xl">/100</span></p>
                </div>
                <div className="text-right">
                  <p className="font-semibold" style={{ color: result.color }}>{result.verdict}</p>
                  <p className="text-xs mt-1" style={{ color: "#5B6899" }}>{result.flags.length} red flag{result.flags.length !== 1 ? "s" : ""} found</p>
                </div>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "#1D2340" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${result.score}%`, background: result.color }} />
              </div>
            </div>

            {result.flags.length === 0 && (
              <div className="p-5 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)" }}>
                <p className="text-sm" style={{ color: "#6EE7B7" }}>
                  ✓ No phishing patterns detected. This doesn&apos;t guarantee the email is safe — always verify unexpected requests through a known-good phone number or separate communication channel.
                </p>
              </div>
            )}

            {/* Flags */}
            {result.flags.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold" style={{ color: "#CBD5F0" }}>Detected Red Flags:</p>
                {result.flags
                  .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]))
                  .map((flag, i) => (
                    <div key={i} className="p-4 rounded-xl" style={{ background: SEVERITY_BG[flag.severity], border: `1px solid ${SEVERITY_COLORS[flag.severity]}30` }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded" style={{ background: `${SEVERITY_COLORS[flag.severity]}20`, color: SEVERITY_COLORS[flag.severity] }}>
                          {flag.severity}
                        </span>
                        <span className="font-semibold text-sm" style={{ color: "#EEF2FF" }}>{flag.category}</span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: "#8A94C0" }}>{flag.description}</p>
                      {flag.matches.length > 0 && (
                        <div className="space-y-1">
                          {flag.matches.map((m, j) => (
                            <code key={j} className="block text-xs px-2 py-1 rounded" style={{ background: "rgba(0,0,0,0.3)", color: SEVERITY_COLORS[flag.severity] }}>
                              &ldquo;{m}&rdquo;
                            </code>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-4 rounded-xl text-xs" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1D2340", color: "#3A4570" }}>
              <strong style={{ color: "#5B6899" }}>Disclaimer:</strong> This is a heuristic screening tool — it checks for common patterns but cannot guarantee detection of all phishing attempts, and may flag legitimate emails. A low score does not mean an email is safe. Always verify unusual requests through independent channels, and consider professional email security tools for comprehensive protection.
            </div>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose-bz">
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>How Phishing Emails Work — and Why They&apos;re So Effective</h2>
          <p style={{ color: "#8A94C0" }}>
            Phishing is responsible for over 90% of data breaches. Attackers don&apos;t need to hack your systems — they just need to trick one employee into clicking a link or entering credentials on a fake login page. Modern phishing emails are sophisticated: they often pass spam filters, use your company&apos;s actual branding, and create enough urgency that employees act without thinking.
          </p>
          <p style={{ color: "#8A94C0" }}>
            Business Email Compromise (BEC) — where an attacker impersonates a CEO or vendor to request a wire transfer — costs businesses an average of $130,000 per incident. These emails often score low on traditional spam filters because they contain no malicious links or attachments, just a request. Our analyzer specifically checks for the language patterns these attacks use.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>What Our Analyzer Checks</h2>
          <p style={{ color: "#8A94C0" }}>
            The analyzer runs 40+ heuristic pattern checks across nine categories: urgency and pressure tactics, credential requests, wire transfer language, suspicious sender domains, shortened or mismatched URLs, generic greetings, too-good-to-be-true offers, malware attachment lures, and known impersonation patterns. High-severity flags are weighted more heavily in the risk score.
          </p>
          <p style={{ color: "#8A94C0" }}>
            This tool is a first-line screening aid. For enterprise-grade protection, consider dedicated email security solutions that scan every inbound email before delivery and run phishing simulations to train your team.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Train Your Team to Spot Phishing</h2>
          <p style={{ color: "#8A94C0" }}>
            Technology alone can&apos;t stop all phishing — the final line of defense is an employee who recognizes a red flag and reports it instead of clicking. Security awareness training platforms run simulated phishing exercises and provide immediate training when an employee clicks. Studies show trained employees are 70% less likely to fall for phishing attacks.
          </p>
          <p style={{ color: "#8A94C0" }}>
            Read our complete guide:{" "}
            <Link href="/blog/how-to-prevent-phishing-attacks" style={{ color: "#3B82F6" }}>
              How to Prevent Phishing Attacks on Your Business in 2026 (Complete Guide) →
            </Link>
          </p>
        </div>

        <div className="mt-8 p-5 rounded-xl" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "#3B82F6" }}>Editor&apos;s Pick</p>
          <p className="font-bold mb-2" style={{ color: "#EEF2FF" }}>Proofpoint Essentials</p>
          <p className="text-sm mb-3" style={{ color: "#8A94C0" }}>Enterprise-grade email security for small business. Blocks phishing before it reaches your team&apos;s inbox — plus free phishing simulation testing.</p>
          <a href="https://www.proofpoint.com/us/products/email-security-and-protection/essentials"
            target="_blank" rel="noopener sponsored"
            className="inline-block text-sm font-semibold px-5 py-2.5 rounded-lg"
            style={{ background: "#2563EB", color: "#fff" }}>
            Free Phishing Test for Your Team →
          </a>
        </div>
      </div>
    </div>
  );
}
