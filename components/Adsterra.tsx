"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

// Adsterra ad units for bizshieldpro.co (blog-farm publisher account). Codes come from
// the Adsterra dashboard; keep them on article pages, apart from AdSense units.
const NATIVE_KEY = "7cb87783984818aad938e17709478e4c";
const BANNERS = {
  "728x90": "438ac7c9890f0691851832669c9ed089",
  "300x250": "e7fec898fc6e76aadd2c4e00bbb8c0ff",
  "320x50": "9f64228676ff517902f210af30347718",
} as const;

type BannerSize = keyof typeof BANNERS;

// Each banner gets its own iframe document: Adsterra's snippet reads a global
// `atOptions`, so two banners on one page would otherwise overwrite each other.
function bannerDoc(key: string, width: number, height: number) {
  return `<!doctype html><html><body style="margin:0"><script>atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};</script><script src="https://bauval.org/22/${key}"></script></body></html>`;
}

function AdLabel() {
  return <p style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.5, margin: "0 0 4px", textAlign: "center" }}>Advertisement</p>;
}

export function AdsterraBanner({ size, className }: { size: BannerSize; className?: string }) {
  const [width, height] = size.split("x").map(Number);
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <AdLabel />
      <iframe title="Advertisement" srcDoc={bannerDoc(BANNERS[size], width, height)} width={width} height={height} scrolling="no" style={{ border: 0, display: "block", maxWidth: "100%" }} />
    </div>
  );
}

const desktopQuery = "(min-width: 768px)";
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(desktopQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** In-article slot: 728x90 on desktop, 300x250 on phones. Chosen in the browser so only one unit loads. */
export function AdsterraInline({ className }: { className?: string }) {
  const desktop = useSyncExternalStore(subscribe, () => window.matchMedia(desktopQuery).matches, () => null);
  if (desktop === null) return <div className={className} style={{ minHeight: 90 }} />;
  return <AdsterraBanner key={desktop ? "d" : "m"} size={desktop ? "728x90" : "300x250"} className={className} />;
}

/** Native Banner: one per page (Adsterra targets a fixed container id). */
export function AdsterraNative({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = `https://bauval.org/21/${NATIVE_KEY}`;
    host.appendChild(script);
    return () => script.remove();
  }, []);
  return (
    <div ref={ref} className={className}>
      <AdLabel />
      <div id={`container-${NATIVE_KEY}`} />
    </div>
  );
}

// 160x600 skyscrapers fixed in the empty margins left and right of the page. Shown only when the
// window leaves room beside the widest content (max-w-5xl), so they never cover text.
const SKYSCRAPER_KEY = "edd320cd0c2664d086f69191271cc022";
const railQuery = "(min-width: 1400px) and (min-height: 700px)";
function subscribeRails(onChange: () => void) {
  const mq = window.matchMedia(railQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function AdsterraSideRails() {
  const wide = useSyncExternalStore(subscribeRails, () => window.matchMedia(railQuery).matches, () => false);
  if (!wide) return null;
  const rail = (side: "left" | "right") => (
    <div style={{ position: "fixed", top: "50%", [side]: 12, transform: "translateY(-50%)", zIndex: 30 }}>
      <AdLabel />
      <iframe title="Advertisement" srcDoc={bannerDoc(SKYSCRAPER_KEY, 160, 600)} width={160} height={600} scrolling="no" style={{ border: 0, display: "block" }} />
    </div>
  );
  return <>{rail("left")}{rail("right")}</>;
}

// Popunder and Social Bar script URLs from the Adsterra dashboard (GET CODE). Empty = not loaded.
const POPUNDER_SRC = "https://abscloud.org/1/76fa92cb771bd23d5db81430540b6f9d";
const SOCIAL_BAR_SRC = "https://bauval.org/14/d68a939b4b936411ae0c1db767c70620";
const POP_KEY = "adsterra-pop-day";

function loadScript(src: string) {
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  document.body.appendChild(s);
  return s;
}

/** Popunder, capped to one page load per visitor per day (the script itself decides when it opens). */
export function AdsterraPopunder() {
  useEffect(() => {
    if (!POPUNDER_SRC) return;
    const today = new Date().toISOString().slice(0, 10);
    try {
      if (localStorage.getItem(POP_KEY) === today) return;
      localStorage.setItem(POP_KEY, today);
    } catch {
      return; // no storage = can't cap, so skip
    }
    const s = loadScript(POPUNDER_SRC);
    return () => s.remove();
  }, []);
  return null;
}

export function AdsterraSocialBar() {
  useEffect(() => {
    if (!SOCIAL_BAR_SRC) return;
    const s = loadScript(SOCIAL_BAR_SRC);
    return () => s.remove();
  }, []);
  return null;
}

const SMARTLINK = "https://araplhn.org/4/1b34c43d4e042d995321921341261451";

/** Adsterra Smartlink as a clearly labelled sponsored button (never disguised as an article link). */
export function AdsterraSponsoredLink({ className }: { className?: string }) {
  return (
    <div className={className} style={{ textAlign: "center" }}>
      <AdLabel />
      <a href={SMARTLINK} target="_blank" rel="sponsored nofollow noopener" style={{ display: "inline-block", padding: "12px 22px", borderRadius: 8, border: "1px solid currentColor", fontWeight: 600, fontSize: 15, opacity: 0.85 }}>
        Sponsored: today&apos;s featured offer →
      </a>
    </div>
  );
}
