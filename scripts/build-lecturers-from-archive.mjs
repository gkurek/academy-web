import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const ARCHIVAL_SEASONS = [
  "2012-2013",
  "2013-2014",
  "2014-2015",
  "2015-2016",
  "2016-2017",
  "2017-2018",
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
];

const directoryPath = join(ROOT, "content/lecturer-directory.json");
const lecturersPath = join(ROOT, "content/lecturers.json");

const directory = JSON.parse(readFileSync(directoryPath, "utf8"));
const lecturers = JSON.parse(readFileSync(lecturersPath, "utf8"));

const dirBySlug = new Map(directory.map((entry) => [entry.slug, entry]));
const lecturerBySlug = new Map(lecturers.map((entry) => [entry.slug, entry]));

const archiveSlugs = new Set();
ARCHIVAL_SEASONS.forEach((seasonSlug) => {
  const season = JSON.parse(
    readFileSync(join(ROOT, `content/lectures/${seasonSlug}.json`), "utf8"),
  );
  season.lectures.forEach((lecture) => {
    lecture.lecturerSlugs?.forEach((slug) => archiveSlugs.add(slug));
  });
});

const nextDirectory = [...directory];
const directorySlugs = new Set(directory.map((entry) => entry.slug));

archiveSlugs.forEach((slug) => {
  if (directorySlugs.has(slug)) {
    return;
  }
  const profile = lecturerBySlug.get(slug);
  if (profile) {
    nextDirectory.push({
      slug: profile.slug,
      name: profile.name,
      ...(profile.titles ? { titles: profile.titles } : {}),
      ...(profile.affiliation ? { affiliation: profile.affiliation } : {}),
    });
    directorySlugs.add(slug);
  }
});

if (!directorySlugs.has("krzysztof-sokolowski") && archiveSlugs.has("krzysztof-sokolowski")) {
  nextDirectory.push({
    slug: "krzysztof-sokolowski",
    name: "Krzysztof Sokołowski",
  });
}

nextDirectory.sort((a, b) => a.name.localeCompare(b.name, "pl"));
nextDirectory.forEach((entry) => dirBySlug.set(entry.slug, entry));

const nextLecturers = [...lecturers];
const lecturerSlugs = new Set(lecturers.map((entry) => entry.slug));
const addedSlugs = [];

archiveSlugs.forEach((slug) => {
  if (lecturerSlugs.has(slug)) {
    return;
  }
  const dirEntry = dirBySlug.get(slug);
  if (!dirEntry) {
    throw new Error(`Missing directory entry for archival lecturer slug: ${slug}`);
  }
  nextLecturers.push({
    slug: dirEntry.slug,
    name: dirEntry.name,
    ...(dirEntry.titles ? { titles: dirEntry.titles } : {}),
    ...(dirEntry.affiliation ? { affiliation: dirEntry.affiliation } : {}),
  });
  lecturerSlugs.add(slug);
  addedSlugs.push(slug);
});

nextLecturers.sort((a, b) => a.name.localeCompare(b.name, "pl"));

writeFileSync(directoryPath, `${JSON.stringify(nextDirectory, null, 2)}\n`, "utf8");
writeFileSync(lecturersPath, `${JSON.stringify(nextLecturers, null, 2)}\n`, "utf8");

console.log(
  `lecturer-directory.json: ${directory.length} → ${nextDirectory.length} entries`,
);
console.log(`lecturers.json: ${lecturers.length} → ${nextLecturers.length} entries`);
console.log(`Added to lecturers.json (${addedSlugs.length}):`, addedSlugs.sort().join(", "));
