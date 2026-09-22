import { PrivacyPolicyPage } from "@/components/text/PrivacyPolicyPage";
import { getPrivacyPolicyPage } from "@/content/pages";
import { footerLegalLink } from "@/navigation";

export default function PrivacyPolicyRoutePage() {
  const page = getPrivacyPolicyPage();

  return <PrivacyPolicyPage page={page} />;
}

export const metadata = {
  title: footerLegalLink.label,
};
