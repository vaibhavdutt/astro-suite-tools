import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { icons, ArrowLeft, ChevronDown, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CATEGORIES, TOOLS, type ToolCategory, type ToolId } from "@/lib/tool-registry";
import {
  FaviconGenerator,
  SocialResizer,
  SvgMinifier,
  WebpConverter,
} from "@/components/serpkit/image-tools";
import {
  BreadcrumbSchema,
  FaqSchema,
  HowToArticleSchema,
  LocalBusinessSchema,
} from "@/components/serpkit/schema-tools";
import {
  CaseFormatter,
  OgPreviewer,
  PixelWidthChecker,
  RobotsSitemapGenerator,
} from "@/components/serpkit/text-tools";

const TITLE = "SERPKit — 12 Client-Side SEO & Image Tools";
const DESCRIPTION =
  "Convert images to WebP, minify SVG, build JSON-LD schema, check meta pixel widths and generate robots.txt — all processed in your browser.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: SerpKit,
});

const VIEWS: Record<ToolId, () => JSX.Element> = {
  webp: WebpConverter,
  "svg-min": SvgMinifier,
  "social-resize": SocialResizer,
  favicon: FaviconGenerator,
  "faq-schema": FaqSchema,
  "local-schema": LocalBusinessSchema,
  "breadcrumb-schema": BreadcrumbSchema,
  "howto-schema": HowToArticleSchema,
  "pixel-width": PixelWidthChecker,
  "title-case": CaseFormatter,
  "og-preview": OgPreviewer,
  robots: RobotsSitemapGenerator,
};

function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = icons[name as keyof typeof icons] ?? Sparkles;
  return <Cmp className={className} />;
}

function SerpKit() {
  const [active, setActive] = useState<ToolId | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter(
      (t) =>
        (category === "All" || t.category === category) &&
        (!q ||
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)),
    );
  }, [query, category]);

  const ActiveView = active ? VIEWS[active] : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={() => setActive(null)}
            className="flex min-w-0 items-center gap-2.5 text-left"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-brand)]">
              <Sparkles className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-bold tracking-tight">
                SERPKit
              </span>
              <span className="block truncate text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                Browser-only utilities
              </span>
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value) setActive(null);
                }}
                placeholder="Search tools…"
                className="w-56 pl-9 lg:w-72"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="soft">
                  Tools Menu
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-[70vh] w-80 overflow-auto">
                {CATEGORIES.map((cat) => (
                  <div key={cat}>
                    <DropdownMenuLabel className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                      {cat}
                    </DropdownMenuLabel>
                    {TOOLS.filter((t) => t.category === cat).map((t) => (
                      <DropdownMenuItem key={t.id} onClick={() => setActive(t.id)}>
                        <ToolIcon name={t.icon} className="size-4 text-primary" />
                        <span className="truncate">{t.short}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </div>
                ))}
                <DropdownMenuItem onClick={() => setActive(null)}>
                  <ArrowLeft className="size-4" /> Back to dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3 sm:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value) setActive(null);
              }}
              placeholder="Search tools…"
              className="pl-9"
            />
          </div>
        </div>
      </header>

      {ActiveView ? (
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Button variant="ghost" className="mb-4 -ml-2" onClick={() => setActive(null)}>
              <ArrowLeft className="size-4" /> Dashboard
            </Button>
            <nav className="space-y-5">
              {CATEGORIES.map((cat) => (
                <div key={cat}>
                  <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {cat}
                  </p>
                  <ul className="space-y-1">
                    {TOOLS.filter((t) => t.category === cat).map((t) => (
                      <li key={t.id}>
                        <button
                          onClick={() => setActive(t.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                            active === t.id
                              ? "bg-accent font-medium text-accent-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <ToolIcon name={t.icon} className="size-4 shrink-0 text-primary" />
                          <span className="truncate">{t.short}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>
          <main className="min-w-0 pb-16">
            <ActiveView />
          </main>
        </div>
      ) : (
        <main>
          <section className="hero-wash border-b border-border">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" /> 12 tools · zero uploads · zero
                accounts
              </span>
              <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                The SEO utility suite that never leaves your browser.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {DESCRIPTION}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button variant="brand" size="lg" onClick={() => setActive("webp")}>
                  Convert images to WebP
                </Button>
                <Button variant="outline" size="lg" onClick={() => setActive("faq-schema")}>
                  Build FAQ schema
                </Button>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="mb-7 flex flex-wrap gap-2">
              {(["All", ...CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    category === cat
                      ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-brand)]"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                No tools match “{query}”.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/50"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <ToolIcon name={t.icon} className="size-5" />
                    </span>
                    <h2 className="mt-4 font-display text-base font-semibold leading-snug">
                      {t.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t.description}
                    </p>
                    <span className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-primary">
                      {t.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <footer className="border-t border-border">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:px-6">
              <p>SERPKit · every byte processed locally with Canvas and JSON in your browser.</p>
              <p className="font-mono">$0 backend</p>
            </div>
          </footer>
        </main>
      )}
    </div>
  );
}
