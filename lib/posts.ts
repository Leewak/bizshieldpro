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
}

export const categories = [
  { slug: "threats", label: "Threats", color: "#EF4444" },
  { slug: "tools", label: "Tools", color: "#3B82F6" },
  { slug: "compliance", label: "Compliance", color: "#F59E0B" },
  { slug: "checklists", label: "Checklists", color: "#10B981" },
  { slug: "password-security", label: "Passwords", color: "#8B5CF6" },
];

export const posts: Post[] = [
  {
    slug: "cybersecurity-checklist-small-business",
    title: "The Essential Cybersecurity Checklist for Small Business in 2026",
    excerpt: "15 steps every small business should complete this month. No IT department required.",
    category: "checklists",
    tags: ["cybersecurity checklist", "small business security"],
    date: "2026-06-23",
    readTime: 8,
    featured: true,
    difficulty: "Beginner",
  },
  {
    slug: "best-password-manager-teams",
    title: "Best Password Managers for Teams in 2026: 1Password vs Keeper vs Bitwarden",
    excerpt: "We tested all three with a 10-person team for 60 days. One is clearly better for small business.",
    category: "tools",
    tags: ["1Password", "Keeper", "Bitwarden", "password manager"],
    date: "2026-06-20",
    readTime: 9,
    featured: true,
    difficulty: "Beginner",
  },
  {
    slug: "how-to-prevent-phishing-attacks",
    title: "How to Prevent Phishing Attacks on Your Small Business (2026 Guide)",
    excerpt: "Phishing causes 90% of data breaches. Here's how to train your team and set up technical defenses that actually work.",
    category: "threats",
    tags: ["phishing", "email security", "social engineering"],
    date: "2026-06-17",
    readTime: 10,
    featured: false,
    difficulty: "Beginner",
  },
  {
    slug: "best-vpn-small-business",
    title: "Best VPNs for Small Business in 2026: NordLayer vs Perimeter 81 vs Cloudflare Zero Trust",
    excerpt: "Business VPNs are not the same as consumer VPNs. Here's what to look for and which one fits your team size.",
    category: "tools",
    tags: ["VPN", "NordLayer", "small business VPN"],
    date: "2026-06-14",
    readTime: 8,
    featured: false,
    difficulty: "Intermediate",
  },
  {
    slug: "gdpr-compliance-small-business",
    title: "GDPR Compliance for Small Business: What You Actually Need to Do",
    excerpt: "Most small businesses are not GDPR compliant. Here's a practical, no-lawyer guide to fixing that fast.",
    category: "compliance",
    tags: ["GDPR", "compliance", "data privacy"],
    date: "2026-06-11",
    readTime: 11,
    featured: false,
    difficulty: "Intermediate",
  },
  {
    slug: "two-factor-authentication-guide-business",
    title: "Two-Factor Authentication for Business: The Complete Setup Guide",
    excerpt: "2FA is your single most impactful security upgrade. Here's how to roll it out across your entire team in one afternoon.",
    category: "checklists",
    tags: ["2FA", "MFA", "two-factor authentication"],
    date: "2026-06-08",
    readTime: 6,
    featured: false,
    difficulty: "Beginner",
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const getPostsByCategory = (cat: string) => posts.filter((p) => p.category === cat);
export const getFeaturedPosts = () => posts.filter((p) => p.featured);
export const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
export const getCategoryLabel = (slug: string) => categories.find((c) => c.slug === slug)?.label ?? slug;
export const getCategoryColor = (slug: string) => categories.find((c) => c.slug === slug)?.color ?? "#3B82F6";
