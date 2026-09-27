import { decodeHtml, htmlToMarkdownBody } from "./html";
import { resolveLecturerSlugs } from "./lecturer-resolve";

export type ParsedLecture = {
  date: string;
  title: string;
  lecturerSlugs: string[];
  note?: string;
  unresolvedLecturers?: string[];
};

export type ParsedLectureSeason = {
  slug: string;
  label: string;
  cycleTitle: string;
  intro?: string;
  lectures: ParsedLecture[];
};

const POLISH_MONTHS: Record<string, number> = {
  stycznia: 1,
  lutego: 2,
  marca: 3,
  kwietnia: 4,
  maja: 5,
  czerwca: 6,
  lipca: 7,
  sierpnia: 8,
  września: 9,
  wrzesnia: 9,
  października: 10,
  pazdziernika: 10,
  listopada: 11,
  grudnia: 12,
};

const ROMAN_MONTHS: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
  XI: 11,
  XII: 12,
};

const LECTURE_TITLE_SEPARATOR = " · ";
const PROGRAM_FOOTER_PATTERN =
  /\b(Na wykłady zapraszamy|Spotkania odbywają się|Zajęcia odbywają się|MODLITWA I WARSZTAT|Cykle wykładowe|ŚLADAMI NAJPIĘKNIEJSZYCH IKON|Akademia Ikony jest skierowana)/i;

const pad2 = (value: number): string => String(value).padStart(2, "0");

export const seasonSlugFromWpSlug = (wpSlug: string): string | undefined => {
  const longMatch = wpSlug.match(/wyklady-(\d{4})-(\d{4})(?:-\d+)?$/);
  if (longMatch) {
    return `${longMatch[1]}-${longMatch[2]}`;
  }
  const shortMatch = wpSlug.match(/wyklady-(\d{4})(\d{4})(?:-\d+)?$/);
  if (shortMatch) {
    return `${shortMatch[1]}-${shortMatch[2]}`;
  }
  const swiatMatch = wpSlug.match(/rok-(\d{4})(\d{4})/);
  if (swiatMatch) {
    return `${swiatMatch[1]}-${swiatMatch[2]}`;
  }
  return undefined;
};

const seasonLabelFromSlug = (slug: string): string => {
  const [start, end] = slug.split("-");
  return `${start}/${end}`;
};

const isoDateForSeason = (seasonSlug: string, day: number, month: number): string => {
  const [startYear, endYear] = seasonSlug.split("-").map(Number);
  const year = month >= 10 ? startYear : endYear;
  return `${year}-${pad2(month)}-${pad2(day)}`;
};

type DateMarker = {
  index: number;
  day: number;
  month: number;
};

const findDateMarkers = (text: string): DateMarker[] => {
  const markers: DateMarker[] = [];

  const numericPattern = /(?:^|[\s;])(\d{1,2})\.(\d{1,2})\.(?:\s*\d{4}\.)?/g;
  let match = numericPattern.exec(text);
  while (match) {
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) {
      markers.push({
        index: match.index + match[0].indexOf(match[1]),
        day: Number(match[1]),
        month,
      });
    }
    match = numericPattern.exec(text);
  }

  const romanPattern = /(?:^|[\s;])(\d{1,2})\.\s*([IVXLC]+)\./g;
  match = romanPattern.exec(text);
  while (match) {
    const month = ROMAN_MONTHS[match[2]];
    if (month) {
      markers.push({
        index: match.index + match[0].indexOf(match[1]),
        day: Number(match[1]),
        month,
      });
    }
    match = romanPattern.exec(text);
  }

  const polishPattern =
    /(?:^|[\s;])(\d{1,2})\.?\s+(stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|wrzesnia|października|pazdziernika|listopada|grudnia)\b/gi;
  match = polishPattern.exec(text);
  while (match) {
    const month = POLISH_MONTHS[match[2].toLowerCase()];
    if (month) {
      markers.push({
        index: match.index + match[0].indexOf(match[1]),
        day: Number(match[1]),
        month,
      });
    }
    match = polishPattern.exec(text);
  }

  return markers
    .sort((a, b) => a.index - b.index)
    .filter((marker, markerIndex, list) => {
      if (markerIndex === 0) {
        return true;
      }
      const previous = list[markerIndex - 1];
      return marker.index - previous.index > 8;
    });
};

