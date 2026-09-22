import { YearNavClient } from "@/components/news/YearNavClient";

export interface YearNavProps {
  years: string[];
  archiveYears: string[];
}

export function YearNav({ years, archiveYears }: YearNavProps) {
  return <YearNavClient years={years} archiveYears={archiveYears} />;
}
