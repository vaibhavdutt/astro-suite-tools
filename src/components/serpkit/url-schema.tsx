import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Globe, Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { analyzeUrl, type ExtractedPage } from "@/lib/scrape.functions";
import { CodeOutput, CopyButton, DownloadTextButton, Panel, ToolShell } from "./primitives";

type SchemaKey = "Article" | "FAQPage" | "BreadcrumbList" | "Organization" | "WebPage" | "HowTo";

const clean = <T,>(obj: T): T => {
  if (Array.isArray(obj)) return obj.map(clean).filter((v) => v !== undefined) as unknown as T;
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const c = clean(v);
      const empty =
        c === undefined ||
        c === "" ||
        c === null ||
        (Array.isArray(c) && c.length === 0) ||
        (typeof c === "object" && !Array.isArray(c) && Object.keys(c as object).length <= 1);
      if (!empty) out[k] = c;
    }
    return out as T;
  }
  return obj;
};

function buildSchemas(p: ExtractedPage): { key: SchemaKey; label: string; json: unknown }[] {
  const out: { key: SchemaKey; label: string; json: unknown }[] = [];
  const ctx = "https://schema.org";

  out.push({
    key: "WebPage",
    label: "WebPage",
    json: clean({
      "@context": ctx,
      "@type": "WebPage",
      name: p.title,
      description: p.description,
      url: p.canonical,
      inLanguage: p.language,
      primaryImageOfPage: p.image ? { "@type": "ImageObject", url: p.image } : undefined,
      isPartOf: { "@type": "WebSite", name: p.siteName, url: new URL(p.finalUrl).origin },
    }),
  });

  out.push({
    key: "Article",
    label: "Article",
    json: clean({
      "@context": ctx,
      "@type": "Article",
      headline: p.h1 || p.title,
      description: p.description,
      image: p.image ? [p.image] : undefined,
      author: p.author ? { "@type": "Person", name: p.author } : undefined,
      publisher: {
        "@type": "Organization",
        name: p.siteName,
        logo: p.logo ? { "@type": "ImageObject", url: p.logo } : undefined,
      },
      datePublished: p.datePublished,
      dateModified: p.dateModified || p.datePublished,
      mainEntityOfPage: { "@type": "WebPage", "@id": p.canonical },
    }),
  });

  if (p.faqs.length)
    out.push({
      key: "FAQPage",
      label: `FAQPage (${p.faqs.length})`,
      json: clean({
        "@context": ctx,
        "@type": "FAQPage",
        mainEntity: p.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    });

  if (p.breadcrumbs.length > 1)
    out.push({
      key: "BreadcrumbList",
      label: `Breadcrumbs (${p.breadcrumbs.length})`,
      json: clean({
        "@context": ctx,
        "@type": "BreadcrumbList",
        itemListElement: p.breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      }),
    });

  if (p.steps.length >= 2)
    out.push({
      key: "HowTo",
      label: `HowTo (${p.steps.length} steps)`,
      json: clean({
        "@context": ctx,
        "@type": "HowTo",
        name: p.h1 || p.title,
        description: p.description,
        step: p.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      }),
    });

  const hasNap = p.telephone || p.address.streetAddress || p.address.addressLocality;
  out.push({
    key: "Organization",
    label: hasNap ? "LocalBusiness" : "Organization",
    json: clean({
      "@context": ctx,
      "@type": hasNap ? "LocalBusiness" : "Organization",
      name: p.siteName,
      url: new URL(p.finalUrl).origin,
      logo: p.logo,
      image: p.image || p.logo,
      telephone: p.telephone,
      priceRange: p.priceRange,
      address: {
        "@type": "PostalAddress",
        streetAddress: p.address.streetAddress,
        addressLocality: p.address.addressLocality,
        addressRegion: p.address.addressRegion,
        postalCode: p.address.postalCode,
        addressCountry: p.address.addressCountry,
      },
      openingHours: p.openingHours,
    }),
  });

  return out;
}

const script = (json: unknown) =>
  `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n</script>`;

export function UrlSchemaGenerator() {
  const analyze = useServerFn(analyzeUrl);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState<ExtractedPage | null>(null);
  const [tab, setTab] = useState<string>("WebPage");

  const run = async () => {
    if (!url.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await analyze({ data: { url: url.trim() } });
      setPage(result);
      setTab("WebPage");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not fetch that page.");
      setPage(null);
    } finally {
      setLoading(false);
    }
  };

  const schemas = page ? buildSchemas(page) : [];
  const activeSchema = schemas.find((s) => s.key === tab) ?? schemas[0];
  const allJson = schemas.map((s) => s.json);

  return (
    <ToolShell
      title="Schema Generator from URL"
      description="Paste any public page URL. SERPKit fetches the HTML, reads its metadata, headings, FAQs, steps and existing structured data, then writes every applicable JSON-LD schema for you — ready to copy."
    >
      <Panel title="Source URL">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Globe className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="https://example.com/guides/technical-seo"
              className="pl-9"
              inputMode="url"
            />
          </div>
          <Button variant="brand" onClick={run} disabled={loading || !url.trim()}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Fetching…" : "Generate schemas"}
          </Button>
        </div>
        {error && (
          <p className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}
        {!error && !page && (
          <p className="mt-3 text-xs text-muted-foreground">
            The page is fetched server-side to bypass CORS. Nothing is stored — results live only in
            this browser tab.
          </p>
        )}
      </Panel>

      {page && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <Panel title="What we found">
              <dl className="space-y-3 text-sm">
                {(
                  [
                    ["Title", page.title],
                    ["Description", page.description],
                    ["H1", page.h1],
                    ["Canonical", page.canonical],
                    ["Site name", page.siteName],
                    ["Author", page.author],
                    ["Published", page.datePublished],
                    ["Telephone", page.telephone],
                    ["FAQ pairs", page.faqs.length ? String(page.faqs.length) : ""],
                    ["Steps", page.steps.length ? String(page.steps.length) : ""],
                    [
                      "Existing schema",
                      page.existingSchemaTypes.slice(0, 8).join(", ") || "none detected",
                    ],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
                      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {k}
                      </dt>
                      <dd className="min-w-0 break-words">{v}</dd>
                    </div>
                  ))}
              </dl>
              {page.image && (
                <img
                  src={page.image}
                  alt={`Social preview image for ${page.title}`}
                  loading="lazy"
                  className="mt-4 aspect-[1.91/1] w-full rounded-xl border border-border object-cover"
                />
              )}
            </Panel>

            <Panel title="Generated schemas">
              <Tabs value={activeSchema?.key ?? "WebPage"} onValueChange={setTab}>
                <TabsList className="flex h-auto flex-wrap justify-start gap-1">
                  {schemas.map((s) => (
                    <TabsTrigger key={s.key} value={s.key} className="text-xs">
                      {s.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="mt-4 flex flex-wrap gap-2">
                <CopyButton
                  value={schemas.map((s) => script(s.json)).join("\n")}
                  label="Copy all schemas"
                />
                <DownloadTextButton
                  value={script(allJson)}
                  filename="schemas.html"
                  label="Download combined"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Review every value before publishing — extraction is heuristic and dates, authors or
                NAP details may need a manual tweak.
              </p>
            </Panel>
          </div>

          <Panel
            title={`${activeSchema?.key ?? ""} JSON-LD`}
            className={cn("lg:sticky lg:top-24 lg:self-start")}
            action={
              activeSchema && (
                <div className="flex gap-2">
                  <DownloadTextButton
                    value={script(activeSchema.json)}
                    filename={`${activeSchema.key.toLowerCase()}-schema.html`}
                    label="Save"
                  />
                  <CopyButton value={script(activeSchema.json)} label="Copy script" />
                </div>
              )
            }
          >
            {activeSchema && <CodeOutput code={script(activeSchema.json)} />}
          </Panel>
        </div>
      )}
    </ToolShell>
  );
}
