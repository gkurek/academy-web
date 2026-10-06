/** First sentence of a lecture cycle title (through ".") stays on one line when the column is wide enough. */
export function LectureCycleTitle({ cycleTitle }: { cycleTitle: string }) {
  const dotSpace = cycleTitle.indexOf(". ");

  if (dotSpace === -1) {
    return cycleTitle;
  }

  const theme = cycleTitle.slice(0, dotSpace + 1);
  const subtitle = cycleTitle.slice(dotSpace + 2);

  return (
    <>
      <span className="lg:whitespace-nowrap">{theme}</span> {subtitle}
    </>
  );
}
