// Content model — copied verbatim from docs/brief-claude-code.md §4.
// Field names are shared with a future site (EJK's personal site) and must not change.

export type Image = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Optional grid preview; lightbox uses `src` at full resolution. */
  thumbSrc?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type Page = {
  slug: string;
  title: string;
  lead?: string;
  body: string; // MDX
  hero?: Image;
  seo?: { description: string; ogImage?: string };
};

export type OfferFacts = {
  // "W skrócie" block
  seasonLabel?: string; // "2026/2027"
  when?: string; // "raz w tygodniu, październik–czerwiec"
  where?: string;
  audience?: string;
  price?: string; // "400 zł / rok"
  enrollmentDeadline?: string; // display text for FactsBox row (e.g. „Do 24 września 2026”); not ISO
  enrollmentStart?: string; // plener: row label „Nabór”
  enrollmentRule?: string; // plener: row label „Zasada naboru”
  enrollmentEmail: string;
  enrollmentPhone?: string;
  enrollmentSubject: string; // unified mailto subject
  firstMeeting?: string; // display text for FactsBox row; machine-readable date in `firstMeetingDate`
  /** ISO date (YYYY-MM-DD) — kurs: start of enrollment window (N7). */
  enrollmentOpens?: string;
  /** ISO date (YYYY-MM-DD) — kurs: end of enrollment window (N7). */
  enrollmentClose?: string;
  /** ISO date (YYYY-MM-DD) — kurs: first meeting (N7). */
  firstMeetingDate?: string;
  /** ISO date (YYYY-MM-DD) — Letnia Szkoła Światła: registration deadline (N7). */
  registrationClose?: string;
  /** ISO date (YYYY-MM-DD) — LSŚ: plener start (N7). */
  dateStart?: string;
  /** ISO date (YYYY-MM-DD) — LSŚ: plener end (N7). */
  dateEnd?: string;
  /**
   * Manual override only (D5): `true` forces „open” outside the date window; `false` changes nothing —
   * the state is computed from the ISO dates above by `getEnrollmentState` (src/content/offers.ts).
   */
  enrollmentOpen: boolean;
  leadTime?: string; // orders: approximate lead time
};

export type Offer = Page & {
  kind: "kurs" | "plener" | "wyklady" | "zamowienie";
  facts: OfferFacts;
  testimonials?: Testimonial[];
};

export type Lecturer = {
  slug: string;
  name: string;
  titles?: string;
  /** Short label for lecture programs, e.g. "UKSW". */
  affiliation?: string;
  /** Full institution name shown on the lecturers profile page. */
  affiliationFull?: string;
  bio?: string;
  photo?: Image;
};

/** Display labels for lecture programs; separate from profile-only `Lecturer` registry. */
export type LecturerDirectoryEntry = {
  slug: string;
  name: string;
  titles?: string;
  affiliation?: string;
};

export type Lecture = {
  date: string;
  title: string;
  /**
   * Pairs by index with the titles joined by " · " in `title`: none, exactly one (shared by
   * every title) or one per title — anything else fails the build. `""` = that talk has no lecturer.
   */
  lecturerSlugs: string[];
  note?: string;
};

export type LectureSeason = {
  slug: string;
  label: string; // "2026/2027"
  cycleTitle: string; // "Ikona – korzenie i owoce wiary. Mistyka dziś"
  intro?: string;
  introSecondary?: string;
  lectures: Lecture[];
  gallery?: Image[];
};

// Subset of the future `Product` type from EJK's personal site — field names
// intentionally match so data can be shared/moved mechanically.
export type IconWork = {
  slug: string;
  title: string; // "Chrystus Pantokrator"
  author: "ejk" | "student";
  authorName?: string; // students only, nominative case when known — never a gendered placeholder
  technique?: string; // "tempera jajowa na desce, złocenie"
  size?: { w: number; h: number };
  image: Image;
  tags?: string[];
};

// K-50/K-53 (2026-09-21): typ `Event` usunięty — archiwum „Wydarzeń” to wpisy News z `kind`.
export type NewsKind =
  | "aktualnosc"
  | "wyklady"
  | "warsztaty"
  | "wystawa"
  | "oprowadzanie"
  | "wyjazd"
  | "spotkanie";

export type NewsLayout = "wydarzenie" | "galeria" | "tekst" | "program";

export type NewsFact = {
  label: string;
  value: string;
};

export type NewsRelatedLink = {
  label: string;
  href: string;
};

export type News = {
  slug: string;
  title: string;
  date: string;
  dateEnd?: string;
  kind: NewsKind;
  layout: NewsLayout;
  excerpt?: string;
  body: string;
  cover?: Image;
  images?: Image[];
  facts?: NewsFact[];
  related?: NewsRelatedLink[];
  hideLead?: boolean;
  /** 0-based index into `images[]`; desktop ≥1024 only — preview in right column (`top`), hidden from gallery there. */
  columnImageIndex?: number;
  venue?: string;
  featured?: boolean;
  /** Lecture season slug (`"2026-2027"`); link to its program is derived — hub while current, archive anchor after (LK1). */
  lectureSeason?: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  /** When set, quote is shown on the summer school (plener) page, not the workshops hub. */
  scope?: "plener";
};

export type TocItem = {
  id: string;
  label: string;
  children?: TocItem[];
};

export type MissionDeclaration = {
  highlight: string;
  detail: string;
};

export type MilestoneItem = {
  value: string;
  label: string;
};

export type ActivityItem = {
  name: string;
  note: string;
};

export type PersonWork = {
  title: string;
  place: string;
  year: string;
};

