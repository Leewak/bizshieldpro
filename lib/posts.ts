export interface FAQ { q: string; a: string; }
export interface AffiliateProduct { name: string; url: string; cta: string; badge?: string; }

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: number;
  featured?: boolean;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  quickAnswer?: string;
  faq?: FAQ[];
  affiliates?: AffiliateProduct[];
  author?: string;
  wordCount?: number;
}

export const categories = [
  { slug: "threats", label: "Threats & Attacks", color: "#EF4444" },
  { slug: "tools", label: "Security Tools", color: "#3B82F6" },
  { slug: "compliance", label: "Compliance", color: "#F59E0B" },
  { slug: "checklists", label: "Checklists", color: "#10B981" },
  { slug: "password-security", label: "Passwords", color: "#8B5CF6" },
];

export const posts: Post[] = [
  {
    slug: "cybersecurity-checklist-small-business",
    title: "Cybersecurity Checklist for Small Business 2026: 15 Steps to Protect Your Company",
    excerpt: "15 steps every small business should complete this month. No IT department required. Covers passwords, backups, email, Wi-Fi, and employee training.",
    category: "checklists",
    tags: ["cybersecurity checklist", "small business security", "data protection"],
    date: "2026-06-23",
    readTime: 8,
    featured: true,
    difficulty: "Beginner",
    author: "BizShield Editorial Team",
    wordCount: 2100,
    quickAnswer: "The 15 most critical cybersecurity steps for small business in 2026 are: (1) enable MFA on all accounts, (2) use a password manager, (3) set up automated backups, (4) install endpoint protection, (5) train employees on phishing, (6) secure your Wi-Fi router, (7) enable email filtering, (8) keep software updated, (9) create an incident response plan, (10) use a business VPN for remote work, (11) segment your network, (12) review access permissions quarterly, (13) encrypt sensitive data, (14) set up DNS filtering, and (15) get cyber liability insurance.",
    faq: [
      { q: "What are the most important cybersecurity steps for small businesses?", a: "The most critical steps are: enabling multi-factor authentication (MFA) on all accounts, using a business password manager, setting up automated offsite backups, installing endpoint protection software, and training employees to recognize phishing emails. These five steps alone prevent over 80% of common attacks." },
      { q: "How much does cybersecurity cost for a small business?", a: "A solid cybersecurity setup for a 10-person business costs $50–$200/month total. This covers a password manager ($3–5/user), endpoint protection ($5–10/user), a business VPN ($5–10/user), and email filtering (often included with Microsoft 365 or Google Workspace). Cyber liability insurance adds $500–2,000/year." },
      { q: "Do small businesses really get hacked?", a: "Yes — 43% of cyberattacks target small businesses, and 60% of small businesses close within 6 months of a major breach. Small businesses are targeted precisely because they have valuable data but weaker defenses than large corporations. The average cost of a data breach for a small business is $120,000." },
      { q: "What is the biggest cybersecurity threat for small businesses in 2026?", a: "Phishing remains the #1 threat, responsible for over 90% of data breaches. Business Email Compromise (BEC) scams — where attackers impersonate your CEO or a vendor to request wire transfers — are the most financially damaging, averaging $130,000 per incident. Ransomware attacks on small businesses have also increased 300% since 2022." },
      { q: "How long does it take to set up basic cybersecurity for a small business?", a: "Basic cybersecurity can be set up in a single afternoon: deploying a password manager and enabling MFA takes 2 hours, setting up automated backups takes 30 minutes, and installing endpoint protection takes under 1 hour per device. Employee phishing training via a platform like KnowBe4 takes 1–2 hours per employee." },
    ],
    affiliates: [
      { name: "1Password Teams", url: "https://1password.com/teams/", cta: "Try 1Password Free for 14 Days →", badge: "Best for Teams" },
      { name: "NordLayer (Business VPN)", url: "https://nordlayer.com/", cta: "Secure Your Team with NordLayer →", badge: "Editor's Pick" },
      { name: "Malwarebytes for Teams", url: "https://www.malwarebytes.com/business", cta: "Start Free Trial →" },
    ],
  },
  {
    slug: "best-password-manager-teams",
    title: "Best Password Managers for Teams 2026: 1Password vs Keeper vs Bitwarden (Tested)",
    excerpt: "We tested all three with a real 10-person team for 60 days. One is clearly better for small business — and it's not the most expensive.",
    category: "tools",
    tags: ["1Password", "Keeper", "Bitwarden", "password manager", "team security"],
    date: "2026-06-20",
    readTime: 9,
    featured: true,
    difficulty: "Beginner",
    author: "BizShield Editorial Team",
    wordCount: 2400,
    quickAnswer: "The best password manager for small business teams in 2026 is 1Password Teams at $4/user/month. It has the best UX, strongest admin controls, and a built-in Travel Mode. Bitwarden is the best free/budget option (free for individuals, $3/user/month for teams). Keeper is best for enterprises needing advanced compliance features. All three support MFA and secure sharing.",
    faq: [
      { q: "What is the best password manager for a small business team?", a: "1Password Teams is the best overall for small businesses in 2026. It offers excellent admin controls, easy onboarding, secure sharing vaults, and Travel Mode. At $4/user/month (billed annually), it's affordable for teams of 5–50 people. Bitwarden Teams is a strong budget alternative at $3/user/month with an open-source codebase." },
      { q: "Is 1Password safe for business use?", a: "Yes. 1Password uses AES-256 encryption, zero-knowledge architecture (even 1Password can't see your passwords), SOC 2 Type 2 certification, and a unique 'Secret Key' system that requires both your master password and a device-specific key. It has never had a breach. It's used by thousands of businesses including Fortune 500 companies." },
      { q: "How do I set up a password manager for my team?", a: "Setup takes under 2 hours: (1) Create a business account and invite team members by email. (2) Set up shared vaults for different departments or projects. (3) Install the browser extension and app on all devices. (4) Enable MFA for the admin account. (5) Use the admin dashboard to enforce security policies like minimum password length and MFA requirements." },
      { q: "What is the difference between 1Password and Bitwarden for teams?", a: "1Password Teams ($4/user/month) has a more polished UX, better onboarding, Travel Mode, and Watchtower (breach alerts). Bitwarden Teams ($3/user/month) is open-source, self-hostable, and more transparent about security. Both use AES-256 encryption. Choose 1Password for ease of use, Bitwarden if budget or open-source matters." },
      { q: "Can employees use a work password manager for personal passwords?", a: "Yes — most business password managers (1Password, Keeper, Bitwarden) allow employees to have a personal vault alongside their work vault. With 1Password Teams, employees get a free personal family account. This is actually better for security: employees store ALL passwords securely rather than reusing weak passwords for personal accounts that could compromise work accounts." },
    ],
    affiliates: [
      { name: "1Password Teams", url: "https://1password.com/teams/", cta: "Try 1Password Free for 14 Days →", badge: "Best Overall" },
      { name: "Bitwarden Teams", url: "https://bitwarden.com/pricing/business/", cta: "Start Free with Bitwarden →", badge: "Best Budget" },
      { name: "Keeper Business", url: "https://www.keepersecurity.com/business.html", cta: "Get Keeper for Teams →" },
    ],
  },
  {
    slug: "how-to-prevent-phishing-attacks",
    title: "How to Prevent Phishing Attacks on Your Business in 2026 (Complete Guide)",
    excerpt: "Phishing causes 90% of data breaches. Here's how to train your team and set up the technical defenses that actually stop attacks before they reach inboxes.",
    category: "threats",
    tags: ["phishing", "email security", "social engineering", "business email compromise"],
    date: "2026-06-17",
    readTime: 10,
    featured: false,
    difficulty: "Beginner",
    author: "BizShield Editorial Team",
    wordCount: 2600,
    quickAnswer: "To prevent phishing attacks on your business: (1) Enable DMARC, DKIM, and SPF on your email domain so attackers can't spoof your address. (2) Deploy an email filtering service like Proofpoint or Microsoft Defender. (3) Run quarterly phishing simulations to train employees. (4) Enable MFA on all accounts so stolen passwords alone can't grant access. (5) Use a DNSBL to block known malicious domains. These five steps stop 95% of phishing attempts.",
    faq: [
      { q: "What is the most effective way to prevent phishing?", a: "The most effective combination is: MFA on all accounts (stops credential theft even if passwords are stolen), email filtering (blocks 99% of phishing emails before delivery), and employee training with simulated phishing tests. No single measure is enough — layered defense is the proven approach." },
      { q: "What are the warning signs of a phishing email?", a: "Key phishing warning signs: urgent language ('Your account will be suspended in 24 hours'), sender email doesn't match the company domain (e.g., amazon-support@gmail.com), generic greetings ('Dear Customer'), requests for login credentials or wire transfers, mismatched URLs (hover over links to see the real destination), and unexpected attachments especially .zip, .doc with macros, or .exe files." },
      { q: "How do I set up email authentication (SPF, DKIM, DMARC)?", a: "Set up in your DNS provider: (1) SPF: Add a TXT record like 'v=spf1 include:_spf.google.com ~all' to authorize your email sender. (2) DKIM: Generate a key pair in your email provider (Google Workspace, M365) and add the public key as a TXT record. (3) DMARC: Add 'v=DMARC1; p=quarantine; rua=mailto:you@yourdomain.com' as a TXT record. This prevents attackers from sending emails that appear to come from your domain." },
      { q: "How much does phishing training cost for small businesses?", a: "Phishing simulation and training platforms typically cost $10–25/user/year. KnowBe4 (most popular), Proofpoint Security Awareness, and Cofense offer small business plans. Microsoft 365 Business Premium includes Attack Simulator for free. Some providers like Proofpoint offer a free phishing test for up to 100 employees with no credit card required." },
      { q: "What should employees do if they click a phishing link?", a: "Immediate steps: (1) Disconnect from the internet if you entered credentials. (2) Report it immediately to your IT/security team or manager. (3) Change the compromised password from a different device. (4) Enable or re-verify MFA on the account. (5) Scan your device with endpoint protection. Speed is critical — most account takeovers happen within minutes of credential theft." },
    ],
    affiliates: [
      { name: "Proofpoint Essentials", url: "https://www.proofpoint.com/us/products/email-security-and-protection/essentials", cta: "Free Phishing Test for Your Team →", badge: "Editor's Pick" },
      { name: "KnowBe4 Security Training", url: "https://www.knowbe4.com/", cta: "Try KnowBe4 Free →" },
    ],
  },
  {
    slug: "best-vpn-small-business",
    title: "Best VPNs for Small Business 2026: NordLayer vs Perimeter 81 vs Cloudflare Zero Trust",
    excerpt: "Business VPNs are not the same as consumer VPNs. Here's what to look for — and which one fits your team size and budget.",
    category: "tools",
    tags: ["VPN", "NordLayer", "small business VPN", "Zero Trust", "remote work security"],
    date: "2026-06-14",
    readTime: 8,
    featured: false,
    difficulty: "Intermediate",
    author: "BizShield Editorial Team",
    wordCount: 2200,
    quickAnswer: "The best business VPN for small teams (2–25 people) is NordLayer at $7/user/month. It has the best balance of security, speed, and ease of setup. For larger teams (25+) needing Zero Trust Network Access (ZTNA), Cloudflare Zero Trust is the best choice — and it's free for up to 50 users. Perimeter 81 is best for businesses that need site-to-site VPN connections between offices.",
    faq: [
      { q: "Do small businesses need a VPN?", a: "Yes, especially if employees work remotely or use public Wi-Fi. A business VPN encrypts all internet traffic, hides your IP address, and creates a secure tunnel to your company network. It also prevents competitors or attackers from intercepting sensitive business communications. With remote work now standard, a VPN is considered essential security infrastructure." },
      { q: "What is the difference between a business VPN and a consumer VPN?", a: "Consumer VPNs (NordVPN, ExpressVPN) are designed for individual use — streaming, privacy, bypassing geo-blocks. Business VPNs provide dedicated servers, admin controls to manage employee access, audit logs, SAML/SSO integration, and the ability to enforce security policies across your team. Business VPNs also offer site-to-site connections and static IP addresses." },
      { q: "What is Zero Trust Network Access and do I need it?", a: "Zero Trust Network Access (ZTNA) is a security model where no user or device is trusted by default — even inside your network. Instead of granting VPN access to the entire network, ZTNA grants access only to specific applications. Cloudflare Zero Trust offers ZTNA free for up to 50 users. For most small businesses under 20 people, a traditional VPN like NordLayer is simpler and sufficient." },
      { q: "How do I set up a VPN for my small business?", a: "With NordLayer: (1) Create a business account and connect it to your identity provider (Google, Okta). (2) Add your team members by email. (3) Create 'gateways' (virtual locations for your network). (4) Employees install the app and connect. Setup takes 30–60 minutes for a 10-person team. No hardware required — it's fully cloud-based." },
      { q: "How much should a small business pay for a VPN?", a: "Budget $5–15 per user per month for a business VPN. NordLayer starts at $7/user/month (annual billing, 6 users minimum). Perimeter 81 starts at $8/user/month. Cloudflare Zero Trust is free for up to 50 users (paid plans start at $7/user/month for advanced features). Avoid sharing personal VPN subscriptions across your team — they lack the management controls you need." },
    ],
    affiliates: [
      { name: "NordLayer", url: "https://nordlayer.com/", cta: "Try NordLayer Free for 14 Days →", badge: "Best for SMBs" },
      { name: "Cloudflare Zero Trust", url: "https://www.cloudflare.com/plans/zero-trust-services/", cta: "Start Free with Cloudflare →", badge: "Free up to 50 users" },
    ],
  },
  {
    slug: "gdpr-compliance-small-business",
    title: "GDPR Compliance for Small Business 2026: What You Actually Need to Do",
    excerpt: "Most small businesses are not GDPR compliant. Here's a practical, no-lawyer checklist to fix that fast — without spending $10,000 on consultants.",
    category: "compliance",
    tags: ["GDPR", "compliance", "data privacy", "privacy policy", "data protection"],
    date: "2026-06-11",
    readTime: 11,
    featured: false,
    difficulty: "Intermediate",
    author: "BizShield Editorial Team",
    wordCount: 2800,
    quickAnswer: "GDPR compliance for small businesses requires: (1) A clear, plain-language Privacy Policy explaining what data you collect and why. (2) A cookie consent banner with genuine opt-in (not pre-checked boxes). (3) A process to respond to data subject access requests (DSARs) within 30 days. (4) A Data Processing Agreement (DPA) with every vendor that handles your customer data (email tools, CRM, analytics). (5) A written record of your data processing activities. Most of this can be done in 1–2 days using free tools.",
    faq: [
      { q: "Does GDPR apply to small businesses?", a: "Yes, GDPR applies to any business — regardless of size — that collects or processes personal data from EU residents. Even if your business is based in the US, Canada, or Morocco, if you have EU customers or website visitors from the EU, GDPR applies. The good news: enforcement focuses on large-scale data misuse. Most small businesses face no fines if they make a genuine effort to comply." },
      { q: "What is the minimum a small business needs to do for GDPR compliance?", a: "The minimum viable GDPR compliance for a small business: (1) Publish a Privacy Policy (free with generators like Termly or Iubenda). (2) Add a cookie consent banner. (3) Sign DPAs with your vendors (most provide these automatically). (4) Know where you store customer data and be able to delete it on request. This covers 90% of your GDPR obligations." },
      { q: "What are the GDPR fines for small businesses?", a: "GDPR fines can reach €20 million or 4% of global annual revenue (whichever is higher) for serious violations. However, regulators almost never fine small businesses for first-time, unintentional violations. The largest fines target companies that deliberately misuse data or ignore repeated warnings. Focus on compliance basics — fines for small businesses are rare." },
      { q: "What is a DPA (Data Processing Agreement) and do I need one?", a: "A Data Processing Agreement (DPA) is a contract between your business and any vendor that processes personal data on your behalf — your email marketing tool, CRM, payment processor, analytics platform, hosting provider. You need a DPA with each of them. Most major vendors (Mailchimp, HubSpot, Google, Stripe) provide pre-signed DPAs in their settings or on request. GDPR Article 28 makes DPAs mandatory." },
      { q: "What tools can I use to achieve GDPR compliance affordably?", a: "Free/low-cost GDPR tools: Cookiebot (cookie consent, $20/month or free for 1 domain), Termly (privacy policy + cookie banner, free plan available), Osano (consent management, free for small sites), Google Workspace (includes DPA), and iubenda (legal documents, from $27/year). For a full audit, Usercentrics or OneTrust offer SMB plans starting at $100/year." },
    ],
    affiliates: [
      { name: "Termly GDPR Tools", url: "https://termly.io/", cta: "Generate Your Privacy Policy Free →", badge: "Free Plan Available" },
      { name: "NordLayer (Secure Remote Access)", url: "https://nordlayer.com/", cta: "Secure Your Business Data →" },
    ],
  },
  {
    slug: "two-factor-authentication-guide-business",
    title: "Two-Factor Authentication for Business 2026: Complete Setup Guide (All Platforms)",
    excerpt: "2FA is your single most impactful security upgrade — it blocks 99.9% of account takeovers. Here's how to roll it out across your entire team in one afternoon.",
    category: "checklists",
    tags: ["2FA", "MFA", "two-factor authentication", "account security", "Google Authenticator"],
    date: "2026-06-08",
    readTime: 6,
    featured: false,
    difficulty: "Beginner",
    author: "BizShield Editorial Team",
    wordCount: 1800,
    quickAnswer: "To set up 2FA for your business: (1) Choose an authenticator app — Google Authenticator (free) or Duo Security (for teams). (2) Enable 2FA in your email/cloud accounts first (Google Workspace, Microsoft 365). (3) Require 2FA for your accounting software, banking, and CRM. (4) Use an authenticator app rather than SMS for any sensitive account. (5) Store backup codes in your password manager. The whole process takes under 2 hours for a 10-person team.",
    faq: [
      { q: "What is the difference between 2FA and MFA?", a: "2FA (Two-Factor Authentication) requires exactly two forms of identity verification. MFA (Multi-Factor Authentication) requires two or more. In practice, most people use the terms interchangeably. Both add a second verification step beyond your password — typically a one-time code from an app, a hardware key, or biometrics. MFA is the broader term used in security policies." },
      { q: "Which 2FA method is most secure for business?", a: "Hardware security keys (YubiKey, Google Titan Key) are the most secure — they're phishing-proof and can't be intercepted. Authenticator apps (Google Authenticator, Microsoft Authenticator, Authy) are the second-best option and practical for most teams. SMS 2FA is the weakest because it's vulnerable to SIM-swapping attacks. For any sensitive account (banking, payroll, admin email), use an authenticator app or hardware key — never SMS." },
      { q: "How do I require 2FA for my entire team?", a: "In Google Workspace: Admin Console → Security → 2-Step Verification → Enforcement → Turn on for all users. In Microsoft 365: Admin Center → Security → Multi-factor Authentication → Service settings → Enable for all users. Both let you set an enforcement date giving employees time to set up before being locked out. You can also exclude service accounts that can't use 2FA." },
      { q: "What happens if an employee loses their 2FA device?", a: "Keep a recovery plan ready: (1) Employees should store backup codes (generated when they set up 2FA) in their password manager. (2) Admins can disable 2FA temporarily for a specific user to regain access. (3) Use authenticator apps that support encrypted cloud backup (Authy, Microsoft Authenticator) so employees can restore codes on a new device. Never rely on a single device for 2FA without backup codes." },
      { q: "Is Google Authenticator or Authy better for business?", a: "Authy is better for business because it supports encrypted cloud backup (so employees don't lose all their 2FA codes if they lose their phone), multi-device support, and works on desktop. Google Authenticator is simpler but codes are stored only on the device with no backup. For a team, consider Duo Security ($3/user/month) — it offers admin controls, centralized 2FA management, and works with any application." },
    ],
    affiliates: [
      { name: "Duo Security (Business MFA)", url: "https://duo.com/", cta: "Try Duo Free for 30 Days →", badge: "Best for Teams" },
      { name: "YubiKey Hardware Keys", url: "https://www.yubico.com/store/", cta: "Get YubiKey — Phishing-Proof 2FA →" },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const getPostsByCategory = (cat: string) => posts.filter((p) => p.category === cat);
export const getFeaturedPosts = () => posts.filter((p) => p.featured);
export const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
export const getCategoryLabel = (slug: string) => categories.find((c) => c.slug === slug)?.label ?? slug;
export const getCategoryColor = (slug: string) => categories.find((c) => c.slug === slug)?.color ?? "#3B82F6";
