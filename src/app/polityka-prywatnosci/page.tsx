import type { Metadata } from "next";

import { PrivacyPolicyPage } from "@/components/text/PrivacyPolicyPage";
import { getPrivacyPolicyPage } from "@/content/pages";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { navTitle } from "@/navigation";

const path = "/polityka-prywatnosci";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function PrivacyPolicyRoutePage() {
  return <PrivacyPolicyPage page={getPrivacyPolicyPage()} path={path} />;
}
