import { getDateRangeDisplay } from "@/lib/formatDateRange";

export interface NewsDateMetaProps {
  date: string;
  dateEnd?: string;
  withYear: boolean;
  className?: string;
}

export function NewsDateMeta({ date, dateEnd, withYear, className }: NewsDateMetaProps) {
  const display = getDateRangeDisplay(date, dateEnd, { withYear });

  if (!display.endLabel) {
    return (
      <time dateTime={display.startDateTime} className={className}>
        {display.startLabel}
      </time>
    );
  }

  return (
    <span className={className}>
      <time dateTime={display.startDateTime}>{display.startLabel}</time>
      {display.separator}
      <time dateTime={display.endDateTime}>{display.endLabel}</time>
    </span>
  );
}