const extractTalksFromStrongHtml = (
  paragraphHtml: string,
): Array<{ title: string; lecturerRaw?: string }> => {
  const talks = [...paragraphHtml.matchAll(/<strong>([^<]*)<\/strong>\s*([^<]*)/gi)].map(
    (entry) => ({
      title: decodeHtml(entry[1]).replace(/,\s*$/, "").trim(),
      lecturerRaw: decodeHtml(entry[2]).replace(/^,\s*/, "").split(/<br/i)[0].trim(),
    }),
  );

  return talks.filter((talk) => talk.title.length > 0);
};

const extractTalksFromPlainBlock = (
  block: string,
): Array<{ title: string; lecturerRaw?: string }> => {
  const cleaned = block
    .replace(/^(\d{1,2}\.\d{1,2}\.|\d{1,2}\.\s*[IVXLC]+\.|\d{1,2}\s+\w+\s*,?\s*)/i, "")
    .replace(/godz\.?\s*\d{1,2}[:.]\d{2}/gi, "")
    .trim();

  if (!cleaned) {
    return [];
  }

  const bulletLines = cleaned
    .split(/\n|•/)
    .map((line) => line.trim())
    .filter((line) => line.length > 3);

  if (bulletLines.length > 0 && bulletLines.some((line) => line.includes(","))) {
    return bulletLines.map((line) => {
      const match = line.match(/^(.+?),\s*((?:ks\.|s\.|o\.|mgr\.|dr|prof\.|diakon|protodiakon).+)$/i);
      if (match) {
        return { title: match[1].trim(), lecturerRaw: match[2].trim() };
      }
      return { title: line };
    });
  }

  const talks: Array<{ title: string; lecturerRaw?: string }> = [];
  const pattern =
    /([^,;]+?),\s*((?:ks\.|s\.|o\.|mgr\.|prof\.|dr(?:\s+hab\.)?|diakon|protodiakon)[^,;]+|(?:Elżbieta|Witali|Łukasz|Lukasz|Judyta|Maria|Barbara|Irina|Krzysztof|Michał|Dorota|Iza)[^,;]+)/gi;

  let match = pattern.exec(cleaned);
  while (match) {
    talks.push({
      title: match[1].trim(),
      lecturerRaw: match[2].trim(),
    });
    match = pattern.exec(cleaned);
  }

  if (talks.length > 0) {
    return talks;
  }

  if (/wystawa|wernisaż|kiermasz/i.test(cleaned)) {
    return [{ title: cleaned }];
  }

  return [{ title: cleaned }];
};

const mergeTalksToLecture = (
  talks: Array<{ title: string; lecturerRaw?: string }>,
  seasonSlug: string,
  day: number,
  month: number,
): ParsedLecture => {
  const titles = talks.map((talk) => talk.title).filter((title) => title.length > 0);
  const lecturerRaws = talks
    .map((talk) => talk.lecturerRaw ?? "")
    .filter((raw) => raw.length > 0)
    .map((raw) => raw.replace(/\.$/, "").trim());

  const { slugs, unresolved } = resolveLecturerSlugs(lecturerRaws);

  const noteSource = titles.find((title) => /wernisaż/i.test(title));
  const note = noteSource ? "wernisaż" : undefined;

  const lecture: ParsedLecture = {
    date: isoDateForSeason(seasonSlug, day, month),
    title: titles.join(LECTURE_TITLE_SEPARATOR),
    lecturerSlugs: slugs,
  };

  if (note) {
    lecture.note = note;
  }
  if (unresolved.length > 0) {
    lecture.unresolvedLecturers = unresolved;
  }

  return lecture;
};

const parseModernParagraphHtml = (html: string, seasonSlug: string): ParsedLecture[] => {
  const lectures: ParsedLecture[] = [];

  [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].forEach((paragraph) => {
    const inner = paragraph[1];
    const dateMatch = inner.match(/^\s*(\d{1,2})\.(\d{1,2})\./);
    if (!dateMatch) {
      return;
    }

    const talks = extractTalksFromStrongHtml(inner);
    if (talks.length === 0) {
      return;
    }

    lectures.push(
      mergeTalksToLecture(
        talks,
        seasonSlug,
        Number(dateMatch[1]),
        Number(dateMatch[2]),
      ),
    );
  });

  return lectures;
};

