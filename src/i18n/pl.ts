import { nbspDeep } from "@/lib/typography";

// UI strings — extend as later pieces need more (menu, accordion, CTAs).
const plSource = {
  meta: {
    // Site name, verbatim from brief-claude-code.md §8.
    siteName: "AKADEMIA IKONY – Studium Ikonograficzne św. Andrzeja Apostoła",
    titleBrand: "Akademia Ikony",
    // Joins document title parts: "Archiwum · Wykłady · Akademia Ikony".
    titleSeparator: " · ",
    // Same name split into the two lines the logo lockup uses.
    orgShortName: "AKADEMIA IKONY",
    orgSubtitle: "Studium Ikonograficzne św. Andrzeja Apostoła",
  },
  a11y: {
    skipToContent: "Przejdź do treści",
    externalLinkIcon: "↗",
    externalLinkNewTab: "(otwiera się w nowej karcie)",
  },
  header: {
    mainNavAriaLabel: "Menu główne",
    menuToggleLabel: "Menu",
    sectionExpandLabel: "Rozwiń sekcję",
    sectionCollapseLabel: "Zwiń sekcję",
    primaryCta: "Zapisy na warsztaty",
    contactCta: "Kontakt",
    blogLink: "Blog",
  },
  sectionNav: {
    ariaLabel: "Nawigacja sekcji",
  },
  breadcrumb: {
    ariaLabel: "Ścieżka",
  },
  textPage: {
    tocLabel: "Na tej stronie",
    tocAriaLabel: "Na tej stronie",
    seeAlsoLabel: "Zobacz też",
  },
  workshop: {
    contactMailtoLabel: "Napisz do Pracowni",
    // Verbatim from brief-claude-code.md §8; fine print under „Formy nauki”.
    legalNote:
      "Nauczanie w Akademii Ikony nie niesie za sobą żadnych skutków formalnych.",
  },
  /** Shared by every lightbox (icons, photos, spreads); per-domain trigger labels stay in their sections. */
  lightbox: {
    close: "Zamknij",
    previous: "Poprzednie",
    previousAria: "Poprzednie zdjęcie",
    next: "Następne",
    nextAria: "Następne zdjęcie",
    position: "{index} z {total}",
    openPhoto: "Powiększ zdjęcie: {alt}",
  },
  home: {
    hero: {
      ctaPrimary: "Warsztaty pisania ikon",
      ctaSecondary: "Wykłady {season}",
    },
    upcomingHeading: "Najbliższe",
    upcoming: {
      newsLinkLabel: "Czytaj w Aktualnościach",
      warsztaty: {
        plener: {
          title: "Letnia Szkoła Światła {year}",
          textWithDeadline: "Zapisy do {date}",
          text: "Zapisy w kolejności zgłoszeń",
          linkLabel: "Jak się zapisać",
        },
        enrollment: {
          title: "Zapisy na kurs {season}",
          textWithDeadline: "Zgłoszenia do {date}",
          text: "Zgłoszenia mailem",
          linkLabel: "Jak się zapisać",
        },
        starts: {
          titleWithDate: "Kurs rusza {date}",
          title: "Kurs rusza",
          text: "Kurs roczny i trzyletni {season}",
          linkLabel: "O kursie",
        },
        running: {
          title: "Kurs {season} trwa",
          text: "Zapisy na kolejny rok od czerwca",
          linkLabel: "O kursie",
        },
      },
      wyklady: {
        next: {
          text: "Najbliższy wykład · {date}",
          titleNoLecturers: "Wykład",
          linkLabel: "Program sezonu",
        },
        break: {
          title: "Sezon {season} — program we wrześniu",
          text: "Ostatni wykład: {date}",
          linkLabel: "O wykładach",
        },
      },
      ikony: {
        vernissage: {
          title: "Wernisaż {date}",
          text: "Wystawa doroczna „{title}”",
          linkLabel: "O wystawach",
        },
        annual: {
          title: "Wystawa „{title}”",
          text: "Czynna do {date}",
          linkLabel: "O wystawach",
        },
        permanent: {
          title: "„{title}”",
          text: "Ekspozycja codzienna · oprowadzania dla grup",
          linkLabel: "O wystawach",
        },
      },
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
      enrollmentStart: "Zapisy",
      enrollmentRule: "Zasady zapisów",
      firstMeeting: "Pierwsze spotkanie",
    },
    phoneOr: "lub {phone}",
    ctaByKind: {
      kurs: {
        open: {
          mailtoLabel: "Napisz zgłoszenie",
          telLabel: "Zadzwoń: {phone}",
        },
        closed: {
          mailtoLabel: "Powiadom mnie o zapisach",
          mailtoSubject: "Powiadomienie o zapisach – kurs roczny",
          note: "Zapisy zamknięte — zapraszamy w przyszłym roku",
        },
      },
      plener: {
        open: {
          mailtoLabel: "Wyślij zgłoszenie mailem",
          telLabel: "Zadzwoń: {phone}",
          note: "Odpowiemy w kolejności zgłoszeń.",
        },
        closed: {
          mailtoLabel: "Powiadom mnie o zapisach",
          mailtoSubject: "Powiadomienie o zapisach – Letnia Szkoła Światła",
          note: "Zapisy na plenery {year} ruszą w marcu.",
        },
      },
      wyklady: {
        open: {
          mailtoLabel: "Zapisz się mailem",
          telLabel: "Zadzwoń: {phone}",
        },
        closed: {
          mailtoLabel: "Powiadom mnie o zapisach",
          mailtoSubject: "Powiadomienie o zapisach – wykłady",
          note: "Zapisy zamknięte — ten sezon już trwa!",
        },
      },
    },
  },
  offers: {
    eyebrowKurs: "Warsztaty · sezon {seasonLabel}",
    eyebrowPlener: "Plener {seasonLabel}",
    enrollmentSectionTitle: "Jak się zapisać",
    semesterProgramHeading: "Program semestrów",
    semesterProgramIntro:
      "Sześć semestrów, każdy zamknięty własnym zadaniem malarskim.",
    semesterTileFallback: "Semestr {n}",
    semesterTileHeadings: [
      "Semestr pierwszy",
      "Semestr drugi",
      "Semestr trzeci",
      "Semestr czwarty",
      "Semestr piąty",
      "Semestr szósty",
    ],
    plenerQuotesHeading: "Głosy z pleneru",
    plenerWhereWeWereInline: "Gościły nas m.in.:",
    figurePlaceholders: {
      kursPracownia: "[zdjęcie: pracownia, praca nad ikoną]",
      lssPlener: "[zdjęcie: plener, praca przy ikonach]",
    },
    // Closing line of an offer page: the FactsBox enrollment mailto as an inline link ({link}).
    closingCta: {
      plener: {
        open: { text: "Zapisy na plenery {year} są otwarte — {link}.", link: "wyślij zgłoszenie mailem" },
        closed: { text: "Zapisy na plenery {year} ruszą w marcu — {link}.", link: "powiadom mnie o zapisach" },
      },
    },
    // Course "Dalsza droga" right column (LY1).
    sideCta: {
      title: "Kursy doskonalące i konsultacje indywidualne",
      mailtoLabel: "Zapytaj",
      photoPlaceholders: {
        kursDalszaDroga: "[zdjęcie: praca przy ikonie]",
      },
    },
    enrollmentByKind: {
      kurs: {
        paragraphs: [
          "Zgłoszenie na kurs roczny lub trzyletni wysyłamy mailem na adres {enrollmentEmail}. Potem zapraszamy na krótką rozmowę wstępną, około trzydziestu minut — ma na celu wzajemne poznanie się i dobór grupy. Chętnie zobaczymy wcześniejsze prace artystyczne, ale to nie jest warunek przyjęcia. Aktualny termin zapisów podajemy w ramce „W skrócie”.",
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
    archiveGalleryLink: "Zobacz galerię zdjęć z wykładów",
    cycleTitlePlaceholder: "[do uzupełnienia]",
    accordionExpand: "rozwiń",
    accordionCollapse: "zwiń",
  },
  lecturers: {
    heading: "Wykładowcy",
    photoPlaceholder: "Zdjęcie w przygotowaniu",
    affiliationPlaceholder: "[do uzupełnienia: afiliacja]",
    expandBio: "Rozwiń notę",
    collapseBio: "Zwiń notę",
    expandBioLabel: "Rozwiń notę: {name}",
    collapseBioLabel: "Zwiń notę: {name}",
  },
  gallery: {
    title: "Galeria ikon",
    filters: {
      themeLabel: "Temat",
      themeGroupAria: "Filtruj według tematu",
      themeAll: "Wszystkie",
    },
    tagLabels: {
      chrystus: "Chrystus",
      "matka-bozy": "Matka Boża",
      aniolowie: "Aniołowie",
      swieci: "Święci",
      swieta: "Święta",
    },
    // K-41: the gallery is split into two fixed sections; ids double as URL hashes.
    sections: {
      ejk: {
        title: "Ikony pisane ręką Elżbiety Jackowskiej-Kurek",
      },
      uczniowie: {
        title: "Ikony uczniów",
        authorsLabel: "Autorzy ikon:",
      },
    },
    caption: {
      student: "{title}, pisana ręką {authorName}",
    },
    lightbox: {
      openIcon: "Powiększ ikonę: {title}",
      authorLabel: "Autor:",
      sizeLabel: "Wymiary:",
      sizeConfirmed: "{w} × {h} cm",
      sizeUnverified: "do weryfikacji",
      techniqueLabel: "Technika:",
      techniqueDefault: "tempera jajowa na desce lipowej",
      tagsLabel: "Kategorie:",
      authorFallback: "Praca z warsztatów Akademii",
    },
  },
  workshopsHub: {
    title: "Warsztaty pisania ikon",
    quotesHeading: "Głosy uczestników",
    studentIconsHeading: "Ikony naszych uczniów",
    studentIconsLink: "Wszystkie ikony uczniów",
    faqHeading: "Zanim zaczniesz",
    // Closing block under the quotes (makieta 2c) — plain mailto, no subject (none in brief §7).
    closing: {
      heading: "Masz pytania?",
      text: "Napisz do nas, chętnie odpowiemy.",
      ctaLabel: "Napisz do Akademii",
    },
    // Offer card eyebrows — picked by enrollment state (`getWorkshopCardEyebrow`).
    eyebrow: {
      kurs: {
        openWithDeadline: "Sezon {season} · zapisy do {date}",
        open: "Sezon {season} · zapisy otwarte",
        starts: "Sezon {season} · zapisy zamknięte",
        running: "Kurs {season} trwa · zapisy na kolejny rok od czerwca",
      },
      plener: {
        openWithDeadline: "Plener {year} · zapisy do {date}",
        open: "Plener {year} · zapisy otwarte",
        before: "Zapisy na rok {year} otwieramy w marcu",
        closed: "Plener {year} · zapisy zamknięte",
      },
    },
  },
  exhibition: {
    page: {
      toc: [
        { id: "doroczna", label: "Wystawa doroczna" },
        { id: "ekspozycja", label: "Ekspozycja codzienna" },
        { id: "oprowadzania", label: "Oprowadzania" },
        { id: "wyjazdowe", label: "Wystawy wyjazdowe" },
      ],
      startHere: "Zobacz też",
      galleryLink: "Galeria ikon",
      workshopsLink: "Chcesz napisać własną ikonę?",
    },
    nowNext: {
      ariaLabel: "Co teraz wisi w kościele",
      nowLabel: "Teraz w kościele",
      nextLabel: "Następnie",
      permanentNowSubline: "Ekspozycja codzienna, do połowy czerwca {year}",
      annualNowSubline: "Wystawa doroczna {year}",
      untilDate: "do {date}",
      annualNextTitle: "Wystawa doroczna {year}",
      vernissageSubline: "Wernisaż {date}, podczas ostatniego wykładu sezonu",
      permanentFromSeptemberSuffix: "od września",
    },
    frames: {
      heroWide: "[zdjęcie: lewa nawa kościoła, szeroki kadr · 21:8]",
      permanentStandard: "[zdjęcie: ikony przy ołtarzu, lewa nawa · 2:1]",
      permanentStandard2: "[zdjęcie: detal ikony, lewa nawa · 4:3]",
      closingWide: "[zdjęcie: wystawa wyjazdowa, Święta Lipka, szeroki kadr · 21:8]",
      tilePlaceholders: [
        "[zdjęcie: chrystus pantokrator · 4:3]",
        "[zdjęcie: wernisaż · 4:3]",
        "[zdjęcie: matka boża znaku · 4:3]",
        "[zdjęcie: wykład elżbiety jackowskiej-kurek · 4:3]",
      ],
    },
    permanent: {
      sectionId: "ekspozycja",
      facts: {
        when: "Kiedy",
        hours: "Godziny",
        onDisplay: "Na ekspozycji",
        admission: "Wstęp",
      },
    },
    annual: {
      sectionId: "doroczna",
      photoArchiveLink: "Fotorelacje z poprzednich wystaw dorocznych",
      tilesCaption: "Wystawa {year} · {count} zdjęć – zobacz wszystkie",
      facts: {
        when: "Kiedy",
        vernissage: "Wernisaż",
        onDisplay: "Na wystawie",
        admission: "Wstęp",
        lecturesProgramLink: "Program i terminy wykładów",
      },
    },
    tours: {
      sectionId: "oprowadzania",
      title: "Oprowadzania",
      scheduleNewsLink: "Aktualnościach",
      mailtoLabel: "Zapytaj o oprowadzanie",
      mailtoSubject: "Oprowadzanie po wystawie – grupa",
    },
    traveling: {
      sectionId: "wyjazdowe",
      heading: "Wystawy wyjazdowe",
      placesLastJoiner: " i ",
      placesJoiner: ", ",
      inviteCta: "Chcesz zaprosić wystawę do swojego miejsca?",
      mailtoLabel: "Napisz do nas",
      mailtoSubject: "Zaproszenie – wystawa wyjazdowa",
    },
    facts: {
      heading: "W skrócie",
      where: "Gdzie",
    },
  },
  publications: {
    breadcrumbHome: "Strona główna",
    title: "Publikacje",
    lead:
      "Na piętnaste urodziny Akademii wydaliśmy album podsumowujący piętnaście lat pracy. W tym dziale publikujemy też wybrane teksty z albumu i artykuły Elżbiety Jackowskiej-Kurek.",
    albumEyebrow: "Fundacja IKONA DZIŚ",
    imprint: "Album jubileuszowy, Fundacja IKONA DZIŚ, {year}",
    albumFallback: "albumu",
    coverCaption: "Zdjęcie albumu",
    coverCaptionAlbum: "Okładka albumu",
    viewAlbum: "Zobacz album",
    orderAlbum: "Zamów",
    orderAlbumMailto: "Zamów album mailem",
    mailtoSubject: "Zamówienie – album „Ikona dziś. Akademia Ikony 2010–2025”",
    spreadsHeading: "Rozkładówki",
    spreadsIntroHub: "Pełna galeria rozkładówek jest na stronie albumu.",
    facts: {
      year: "Rok",
      pages: "Objętość",
      pageCount: "Liczba stron",
      format: "Format",
      isbn: "ISBN",
      price: "Cena",
      priceValue: "{price} zł",
      availability: "Dostępność",
      availabilityAvailableShort: "Dostępny",
      availabilitySoldOut: "Wyczerpany",
      howToBuy: "Jak kupić",
      howToBuyValue:
        "W Kościele Środowisk Twórczych lub mailowo, wysyłka pocztą.",
      publisher: "Wydawca",
      heading: "W skrócie",
    },
    articlesHeading: "Artykuły",
    articleReadMore: "Czytaj",
    articlesLead:
      "Teksty wykładowców Akademii, wybrane pozycje z albumu oraz artykuły Elżbiety Jackowskiej-Kurek z mediów.",
    sampleTag: "[przykład]",
    // Rendered by ArticleList around the italic album title: {title} stays a separate element.
    sourceFromAlbum: "Z albumu {title} · {year}",
    sourceFromMedia: "{outlet} · {year}",
    sourceAlbumMeta: "Z albumu",
    sourcePressFirstPrint: "Pierwodruk: {outlet}, {date}",
    aboutHeading: "O albumie",
    tocHeading: "Spis treści",
    tocFeaturedHeading: "Do przeczytania w serwisie",
    tocFullToggle: "Pełny spis treści",
    tocPages: "str. {pages}",
    tocReadOnline: "Czytaj na stronie",
    relatedNewsHeading: "Z wernisażu albumu",
    seeAlsoLabel: "Zobacz też",
    allPublications: "Wszystkie publikacje",
    exhibitionLink: "Wystawy",
    lecturesLinkFooter: "Cykl wykładów",
    lecturesScheduleLink: "Terminy wykładów",
    articleSourceHeading: "Źródło tekstu",
    articleSourceAlbumSentence:
      "Ten tekst pochodzi z albumu {title} wydanego przez Fundację IKONA DZIŚ.",
    pageForms: ["strona", "strony", "stron"],
    articleSourceAlbumFacts: "{pages} {pageWord} · {format} · {price}",
    articleSourceViewAlbum: "Zobacz album",
    articleSourceOrder: "Zamów",
    articlePressReadPublisher: "Czytaj w serwisie wydawcy",
    lightbox: {
      openSpread: "Powiększ rozkładówkę: {alt}",
    },
  },
  privacy: {
    lastUpdatedLabel: "Ostatnia aktualizacja:",
  },
  notFound: {
    documentTitle: "Nie znaleziono strony",
    title: "Nie znaleziono strony",
    lead:
      "Adres może być nieaktualny lub wpisany z błędem. Skorzystaj z linków poniżej, aby wrócić do serwisu.",
    homeLink: "Strona główna",
    sitemapHeading: "Mapa strony",
    sitemapAriaLabel: "Działy serwisu",
  },
  contact: {
    addressHeading: "Adres",
    phoneLabel: "Telefon",
    entranceHeading: "Wejście od strony zakrystii",
    mapLinkLabel: "Otwórz w Mapach Google",
    photo: {
      alt: "Fasada Kościoła Środowisk Twórczych przy placu Teatralnym – portyk z czterema kolumnami między białymi skrzydłami budynku",
      creditLead: "Fot. Adrian Grycuk, ",
      sourceLabel: "Wikimedia Commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Ko%C5%9Bci%C3%B3%C5%82_%C5%9Bw._Brata_Alberta_i_%C5%9Bw._Andrzeja_Aposto%C5%82a_w_Warszawie_2019.jpg",
      licenseLabel: "CC BY-SA 3.0 PL",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/pl/deed.pl",
    },
    organizerHeading: "Organizator",
    organizerLead: "Akademia Ikony jest projektem wiodącym fundacji ",
    organizerLinkLabel: "IKONA DZIŚ",
    organizerTail: "",
    onlineHeading: "Akademia w sieci",
    blogLinkLabel: "Blog – studiumikony.blogspot.com",
  },
  news: {
    title: "Aktualności",
    lead:
      "Wykłady, warsztaty, plenery, wystawy i spotkania w Akademii Ikony – oraz archiwum od 2012 roku, w jednym strumieniu wpisów.",
    yearNavAriaLabel: "Przejdź do roku",
    yearNavLabel: "Przejdź do roku",
    yearNavMore: "…",
    featuredLabel: "Wyróżnione",
    showArchiveLabel: "Pokaż archiwum {range} ({count} {word})",
    archiveEntryForms: {
      one: "wpis",
      few: "wpisy",
      many: "wpisów",
    },
    kind: {
      aktualnosc: "Z Akademii",
      wyklady: "Wykłady",
      warsztaty: "Warsztaty",
      wystawa: "Wystawa",
      oprowadzanie: "Oprowadzanie",
      wyjazd: "Wyjazd studyjny",
      spotkanie: "Spotkanie",
    },
    readMore: "Czytaj",
    readMoreFeatured: "Czytaj dalej",
    galleryCountLabel: "Galeria · {count} {word}",
    galleryPhotoForms: {
      one: "zdjęcie",
      few: "zdjęcia",
      many: "zdjęć",
    },
    allNewsLink: "Wszystkie aktualności",
    previousEntryNav: "← Poprzedni wpis",
    nextEntryNav: "Następny wpis →",
    previousEntryAria: "Poprzedni wpis: {title}",
    nextEntryAria: "Następny wpis: {title}",
    articleNavAriaLabel: "Nawigacja między wpisami",
    galleryMobileCaption: "Kliknij zdjęcie, aby powiększyć.",
    showAllGallery: "Pokaż wszystkie ({count})",
    enlargePhotoAria: "Powiększ zdjęcie {n} z {total}",
    relatedHeading: "Powiązane",
    // Default „Powiązane” for kinds whose label is not a nav label (the rest come from navigation.ts).
    relatedDefaults: {
      wystawa: "Wystawy w Kościele Środowisk Twórczych",
    },
    relatedLectureArchive: "Archiwum wykładów",
    eventCta: {
      warsztaty: "Jak się zapisać na kurs",
      wyklady: "Program wykładów",
      wystawa: "Wystawy w Kościele Środowisk Twórczych",
    },
  },
  footer: {
    sitemapAriaLabel: "Mapa strony",
    copyrightPrefix: "© {year} Fundacja ",
    foundationLinkLabel: "IKONA DZIŚ",
    churchName: "Kościół Środowisk Twórczych",
    churchPatronsShort: "pw. św. Andrzeja Apostoła i św. Brata Alberta",
    // Verbatim from brief-claude-code.md §8.
    accessibilityNote: "Przestrzeń bez barier architektonicznych",
    organizerLabel: "Organizator",
    organizerName: "Fundacja IKONA DZIŚ",
    blogLabel: "Blog",
    facebookLabel: "Facebook",
    youtubeLabel: "YouTube",
    legalSeparator: "·",
    designCreditLabel: "Projekt i wdrożenie",
    designCreditName: "GK",
    designCreditUrl: "https://grzegorzkurek.pl/",
  },
} as const;

// Single-letter words glued with a non-breaking space; `meta` feeds `<title>` and stays plain.
const { meta, ...plBody } = plSource;

export const pl = { meta, ...nbspDeep(plBody) };
