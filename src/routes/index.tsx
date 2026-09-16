import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Bot,
  BrainCircuit,
  Briefcase,
  Code2,
  Download,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SITE_URL = "https://vaibhavdutt.com";
const TITLE = "Vaibhav Dutt — SEO Specialist | Technical SEO & AI-Driven Search Growth";
const DESCRIPTION =
  "SEO Specialist with 6+ years growing organic traffic into the millions through technical SEO, content architecture, Local SEO and AI-driven search (AEO/GEO). Based in Delhi, India.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Vaibhav Dutt",
          jobTitle: "SEO Specialist",
          description: DESCRIPTION,
          email: "mailto:vaibhavdutt66@gmail.com",
          telephone: "+91 88261 81678",
          address: { "@type": "PostalAddress", addressLocality: "Delhi", addressCountry: "IN" },
          url: SITE_URL,
          sameAs: ["https://www.linkedin.com/in/vaibhav-dutt-seo/"],
          knowsAbout: [
            "Technical SEO",
            "Answer Engine Optimization",
            "Generative Engine Optimization",
            "Local SEO",
            "Programmatic SEO",
            "Content Strategy",
          ],
        }),
      },
    ],
  }),
  component: Portfolio,
});

const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const STATS = [
  { icon: TrendingUp, value: "6M+", label: "Monthly organic sessions managed" },
  { icon: BarChart3, value: "2×", label: "Traffic growth at Marriage.com in 16 months" },
  { icon: Users, value: "4", label: "SEO executives led & mentored" },
  { icon: Briefcase, value: "6+", label: "Years in search" },
];

const EXPERIENCE = [
  {
    company: "DesignCafe",
    role: "SEO Specialist",
    period: "Oct 2024 – Jan 2026",
    location: "Remote",
    current: false,
    highlights: [
      "Pioneered AEO and GEO strategies to improve brand visibility inside AI-generated search results, including ChatGPT and Gemini outputs.",
      "Directed AI-assisted SEO workflows for keyword clustering, SERP analysis and content execution — cutting research turnaround time.",
      "Restructured site content with schema markup, semantic formatting and entity optimization, increasing rich-result and zero-click eligibility.",
      "Launched scalable Local SEO campaigns: city- and service-specific landing pages mapped to high-intent queries.",
      "Managed and optimized Google Business Profiles across multiple locations, improving local pack visibility.",
      "Built data-driven SEO roadmaps that grew organic visibility, rankings and qualified lead volume.",
    ],
  },
  {
    company: "ProProfs",
    role: "Sr. SEO Executive / Senior SEO Analyst",
    period: "Jan 2022 – Oct 2024",
    location: "Hybrid",
    highlights: [
      "Scaled Marriage.com organic traffic from 3M to 6M monthly sessions in 16 months through a full-funnel SEO strategy.",
      "Owned SEO for a 6M+ monthly-organic-traffic property — one of the company's highest-traffic assets.",
      "Recruited, trained and managed a team of 4 SEO executives aligned to company-wide growth targets.",
      "Designed and launched course and therapist-directory landing pages that opened new revenue streams.",
      "Directed high-volume content publishing campaigns with quarterly strategies and cross-functional delivery.",
    ],
  },
  {
    company: "LNS Technologies Pvt. Ltd.",
    role: "SEO Executive",
    period: "Aug 2019 – Jan 2022",
    location: "On-site",
    highlights: [
      "Executed on-page optimization — titles, metas, H1s, internal linking, sitemaps, robots.txt — across multiple client sites.",
      "Ran off-page campaigns across PR submissions, guest blogging, classifieds and bookmarking.",
      "Conducted full-site technical audits: responsiveness, URL structure, canonicals, 301 redirects.",
      "Delivered SEO programs for Houseaffection.com, Fitreign.com and Cooldroid.net as dedicated client accounts.",
    ],
  },
];