const parsePolishDateListHtml = (html: string, seasonSlug: string): ParsedLecture[] => {
  const lectures: ParsedLecture[] = [];
  const sectionPattern =
    /<div[^>]*>\s*<b[^>]*>\s*(\d{1,2}\s+[^<]+?)\s*<\/b>\s*<\/div>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi;

  [...html.matchAll(sectionPattern)].forEach((section) => {
    const dateLabel = decodeHtml(section[1]).replace(/\s+/g, " ").trim();
    const dateMatch = dateLabel.match(
      /^(\d{1,2})\s+(stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|wrzesnia|października|pazdziernika|listopada|grudnia)/i,
    );
    if (!dateMatch) {
      return;
    }

    const month = POLISH_MONTHS[dateMatch[2].toLowerCase()];
    const day = Number(dateMatch[1]);
    const listHtml = section[2];
    const talks = [...listHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((item) => decodeHtml(item[1]).replace(/\s+/g, " ").trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const commaIndex = line.lastIndexOf(",");
        if (commaIndex === -1) {
          return { title: line };
        }
        return {
          title: line.slice(0, commaIndex).trim(),
          lecturerRaw: line.slice(commaIndex + 1).trim(),
        };
      });

    if (talks.length === 0) {
      return;
    }

    lectures.push(mergeTalksToLecture(talks, seasonSlug, day, month));
  });

  return lectures;
};

const parsePlainProgramText = (text: string, seasonSlug: string): ParsedLecture[] => {
  const programText = text.split(PROGRAM_FOOTER_PATTERN)[0] ?? text;
  const markers = findDateMarkers(programText);
  const lectures: ParsedLecture[] = [];

  markers.forEach((marker, markerIndex) => {
    const nextIndex = markers[markerIndex + 1]?.index ?? programText.length;
    const block = programText.slice(marker.index, nextIndex);
    const talks = extractTalksFromPlainBlock(block);
    if (talks.length === 0) {
      return;
    }
    lectures.push(mergeTalksToLecture(talks, seasonSlug, marker.day, marker.month));
  });

  return lectures;
};

const extractCycleTitle = (html: string, wpTitle: string): string => {
  const headerMatch = html.match(/<strong>([^<]{10,200})<\/strong>/i);
  if (headerMatch) {
    const line = decodeHtml(headerMatch[1]).replace(/\s+/g, " ").trim();
    if (!/wykłady\s+\d{4}/i.test(line)) {
      return line.replace(/\s*Wykłady\s+\d{4}\/\d{4}\s*$/i, "").trim();
    }
  }

  return decodeHtml(wpTitle)
    .replace(/&#8211;/g, "–")
    .replace(/\s*–\s*wykłady\s+\d{4}\/\d{4}\s*$/i, "")
    .trim();
};

const extractIntro = (text: string, firstDateIndex: number): string | undefined => {
  const introBlock = text.slice(0, firstDateIndex).trim();
  if (!introBlock) {
    return undefined;
  }

  const sentences = introBlock
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40);

  const practical = sentences.filter(
    (sentence) =>
      /@|sekretariat|zapraszamy|zgłoszenia|koszt|godz\./i.test(sentence) ||
      /Kościele Środowisk/i.test(sentence),
  );

  const chosen = (practical.length > 0 ? practical : sentences).slice(0, 2);
  return chosen.length > 0 ? chosen.join(" ") : undefined;
};

export const parseLectureSeasonFromWp = (
  seasonSlug: string,
  wpTitle: string,
  html: string,
): ParsedLectureSeason => {
  const plainText = htmlToMarkdownBody(html);
  const modernLectures = parseModernParagraphHtml(html, seasonSlug);
  const listHtmlLectures = parsePolishDateListHtml(html, seasonSlug);
  const plainLectures = parsePlainProgramText(plainText, seasonSlug);

  const lectures =
    modernLectures.length >= 3
      ? modernLectures
      : listHtmlLectures.length >= 3
        ? listHtmlLectures
        : plainLectures;

  const markers = findDateMarkers(plainText.split(PROGRAM_FOOTER_PATTERN)[0] ?? plainText);
  const firstDateIndex = markers[0]?.index ?? plainText.length;

  return {
    slug: seasonSlug,
    label: seasonLabelFromSlug(seasonSlug),
    cycleTitle: extractCycleTitle(html, wpTitle),
    intro: extractIntro(plainText, firstDateIndex),
    lectures,
  };
};
