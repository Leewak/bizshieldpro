"use client";
export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-xs font-mono mb-4" style={{ color: "#3B82F6" }}>GET IN TOUCH</p>
      <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#F0F4FF", fontFamily: "var(--font-space-grotesk)" }}>Contact BizShield Pro</h1>
      <p className="mb-10 text-sm leading-relaxed" style={{ color: "#6B7DB8" }}>
        We are an independent cybersecurity publication for small business owners. Our editorial team researches and tests every tool we recommend. Reach out for corrections, vendor inquiries, or general questions.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { title: "Editorial", desc: "Corrections or updates to our security guides" },
          { title: "Vendors", desc: "Submit a product for review consideration" },
          { title: "Partnerships", desc: "Sponsorships or affiliate programs" },
        ].map(({ title, desc }) => (
          <div key={title} className="p-4 rounded-xl" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.12)" }}>
            <p className="font-semibold text-sm mb-1" style={{ color: "#CBD5E1" }}>{title}</p>
            <p className="text-xs leading-snug" style={{ color: "#4A5580" }}>{desc}</p>
          </div>
        ))}
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Name</label><input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} /></div>
          <div><label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Email</label><input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} /></div>
        </div>
        <div><label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Subject</label><input type="text" placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} /></div>
        <div><label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Message</label><textarea rows={6} placeholder="Your message..." className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} /></div>
        <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold" style={{ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", color: "#fff" }}>Send Message</button>
      </form>
      <div className="mt-10 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ borderTop: "1px solid #1C2245" }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#3B82F6" }}>Email</p>
          <p className="text-sm" style={{ color: "#CBD5E1" }}>hello@bizshieldpro.co</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#3B82F6" }}>Response Time</p>
          <p className="text-sm" style={{ color: "#CBD5E1" }}>Within 2–3 business days</p>
        </div>
      </div>
    </div>
  );
}
