// UI strings — extend as later pieces need more (menu, accordion, CTAs).
export const pl = {
  meta: {
    // Site name, verbatim from brief-claude-code.md §8.
    siteName: "AKADEMIA IKONY – Studium Ikonograficzne św. Andrzeja Apostoła",
    // Same name split into the two lines the logo lockup uses.
    orgShortName: "AKADEMIA IKONY",
    orgSubtitle: "Studium Ikonograficzne św. Andrzeja Apostoła",
  },
  common: {
    contentInProgress: "Treść w przygotowaniu",
  },
  header: {
    menuToggleLabel: "Menu",
    sectionExpandLabel: "Rozwiń sekcję",
    sectionCollapseLabel: "Zwiń sekcję",
    primaryCta: "Zapisy na warsztaty",
    contactCta: "Kontakt",
    newsLink: "Aktualności",
    publicationsLink: "Publikacje",
    blogLink: "Blog",
  },
  sectionNav: {
    ariaLabel: "Nawigacja sekcji",
  },
  breadcrumb: {
    ariaLabel: "Ścieżka",
  },
  home: {
    hero: {
      title: "Uczymy pisania ikon od 2010 roku.",
      lead: "Warsztaty, wykłady i galeria ikon w Kościele Środowisk Twórczych na Placu Teatralnym w Warszawie. Praca indywidualna z każdym uczestnikiem, raz w tygodniu, od października do czerwca.",
      ctaPrimary: "Warsztaty pisania ikon",
      ctaSecondary: "Wykłady 2026/2027",
      image: {
        src: "/media/sample/icons/chrystus.jpg",
        alt: "Ikona Chrystusa Pantokratora",
        width: 360,
        height: 682,
        caption: "Chrystus Pantokrator, Synaj, VI w.",
      },
    },
    upcomingAriaLabel: "Najbliższe",
    pillars: [
      {
        title: "Warsztaty",
        body: "Kurs roczny przedwstępny i wstępny oraz trzyletni doskonalący. Materiały na miejscu, praca indywidualna. Osobno Letnia Szkoła Światła — tygodniowe plenery w trybie rekolekcyjnym.",
        linkLabel: "Kurs roczny i trzyletni",
        href: "/warsztaty/kurs-roczny-i-trzyletni",
        image: {
          src: "/media/sample/photos/pracownia.jpg",
          alt: "Praca nad ikoną w pracowni",
          width: 960,
          height: 540,
        },
      },
      {
        title: "Wykłady",
        body: "Wybrane wtorki miesiąca, 18:00–20:30, październik–czerwiec. Prowadzą teolodzy, historycy sztuki i duchowni. 400 zł za rok, z możliwością rocznego dostępu do nagrań.",
        linkLabel: "Sezon i archiwum",
        href: "/wyklady",
        image: {
          src: "/media/sample/photos/wyklad.jpg",
          alt: "Wykład w Akademii Ikony",
          width: 1440,
          height: 810,
        },
      },
      {
        title: "Ikony",
        body: "Prace Elżbiety Jackowskiej-Kurek i uczniów, wystawy, ikony na zamówienie, poświęcenia, oprowadzania kuratorskie i wyjazdy studyjne.",
        linkLabel: "Galeria",
        href: "/ikony",
        image: {
          src: "/media/sample/photos/wystawa.jpg",
          alt: "Zwiedzający na wystawie ikon",
          width: 1000,
          height: 714,
        },
      },
    ],
    testimonial: {
      quote: "„Kreska po kresce wspinamy się na Górę Tabor.”",
      author: "Elżbieta Jackowska-Kurek, założycielka Akademii",
    },
    icons: {
      heading: "Wybrane ikony",
      seeAllLabel: "Cała galeria",
    },
  },
  footer: {
    sitemapAriaLabel: "Mapa strony",
    copyright: "© 2026 Akademia Ikony",
    // Verbatim from brief-claude-code.md §8.
    accessibilityNote: "Przestrzeń bez barier architektonicznych",
    organizerLabel: "Organizator",
    organizerName: "fundacja IKONA DZIŚ",
    blogLabel: "Blog",
    facebookLabel: "Facebook",
    youtubeLabel: "YouTube",
  },
} as const;
