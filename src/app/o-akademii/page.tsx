import { AboutPage } from "@/components/text/AboutPage";
import { getAboutPage } from "@/content/pages";

export default function AboutRoutePage() {
  const page = getAboutPage();

  return <AboutPage page={page} />;
}
