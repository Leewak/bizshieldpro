"use client";

import { useMemo, useState } from "react";
import ToolShell, { box, inputCls, inputStyle } from "@/components/ToolShell";

export default function Page() {
  const [company, setCompany] = useState("Our company");
  const [minLen, setMinLen] = useState(12);
  const [mfa, setMfa] = useState(true);
  const [manager, setManager] = useState("our company password manager");
  const [contact, setContact] = useState("the IT contact");
  const text = useMemo(() => `${company} — Password and Account Security Policy

1. Purpose
This policy sets simple rules for passwords and sign-ins so that company accounts and customer data stay protected.

2. Password length and choice
- Passwords must be at least ${minLen} characters long. Longer passphrases are encouraged.
- Use a unique password for every account. Never reuse a work password elsewhere.
- Do not use passwords that appear in known data breaches, or obvious choices such as the company name, "Password1" or your own name.
- You do not need to use special patterns of symbols; length and uniqueness matter more.

3. Password manager
- Store work passwords in ${manager}. Let it generate random passwords for you.
- Do not keep passwords in spreadsheets, notes apps, email or on paper at your desk.

4. Multi-factor authentication${mfa ? `
- Multi-factor authentication (MFA) must be turned on for email, the password manager, banking, payroll, cloud storage and any admin account.
- Prefer an authenticator app or security key over SMS codes.
- Never approve an MFA prompt you did not start, and never read out an MFA code to anyone.` : `
- Turn on multi-factor authentication wherever it is available.`}

5. Changing passwords
- Passwords do not need to be changed on a fixed schedule.
- Change a password immediately if it may have been exposed: a phishing email you clicked, a breach notice, or a lost device.

6. Sharing
- Never share your personal password. Shared team logins must be shared through ${manager}, not by email or chat.

7. Leaving the company
- Access is removed on the last working day. Shared passwords the person knew are changed.

8. Reporting
- Report a suspected compromised account, lost device or suspicious login prompt to ${contact} straight away. Reporting quickly is never a disciplinary matter.
`, [company, minLen, mfa, manager, contact]);
  return (
    <ToolShell slug="password-policy-generator" privacy={null}
      intro={<p>Generate a short, readable password and MFA policy for your staff handbook. It follows current guidance such as NIST SP 800-63B: favour length over complexity rules, block breached passwords, require MFA, and drop forced periodic resets.</p>}
      howTo={[
        { h: "Why this policy looks different from older ones", p: <p>Older policies forced frequent password changes and complex character rules. Research behind modern guidance found these push people towards predictable patterns like <code>Spring2025!</code>. Current advice is to require long, unique passwords stored in a password manager, protect important accounts with MFA, and change passwords only when there is a reason to.</p> },
      ]}
      faq={[
        { q: "Is this policy legally binding?", a: "It is a template, not legal advice. Adapt it to your business and any industry rules you must follow, and have staff acknowledge it." },
        { q: "Should passwords expire every 90 days?", a: "Current NIST guidance says no, unless there is evidence of compromise. Forced expiry tends to produce weaker, predictable passwords." },
        { q: "What minimum length should I choose?", a: "At least 12 characters for staff accounts is a common, practical minimum; 15+ for administrators." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <label className="text-sm" style={{ color: "#8A94C0" }}>Company name<input value={company} onChange={(e) => setCompany(e.target.value)} className={`${inputCls} mt-1`} style={inputStyle} /></label>
        <label className="text-sm" style={{ color: "#8A94C0" }}>Password manager name<input value={manager} onChange={(e) => setManager(e.target.value)} className={`${inputCls} mt-1`} style={inputStyle} /></label>
        <label className="text-sm" style={{ color: "#8A94C0" }}>Report incidents to<input value={contact} onChange={(e) => setContact(e.target.value)} className={`${inputCls} mt-1`} style={inputStyle} /></label>
        <label className="text-sm p-3 rounded-xl" style={{ ...box, color: "#8A94C0" }}>Minimum length: <strong style={{ color: "#EEF2FF" }}>{minLen}</strong>
          <input type="range" min={8} max={20} value={minLen} onChange={(e) => setMinLen(Number(e.target.value))} className="w-full mt-2" /></label>
      </div>
      <label className="flex items-center gap-2 text-sm mb-4" style={{ color: "#8A94C0" }}><input type="checkbox" checked={mfa} onChange={(e) => setMfa(e.target.checked)} /> Require MFA on key accounts</label>
      <div className="p-4 rounded-xl" style={box}>
        <div className="flex justify-end gap-3 text-xs mb-2"><button type="button" onClick={() => navigator.clipboard.writeText(text)} style={{ color: "#3B82F6" }}>Copy</button>
          <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`} download="password-policy.txt" style={{ color: "#3B82F6" }}>Download .txt</a></div>
        <pre className="text-sm whitespace-pre-wrap" style={{ color: "#CBD5F0", fontFamily: "inherit" }}>{text}</pre>
      </div>
    </ToolShell>
  );
}
