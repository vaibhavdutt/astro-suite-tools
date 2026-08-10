/* Server-only HTML extraction helpers (regex based — no DOM dependency). */

export interface ExtractedPage {
  url: string;
  finalUrl: string;
  title: string;
  description: string;
  canonical: string;
  siteName: string;
  language: string;
  image: string;
  h1: string;
  author: string;
  datePublished: string;
  dateModified: string;
  telephone: string;
  logo: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours: string[];
  priceRange: string;
  faqs: { q: string; a: string }[];
  steps: { name: string; text: string }[];
  breadcrumbs: { name: string; url: string }[];
  existingSchemaTypes: string[];
}

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&rsquo;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/\s+/g, " ")
    .trim();

const strip = (html: string) => decode(html.replace(/<[^>]*>/g, " "));

function meta(html: string, key: string): string {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`,
      "i",
    ),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return decode(m[1]);
  }
  return "";
}

function tags(html: string, tag: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const text = strip(m[1] ?? "");
    if (text) out.push(text);
  }
  return out;
}

function jsonLdBlocks(html: string): unknown[] {
  const out: unknown[] = [];
  const re = /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse((m[1] ?? "").trim());
      out.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      /* ignore malformed blocks */
    }
  }
  return out;
}

type LdNode = any;

const flatten = (nodes: unknown[]): LdNode[] => {
  const res: LdNode[] = [];
  const walk = (n: unknown) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (n && typeof n === "object") {
      const obj = n as Record<string, any>;
      res.push(obj);
      if (Array.isArray(obj["@graph"])) obj["@graph"].forEach(walk);
    }
  };
  nodes.forEach(walk);
  return res;
};

const typeOf = (n: LdNode): string[] => {
  const t = n["@type"];
  return (Array.isArray(t) ? t : [t]).filter((x): x is string => typeof x === "string");
};

const asName = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return asName(v[0]);
  if (v && typeof v === "object") return String((v as any).name ?? (v as any).url ?? "");
  return "";
};

const asUrl = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return asUrl(v[0]);
  if (v && typeof v === "object") return String((v as any).url ?? (v as any).contentUrl ?? "");
  return "";
};

/* ------------------------------------------------------------- FAQ mining */

function mineFaqs(html: string, nodes: LdNode[]): { q: string; a: string }[] {
  const fromLd: { q: string; a: string }[] = [];
  for (const n of nodes) {
    if (!typeOf(n).includes("Question")) continue;
    const q = asName(n.name);
    const a = strip(String(n.acceptedAnswer?.text ?? n.acceptedAnswer?.name ?? ""));
    if (q) fromLd.push({ q, a });
  }
  if (fromLd.length) return fromLd.slice(0, 20);

  const out: { q: string; a: string }[] = [];
  const re = /<(h2|h3|h4|summary|dt)[^>]*>([\s\S]*?)<\/\1>([\s\S]{0,2000}?)(?=<(?:h2|h3|h4|summary|dt)[^>]*>|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const q = strip(m[2] ?? "");
    if (!q || !/\?\s*$/.test(q) || q.length > 200) continue;
    const body = m[3] ?? "";
    const para = body.match(/<(?:p|dd|div)[^>]*>([\s\S]*?)<\/(?:p|dd|div)>/i);
    const a = strip(para?.[1] ?? body).slice(0, 600);
    if (a) out.push({ q, a });
  }
  return out.slice(0, 20);
}

/* ----------------------------------------------------------- Step mining */

function mineSteps(html: string, nodes: LdNode[]): { name: string; text: string }[] {
  for (const n of nodes) {
    if (!typeOf(n).includes("HowTo") || !Array.isArray(n.step)) continue;
    const steps = n.step
      .map((s: any) => ({
        name: asName(s?.name) || strip(String(s?.text ?? "")).slice(0, 80),
        text: strip(String(s?.text ?? s?.itemListElement?.[0]?.text ?? "")),
      }))
      .filter((s: { name: string }) => s.name);
    if (steps.length) return steps.slice(0, 25);
  }

  const ol = html.match(/<ol[^>]*>([\s\S]*?)<\/ol>/i);
  if (ol) {
    const items = tags(ol[1] ?? "", "li").filter((t) => t.length > 8);
    if (items.length >= 2)
      return items.slice(0, 25).map((t, i) => ({
        name: t.length > 70 ? `Step ${i + 1}` : t,
        text: t,
      }));
  }

  const headings = tags(html, "h2").filter((h) => /^(step\s*\d|\d+[.)]\s)/i.test(h));
  return headings.slice(0, 25).map((h) => ({ name: h, text: h }));
}

/* ---------------------------------------------------------- Breadcrumbs */

function mineBreadcrumbs(
  finalUrl: string,
  nodes: LdNode[],
): { name: string; url: string }[] {
  for (const n of nodes) {
    if (!typeOf(n).includes("BreadcrumbList") || !Array.isArray(n.itemListElement)) continue;
    const list = n.itemListElement
      .map((el: any) => ({
        name: asName(el?.name ?? el?.item),
        url: asUrl(el?.item ?? el?.url),
      }))
      .filter((x: { name: string }) => x.name);
    if (list.length) return list;
  }

  const u = new URL(finalUrl);
  const parts = u.pathname.split("/").filter(Boolean);
  const crumbs = [{ name: "Home", url: `${u.origin}/` }];
  let path = "";
  for (const p of parts) {
    path += `/${p}`;
    crumbs.push({
      name: decodeURIComponent(p.replace(/\.\w+$/, ""))
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      url: `${u.origin}${path}${u.pathname.endsWith("/") ? "/" : ""}`,
    });
  }
  return crumbs;
}

/* ------------------------------------------------------------- Main entry */

export async function extractPage(rawUrl: string): Promise<ExtractedPage> {
  let target: URL;
  try {
    target = new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`);
  } catch {
    throw new Error("That does not look like a valid URL.");
  }
  if (!/^https?:$/.test(target.protocol)) throw new Error("Only http and https URLs are supported.");

  const res = await fetch(target.toString(), {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; SERPKitBot/1.0; +https://serpkit.app)",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`The page responded with ${res.status} ${res.statusText}.`);

  const ct = res.headers.get("content-type") ?? "";
  if (ct && !/html|xml|text\/plain/i.test(ct))
    throw new Error(`Expected an HTML page but received "${ct.split(";")[0]}".`);

  const html = (await res.text()).slice(0, 2_500_000);
  const finalUrl = res.url || target.toString();
  const nodes = flatten(jsonLdBlocks(html));

  const org = nodes.find((n) =>
    typeOf(n).some((t) => /LocalBusiness|Organization|Restaurant|Store|Hotel/i.test(t)),
  );
  const art = nodes.find((n) => typeOf(n).some((t) => /Article|BlogPosting|NewsArticle/i.test(t)));
  const addr: LdNode = org?.address ?? {};

  const telMatch = html.match(/href=["']tel:([^"']+)["']/i);
  const postalGuess = html.match(
    /([A-Z][A-Za-z.\- ]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/,
  );

  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const langAttr = html.match(/<html[^>]*\slang=["']([^"']+)["']/i);
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const iconLink = html.match(
    /<link[^>]+rel=["'](?:apple-touch-icon|icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i,
  );

  const absolute = (v: string) => {
    if (!v) return "";
    try {
      return new URL(v, finalUrl).toString();
    } catch {
      return v;
    }
  };

  return {
    url: rawUrl,
    finalUrl,
    title: meta(html, "og:title") || decode(titleTag?.[1] ?? ""),
    description: meta(html, "description") || meta(html, "og:description"),
    canonical: canonical?.[1] ? absolute(canonical[1]) : finalUrl,
    siteName: meta(html, "og:site_name") || asName(org?.name) || new URL(finalUrl).hostname,
    language: langAttr?.[1] ?? "",
    image: absolute(meta(html, "og:image") || meta(html, "twitter:image") || asUrl(art?.image)),
    h1: tags(html, "h1")[0] ?? "",
    author:
      asName(art?.author) ||
      meta(html, "author") ||
      meta(html, "article:author"),
    datePublished:
      String(art?.datePublished ?? "").slice(0, 10) ||
      meta(html, "article:published_time").slice(0, 10),
    dateModified:
      String(art?.dateModified ?? "").slice(0, 10) ||
      meta(html, "article:modified_time").slice(0, 10),
    telephone: asName(org?.telephone) || decode(telMatch?.[1] ?? ""),
    logo: absolute(asUrl(org?.logo) || (iconLink?.[1] ?? "") || meta(html, "og:image")),
    address: {
      streetAddress: String(addr.streetAddress ?? ""),
      addressLocality: String(addr.addressLocality ?? postalGuess?.[1] ?? ""),
      addressRegion: String(addr.addressRegion ?? postalGuess?.[2] ?? ""),
      postalCode: String(addr.postalCode ?? postalGuess?.[3] ?? ""),
      addressCountry: String(
        typeof addr.addressCountry === "object"
          ? (addr.addressCountry?.name ?? "")
          : (addr.addressCountry ?? ""),
      ),
    },
    openingHours: (Array.isArray(org?.openingHours)
      ? org.openingHours
      : org?.openingHours
        ? [org.openingHours]
        : Array.isArray(org?.openingHoursSpecification)
          ? org.openingHoursSpecification.map(
              (h: any) =>
                `${asName(h?.dayOfWeek).split("/").pop()} ${h?.opens ?? ""}-${h?.closes ?? ""}`,
            )
          : []
    ).map((x: unknown) => String(x)),
    priceRange: String(org?.priceRange ?? ""),
    faqs: mineFaqs(html, nodes),
    steps: mineSteps(html, nodes),
    breadcrumbs: mineBreadcrumbs(finalUrl, nodes),
    existingSchemaTypes: Array.from(new Set(nodes.flatMap(typeOf))).filter(Boolean),
  };
}
