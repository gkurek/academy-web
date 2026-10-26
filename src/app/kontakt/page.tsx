import type { Metadata } from "next";

import { ContactPage } from "@/components/contact/ContactPage";
import { getContactPage } from "@/content/pages";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { navTitle } from "@/navigation";

const path = "/kontakt";
const title = navTitle(path);

export const metadata: Metadata = pageMetadata({ path, title, ...getPageSeo(path) });

export default function ContactRoutePage() {
  const { photo, Content } = getContactPage();

  return <ContactPage path={path} title={title} photo={photo} Content={Content} />;
}