const SKILLS = [
  {
    icon: Search,
    title: "SEO Strategy",
    items: ["Technical SEO", "On-Page & Off-Page", "Programmatic SEO", "Entity SEO & E-E-A-T", "Local SEO", "Core Web Vitals", "JavaScript SEO"],
  },
  {
    icon: BrainCircuit,
    title: "AI & Generative Search",
    items: ["AEO (Answer Engine Optimization)", "GEO (Generative Engine Optimization)", "AI Content Optimization", "Prompt Engineering for SEO", "LLM Output Analysis"],
  },
  {
    icon: TrendingUp,
    title: "Growth & Reporting",
    items: ["Keyword Research & Clustering", "SERP & Competitor Analysis", "Digital PR & Link Building", "GA4 & Looker Studio", "Content Strategy"],
  },
  {
    icon: Wrench,
    title: "Tools & Platforms",
    items: ["GA4", "Search Console", "Ahrefs", "Semrush", "Screaming Frog", "Sitebulb", "SurferSEO", "Clearscope", "WordPress", "ChatGPT & Gemini"],
  },
  {
    icon: Code2,
    title: "Technical & Automation",
    items: ["Python fundamentals", "SEO data analysis scripting", "Reporting automation", "Workflow efficiency"],
  },
];

const CERTIFICATIONS = [
  {
    title: "Salesforce AI Associate",
    issuer: "Salesforce",
    year: "2024",
    note: "Understanding and leveraging AI in the Salesforce ecosystem.",
  },
  {
    title: "AI Tools & Claude Workshop",
    issuer: "Be10x",
    year: "2026",
    note: "AI-assisted research, data analysis, prompting techniques and building AI into everyday workflows.",
  },
];

const PROJECTS = [
  {
    name: "SERPKit",
    url: "https://serpkit-seo.vercel.app",
    tag: "Side project",
    description:
      "A browser-only SEO utility toolkit: WebP converter, SVG minifier, social image resizer, favicon generator, JSON-LD schema builders (including schema-from-URL), meta pixel checker, OG previewer and robots.txt / sitemap generator — $0 backend.",
  },
];