export type PersonProfileData = {
  name: string;
  role: string;
  portrait: Image;
  bio: string[];
  /** Optional — the "Wybrane realizacje" section was dropped (LY4); kept in the shared model. */
  worksTitle?: string;
  works?: PersonWork[];
  link?: { href: string; label: string };
};

export type TextPageLink = {
  href: string;
  label: string;
};

/** Text page metadata — body lives in companion MDX; toc drives TocSidebar/TocCollapse when present. */
export type TextPageData = Page & {
  toc?: TocItem[];
  sample?: boolean;
};

export type PrivacyPolicySection = {
  id: string;
  paragraphs: string[];
  list?: string[];
  paragraphsAfterList?: string[];
};

export type PrivacyPolicyPageData = TextPageData & {
  lastUpdated: string;
  sections: PrivacyPolicySection[];
  contactEmail: string;
};

export type LearningFormRow = {
  title: string;
  description: string;
  link?: TextPageLink;
};

export type InterviewExchange = {
  q: string;
  a: string;
};

export type InterviewPart = {
  id: string;
  title: string;
  exchanges: InterviewExchange[];
};

export type Interview = {
  intro: string;
  initials: { asker: string; answerer: string };
  parts: InterviewPart[];
  closing: string;
  signature: string;
};

export type WorkshopPageData = TextPageData & {
  learningForms: {
    heading: string;
    rows: LearningFormRow[];
    contact: {
      email: string;
      subject: string;
      phone: string;
      phoneDisplay: string;
    };
  };
  interview: Interview & { heading: string };
  curriculum: {
    heading: string;
  };
  gallery: {
    heading: string;
    mobileCaption: string;
    photos: Image[];
  };
};

export type AboutPageData = TextPageData & {
  hero: Image;
  mission: {
    heading: string;
    declarations: MissionDeclaration[];
  };
  audience: {
    heading: string;
  };
  person: {
    heading: string;
    profile: PersonProfileData;
  };
  approach: {
    heading: string;
    quote: string;
    comment: string;
    readMore: TextPageLink;
  };
  history: {
    heading: string;
    milestones: MilestoneItem[];
    links: TextPageLink[];
  };
  activities: {
    heading: string;
    lead: string;
    items: ActivityItem[];
    links: TextPageLink[];
  };
  workshop: {
    heading: string;
    accessibility: string;
    photos: Image[];
    links: TextPageLink[];
  };
};

// K-82…K-84, K-127: daily permanent display + annual exhibitions in KŚT.
export type ExhibitionTravelingPlace = {
  place: string;
  newsSlug?: string;
};

export type PermanentExhibition = {
  title: string;
  lead: string;
  iconCount: { from: number; to: number };
  /** K-127: optional frame images; omitted = placeholder in UI. */
  heroImage?: Image;
  permanentImage?: Image;
  permanentImage2?: Image;
  closingImage?: Image;
  /** K-127 / K-87: curated list for #wyjazdowe (not derived from News.venue). */
  travelingPlaces: ExhibitionTravelingPlace[];
  sample?: boolean;
};

export type AnnualExhibition = {
  seasonSlug: string;
  title: string;
  vernissage?: string;
  dateEnd?: string;
  photos?: Image[];
  newsSlug?: string;
};

// K-76: Publikacje — jeden album jubileuszowy + artykuły (bez zakładek, bez SectionNav).
export type Author = { name: string; lecturerSlug?: string };

/** AL3: album chapter as printed in the book's table of contents; `pages` is a range, e.g. "6–51". */
export type PublicationChapter = { title?: string; pages: string };

/** AL3: `chapter` is an index into `Publication.chapters`; `intro` marks a text printed before the chapter title. */
export type PublicationTocEntry = {
  title: string;
  author?: Author;
  articleSlug?: string;
  chapter?: number;
  intro?: boolean;
};

export type Publication = {
  slug: string;
  title: string;
  year: number;
  publisher: string; // "Fundacja IKONA DZIŚ"
  isbn?: string;
  pages: number;
  format: string; // "23 × 23 cm"
  price?: number; // PLN; brak = nie w sprzedaży
  availability: "dostepny" | "wyczerpany";
  cover: Image;
  spreads: Image[];
  chapters?: PublicationChapter[];
  toc: PublicationTocEntry[];
  sample?: boolean;
};

export type ArticleSource =
  | { kind: "album"; publicationSlug: string }
  | { kind: "media"; outlet: string; date: string; url?: string; excerptOnly?: boolean };

export type Article = {
  slug: string;
  title: string;
  authors: Author[];
  year: number;
  excerpt: string;
  source: ArticleSource;
  sample?: boolean;
};

export type UpcomingSlot = "warsztaty" | "wyklady" | "ikony";

/** Manual override for one „Najbliższe” slot on the home page (N7). */
export type UpcomingOverride = {
  slot: UpcomingSlot;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
  /** ISO date (YYYY-MM-DD); active from this day inclusive. Omitted = always from the past. */
  from?: string;
  /** ISO date (YYYY-MM-DD); active through this day inclusive. */
  until: string;
};

export type SiteSettings = {
  orgName: string;
  place: string;
  address: string;
  emails: { label: string; address: string; contactName?: string }[];
  phone: string;
  mapEmbedUrl: string;
  blogUrl: string;
  ecosystem: {
    foundationUrl: string;
    personalSiteUrl?: string; // fill in once EJK's personal site launches — empty for now
    social: { facebook: string; youtube: string };
  };
  upcomingOverrides: UpcomingOverride[];
};
