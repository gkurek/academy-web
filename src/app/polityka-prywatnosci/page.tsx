import type { Metadata } from "next";

import { PrivacyPolicyPage } from "@/components/text/PrivacyPolicyPage";
import { getPrivacyPolicyPage } from "@/content/pages";
import { navTitle } from "@/navigation";

const path = "/polityka-prywatnosci";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function PrivacyPolicyRoutePage() {
  return <PrivacyPolicyPage page={getPrivacyPolicyPage()} path={path} />;
}
