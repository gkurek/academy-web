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
  enrollmentDeadline?: string; // ISO
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
  affiliation?: string;
  bio?: string;
  photo?: Image;
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
  lectures: Lecture[];
  gallery?: Image[];
};

// Subset of the future `Product` type from EJK's personal site — field names
// intentionally match so data can be shared/moved mechanically.
export type IconWork = {
  slug: string;
  title: string; // "Chrystus Pantokrator"
  author: "ejk" | "student";
  authorName: string;
  technique?: string; // "tempera jajowa na desce, złocenie"
  size?: { w: number; h: number };
  year?: number;
  image: Image;
  tags?: string[];
};

export type Event = {
  slug: string;
  category: "wystawa" | "poswiecenie" | "oprowadzanie" | "wyjazd";
  title: string;
  date?: string;
  dateEnd?: string;
  body: string;
  images?: Image[];
};

export type News = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  body: string;
  cover?: Image;
};

export type Testimonial = { quote: string; author: string; role?: string };

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
  upcoming: { title: string; text: string; href: string }[]; // "Najbliższe" on the home page
};
