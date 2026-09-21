import { notFound } from "next/navigation";

import { AboutPage } from "@/components/text/AboutPage";
import { getAboutPage } from "@/content/pages";

export default function AboutRoutePage() {
  const page = getAboutPage();
  if (!page) {
    notFound();
  }

  return <AboutPage page={page} />;
}
