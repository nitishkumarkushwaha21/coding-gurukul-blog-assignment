import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export function SEOHead({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata {
  return buildPageMetadata({ title, description });
}
