"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const INDUSTRIES = [
  { id: "healthcare", label: "Healthcare", mult: 1.8 },
  { id: "financial", label: "Financial Services", mult: 1.35 },
  { id: "professional", label: "Professional Services", mult: 1.1 },
  { id: "technology", label: "Technology / SaaS", mult: 1.0 },
  { id: "retail", label: "Retail / E-commerce", mult: 0.75 },
  { id: "manufacturing", label: "Manufacturing", mult: 0.8 },
  { id: "other", label: "Other", mult: 0.9 },
];

const SIZE_TIERS = [
  { id: "micro", label: "1–10 employees", flat: 15000 },
  { id: "small", label: "11–50 employees", flat: 35000 },
  { id: "mid", label: "51–200 employees", flat: 75000 },
  { id: "large", label: "200+ employees", flat: 150000 },
];

const DETECTION = [
  { id: "fast", label: "Under 100 days", mult: 1.0 },
  { id: "avg", label: "100–200 days", mult: 1.15 },
  { id: "slow", label: "Over 200 days", mult: 1.35 },
];

const BASE_COST_PER_RECORD = 165;

const BREAKDOWN = [
  { label: "Detection & Escalation", pct: 0.3 },
  { label: "Notification Costs", pct: 0.07 },
  { label: "Post-Breach Response", pct: 0.24 },
  { label: "Lost Business & Customers", pct: 0.39 },
];

export default function BreachCostCalculator() {
  const [records, setRecords] = useState(1000);
  const [industry, setIndustry] = useState("professional");
  const [size, setSize] = useState("small");
  const [detection, setDetection] = useState("avg");

  const result = useMemo(() => {
    const ind = INDUSTRIES.find((i) => i.id === industry)!;
    const sz = SIZE_TIERS.find((s) => s.id === size)!;
    const det = DETECTION.find((d) => d.id === detection)!;
    const dataCost = records * BASE_COST_PER_RECORD * ind.mult;
    const total = (dataCost + sz.flat) * det.mult;
    return { total, low: total * 0.75, high: total * 1.3 };
  }, [records, industry, size, detection]);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="pt-10 pb-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
          <Link href="/" className="hover:text-bz-blue">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-bz-blue">Free Tools</Link>
          <span>/</span>
          <span style={{ color: "#3A4570" }}>Breach Cost Calculator</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          Data Breach Cost Calculator
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: "#8A94C0" }}>
          Estimate what a breach could cost your business, based on per-record cost averages and detection-time multipliers from published industry breach cost research.
        </p>

        <div className="flex items-center gap-2 mb-6 text-xs px-3 py-2 rounded-lg w-fit" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}>
          <span>🔒</span> Calculated entirely in your browser
        </div>

        <div className="space-y-5 mb-6">
          <div className="p-5 rounded-xl" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "#CBD5F0" }}>Customer/employee records exposed</span>
              <span className="text-sm font-bold" style={{ color: "#3B82F6" }}>{records.toLocaleString()}</span>
            </div>
            <input type="range" min={100} max={100000} step={100} value={records} onChange={(e) => setRecords(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs mt-2" style={{ color: "#3A4570" }}><span>100</span><span>100,000</span></div>
          </div>

          <div className="p-5 rounded-xl" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "#CBD5F0" }}>Industry</p>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRIES.map((i) => (
                <button key={i.id} type="button" onClick={() => setIndustry(i.id)}
                  className="text-sm py-2 px-3 rounded-lg text-left transition-all"
                  style={{ background: industry === i.id ? "#2563EB" : "#1D2340", color: industry === i.id ? "#fff" : "#8A94C0" }}>
                  {i.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "#CBD5F0" }}>Company size</p>
            <div className="grid grid-cols-2 gap-2">
              {SIZE_TIERS.map((s) => (
                <button key={s.id} type="button" onClick={() => setSize(s.id)}
                  className="text-sm py-2 px-3 rounded-lg text-left transition-all"
                  style={{ background: size === s.id ? "#2563EB" : "#1D2340", color: size === s.id ? "#fff" : "#8A94C0" }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "#CBD5F0" }}>Time to detect the breach</p>
            <div className="grid grid-cols-3 gap-2">
              {DETECTION.map((d) => (
                <button key={d.id} type="button" onClick={() => setDetection(d.id)}
                  className="text-xs py-2 px-2 rounded-lg transition-all"
                  style={{ background: detection === d.id ? "#2563EB" : "#1D2340", color: detection === d.id ? "#fff" : "#8A94C0" }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl text-center mb-6" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "#5B6899" }}>Estimated Total Cost</p>
          <p className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EF4444" }}>{fmt(result.total)}</p>
          <p className="text-sm" style={{ color: "#8A94C0" }}>Likely range: {fmt(result.low)} – {fmt(result.high)}</p>
        </div>

        <div className="p-5 rounded-xl mb-8" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
          <p className="text-sm font-semibold mb-4" style={{ color: "#CBD5F0" }}>Typical cost breakdown</p>
          <div className="space-y-3">
            {BREAKDOWN.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "#8A94C0" }}>{b.label}</span>
                  <span style={{ color: "#5B6899" }}>{fmt(result.total * b.pct)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1D2340" }}>
                  <div className="h-full rounded-full" style={{ width: `${b.pct * 100}%`, background: "#3B82F6" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-16 prose-bz">
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>How This Estimate Is Calculated</h2>
          <p style={{ color: "#8A94C0" }}>
            This calculator uses a base cost of roughly $165 per exposed record — in line with published global averages from annual data breach cost research — adjusted by an industry multiplier (healthcare and financial services run highest due to regulatory exposure), a flat incident-response cost scaled to company size, and a detection-time multiplier, since breaches that go undetected longer consistently cost more to contain.
          </p>
          <p style={{ color: "#8A94C0" }}>
            This is a planning estimate, not a quote — actual costs vary by jurisdiction, contract obligations, and whether cyber insurance is in place. Its purpose is to make the case for prevention concrete: the fastest way to cut this number is to never need it.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Cheaper Than a Breach: What Prevention Costs</h2>
          <p style={{ color: "#8A94C0" }}>
            Basic controls — MFA, backups, phishing training, patched software — cost a fraction of even a small breach. Run our{" "}
            <Link href="/tools/cybersecurity-risk-assessment" style={{ color: "#3B82F6" }}>Cybersecurity Risk Self-Assessment</Link>{" "}
            to see which of those controls you&apos;re missing.
          </p>
        </div>
      </div>
    </div>
  );
}
