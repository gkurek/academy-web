export interface YearHeadingProps {
  year: string;
}

export function YearHeading({ year }: YearHeadingProps) {
  return (
    <h2 id={year} className="year-heading">
      <span className="year-heading-text">{year}</span>
      <span className="year-heading-hairline" aria-hidden="true" />
    </h2>
  );
}
