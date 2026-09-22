export type FormatDateRangeOptions = {
  withYear?: boolean;
};

export type DateRangeDisplay = {
  startDateTime: string;
  endDateTime?: string;
  startLabel: string;
  endLabel?: string;
  /** En-dash between day span (same month) or spaced en-dash between full dates. */
  separator?: string;
};

type DateParts = {
  day: string;
  month: string;
  year: string;
};

const dayMonthYearFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getDateParts(isoDate: string): DateParts {
  return dayMonthYearFormatter.formatToParts(parseIsoDate(isoDate)).reduce<DateParts>(
    (acc, { type, value }) => {
      if (type === "day" || type === "month" || type === "year") {
        return { ...acc, [type]: value };
      }
      return acc;
    },
    { day: "", month: "", year: "" },
  );
}

/** Structured labels for `<time>` elements (K-64, K-72). */
export function getDateRangeDisplay(
  date: string,
  dateEnd?: string,
  options: FormatDateRangeOptions = {},
): DateRangeDisplay {
  const withYear = options.withYear ?? true;

  if (!dateEnd || dateEnd === date) {
    const parts = getDateParts(date);
    const label = withYear
      ? `${parts.day} ${parts.month} ${parts.year}`
      : `${parts.day} ${parts.month}`;

    return {
      startDateTime: date,
      startLabel: label,
    };
  }

  const startParts = getDateParts(date);
  const endParts = getDateParts(dateEnd);
  const start = parseIsoDate(date);
  const end = parseIsoDate(dateEnd);
  const sameMonth =
    start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    const monthYearSuffix = withYear
      ? ` ${endParts.month} ${endParts.year}`
      : ` ${endParts.month}`;

    return {
      startDateTime: date,
      endDateTime: dateEnd,
      startLabel: startParts.day,
      endLabel: `${endParts.day}${monthYearSuffix}`,
      separator: "–",
    };
  }

  if (sameYear) {
    const endLabel = withYear
      ? `${endParts.day} ${endParts.month} ${endParts.year}`
      : `${endParts.day} ${endParts.month}`;

    return {
      startDateTime: date,
      endDateTime: dateEnd,
      startLabel: `${startParts.day} ${startParts.month}`,
      endLabel,
      separator: " – ",
    };
  }

  return {
    startDateTime: date,
    endDateTime: dateEnd,
    startLabel: `${startParts.day} ${startParts.month} ${startParts.year}`,
    endLabel: `${endParts.day} ${endParts.month} ${endParts.year}`,
    separator: " – ",
  };
}

/** Plain-text date or range for meta lines and cards (K-64, K-72). */
export function formatDateRange(
  date: string,
  dateEnd?: string,
  options: FormatDateRangeOptions = {},
): string {
  const display = getDateRangeDisplay(date, dateEnd, options);

  if (!display.endLabel) {
    return display.startLabel;
  }

  if (display.separator === "–") {
    return `${display.startLabel}${display.separator}${display.endLabel}`;
  }

  return `${display.startLabel}${display.separator ?? " – "}${display.endLabel}`;
}
