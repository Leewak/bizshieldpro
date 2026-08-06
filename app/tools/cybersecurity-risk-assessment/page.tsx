"use client";

import { useState } from "react";
import Link from "next/link";

type Q = { id: string; category: string; text: string; tip: string };

const QUESTIONS: Q[] = [
  { id: "mfa", category: "Access Control", text: "Is multi-factor authentication (MFA) required for email and other critical accounts?", tip: "Enable MFA on email, banking, and admin accounts — it blocks the vast majority of account-takeover attempts even if a password leaks." },
  { id: "unique-pw", category: "Access Control", text: "Does every employee use a unique password for each work account (no reuse)?", tip: "Roll out a team password manager so unique passwords are the default, not extra effort." },
  { id: "offboarding", category: "Access Control", text: "Do you immediately revoke system access when an employee leaves?", tip: "Add access revocation to your offboarding checklist — delayed revocation is a common insider-risk gap." },
  { id: "backups", category: "Backups", text: "Are business-critical files backed up automatically, on a schedule you don't have to remember?", tip: "Set up automated daily backups with versioning — manual backups get skipped." },
  { id: "backup-test", category: "Backups", text: "Have you tested restoring from backup in the last 12 months?", tip: "An untested backup is a hope, not a plan. Do a test restore at least twice a year." },
  { id: "offsite-backup", category: "Backups", text: "Is at least one backup copy stored offsite or in a separate cloud account from your main systems?", tip: "Ransomware often encrypts connected backups too — keep one copy isolated (3-2-1 rule)." },
  { id: "phishing-training", category: "Phishing Readiness", text: "Have employees received phishing-awareness training in the past year?", tip: "Run a short annual training plus periodic simulated phishing tests — this is the highest-ROI security control for most small teams." },
  { id: "report-process", category: "Phishing Readiness", text: "Do employees know exactly how to report a suspicious email?", tip: "Post a one-line 'forward suspicious emails to security@yourdomain' policy somewhere visible." },
  { id: "wire-verify", category: "Phishing Readiness", text: "Do you verify payment or wire-transfer changes by phone before acting on an email request?", tip: "Business email compromise scams request urgent payment changes — always verify by a second channel." },
  { id: "updates", category: "Software & Devices", text: "Are operating systems and software set to update automatically?", tip: "Unpatched software is one of the most common breach entry points. Turn on auto-updates everywhere possible." },
  { id: "antivirus", category: "Software & Devices", text: "Do all company devices run up-to-date antivirus/endpoint protection?", tip: "Modern endpoint protection catches ransomware and malware before it spreads." },
  { id: "byod", category: "Software & Devices", text: "If employees use personal devices for work, are they covered by a security policy (screen lock, encryption)?", tip: "A simple BYOD policy requiring screen lock and disk encryption closes an easy gap." },
  { id: "wifi", category: "Network", text: "Is your business Wi-Fi network separated from a public/guest network?", tip: "Guest devices on the same network as business systems is a common, easily-fixed exposure." },
  { id: "vendor", category: "Data & Vendors", text: "Do you know which third-party vendors have access to your customer data?", tip: "Keep a simple list of vendors with data access and review it annually — you can't secure what you don't track." },
  { id: "incident-plan", category: "Incident Response", text: "Do you have a written plan for what to do in the first hour after a suspected breach?", tip: "Even a one-page plan (who to call, what to disconnect) dramatically reduces breach cost and downtime." },
];

