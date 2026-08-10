import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  CodeOutput,
  CopyButton,
  DownloadTextButton,
  Field,
  Panel,
  ToolShell,
} from "./primitives";

/* ------------------------------------------------- Pixel width checker */

function useTextWidth(text: string, font: string) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ctxRef.current) {
      ctxRef.current = document.createElement("canvas").getContext("2d");
    }
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.font = font;
    setWidth(Math.round(ctx.measureText(text).width));
  }, [text, font]);
  return width;
}

function Meter({
  label,
  chars,
  charLimit,
  px,
  pxLimit,
}: {
  label: string;
  chars: number;
  charLimit: number;
  px: number;
  pxLimit: number;
}) {
  const pct = Math.min(100, (px / pxLimit) * 100);
  const over = px > pxLimit;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
        <span className="truncate text-sm font-medium">{label}</span>
        <span
          className={cn(
            "shrink-0 font-mono text-xs",
            over ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {chars}/{charLimit} chars · {px}/{pxLimit}px
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", over ? "bg-destructive" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={cn("text-xs", over ? "text-destructive" : "text-muted-foreground")}>
        {over ? "Likely truncated with an ellipsis in Google results." : "Within Google's display width."}
      </p>
    </div>
  );
}

export function PixelWidthChecker() {
  const [title, setTitle] = useState("Free Client-Side SEO Tools — Image, Schema & Meta | SERPKit");
  const [desc, setDesc] = useState(
    "Convert images to WebP, build JSON-LD schema and check meta pixel widths — all in your browser with zero uploads.",
  );
  const [url, setUrl] = useState("https://serpkit.app/tools");

  const titlePx = useTextWidth(title, '600 20px Arial, "Helvetica Neue", sans-serif');
  const descPx = useTextWidth(desc, '400 14px Arial, "Helvetica Neue", sans-serif');

  return (
    <ToolShell
      title="Meta Title & Description Pixel Width Checker"
      description="Google truncates by pixel width, not character count. Widths here are measured with the Canvas text metrics API against Google's ~600px desktop cutoff."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Your meta tags">
          <div className="space-y-5">
            <Field label="Meta title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Meter label="Title" chars={title.length} charLimit={60} px={titlePx} pxLimit={600} />
            <Field label="Meta description">
              <Textarea
                value={desc}
                className="min-h-28"
                onChange={(e) => setDesc(e.target.value)}
              />
            </Field>
            <Meter
              label="Description"
              chars={desc.length}
              charLimit={160}
              px={descPx}
              pxLimit={960}
            />
            <Field label="URL">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} />
            </Field>
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Google SERP preview">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-1 flex items-center gap-2">
                <div className="grid size-6 place-items-center rounded-full border border-border text-[0.6rem] font-semibold">
                  {(title[0] ?? "S").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{new URL0(url)}</p>
                  <p className="truncate text-[0.7rem] text-muted-foreground">{url}</p>
                </div>
              </div>
              <p
                className="mt-2 line-clamp-2 text-[1.2rem] leading-snug text-[oklch(0.45_0.16_265)]"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {title || "Your title here"}
              </p>
              <p
                className="mt-1 line-clamp-2 text-sm text-muted-foreground"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {desc || "Your description here"}
              </p>
            </div>
          </Panel>
          <Panel
            title="Meta tag markup"
            action={
              <CopyButton
                value={`<title>${title}</title>\n<meta name="description" content="${desc}" />`}
              />
            }
          >
            <CodeOutput
              code={`<title>${title}</title>\n<meta name="description" content="${desc}" />\n<link rel="canonical" href="${url}" />`}
            />
          </Panel>
        </div>
      </div>
    </ToolShell>
  );
}

function URL0(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

/* --------------------------------------------------------- Case formatter */

const SMALL_WORDS = new Set([
  "a","an","and","as","at","but","by","for","if","in","nor","of","on","or","per","the","to","vs","via","with",
]);

function toTitleCase(input: string) {
  return input
    .toLowerCase()
    .split(/(\s+)/)
    .map((word, i, arr) => {
      if (!word.trim()) return word;
      const isEdge = i === 0 || i === arr.length - 1;
      if (!isEdge && SMALL_WORDS.has(word.replace(/[^\w]/g, ""))) return word;
      return word.replace(/[a-z]/, (c) => c.toUpperCase());
    })
    .join("");
}

function toSentenceCase(input: string) {
  return input
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}

export function CaseFormatter() {
  const [text, setText] = useState("the complete guide to client-side seo tooling");

  const variants = useMemo(
    () => [
      { label: "Title Case", value: toTitleCase(text) },
      { label: "Sentence case", value: toSentenceCase(text) },
      { label: "UPPERCASE", value: text.toUpperCase() },
      { label: "lowercase", value: text.toLowerCase() },
      { label: "kebab-case slug", value: text.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") },
    ],
    [text],
  );

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <ToolShell
      title="Title Case & Headline Formatter"
      description="Paste a headline and get every casing variant instantly, with editorial small-word rules applied to Title Case."
    >
      <div className="space-y-5">
        <Panel title={`Input · ${words} words · ${text.length} characters`}>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-28 text-base"
            placeholder="Type or paste a headline…"
          />
        </Panel>
        <div className="grid gap-5 md:grid-cols-2">
          {variants.map((v) => (
            <Panel key={v.label} title={v.label} action={<CopyButton value={v.value} />}>
              <p className="break-words font-display text-lg leading-snug">{v.value || "—"}</p>
            </Panel>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

/* ------------------------------------------------------------ OG previewer */

export function OgPreviewer() {
  const [f, setF] = useState({
    title: "SERPKit — client-side SEO utilities",
    description: "Twelve browser-only tools for images, schema and meta tags. No uploads, no accounts.",
    image: "",
    url: "https://serpkit.app",
    site: "serpkit.app",
  });
  const [network, setNetwork] = useState<"x" | "facebook" | "linkedin">("x");

  const domain = URL0(f.url);
  const imageBox = (
    <div className="aspect-[1200/630] w-full overflow-hidden bg-muted">
      {f.image ? (
        <img src={f.image} alt="Preview" className="size-full object-cover" />
      ) : (
        <div className="grid size-full place-items-center text-xs text-muted-foreground">
          Add an image URL to preview
        </div>
      )}
    </div>
  );

  const markup = `<meta property="og:title" content="${f.title}" />
<meta property="og:description" content="${f.description}" />
<meta property="og:image" content="${f.image}" />
<meta property="og:url" content="${f.url}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${f.title}" />
<meta name="twitter:description" content="${f.description}" />
<meta name="twitter:image" content="${f.image}" />`;

  return (
    <ToolShell
      title="Social Open Graph Previewer"
      description="See exactly how your link unfurls on X, Facebook and LinkedIn, then copy the matching Open Graph and Twitter Card tags."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <Panel title="Card content">
            <div className="space-y-4">
              <Field label="Title">
                <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
              </Field>
              <Field label="Description">
                <Textarea
                  value={f.description}
                  onChange={(e) => setF({ ...f, description: e.target.value })}
                />
              </Field>
              <Field label="Image URL (1200×630 recommended)">
                <Input value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} />
              </Field>
              <Field label="Page URL">
                <Input value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} />
              </Field>
            </div>
          </Panel>
          <Panel title="Meta tags" action={<CopyButton value={markup} />}>
            <CodeOutput code={markup} />
          </Panel>
        </div>

        <Panel
          title="Preview"
          className="lg:sticky lg:top-24 lg:self-start"
          action={
            <Tabs value={network} onValueChange={(v) => setNetwork(v as typeof network)}>
              <TabsList>
                <TabsTrigger value="x">X</TabsTrigger>
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        >
          {network === "x" && (
            <div className="overflow-hidden rounded-2xl border border-border">
              {imageBox}
              <div className="space-y-1 p-3">
                <p className="text-xs text-muted-foreground">{domain}</p>
                <p className="line-clamp-1 text-sm font-medium">{f.title}</p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{f.description}</p>
              </div>
            </div>
          )}
          {network === "facebook" && (
            <div className="overflow-hidden rounded-lg border border-border">
              {imageBox}
              <div className="space-y-1 bg-muted/60 p-3">
                <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                  {domain}
                </p>
                <p className="line-clamp-2 font-display text-base font-semibold">{f.title}</p>
                <p className="line-clamp-1 text-sm text-muted-foreground">{f.description}</p>
              </div>
            </div>
          )}
          {network === "linkedin" && (
            <div className="overflow-hidden rounded-lg border border-border shadow-[var(--shadow-soft)]">
              {imageBox}
              <div className="space-y-1 p-3">
                <p className="line-clamp-2 text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{domain}</p>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </ToolShell>
  );
}

/* ------------------------------------------------------- Robots & sitemap */

export function RobotsSitemapGenerator() {
  const [domain, setDomain] = useState("https://example.com");
  const [allowAll, setAllowAll] = useState(true);
  const [includeSitemap, setIncludeSitemap] = useState(true);
  const [crawlDelay, setCrawlDelay] = useState(false);
  const [disallow, setDisallow] = useState("/admin\n/cart\n/search");
  const [paths, setPaths] = useState([
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/about", changefreq: "monthly", priority: "0.7" },
    { path: "/blog", changefreq: "daily", priority: "0.8" },
  ]);

  const base = domain.replace(/\/$/, "");

  const robots = useMemo(() => {
    const lines = ["User-agent: *"];
    if (allowAll) {
      lines.push("Allow: /");
      disallow
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((l) => lines.push(`Disallow: ${l.startsWith("/") ? l : `/${l}`}`));
    } else {
      lines.push("Disallow: /");
    }
    if (crawlDelay) lines.push("Crawl-delay: 10");
    if (includeSitemap && allowAll) lines.push("", `Sitemap: ${base}/sitemap.xml`);
    return lines.join("\n");
  }, [allowAll, disallow, crawlDelay, includeSitemap, base]);

  const sitemap = useMemo(
    () =>
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...paths
          .filter((p) => p.path.trim())
          .map((p) =>
            [
              "  <url>",
              `    <loc>${base}${p.path.startsWith("/") ? p.path : `/${p.path}`}</loc>`,
              `    <changefreq>${p.changefreq}</changefreq>`,
              `    <priority>${p.priority}</priority>`,
              "  </url>",
            ].join("\n"),
          ),
        "</urlset>",
      ].join("\n"),
    [paths, base],
  );

  return (
    <ToolShell
      title="Robots.txt & XML Sitemap Generator"
      description="Toggle crawler rules and list your URLs to produce a clean robots.txt and a valid sitemap.xml boilerplate you can download straight into your project."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <Panel title="Site & crawler rules">
            <div className="space-y-5">
              <Field label="Domain">
                <Input value={domain} onChange={(e) => setDomain(e.target.value)} />
              </Field>
              {[
                {
                  label: "Allow crawling",
                  hint: "Off blocks all robots with Disallow: /",
                  value: allowAll,
                  set: setAllowAll,
                },
                {
                  label: "Reference sitemap",
                  hint: "Adds a Sitemap: directive",
                  value: includeSitemap,
                  set: setIncludeSitemap,
                },
                {
                  label: "Crawl delay",
                  hint: "Adds Crawl-delay: 10",
                  value: crawlDelay,
                  set: setCrawlDelay,
                },
              ].map((t) => (
                <div key={t.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.hint}</p>
                  </div>
                  <Switch checked={t.value} onCheckedChange={t.set} className="shrink-0" />
                </div>
              ))}
              {allowAll && (
                <Field label="Disallowed paths (one per line)">
                  <Textarea
                    value={disallow}
                    onChange={(e) => setDisallow(e.target.value)}
                    className="min-h-24 font-mono text-xs"
                  />
                </Field>
              )}
            </div>
          </Panel>
          <Panel title="Sitemap URLs">
            <div className="space-y-3">
              {paths.map((p, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:grid-cols-[minmax(0,1fr)_7rem_5rem_auto]"
                >
                  <Input
                    value={p.path}
                    placeholder="/path"
                    onChange={(e) =>
                      setPaths(paths.map((x, idx) => (idx === i ? { ...x, path: e.target.value } : x)))
                    }
                  />
                  <Input
                    value={p.changefreq}
                    onChange={(e) =>
                      setPaths(
                        paths.map((x, idx) => (idx === i ? { ...x, changefreq: e.target.value } : x)),
                      )
                    }
                  />
                  <Input
                    value={p.priority}
                    onChange={(e) =>
                      setPaths(
                        paths.map((x, idx) => (idx === i ? { ...x, priority: e.target.value } : x)),
                      )
                    }
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => setPaths(paths.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="soft"
              className="mt-4"
              onClick={() =>
                setPaths([...paths, { path: "", changefreq: "monthly", priority: "0.5" }])
              }
            >
              <Plus className="size-4" /> Add URL
            </Button>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel
            title="robots.txt"
            action={
              <div className="flex gap-2">
                <DownloadTextButton value={robots} filename="robots.txt" label="Save" />
                <CopyButton value={robots} />
              </div>
            }
          >
            <CodeOutput code={robots} />
          </Panel>
          <Panel
            title="sitemap.xml"
            action={
              <div className="flex gap-2">
                <DownloadTextButton value={sitemap} filename="sitemap.xml" label="Save" />
                <CopyButton value={sitemap} />
              </div>
            }
          >
            <CodeOutput code={sitemap} />
          </Panel>
        </div>
      </div>
    </ToolShell>
  );
}
