// Content model — copied verbatim from docs/brief-claude-code.md §4.
// Field names are shared with a future site (EJK's personal site) and must not change.

export type Image = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
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
  enrollmentDeadline?: string; // display text for FactsBox row (e.g. „Do 24 września 2026”); not ISO — use `firstMeeting` for machine-readable dates
  enrollmentStart?: string; // plener: row label „Nabór”
  enrollmentRule?: string; // plener: row label „Zasada naboru”
  enrollmentEmail: string;
  enrollmentPhone?: string;
  enrollmentSubject: string; // unified mailto subject
  firstMeeting?: string; // ISO
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
  | "plener"
  | "wystawa"
  | "oprowadzanie"
  | "wyjazd"
  | "spotkanie";

export type News = {
  slug: string;
  title: string;
  date: string;
  dateEnd?: string;
  kind: NewsKind;
  excerpt?: string;
  body: string;
  cover?: Image;
  images?: Image[];
  poster?: Image;
  featured?: boolean;
  featuredUntil?: string;
};

export type Testimonial = { quote: string; author: string; role?: string };

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
  worksTitle: string;
  works: PersonWork[];
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
  foundation: {
    beforeLink: string;
    linkLabel: string;
    linkHref: string;
    afterLink: string;
  };
  legal: string;
  startLinks: {
    intro: string;
    links: TextPageLink[];
  };
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
  upcoming: { title: string; text: string; href: string; linkLabel: string }[]; // "Najbliższe" on the home page
};
