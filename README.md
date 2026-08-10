# SERPKit: Web Tool Suite

Build a modern, single-page Web Utilities Suite called "SERPKit" using React and Tailwind CSS.

### Overall Structure & Layout:

1. Top Navigation Bar:

   - App Logo ("SERPKit"), a live Search bar to filter tools, and a "Tools Menu" dropdown listing all tools.

2. Home Page / Dashboard:

   - Hero header title.

   - Clean card grid layout matching modern SaaS designs (rounded corners, subtle borders, icons, titles, short descriptions).

   - Category filter buttons at the top ("All", "Image & Assets", "Schema Builders", "Text & SEO Meta").

3. View Switcher:

   - Clicking any card opens that specific tool view with a sidebar or header dropdown menu to easily switch between tools without returning home.

---

### COMPLETE LIST OF ALL INTEGRATED TOOLS:

CATEGORY 1: Image & Asset Tools (100% Client-Side JS / $0 Backend Costs)

1. "Universal Image to WebP Converter": 

   - Supports drag-and-drop for JPG, JPEG, and PNG images.

   - Uses HTML5 Canvas API to convert files directly in the browser with zero server upload.

   - Includes a quality selection slider (0-100%), bulk conversion, an option to auto-rename files into SEO hyphenated slugs, and a zip/bulk download button.

2. "SVG Minifier & Code Cleaner": 

   - Paste raw SVG code or upload an .svg file to strip out comments, metadata, and whitespace, with a copy button.

3. "Social Media Image Resizer": 

   - Upload an image and auto-crop/resize to exact dimensions for Open Graph / Twitter Cards (1200x630), LinkedIn, and Instagram.

4. "Favicon & Web App Icon Package Generator": 

   - Upload a square PNG to generate favicons along with web app manifest JSON files ready to download.

CATEGORY 2: Structured Data & Schema Builders (Pure Frontend JSON-LD Output)

5. "FAQ Schema Generator": 

   - Dynamic input fields to add/remove Question & Answer pairs, outputting Google-compliant JSON-LD schema with live code preview and a copy button.

6. "Local Business / Organization Schema Builder": 

   - Form for Name, Address, Phone (NAP), opening hours, and logo URL to output structured JSON-LD.

7. "Breadcrumb List Schema Generator": 

   - Hierarchical URL input form to generate nested breadcrumb schema.

8. "How-To / Article Schema Builder": 

   - Form inputs for step-by-step instructions or article metadata to generate rich snippet JSON-LD markup.

CATEGORY 3: Text, Meta & Content Utilities

9. "Meta Title & Description Pixel Width Checker": 

   - Real-time character counter AND pixel-width calculator (checking against Google's ~600px cutoff) with a live Google SERP preview box.

10. "Title Case & Headline Formatter": 

    - Text input to instantly convert text into Title Case, Sentence Case, UPPERCASE, or lowercase with one click.

11. "Social Open Graph Previewer": 

    - Enter Title, Description, and Image URL to display live card previews for Twitter/X, Facebook, and LinkedIn.

12. "Robots.txt & XML Sitemap Generator": 

    - Simple form toggle interface to generate clean robots.txt files and XML sitemap boilerplates.

Ensure all image processing, text formatting, and schema outputs happen completely on the client side in the browser.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b2e4946a-94a7-44b7-962e-80314f268d56).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
