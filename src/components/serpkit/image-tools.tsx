import { useMemo, useState } from "react";
import JSZip from "jszip";
import { Download, FileArchive, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  CodeOutput,
  CopyButton,
  DownloadTextButton,
  DropZone,
  Field,
  Panel,
  ToolShell,
  slugify,
} from "./primitives";

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode image"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Encoding failed"))), type, quality),
  );
}

const kb = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.round(bytes / 1024)} KB`;

/* ------------------------------------------------------------------ 1. WebP */

interface Converted {
  name: string;
  originalName: string;
  originalSize: number;
  size: number;
  blob: Blob;
  url: string;
}

export function WebpConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [seoNames, setSeoNames] = useState(true);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Converted[]>([]);

  const addFiles = (incoming: File[]) => {
    const valid = incoming.filter((f) => /image\/(jpeg|jpg|png)/i.test(f.type));
    setFiles((prev) => [...prev, ...valid]);
  };

  const convert = async () => {
    setBusy(true);
    const out: Converted[] = [];
    for (const file of files) {
      try {
        const img = await loadImage(file);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        const blob = await canvasToBlob(canvas, "image/webp", quality / 100);
        const base = file.name.replace(/\.[^.]+$/, "");
        out.push({
          name: `${seoNames ? slugify(base) : base}.webp`,
          originalName: file.name,
          originalSize: file.size,
          size: blob.size,
          blob,
          url: URL.createObjectURL(blob),
        });
      } catch {
        /* skip unreadable file */
      }
    }
    setResults(out);
    setBusy(false);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    results.forEach((r) => zip.file(r.name, r.blob));
    saveBlob(await zip.generateAsync({ type: "blob" }), "serpkit-webp.zip");
  };

  const saved = results.reduce((a, r) => a + (r.originalSize - r.size), 0);

  return (
    <ToolShell
      title="Universal Image to WebP Converter"
      description="Everything runs on the HTML5 Canvas API inside your browser — no upload, no server, no cost. Drop JPG or PNG files, tune the quality, and download individually or as a zip."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel title="Source images">
          <DropZone
            accept="image/jpeg,image/png"
            multiple
            onFiles={addFiles}
            hint="JPG, JPEG and PNG · batch friendly"
          />
          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{kb(f.size)}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel title="Settings">
            <div className="space-y-6">
              <div>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-medium">Quality</span>
                  <span className="font-mono text-primary">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(v) => setQuality(v[0] ?? quality)}
                />
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">SEO hyphenated filenames</p>
                  <p className="text-xs text-muted-foreground">My Photo.jpg → my-photo.webp</p>
                </div>
                <Switch checked={seoNames} onCheckedChange={setSeoNames} className="shrink-0" />
              </div>
              <Button
                variant="brand"
                className="w-full"
                disabled={!files.length || busy}
                onClick={convert}
              >
                {busy && <Loader2 className="size-4 animate-spin" />}
                Convert {files.length || ""} to WebP
              </Button>
            </div>
          </Panel>

          {results.length > 0 && (
            <Panel
              title={`Results · saved ${kb(Math.max(saved, 0))}`}
              action={
                <Button size="sm" variant="soft" onClick={downloadZip}>
                  <FileArchive className="size-4" /> Zip
                </Button>
              }
            >
              <ul className="space-y-2">
                {results.map((r) => (
                  <li
                    key={r.name}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {kb(r.originalSize)} → {kb(r.size)}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" className="shrink-0" asChild>
                      <a href={r.url} download={r.name}>
                        <Download className="size-4" />
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </ToolShell>
  );
}

/* -------------------------------------------------------------- 2. SVG min */

function minifySvg(svg: string) {
  return svg
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<desc[\s\S]*?<\/desc>/gi, "")
    .replace(/<(sodipodi|inkscape)[^>]*\/?>/gi, "")
    .replace(/\s(sodipodi|inkscape|xmlns:sodipodi|xmlns:inkscape|xmlns:dc|xmlns:cc|xmlns:rdf|xmlns:svg|xmlns:serif|serif|data-name|id)(:[\w-]+)?="[^"]*"/gi, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\/>/g, "/>")
    .trim();
}

export function SvgMinifier() {
  const [raw, setRaw] = useState("");
  const min = useMemo(() => (raw.trim() ? minifySvg(raw) : ""), [raw]);
  const savedPct = raw.length ? Math.max(0, Math.round((1 - min.length / raw.length) * 100)) : 0;

  return (
    <ToolShell
      title="SVG Minifier & Code Cleaner"
      description="Strips comments, XML prologues, editor metadata and redundant whitespace from SVG markup. Paste code or upload a file — nothing leaves your browser."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="Raw SVG"
          action={
            <label className="cursor-pointer text-xs font-medium text-primary underline-offset-4 hover:underline">
              Upload .svg
              <input
                type="file"
                accept=".svg,image/svg+xml"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) setRaw(await f.text());
                }}
              />
            </label>
          }
        >
          <Textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="<svg xmlns='http://www.w3.org/2000/svg' ...>"
            className="min-h-[22rem] font-mono text-xs"
          />
        </Panel>
        <Panel
          title={`Minified · ${savedPct}% smaller`}
          action={
            <div className="flex gap-2">
              {min && <DownloadTextButton value={min} filename="clean.svg" label="Save" />}
              <CopyButton value={min} />
            </div>
          }
        >
          {min ? (
            <>
              <CodeOutput code={min} />
              <div
                className="mt-4 grid min-h-24 place-items-center rounded-xl border border-border bg-muted/40 p-4 [&_svg]:max-h-32"
                dangerouslySetInnerHTML={{ __html: min }}
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Output appears here.</p>
          )}
        </Panel>
      </div>
    </ToolShell>
  );
}

/* ---------------------------------------------------------- 3. Social sizes */

const SOCIAL_PRESETS = [
  { label: "Open Graph / Facebook", w: 1200, h: 630 },
  { label: "Twitter / X summary large", w: 1200, h: 675 },
  { label: "LinkedIn share", w: 1200, h: 627 },
  { label: "Instagram square", w: 1080, h: 1080 },
  { label: "Instagram portrait", w: 1080, h: 1350 },
  { label: "Instagram story", w: 1080, h: 1920 },
];

export function SocialResizer() {
  const [source, setSource] = useState<File | null>(null);
  const [outputs, setOutputs] = useState<{ label: string; url: string; name: string; w: number; h: number }[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async (file: File) => {
    setBusy(true);
    const img = await loadImage(file);
    const made: typeof outputs = [];
    for (const p of SOCIAL_PRESETS) {
      const canvas = document.createElement("canvas");
      canvas.width = p.w;
      canvas.height = p.h;
      const ctx = canvas.getContext("2d")!;
      const scale = Math.max(p.w / img.naturalWidth, p.h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (p.w - dw) / 2, (p.h - dh) / 2, dw, dh);
      const blob = await canvasToBlob(canvas, "image/png");
      made.push({
        label: p.label,
        url: URL.createObjectURL(blob),
        name: `${slugify(p.label)}-${p.w}x${p.h}.png`,
        w: p.w,
        h: p.h,
      });
    }
    setOutputs(made);
    setBusy(false);
  };

  return (
    <ToolShell
      title="Social Media Image Resizer"
      description="Center-crops and rescales one upload into every major social dimension using the Canvas API. Download the crops you need."
    >
      <div className="space-y-5">
        <Panel title="Upload">
          <DropZone
            accept="image/*"
            onFiles={(f) => {
              if (f[0]) {
                setSource(f[0]);
                void run(f[0]);
              }
            }}
            hint="Any image · cropped from the center, never stretched"
          />
          {source && (
            <p className="mt-3 text-xs text-muted-foreground">
              {source.name} · {kb(source.size)} {busy && "· rendering crops…"}
            </p>
          )}
        </Panel>
        {outputs.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {outputs.map((o) => (
              <Panel key={o.name}>
                <div className="overflow-hidden rounded-xl border border-border bg-muted">
                  <img src={o.url} alt={o.label} className="h-40 w-full object-cover" />
                </div>
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{o.label}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {o.w}×{o.h}
                    </p>
                  </div>
                  <Button size="sm" variant="soft" className="shrink-0" asChild>
                    <a href={o.url} download={o.name}>
                      <Download className="size-4" />
                    </a>
                  </Button>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </div>
    </ToolShell>
  );
}

/* ------------------------------------------------------------- 4. Favicons */

const FAVICON_SIZES = [16, 32, 48, 64, 96, 180, 192, 256, 512];

export function FaviconGenerator() {
  const [appName, setAppName] = useState("My App");
  const [themeColor, setThemeColor] = useState("#0f766e");
  const [icons, setIcons] = useState<{ size: number; url: string; blob: Blob }[]>([]);
  const [busy, setBusy] = useState(false);

  const manifest = useMemo(
    () =>
      JSON.stringify(
        {
          name: appName,
          short_name: appName.split(" ")[0],
          icons: [192, 512].map((s) => ({
            src: `/icons/favicon-${s}x${s}.png`,
            sizes: `${s}x${s}`,
            type: "image/png",
            purpose: "any maskable",
          })),
          theme_color: themeColor,
          background_color: "#ffffff",
          display: "standalone",
          start_url: "/",
        },
        null,
        2,
      ),
    [appName, themeColor],
  );

  const headSnippet = `<link rel="icon" href="/icons/favicon-32x32.png" sizes="32x32" />
