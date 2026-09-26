import type { Metadata } from "next";

import { ExhibitionPage } from "@/components/exhibition/ExhibitionPage";
import { pl } from "@/i18n/pl";
import { mainNav, sectionNav } from "@/navigation";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: pl.exhibition.page.title,
};

const mainNavActive = mainNav.find((item) => item.href === "/ikony")!.label;
const sectionItem = sectionNav.ikony.find((link) => link.href === "/ikony/wystawy")!;

export default function ExhibitionRoutePage() {
  return <ExhibitionPage active={mainNavActive} sectionActive={sectionItem.label} />;
}
