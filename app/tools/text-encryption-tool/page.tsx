"use client";

import { useState } from "react";
import ToolShell, { inputCls, inputStyle, mono } from "@/components/ToolShell";

const ITER = 310000;
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function key(pass: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
async function encrypt(text: string, pass: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await key(pass, salt), new TextEncoder().encode(text)));
  return `bsp1.${b64(salt)}.${b64(iv)}.${b64(ct)}`;
}
async function decrypt(blob: string, pass: string) {
  const [v, s, i, c] = blob.trim().split(".");
  if (v !== "bsp1" || !c) throw new Error("format");
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(i) }, await key(pass, unb64(s)), unb64(c));
  return new TextDecoder().decode(pt);
}

export default function Page() {
  const [text, setText] = useState("");
  const [pass, setPass] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const act = async (mode: "e" | "d") => {
    setErr(""); setOut("");
    if (pass.length < 8) { setErr("Use a password of at least 8 characters (longer is better)."); return; }
    setBusy(true);
    try { setOut(mode === "e" ? await encrypt(text, pass) : await decrypt(text, pass)); }
    catch { setErr(mode === "d" ? "Could not decrypt — wrong password or the text was changed." : "Encryption failed."); }
    setBusy(false);
  };
  return (
    <ToolShell slug="text-encryption-tool"
      intro={<p>Encrypt a message with a password so only someone who knows the password can read it. Uses AES-256-GCM with a key derived by PBKDF2 ({ITER.toLocaleString()} iterations) — standard, well-reviewed cryptography built into your browser.</p>}
      howTo={[
        { h: "How to share a secret safely", p: <><p>Encrypt the message here, send the encrypted text by email or chat, and give the password through a different channel — for example by phone or in person. Anyone who intercepts only one of the two learns nothing.</p><p>Choose a long, unique password; the encryption is only as strong as the password. For ongoing secret sharing in a team, a password manager with secure sharing is more convenient.</p></> },
      ]}
      faq={[
        { q: "Can you recover my text if I forget the password?", a: "No. Nothing is stored and there is no back door. Without the password the text cannot be decrypted." },
        { q: "Is AES-256-GCM secure?", a: "Yes. It is a widely used standard that also detects tampering — if the encrypted text is altered, decryption fails." },
        { q: "Is anything sent to a server?", a: "No. Encryption and decryption happen entirely in your browser with the Web Crypto API." },
      ]}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Message to encrypt, or encrypted text (bsp1.…) to decrypt" className={inputCls} style={{ ...inputStyle, ...mono }} />
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" autoComplete="new-password" className={`${inputCls} mt-3`} style={inputStyle} />
      <div className="flex gap-2 my-3">
        <button type="button" disabled={busy} onClick={() => act("e")} className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-lg disabled:opacity-50" style={{ background: "#2563EB", color: "#fff" }}>🔒 Encrypt</button>
        <button type="button" disabled={busy} onClick={() => act("d")} className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-lg disabled:opacity-50" style={{ background: "#1D2340", color: "#EEF2FF" }}>🔓 Decrypt</button>
      </div>
      {err && <p className="text-sm mb-2" style={{ color: "#EF4444" }}>{err}</p>}
      {out && (<><textarea readOnly value={out} rows={5} className={inputCls} style={{ ...inputStyle, ...mono }} /><button type="button" onClick={() => navigator.clipboard.writeText(out)} className="mt-2 text-xs" style={{ color: "#3B82F6" }}>Copy result</button></>)}
    </ToolShell>
  );
}