<link rel="icon" href="/icons/favicon-192x192.png" sizes="192x192" />
<link rel="apple-touch-icon" href="/icons/favicon-180x180.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="${themeColor}" />`;

  const build = async (file: File) => {
    setBusy(true);
    const img = await loadImage(file);
    const made: typeof icons = [];
    for (const size of FAVICON_SIZES) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, size, size);
      const blob = await canvasToBlob(canvas, "image/png");
      made.push({ size, url: URL.createObjectURL(blob), blob });
    }
    setIcons(made);
    setBusy(false);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("icons")!;
    icons.forEach((i) => folder.file(`favicon-${i.size}x${i.size}.png`, i.blob));
    zip.file("site.webmanifest", manifest);
    zip.file("head-snippet.html", headSnippet);
    saveBlob(await zip.generateAsync({ type: "blob" }), "serpkit-favicons.zip");
  };

  return (
    <ToolShell
      title="Favicon & Web App Icon Package Generator"
      description="Upload one square PNG and get every icon size, a valid web app manifest and the HTML head snippet — packaged as a zip, generated locally."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Panel title="Source icon">
            <DropZone
              accept="image/png,image/svg+xml,image/jpeg"
              onFiles={(f) => f[0] && build(f[0])}
              hint="Square PNG recommended · 512×512 or larger"
            />
            {busy && <p className="mt-3 text-xs text-muted-foreground">Generating sizes…</p>}
          </Panel>
          <Panel title="Manifest details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="App name">
                <Input value={appName} onChange={(e) => setAppName(e.target.value)} />
              </Field>
              <Field label="Theme color">
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="h-9 w-14 p-1"
                  />
                  <Input value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
                </div>
              </Field>
            </div>
          </Panel>
          {icons.length > 0 && (
            <Panel
              title="Generated sizes"
              action={
                <Button size="sm" variant="brand" onClick={downloadZip}>
                  <FileArchive className="size-4" /> Download package
                </Button>
              }
            >
              <div className="flex flex-wrap items-end gap-4">
                {icons.map((i) => (
                  <a
                    key={i.size}
                    href={i.url}
                    download={`favicon-${i.size}x${i.size}.png`}
                    className="text-center"
                  >
                    <img
                      src={i.url}
                      alt={`${i.size} icon`}
                      className="mx-auto rounded border border-border"
                      style={{ width: Math.min(i.size, 64), height: Math.min(i.size, 64) }}
                    />
                    <span className="mt-1 block font-mono text-[0.65rem] text-muted-foreground">
                      {i.size}
                    </span>
                  </a>
                ))}
              </div>
            </Panel>
          )}
        </div>
        <div className="space-y-5">
          <Panel title="site.webmanifest" action={<CopyButton value={manifest} />}>
            <CodeOutput code={manifest} />
          </Panel>
          <Panel title="HTML head snippet" action={<CopyButton value={headSnippet} />}>
            <CodeOutput code={headSnippet} />
          </Panel>
        </div>
      </div>
    </ToolShell>
  );
}
