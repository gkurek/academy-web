const MONTH_LOCATIVE_PL = [
  "styczniu",
  "lutym",
  "marcu",
  "kwietniu",
  "maju",
  "czerwcu",
  "lipcu",
  "sierpniu",
  "wrześniu",
  "październiku",
  "listopadzie",
  "grudniu",
] as const;

/** e.g. `2027-06-12` → `czerwcu 2027` (K-127 schedule copy). */
export function formatPolishMonthYearLocative(isoDate: string): string {
  const [yearPart, monthPart] = isoDate.split("-");
  const monthIndex = Number(monthPart) - 1;
  const year = Number(yearPart);

  if (!Number.isFinite(year) || monthIndex < 0 || monthIndex > 11) {
    return "";
  }

  return `${MONTH_LOCATIVE_PL[monthIndex]} ${year}`;
}