const EDUCATION = [
  { degree: "Bachelor of Computer Applications (BCA)", school: "Maharaja Agrasen Himalayan Garhwal University", year: "2023" },
  { degree: "Computer Science Engineering (CSE)", school: "Ambedkar Institute of Technology", year: "2019" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors",
          scrolled ? "border-border bg-background/85 backdrop-blur" : "border-transparent",
        )}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground shadow-[var(--shadow-brand)]">
              VD
            </span>
            <span className="font-display text-base font-bold tracking-tight">Vaibhav Dutt</span>
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="https://www.linkedin.com/in/vaibhav-dutt-seo/" target="_blank" rel="noreferrer" className="hidden sm:block">
              <Button variant="soft" size="sm">
                <Linkedin className="size-4" /> LinkedIn
              </Button>
            </a>
            <button
              className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setMenuOpen(false);
                  scrollTo(n.id);
                }}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="hero-wash border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" /> SEO Specialist · Technical SEO · AI-Driven Search Growth
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-glow sm:text-7xl">
            Vaibhav Dutt
          </h1>
          <p className="mt-5 max-w-2xl font-display text-xl leading-snug text-muted-foreground sm:text-2xl">
            I grow organic search from thousands to{" "}
            <span className="text-foreground">millions of monthly sessions</span> — and now into
            AI-generated answers.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            6+ years building scalable, data-backed search strategies across e-commerce, education
            and lead-generation. Early adopter of AEO/GEO — optimizing for ChatGPT, Gemini and the
            next generation of search.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="brand" size="lg" onClick={() => scrollTo("contact")}>
              <Mail className="size-4" /> Get in touch
            </Button>
            <a href="https://www.linkedin.com/in/vaibhav-dutt-seo/" target="_blank" rel="noreferrer">
              <Button variant="outline" size="lg">
                <Linkedin className="size-4" /> linkedin.com/in/vaibhav-dutt-seo
              </Button>
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" /> Delhi, India
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-4 text-primary" /> vaibhavdutt66@gmail.com
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden bg-border lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-card px-6 py-8">
              <s.icon className="size-5 text-primary" />
              <p className="mt-3 font-display text-3xl font-bold tracking-tight">{s.value}</p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading kicker="About" title="Search growth, engineered" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I'm a results-driven SEO Specialist with 6+ years of experience building scalable,
                data-backed search strategies across e-commerce, education and lead-generation
                sites. My track record includes growing organic traffic into the millions of monthly
                sessions through technical SEO, content architecture and Local SEO programs.
              </p>
              <p>
                I'm an early adopter of AI-driven search optimization — AEO (Answer Engine
                Optimization) and GEO (Generative Engine Optimization) — and I use AI-assisted
                workflows for keyword research, content clustering and reporting, translating
                emerging search behavior into measurable ranking and revenue gains.
              </p>
              <p>
                I lead cross-functional teams, mentor junior SEO talent, and ship aggressive growth
                targets on schedule.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                At a glance
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  "6M+ monthly sessions owned at ProProfs",
                  "AEO/GEO pioneer for AI search visibility",
                  "Local SEO at multi-location scale",
                  "Team lead — hired & managed 4 SEO executives",
                  "Python scripting for SEO automation",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-foreground/90">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="scroll-mt-20 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading kicker="Experience" title="Where I've driven growth" />
          <div className="relative space-y-10 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-border">
            {EXPERIENCE.map((job) => (
              <article key={job.company} className="relative pl-10">
                <span className="absolute left-0 top-1.5 grid size-4 place-items-center rounded-full border-2 border-primary bg-background" />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-xl font-semibold tracking-tight">{job.company}</h3>
                  <span className="text-sm font-medium text-primary">{job.role}</span>
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {job.period} · {job.location}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" />
                      {h}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="scroll-mt-20 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading kicker="Skills" title="The toolkit" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{s.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.items.map((i) => (
                    <span
                      key={i}
                      className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications + Projects */}
      <section id="certifications" className="scroll-mt-20 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading kicker="Certifications" title="Always learning" />
          <div className="grid gap-5 sm:grid-cols-2">
            {CERTIFICATIONS.map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Award className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{c.title}</h3>
                <p className="mt-1 font-mono text-xs text-primary">
                  {c.issuer} · {c.year}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.note}</p>
              </div>
            ))}
          </div>

          <div id="projects" className="scroll-mt-24 mt-16">
            <SectionHeading kicker="Projects" title="Things I've built" />
            {PROJECTS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {p.tag}
                  </span>
                  <span className="ml-auto font-mono text-xs text-muted-foreground group-hover:text-primary">
                    {p.url.replace("https://", "")} ↗
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="scroll-mt-20 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading kicker="Education" title="Foundations" />
          <div className="grid gap-5 sm:grid-cols-2">
            {EDUCATION.map((e) => (
              <div key={e.degree} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <GraduationCap className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold leading-snug">{e.degree}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{e.school}</p>
                <p className="mt-1 font-mono text-xs text-primary">{e.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)] sm:p-12">
            <Bot className="mx-auto size-8 text-primary" />
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Let's grow your organic search
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Whether it's technical SEO, AI-search visibility or a full-funnel content program —
              I'd love to hear what you're building.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href="mailto:vaibhavdutt66@gmail.com">
                <Button variant="brand" size="lg">
                  <Mail className="size-4" /> vaibhavdutt66@gmail.com
                </Button>
              </a>
              <a href="tel:+918826181678">
                <Button variant="outline" size="lg">
                  <Phone className="size-4" /> +91 88261 81678
                </Button>
              </a>
              <a href="https://www.linkedin.com/in/vaibhav-dutt-seo/" target="_blank" rel="noreferrer">
                <Button variant="soft" size="lg">
                  <Linkedin className="size-4" /> LinkedIn
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:px-6">
          <p>© 2026 Vaibhav Dutt · Delhi, India</p>
          <p className="inline-flex items-center gap-1.5 font-mono">
            <Download className="size-3.5" /> resume available on request
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">{kicker}</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}
