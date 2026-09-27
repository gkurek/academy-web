import { readFileSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DIRECTORY_PATH = join(ROOT, "content/lecturer-directory.json");
const LECTURERS_PATH = join(ROOT, "content/lecturers.json");

type DirectoryEntry = { slug: string; name: string; titles?: string };
type ProfileEntry = { slug: string; name: string; titles?: string };

const normalizeNameKey = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const LECTURER_ALIASES: Record<string, string> = {
  "witali michalczuk": "vitali-michalczuk",
  "lukasz leonkiewicz": "lukasz-leonkiewicz",
  "łukasz leonkiewicz": "lukasz-leonkiewicz",
  "ewa kocoj": "ewa-kocoj",
  "ewa kocój": "ewa-kocoj",
  "judyta pudelko": "judyta-pudelko",
  "judyta pudełko": "judyta-pudelko",
  "ewa siuzdak": "ewa-siuzdak",
  "irina tatarova": "irina-tatarova",
  "barbara strzalkowska": "barbara-strzalkowska",
  "barbara strzałkowska": "barbara-strzalkowska",
  "maria osuchowska marcelleti": "maria-osuchowska-marcelleti",
  "irina tatarowa": "irina-tatarova",
  "krzysztof sokolowski": "krzysztof-sokolowski",
  "krzysztof sokolovski": "krzysztof-sokolowski",
  "dorota walczak": "dorota-walczak",
  "justyna spruth": "justyna-sprutta",
  "jozef naumowicz": "jozef-naumowicz",
};

const buildNameIndex = (): Map<string, string> => {
  const index = new Map<string, string>();

  const directory = JSON.parse(readFileSync(DIRECTORY_PATH, "utf8")) as DirectoryEntry[];
  const profiles = JSON.parse(readFileSync(LECTURERS_PATH, "utf8")) as ProfileEntry[];

  [...directory, ...profiles].forEach((entry) => {
    index.set(normalizeNameKey(entry.name), entry.slug);
  });

  Object.entries(LECTURER_ALIASES).forEach(([alias, slug]) => {
    index.set(normalizeNameKey(alias), slug);
  });

  return index;
};

const nameIndex = buildNameIndex();

const TITLE_PREFIX =
  /^(?:ks\.?|s\.?|o\.?|mgr\.?|dr(?:\s+hab\.)?|prof\.?(?:\s+dr)?(?:\s+hab\.)?|diakon|protodiakon)\s+/i;

const stripTitles = (raw: string): string => {
  let value = raw.replace(/\.$/, "").trim();
  while (TITLE_PREFIX.test(value)) {
    value = value.replace(TITLE_PREFIX, "").trim();
  }
  return value.replace(/\s+(?:SJ|OP|PDDM|UKSW|UJ|prof\.?\s+UJ)$/i, "").trim();
};

export const resolveLecturerSlug = (rawLecturer: string): string | undefined => {
  const cleaned = stripTitles(rawLecturer.replace(/\s+/g, " ").trim());
  if (!cleaned) {
    return undefined;
  }

  const direct = nameIndex.get(normalizeNameKey(cleaned));
  if (direct) {
    return direct;
  }

  const parts = cleaned.split(/\s+/);
  if (parts.length >= 2) {
    const lastFirst = nameIndex.get(normalizeNameKey(`${parts[parts.length - 1]} ${parts[0]}`));
    if (lastFirst) {
      return lastFirst;
    }
  }

  return undefined;
};

export const resolveLecturerSlugs = (
  rawLecturers: string[],
): { slugs: string[]; unresolved: string[] } => {
  const slugs: string[] = [];
  const unresolved: string[] = [];

  rawLecturers.forEach((raw) => {
    const slug = resolveLecturerSlug(raw);
    if (slug) {
      slugs.push(slug);
    } else if (raw.trim()) {
      unresolved.push(raw.trim());
    }
  });

  return { slugs, unresolved };
};
