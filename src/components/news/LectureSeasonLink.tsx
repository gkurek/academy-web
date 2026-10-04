import Link from "next/link";

import { getLectureSeasonLink } from "@/content/news";

export interface LectureSeasonLinkProps {
  /** Lecture season slug, e.g. `"2026-2027"`. */
  season: string;
}

/**
 * MDX link to a lecture season's program; label and target follow the season's
 * state (hub while current, archive anchor afterwards — LK1). Plain `<a>` so
 * `.news-prose` link styles apply.
 */
export function LectureSeasonLink({ season }: LectureSeasonLinkProps) {
  const { label, href } = getLectureSeasonLink(season);
  return <Link href={href}>{label}</Link>;
}
