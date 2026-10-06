import type { Metadata } from "next";

import { AboutPage } from "@/components/text/AboutPage";
import { getAboutPage } from "@/content/pages";
import { navTitle } from "@/navigation";

const path = "/o-akademii";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function AboutRoutePage() {
  return <AboutPage page={getAboutPage()} path={path} />;
}
