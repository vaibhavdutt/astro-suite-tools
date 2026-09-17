import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeOutput, CopyButton, DownloadTextButton, Field, Panel, ToolShell } from "./primitives";

function SchemaLayout({
  title,
  description,
  form,
  json,
  filename,
}: {
  title: string;
  description: string;
  form: React.ReactNode;
  json: string;
  filename: string;
}) {
  const script = `<script type="application/ld+json">\n${json}\n</script>`;
  return (
    <ToolShell title={title} description={description}>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">{form}</div>
        <Panel
          title="Live JSON-LD"
          className="lg:sticky lg:top-24 lg:self-start"
          action={
            <div className="flex gap-2">
              <DownloadTextButton value={script} filename={filename} label="Save" />
              <CopyButton value={script} label="Copy script" />
            </div>
          }
        >
          <CodeOutput code={script} />
        </Panel>
      </div>
    </ToolShell>
  );
}

const stringify = (obj: unknown) => JSON.stringify(obj, null, 2);

/* --------------------------------------------------------------- FAQ schema */

export function FaqSchema() {
  const [pairs, setPairs] = useState([
    { q: "Do you offer refunds?", a: "Yes, within 30 days of purchase." },
  ]);

  const json = useMemo(
    () =>
      stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: pairs
          .filter((p) => p.q.trim())
          .map((p) => ({
            "@type": "Question",
            name: p.q,
            acceptedAnswer: { "@type": "Answer", text: p.a },
          })),
      }),
    [pairs],
  );

  return (
    <SchemaLayout
      title="FAQ Schema Generator"
      description="Build Google-compliant FAQPage structured data. Add as many question and answer pairs as you need — the JSON-LD updates as you type."
      filename="faq-schema.html"
      json={json}
      form={
        <>
          {pairs.map((p, i) => (
            <Panel
              key={i}
              title={`Question ${i + 1}`}
              action={
                pairs.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setPairs(pairs.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )
              }
            >
              <div className="space-y-4">
                <Field label="Question">
                  <Input
                    value={p.q}
                    onChange={(e) =>
                      setPairs(pairs.map((x, idx) => (idx === i ? { ...x, q: e.target.value } : x)))
                    }
                  />
                </Field>
                <Field label="Answer">
                  <Textarea
                    value={p.a}
                    className="min-h-24"
                    onChange={(e) =>
                      setPairs(pairs.map((x, idx) => (idx === i ? { ...x, a: e.target.value } : x)))
                    }
                  />
                </Field>
              </div>
            </Panel>
          ))}
          <Button variant="soft" onClick={() => setPairs([...pairs, { q: "", a: "" }])}>
            <Plus className="size-4" /> Add question
          </Button>
        </>
      }
    />
  );
}

