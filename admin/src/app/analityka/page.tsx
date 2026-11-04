import { AdminPage } from "@/components/AdminPage";
import { pl } from "@/i18n/pl";

// Charts and period switches arrive in 12b-2; 12a only frames the page.
export default function AnalyticsPage() {
  return <AdminPage heading={pl.tabs.analytics} />;
}
