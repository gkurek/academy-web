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
  factsBox: {
    headingFallback: "W skrócie",
    headingSeason: "W skrócie · sezon {seasonLabel}",
    headingPlener: "W skrócie · plener {seasonLabel}",
    rows: {
      when: "Kiedy",
      where: "Gdzie",
      audience: "Dla kogo",
      price: "Koszt",
      enrollment: "Zgłoszenia",
      enrollmentDeadline: "Termin zgłoszeń",
      enrollmentStart: "Nabór",
      enrollmentRule: "Zasada naboru",
      firstMeeting: "Pierwsze spotkanie",
      leadTime: "Czas realizacji",
    },
    rowsByKind: {
      zamowienie: {
        when: "Co można zamówić",
        where: "Technika",
        leadTime: "Orientacyjny czas realizacji",
        price: "Koszt",
        contact: "Kontakt",
      },
    },
    phoneOr: "lub 601 734 705",
    contactClosedPlener: "{email} · 601 734 705",
    phoneTel: "tel:+48601734705",
    ctaByKind: {
      kurs: {
        open: {
          mailtoLabel: "Napisz zgłoszenie",
          telLabel: "Zadzwoń: 601 734 705",
        },
        closed: {
          mailtoLabel: "Zapytaj o miejsce mailem",
          telLabel: "Zadzwoń: 601 734 705",
          note: "Nabór na ten sezon jest zamknięty. Zapytaj o listę rezerwową.",
        },
      },
      plener: {
        open: {
          mailtoLabel: "Wyślij zgłoszenie mailem",
          telLabel: "Zadzwoń: 601 734 705",
          note: "Odpowiemy w kolejności zgłoszeń.",
        },
        closed: {
          mailtoLabel:
            "Nabór rusza w marcu 2027 – daj znać, że chcesz dostać wiadomość",
          telLabel: "Zadzwoń: 601 734 705",
        },
      },
      wyklady: {
        open: {
          mailtoLabel: "Zapisz się mailem",
          telLabel: "Zadzwoń: 601 734 705",
          note: "Roczny dostęp do nagrań po zakończeniu sezonu.",
        },
        closed: {
          mailtoLabel: "Zapytaj o miejsce mailem",
          telLabel: "Zadzwoń: 601 734 705",
          note: "Nabór na bieżący sezon jest zamknięty.",
        },
      },
      zamowienie: {
        open: {
          mailtoLabel: "Zapytaj o ikonę",
          telLabel: "Zadzwoń: 601 734 705",
          note: "Opisz zamówienie — odpowiemy z propozycją terminu i wyceny.",
        },
        closed: {
          mailtoLabel: "Zapytaj o ikonę",
          telLabel: "Zadzwoń: 601 734 705",
          note: "Skontaktuj się mailowo lub telefonicznie.",
        },
      },
    },
  },
  offers: {
    enrollmentSectionTitle: "Jak się zapisać",
    // Verbatim from brief-claude-code.md §8.
    legalNote:
      "Nauczanie w Akademii Ikony nie niesie za sobą żadnych skutków formalnych.",
    semesterProgramHeading: "Program kursu trzyletniego",
    semesterProgramIntro:
      "Sześć semestrów, każdy zamknięty własnym zadaniem malarskim.",
    plenerQuotesHeading: "Głosy z pleneru",
    orderStepsHeading: "Jak przebiega zamówienie",
    orderStepsIntro: "Trzy kroki od pierwszego maila do gotowej ikony.",
    orderExamplesHeading: "Przykłady realizacji",
    readyIconsTitle: "Gotowe ikony — zapytaj mailem",
    readyIconsBody:
      "Część prac z galerii jest dostępna od ręki. Napisz, którą masz na myśli:",
    enrollmentByKind: {
      kurs: {
        paragraphs: [
          "Zgłoszenie wysyłamy mailem na adres akademiaikony@gmail.com do 24 września 2026. Potem zapraszamy na krótką rozmowę wstępną, około trzydziestu minut, żeby ustalić grupę i punkt wyjścia.",
          "Pierwsze spotkanie sezonu odbywa się 6 października 2026 o 18:00.",
        ],
      },
    },
  },
  lectures: {
    eyebrow: "Sezon {seasonLabel}",
    programHeading: "Program sezonu",
    programLead: "{count} spotkań w sezonie {seasonLabel}.",
    archiveHeading: "Archiwum sezonów",
    archiveFullLink: "Pełne archiwum",
    placeholderMessage: "W trakcie przygotowania",
    cycleTitlePlaceholder: "[do uzupełnienia]",
    accordionExpand: "rozwiń",
    accordionCollapse: "zwiń",
  },
  lecturers: {
    heading: "Wykładowcy",
    affiliationPlaceholder: "[do uzupełnienia: afiliacja]",
    expandBio: "Rozwiń notę",
    collapseBio: "Zwiń notę",
  },
  workshopsHub: {
    title: "Warsztaty pisania ikon",
    lead: "Dwie ścieżki. Kurs w roku akademickim — raz w tygodniu, od października do czerwca. I tygodniowy plener latem, w trybie rekolekcyjnym. Obie prowadzi Elżbieta Jackowska-Kurek, w obu pracuje się indywidualnie.",
    quotesHeading: "Głosy uczestników",
    cards: {
      "kurs-roczny-i-trzyletni": {
        eyebrow: "Sezon 2026/2027 · zgłoszenia do 24 września 2026",
        excerpt:
          "Rok przedwstępny i wstępny wprowadza w technikę i kanon. Kurs trzyletni doskonalący prowadzi dalej, semestr po semestrze. Grupy wieczorne i dzienne, materiały na miejscu.",
        bullets: [
          "Raz w tygodniu, październik–czerwiec",
          "Pierwsze spotkanie 6 października 2026, 18:00",
          "Rozmowa wstępna przed zapisem, około 30 minut",
        ],
        ctaLabel: "Program i zapisy",
        ctaVariant: "primary" as const,
      },
      "letnia-szkola-swiatla": {
        eyebrow: "Nabór na 2027 od marca 2027 · kolejność zgłoszeń",
        excerpt:
          "Tygodniowe plenery ikonowe w sierpniu i wrześniu. Dzień ma rytm rekolekcyjny: modlitwa, praca przy desce, wspólny posiłek, rozmowa o tym, co powstaje.",
        bullets: [
          "Tydzień, sierpień lub wrzesień",
          "Miejsce i termin 2027 [pole CMS]",
          "Koszt [pole CMS]",
        ],
        ctaLabel: "O plenerze",
        ctaVariant: "secondary" as const,
      },
    },
    cardImages: {
      "kurs-roczny-i-trzyletni": {
        src: "/media/sample/photos/pracownia.jpg",
        alt: "Praca nad ikoną",
        width: 960,
        height: 540,
      },
      "letnia-szkola-swiatla": {
        src: "/media/sample/photos/wyklad.jpg",
        alt: "Plener ikonowy",
        width: 1440,
        height: 810,
      },
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