/* ------------------------------------------------------- Local business */

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function LocalBusinessSchema() {
  const [type, setType] = useState("LocalBusiness");
  const [f, setF] = useState({
    name: "Northline Coffee",
    url: "https://northlinecoffee.com",
    logo: "https://northlinecoffee.com/logo.png",
    phone: "+1 555 018 2299",
    street: "118 Harbor Street",
    city: "Portland",
    region: "ME",
    postal: "04101",
    country: "US",
    priceRange: "$$",
  });
  const [hours, setHours] = useState(
    DAYS.map((d) => ({ day: d, open: "09:00", close: "17:00", closed: d === "Sunday" })),
  );

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  const json = useMemo(
    () =>
      stringify({
        "@context": "https://schema.org",
        "@type": type,
        name: f.name,
        url: f.url,
        logo: f.logo,
        image: f.logo,
        telephone: f.phone,
        priceRange: f.priceRange,
        address: {
          "@type": "PostalAddress",
          streetAddress: f.street,
          addressLocality: f.city,
          addressRegion: f.region,
          postalCode: f.postal,
          addressCountry: f.country,
        },
        openingHoursSpecification: hours
          .filter((h) => !h.closed)
          .map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: `https://schema.org/${h.day}`,
            opens: h.open,
            closes: h.close,
          })),
      }),
    [type, f, hours],
  );

  return (
    <SchemaLayout
      title="Local Business / Organization Schema Builder"
      description="Publish consistent NAP data, opening hours and branding as structured data that search engines can read."
      filename="local-business-schema.html"
      json={json}
      form={
        <>
          <Panel title="Entity">
            <Tabs value={type} onValueChange={setType}>
              <TabsList>
                <TabsTrigger value="LocalBusiness">LocalBusiness</TabsTrigger>
                <TabsTrigger value="Organization">Organization</TabsTrigger>
                <TabsTrigger value="Restaurant">Restaurant</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input value={f.name} onChange={set("name")} />
              </Field>
              <Field label="Website URL">
                <Input value={f.url} onChange={set("url")} />
              </Field>
              <Field label="Logo URL">
                <Input value={f.logo} onChange={set("logo")} />
              </Field>
              <Field label="Telephone">
                <Input value={f.phone} onChange={set("phone")} />
              </Field>
              <Field label="Price range">
                <Input value={f.priceRange} onChange={set("priceRange")} />
              </Field>
            </div>
          </Panel>
          <Panel title="Address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Street">
                <Input value={f.street} onChange={set("street")} />
              </Field>
              <Field label="City">
                <Input value={f.city} onChange={set("city")} />
              </Field>
              <Field label="Region / State">
                <Input value={f.region} onChange={set("region")} />
              </Field>
              <Field label="Postal code">
                <Input value={f.postal} onChange={set("postal")} />
              </Field>
              <Field label="Country code">
                <Input value={f.country} onChange={set("country")} />
              </Field>
            </div>
          </Panel>
          <Panel title="Opening hours">
            <div className="space-y-2">
              {hours.map((h, i) => (
                <div
                  key={h.day}
                  className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[6rem_auto_auto_auto]"
                >
                  <span className="truncate text-sm font-medium">{h.day}</span>
                  {h.closed ? (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={h.open}
                        className="w-28"
                        onChange={(e) =>
                          setHours(
                            hours.map((x, idx) =>
                              idx === i ? { ...x, open: e.target.value } : x,
                            ),
                          )
                        }
                      />
                      <Input
                        type="time"
                        value={h.close}
                        className="w-28"
                        onChange={(e) =>
                          setHours(
                            hours.map((x, idx) =>
                              idx === i ? { ...x, close: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setHours(hours.map((x, idx) => (idx === i ? { ...x, closed: !x.closed } : x)))
                    }
                  >
                    {h.closed ? "Open" : "Mark closed"}
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
        </>
      }
    />
  );
}

/* ---------------------------------------------------------- Breadcrumbs */

export function BreadcrumbSchema() {
  const [items, setItems] = useState([
    { name: "Home", url: "https://example.com/" },
    { name: "Guides", url: "https://example.com/guides/" },
    { name: "Technical SEO", url: "https://example.com/guides/technical-seo/" },
  ]);

  const json = useMemo(
    () =>
      stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items
          .filter((i) => i.name.trim())
          .map((i, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: i.name,
            item: i.url,
          })),
      }),
    [items],
  );

  return (
    <SchemaLayout
      title="Breadcrumb List Schema Generator"
      description="Map your URL hierarchy top-down and export nested BreadcrumbList markup so Google renders the trail in the SERP."
      filename="breadcrumb-schema.html"
      json={json}
      form={
        <>
          <Panel title="Hierarchy">
            <div className="space-y-4">
              {items.map((it, i) => (
                <div key={i} className="rounded-xl border border-border p-4">
                  <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <span className="truncate font-mono text-xs text-primary">
                      Level {i + 1}
                      {i > 0 && " ↳"}
                    </span>
                    {items.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="shrink-0"
                        onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name">
                      <Input
                        value={it.name}
                        onChange={(e) =>
                          setItems(
                            items.map((x, idx) =>
                              idx === i ? { ...x, name: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </Field>
                    <Field label="URL">
                      <Input
                        value={it.url}
                        onChange={(e) =>
                          setItems(
                            items.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)),
                          )
                        }
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="soft"
              className="mt-4"
              onClick={() => setItems([...items, { name: "", url: "" }])}
            >
              <Plus className="size-4" /> Add level
            </Button>
          </Panel>
          <Panel title="Preview">
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              {items.map((i, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  {idx > 0 && <span className="text-muted-foreground">›</span>}
                  <span
                    className={
                      idx === items.length - 1 ? "font-medium" : "text-muted-foreground underline"
                    }
                  >
                    {i.name || "—"}
                  </span>
                </span>
              ))}
            </nav>
          </Panel>
        </>
      }
    />
  );
}

/* -------------------------------------------------------- HowTo / Article */

export function HowToArticleSchema() {
  const [mode, setMode] = useState<"HowTo" | "Article">("HowTo");
  const [howto, setHowto] = useState({
    name: "How to compress images for the web",
    description: "Reduce image weight without visible quality loss.",
    totalTime: "PT10M",
    steps: [
      { name: "Pick your source file", text: "Start from the highest quality original you have." },
      { name: "Convert to WebP", text: "Export at 80% quality and compare against the original." },
    ],
  });
  const [article, setArticle] = useState({
    headline: "Core Web Vitals in 2026: what actually moves rankings",
    description: "A practical breakdown of the metrics that matter and how to fix them.",
    author: "Dana Reyes",
    publisher: "SERPKit Journal",
    logo: "https://example.com/logo.png",
    image: "https://example.com/cover.jpg",
    datePublished: "2026-05-12",
    dateModified: "2026-06-02",
  });

  const json = useMemo(() => {
    if (mode === "HowTo") {
      return stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: howto.name,
        description: howto.description,
        totalTime: howto.totalTime,
        step: howto.steps
          .filter((s) => s.name.trim())
          .map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
      });
    }
    return stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.headline,
      description: article.description,
      image: [article.image],
      author: { "@type": "Person", name: article.author },
      publisher: {
        "@type": "Organization",
        name: article.publisher,
        logo: { "@type": "ImageObject", url: article.logo },
      },
      datePublished: article.datePublished,
      dateModified: article.dateModified,
    });
  }, [mode, howto, article]);

  return (
    <SchemaLayout
      title="How-To / Article Schema Builder"
      description="Switch between step-by-step HowTo markup and Article metadata to earn richer results for tutorials and editorial content."
      filename={`${mode.toLowerCase()}-schema.html`}
      json={json}
      form={
        <>
          <Panel title="Schema type">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "HowTo" | "Article")}>
              <TabsList>
                <TabsTrigger value="HowTo">How-To</TabsTrigger>
                <TabsTrigger value="Article">Article</TabsTrigger>
              </TabsList>
            </Tabs>
          </Panel>

          {mode === "HowTo" ? (
            <>
              <Panel title="Overview">
                <div className="space-y-4">
                  <Field label="Title">
                    <Input
                      value={howto.name}
                      onChange={(e) => setHowto({ ...howto, name: e.target.value })}
                    />
                  </Field>
                  <Field label="Description">
                    <Textarea
                      value={howto.description}
                      onChange={(e) => setHowto({ ...howto, description: e.target.value })}
                    />
                  </Field>
                  <Field label="Total time (ISO 8601, e.g. PT10M)">
                    <Input
                      value={howto.totalTime}
                      onChange={(e) => setHowto({ ...howto, totalTime: e.target.value })}
                    />
                  </Field>
                </div>
              </Panel>
              <Panel title="Steps">
                <div className="space-y-4">
                  {howto.steps.map((s, i) => (
                    <div key={i} className="rounded-xl border border-border p-4">
                      <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                        <span className="font-mono text-xs text-primary">Step {i + 1}</span>
                        {howto.steps.length > 1 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="shrink-0"
                            onClick={() =>
                              setHowto({
                                ...howto,
                                steps: howto.steps.filter((_, idx) => idx !== i),
                              })
                            }
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Field label="Step name">
                          <Input
                            value={s.name}
                            onChange={(e) =>
                              setHowto({
                                ...howto,
                                steps: howto.steps.map((x, idx) =>
                                  idx === i ? { ...x, name: e.target.value } : x,
                                ),
                              })
                            }
                          />
                        </Field>
                        <Field label="Instructions">
                          <Textarea
                            value={s.text}
                            onChange={(e) =>
                              setHowto({
                                ...howto,
                                steps: howto.steps.map((x, idx) =>
                                  idx === i ? { ...x, text: e.target.value } : x,
                                ),
                              })
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="soft"
                  className="mt-4"
                  onClick={() => setHowto({ ...howto, steps: [...howto.steps, { name: "", text: "" }] })}
                >
                  <Plus className="size-4" /> Add step
                </Button>
              </Panel>
            </>
          ) : (
            <Panel title="Article metadata">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Headline">
                  <Input
                    value={article.headline}
                    onChange={(e) => setArticle({ ...article, headline: e.target.value })}
                  />
                </Field>
                <Field label="Author">
                  <Input
                    value={article.author}
                    onChange={(e) => setArticle({ ...article, author: e.target.value })}
                  />
                </Field>
                <Field label="Publisher">
                  <Input
                    value={article.publisher}
                    onChange={(e) => setArticle({ ...article, publisher: e.target.value })}
                  />
                </Field>
                <Field label="Publisher logo URL">
                  <Input
                    value={article.logo}
                    onChange={(e) => setArticle({ ...article, logo: e.target.value })}
                  />
                </Field>
                <Field label="Cover image URL">
                  <Input
                    value={article.image}
                    onChange={(e) => setArticle({ ...article, image: e.target.value })}
                  />
                </Field>
                <Field label="Date published">
                  <Input
                    type="date"
                    value={article.datePublished}
                    onChange={(e) => setArticle({ ...article, datePublished: e.target.value })}
                  />
                </Field>
                <Field label="Date modified">
                  <Input
                    type="date"
                    value={article.dateModified}
                    onChange={(e) => setArticle({ ...article, dateModified: e.target.value })}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Description">
                    <Textarea
                      value={article.description}
                      onChange={(e) => setArticle({ ...article, description: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </Panel>
          )}
        </>
      }
    />
  );
}
