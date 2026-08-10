import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractPage, type ExtractedPage } from "./scrape.server";

export type { ExtractedPage };

export const analyzeUrl = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ url: z.string().min(3).max(2048) }).parse(data))
  .handler(async ({ data }) => extractPage(data.url));
