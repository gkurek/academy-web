import { redirect } from "next/navigation";

import { adminTabs } from "@/navigation";

// /admin opens the first visible tab.
export default function AdminHomePage() {
  redirect(adminTabs[0].href);
}