export default function RiskAssessment() {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [showResults, setShowResults] = useState(false);

  const answeredCount = Object.values(answers).filter((v) => v !== undefined).length;
  const yesCount = Object.values(answers).filter((v) => v === true).length;
  const pct = Math.round((yesCount / QUESTIONS.length) * 100);

  const setAnswer = (id: string, val: boolean) => setAnswers((a) => ({ ...a, [id]: val }));

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const risk =
    pct >= 85 ? { label: "Low Risk", color: "#10B981" } :
    pct >= 60 ? { label: "Moderate Risk", color: "#3B82F6" } :
    pct >= 35 ? { label: "High Risk", color: "#F97316" } :
    { label: "Critical Risk", color: "#EF4444" };

  const weakAreas = QUESTIONS.filter((q) => answers[q.id] === false);

  const reset = () => { setAnswers({}); setShowResults(false); };

  return (
    <div className="pt-10 pb-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
          <Link href="/" className="hover:text-bz-blue">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-bz-blue">Free Tools</Link>
          <span>/</span>
          <span style={{ color: "#3A4570" }}>Risk Assessment</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          Cybersecurity Risk Self-Assessment
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: "#8A94C0" }}>
          15 questions across access control, backups, phishing readiness, devices, and incident response. Get an instant risk score and a prioritized action list.
        </p>

        <div className="flex items-center gap-2 mb-6 text-xs px-3 py-2 rounded-lg w-fit" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}>
          <span>🔒</span> Scored entirely in your browser — nothing is submitted anywhere
        </div>

        {!showResults ? (
          <>
            <div className="h-2 rounded-full overflow-hidden mb-8" style={{ background: "#1D2340" }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%`, background: "#3B82F6" }} />
            </div>

            <div className="space-y-4 mb-8">
              {QUESTIONS.map((q, i) => (
                <div key={q.id} className="p-5 rounded-xl" style={{ background: "#0D1020", border: `1px solid ${answers[q.id] !== undefined ? "#1D2340" : "#1D2340"}` }}>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "#5B6899" }}>{i + 1}. {q.category}</p>
                  <p className="text-sm mb-4" style={{ color: "#EEF2FF" }}>{q.text}</p>
                  <div className="flex gap-3">
                    {([["Yes", true], ["No", false]] as [string, boolean][]).map(([label, val]) => (
                      <button key={label} type="button" onClick={() => setAnswer(q.id, val)}
                        className="flex-1 text-sm font-semibold py-2 rounded-lg transition-all"
                        style={{
                          background: answers[q.id] === val ? (val ? "#10B981" : "#EF4444") : "#1D2340",
                          color: answers[q.id] === val ? "#0A0C14" : "#8A94C0",
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowResults(true)} disabled={!allAnswered} type="button"
              className="w-full text-sm font-semibold px-4 py-3.5 rounded-lg transition-all disabled:opacity-40"
              style={{ background: "#2563EB", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
              {allAnswered ? "See My Risk Score →" : `Answer all ${QUESTIONS.length} questions (${answeredCount}/${QUESTIONS.length})`}
            </button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="p-6 rounded-xl text-center" style={{ background: "#0D1020", border: `2px solid ${risk.color}60` }}>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "#5B6899" }}>Your Score</p>
              <p className="text-5xl font-bold mb-2" style={{ fontFamily: "var(--font-space-grotesk)", color: risk.color }}>{pct}%</p>
              <p className="text-lg font-bold" style={{ color: risk.color }}>{risk.label}</p>
            </div>

            {weakAreas.length > 0 ? (
              <div className="p-5 rounded-xl" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
                <p className="text-sm font-semibold mb-4" style={{ color: "#CBD5F0" }}>Top {Math.min(weakAreas.length, 15)} Priorities to Fix:</p>
                <div className="space-y-4">
                  {weakAreas.map((q) => (
                    <div key={q.id} className="flex items-start gap-3">
                      <span style={{ color: "#EF4444" }}>→</span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#EEF2FF" }}>{q.text}</p>
                        <p className="text-xs mt-1" style={{ color: "#8A94C0" }}>{q.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)" }}>
                <p className="text-sm" style={{ color: "#6EE7B7" }}>✓ You answered yes to everything — you&apos;re covering the fundamentals well. Keep reviewing this annually as your team and tools change.</p>
              </div>
            )}

            <button onClick={reset} type="button"
              className="w-full text-sm font-semibold px-4 py-3 rounded-lg" style={{ background: "#1D2340", color: "#EEF2FF" }}>
              Retake Assessment
            </button>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose-bz">
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Why Small Businesses Need a Risk Assessment</h2>
          <p style={{ color: "#8A94C0" }}>
            43% of cyberattacks target small businesses, yet most don&apos;t have a dedicated IT security team to catch gaps before an attacker does. This assessment covers the six areas that account for the overwhelming majority of small-business breaches: weak access control, missing or untested backups, phishing susceptibility, unpatched software, flat networks, and the absence of an incident response plan.
          </p>
          <p style={{ color: "#8A94C0" }}>
            None of these questions require a security background to answer — they&apos;re about whether a practice exists, not how sophisticated it is. A &quot;no&quot; answer isn&apos;t a failure, it&apos;s a prioritized to-do list, ranked by what attackers exploit most often.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>What to Do With Your Score</h2>
          <p style={{ color: "#8A94C0" }}>
            Work through the flagged items in order — access control and backups first, since they limit both how attackers get in and how much damage they can do once inside. Explore our{" "}
            <Link href="/category/checklists" style={{ color: "#3B82F6" }}>Checklists</Link>{" "}
            for step-by-step guides on each category, and re-run this assessment every quarter as your team and tools change.
          </p>
        </div>
      </div>
    </div>
  );
}
