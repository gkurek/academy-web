import { AdminPage } from "@/components/AdminPage";
import { pl } from "@/i18n/pl";

// Empty for now — list and entry form come with 12d (K-171).
export default function NewsPage() {
  return <AdminPage heading={pl.tabs.news} />;
}
