export type ToolCategory = "Image & Assets" | "Schema Builders" | "Text & SEO Meta";

export type ToolId =
  | "webp"
  | "svg-min"
  | "social-resize"
  | "favicon"
  | "faq-schema"
  | "local-schema"
  | "breadcrumb-schema"
  | "howto-schema"
  | "pixel-width"
  | "title-case"
  | "og-preview"
  | "robots";

export interface ToolMeta {
  id: ToolId;
  name: string;
  short: string;
  description: string;
  category: ToolCategory;
  icon: string;
}

export const CATEGORIES: ToolCategory[] = [
  "Image & Assets",
  "Schema Builders",
  "Text & SEO Meta",
];

export const TOOLS: ToolMeta[] = [
  {
    id: "webp",
    name: "Universal Image to WebP Converter",
    short: "Image to WebP",
    description:
      "Drag & drop JPG or PNG files and convert them to WebP in-browser with quality control, SEO slug renaming and zip download.",
    category: "Image & Assets",
    icon: "ImageDown",
  },
  {
    id: "svg-min",
    name: "SVG Minifier & Code Cleaner",
    short: "SVG Minifier",
    description:
      "Paste or upload SVG code to strip comments, metadata, editor cruft and whitespace, then copy the clean markup.",
    category: "Image & Assets",
    icon: "Scissors",
  },
  {
    id: "social-resize",
    name: "Social Media Image Resizer",
    short: "Social Resizer",
    description:
      "Auto-crop and resize any upload to exact Open Graph, Twitter Card, LinkedIn and Instagram dimensions.",
    category: "Image & Assets",
    icon: "Crop",
  },
  {
    id: "favicon",
    name: "Favicon & Web App Icon Generator",
    short: "Favicon Package",
    description:
      "Upload a square PNG to generate a full favicon set plus a ready-to-ship web app manifest, bundled as a zip.",
    category: "Image & Assets",
    icon: "Package",
  },
  {
    id: "faq-schema",
    name: "FAQ Schema Generator",
    short: "FAQ Schema",
    description:
      "Add and remove Q&A pairs to output Google-compliant FAQPage JSON-LD with a live code preview.",
    category: "Schema Builders",
    icon: "MessagesSquare",
  },
  {
    id: "local-schema",
    name: "Local Business / Organization Schema",
    short: "Local Business Schema",
    description:
      "Fill in NAP details, opening hours and logo URL to generate LocalBusiness or Organization JSON-LD.",
    category: "Schema Builders",
    icon: "Store",
  },
  {
    id: "breadcrumb-schema",
    name: "Breadcrumb List Schema Generator",
    short: "Breadcrumb Schema",
    description:
      "Build a hierarchical URL trail and export nested BreadcrumbList structured data.",
    category: "Schema Builders",
    icon: "ListTree",
  },
  {
    id: "howto-schema",
    name: "How-To / Article Schema Builder",
    short: "How-To & Article",
    description:
      "Generate HowTo step markup or Article metadata for rich snippets, all as copy-ready JSON-LD.",
    category: "Schema Builders",
    icon: "BookOpen",
  },
  {
    id: "pixel-width",
    name: "Meta Title & Description Pixel Checker",
    short: "Pixel Width Checker",
    description:
      "Measure real pixel width against Google's ~600px cutoff with character counts and a live SERP preview.",
    category: "Text & SEO Meta",
    icon: "Ruler",
  },
  {
    id: "title-case",
    name: "Title Case & Headline Formatter",
    short: "Case Formatter",
    description:
      "Convert any headline into Title Case, Sentence case, UPPERCASE or lowercase with one click.",
    category: "Text & SEO Meta",
    icon: "CaseSensitive",
  },
  {
    id: "og-preview",
    name: "Social Open Graph Previewer",
    short: "OG Previewer",
    description:
      "Preview how your title, description and image render as cards on X, Facebook and LinkedIn.",
    category: "Text & SEO Meta",
    icon: "Share2",
  },
  {
    id: "robots",
    name: "Robots.txt & XML Sitemap Generator",
    short: "Robots & Sitemap",
    description:
      "Toggle crawler rules and list URLs to generate clean robots.txt and sitemap.xml boilerplate.",
    category: "Text & SEO Meta",
    icon: "FileCode2",
  },
];

export const getTool = (id: ToolId) => TOOLS.find((t) => t.id === id)!;
