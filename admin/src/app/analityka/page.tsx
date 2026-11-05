import { AdminPage } from "@/components/AdminPage";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { pl } from "@/i18n/pl";
import { USING_SAMPLE_DATA } from "@/lib/analyticsSource";
import { DEV_STATES, getPeriodViews, type DevState } from "@/lib/analyticsView";
import { POSTHOG_URL } from "@/lib/site";

function devState(value: string | string[] | undefined): DevState | undefined {
  if (process.env.NODE_ENV !== "development") return undefined;
  return DEV_STATES.find((state) => state === value);
}

export default async function AnalyticsPage({ searchParams }: PageProps<"/analityka">) {
  const views = await getPeriodViews(devState((await searchParams).stan));

  return (
    <AdminPage
      heading={pl.tabs.analytics}
      actions={
        <a
          href={POSTHOG_URL}
          target="_blank"
          rel="noopener"
          className="flex min-h-tap items-center gap-1.5 text-ui text-gold underline decoration-line-gold underline-offset-4 hover:text-gold-hover"
        >
          {pl.analytics.openPostHog}
          <ExternalLinkIcon />
          <span className="sr-only">{pl.header.externalNewTab}</span>
        </a>
      }
    >
      <AnalyticsDashboard views={views} sample={USING_SAMPLE_DATA} />
    </AdminPage>
  );
}
