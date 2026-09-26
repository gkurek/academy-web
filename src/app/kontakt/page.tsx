import { ContactPage } from "@/components/contact/ContactPage";
import { getContactPage } from "@/content/pages";
import { mainNav } from "@/navigation";

const contactLabel = mainNav.find((item) => item.href === "/kontakt")!.label;

export default function ContactRoutePage() {
  const { Content } = getContactPage();

  return <ContactPage Content={Content} />;
}

export const metadata = {
  title: contactLabel,
};
