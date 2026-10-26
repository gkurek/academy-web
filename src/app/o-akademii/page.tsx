import type { Metadata } from "next";

import { JsonLd } from "@/components/core/JsonLd";
import { AboutPage } from "@/components/text/AboutPage";
import { getAboutPage } from "@/content/pages";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { FOUNDER_PATH, founderNode } from "@/lib/structured-data/person";
import { navTitle } from "@/navigation";

const path = FOUNDER_PATH;

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function AboutRoutePage() {
  const page = getAboutPage();

  return (
    <>
      <JsonLd data={founderNode(page.person.profile)} />
      <AboutPage page={page} path={path} />
    </>
  );
}
