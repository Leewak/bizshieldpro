"use client";
export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#F0F4FF", fontFamily: "var(--font-space-grotesk)" }}>Contact Us</h1>
      <p className="mb-10 text-sm" style={{ color: "#6B7DB8" }}>Questions about cybersecurity tools, corrections, or partnership inquiries? We reply within 2–3 business days.</p>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Name</label><input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} /></div>
          <div><label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Email</label><input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} /></div>
        </div>
        <div><label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Subject</label><input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} /></div>
        <div><label className="block text-xs font-semibold mb-2" style={{ color: "#6B7DB8" }}>Message</label><textarea rows={6} placeholder="Your message..." className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "#080B18", border: "1px solid #1C2245", color: "#F0F4FF" }} /></div>
        <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold" style={{ background: "linear-gradient(135deg, #3B82F6, #22D3EE)", color: "#fff" }}>Send Message</button>
        <p className="text-center text-xs" style={{ color: "#2A3260" }}>Or email: <a href="mailto:guifrhi.khalid@gmail.com" style={{ color: "#3B82F6" }}>guifrhi.khalid@gmail.com</a></p>
      </form>
    </div>
  );
}
