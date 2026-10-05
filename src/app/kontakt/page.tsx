import type { Metadata } from "next";

import { ContactPage } from "@/components/contact/ContactPage";
import { getContactPage } from "@/content/pages";
import { navTitle } from "@/navigation";

const path = "/kontakt";
const title = navTitle(path);

export const metadata: Metadata = {
  title,
};

export default function ContactRoutePage() {
  const { Content } = getContactPage();

  return <ContactPage path={path} title={title} Content={Content} />;
}
