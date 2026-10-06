// UI strings — extend as later pieces need more (menu, accordion, CTAs).
export const pl = {
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
          title: "Nabór na kurs {season}",
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
          text: "Nabór na kolejny rok od czerwca",
          linkLabel: "O kursie",
        },
      },
      wyklady: {
        next: {
          title: "{date} · {lecturers}",
          titleNoLecturers: "{date}",
          text: "Najbliższy wykład",
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
      },
    },
    phoneOr: "lub {phone}",
    publicationsRowLabel: "Publikacje",
    publicationsLink: "Album i artykuły Akademii",
    ctaByKind: {
      kurs: {
        open: {
          mailtoLabel: "Napisz zgłoszenie",
          telLabel: "Zadzwoń: {phone}",
        },
        closed: {
          mailtoLabel: "Zapytaj o miejsce mailem",
          telLabel: "Zadzwoń: {phone}",
          note: "Nabór na ten sezon jest zamknięty. Zapytaj o listę rezerwową.",
        },
      },
      plener: {
        open: {
          mailtoLabel: "Wyślij zgłoszenie mailem",
          telLabel: "Zadzwoń: {phone}",
          note: "Odpowiemy w kolejności zgłoszeń.",
        },
        closed: {
          mailtoLabel: "Powiadom mnie o naborze",
          telLabel: "Zadzwoń: {phone}",
          note: "Nabór na plenery {year} ruszy w marcu — napisz, jeśli chcesz dostać wiadomość.",
        },
      },
      wyklady: {
        open: {
          mailtoLabel: "Zapisz się mailem",
          telLabel: "Zadzwoń: {phone}",
          note: "Roczny dostęp do nagrań po zakończeniu sezonu.",
        },
        closed: {
          mailtoLabel: "Zapytaj o miejsce mailem",
          telLabel: "Zadzwoń: {phone}",
          note: "Nabór na bieżący sezon jest zamknięty.",
        },
      },
      zamowienie: {
        open: {
          mailtoLabel: "Zapytaj o ikonę",
          telLabel: "Zadzwoń: {phone}",
          note: "Opisz zamówienie – odpowiemy z propozycją terminu i wyceny.",
        },
        closed: {
          mailtoLabel: "Zapytaj o ikonę",
          telLabel: "Zadzwoń: {phone}",
          note: "Skontaktuj się mailowo lub telefonicznie.",
        },
      },
    },
  },
  offers: {
    eyebrowKurs: "Warsztaty · sezon {seasonLabel}",
    eyebrowPlener: "Plener {seasonLabel}",
    enrollmentSectionTitle: "Jak się zapisać",
    // Verbatim from brief-claude-code.md §8.
    legalNote:
      "Nauczanie w Akademii Ikony nie niesie za sobą żadnych skutków formalnych.",
    semesterProgramHeading: "Program kursu trzyletniego",
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
    plenerWhereWeWereInline: "Miejsca się zmieniają — byliśmy m.in. w:",
    orderStepsHeading: "Jak przebiega zamówienie",
    orderStepsIntro: "Trzy kroki od pierwszego maila do gotowej ikony.",
    orderExamplesHeading: "Przykłady realizacji",
    // Course "Dalsza droga" right column (LY1).
    sideCta: {
      title: "Kursy doskonalące i konsultacje indywidualne",
      mailtoLabel: "Zapytaj",
    },
    readyIconsTitle: "Gotowe ikony – zapytaj mailem",
    readyIconsBody:
      "Część prac z galerii jest dostępna od ręki. Napisz, którą masz na myśli:",
    enrollmentByKind: {
      kurs: {
        paragraphs: [
          "Zgłoszenie wysyłamy mailem na adres {enrollmentEmail} do {enrollmentClose}. Potem zapraszamy na krótką rozmowę wstępną, około trzydziestu minut — ma na celu wzajemne poznanie się i dobór grupy. Chętnie zobaczymy wcześniejsze prace artystyczne, ale to nie jest warunek przyjęcia.",
          "Pierwsze spotkanie sezonu odbywa się {firstMeeting} o 18:00. Dokumenty zgłoszeniowe są dostępne na miejscu.",
        ],
      },
      // Draft built only from the plener facts (mail, individual talk, order of applications) — EJK to confirm.
      plener: {
        paragraphs: [
          "Zgłoszenie wysyłamy mailem na adres {enrollmentEmail}. O udziale rozmawiamy indywidualnie, a zgłoszenia przyjmujemy w kolejności ich nadejścia.",
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
      },
    },
    caption: {
      student: "{title}, pisana ręką {authorName}",
    },
    lightbox: {
      openIcon: "Powiększ ikonę: {title}",
      authorLabel: "Autor:",
      // Sizes copied from WP captions are unconfirmed (they contradict the photos) — never shown as numbers.
      sizeLabel: "Wymiary:",
      sizeUnverified: "do weryfikacji",
      techniqueLabel: "Technika:",
      techniqueDefault: "tempera jajowa na desce lipowej",
      tagsLabel: "Tagi:",
      orderLink: "Zapytaj o podobną ikonę",
      authorFallback: "Praca z warsztatów Akademii",
    },
    orderTeaser: {
      title: "Ikony na zamówienie",
      lead:
        "Piszemy ikony dla parafii i osób prywatnych – na konkretne wezwanie, w ustalonym rozmiarze, w technice temperowej ze złoceniem.",
      linkLabel: "Jak zamówić ikonę",
    },
  },
  workshopsHub: {
    title: "Warsztaty pisania ikon",
    quotesHeading: "Głosy uczestników",
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
    articlesLead:
      "Teksty wykładowców Akademii, wybrane pozycje z albumu oraz artykuły Elżbiety Jackowskiej-Kurek z mediów.",
    sampleTag: "[przykład]",
    // Rendered by ArticleList around the italic album title: {title} stays a separate element.
    sourceFromAlbum: "Z albumu {title} · {year}",
    sourceFromMedia: "{outlet} · {year}",
    sourceAlbumMeta: "Z albumu",
    sourcePressFirstPrint: "Pierwodruk: «{title}», {date}",
    aboutHeading: "O albumie",
    tocHeading: "Spis treści",
    tocLead:
      "Rozdziały albumu z zakresem stron. Teksty opublikowane na stronie są oznaczone i prowadzą do pełnej wersji; nazwiska autorów linkują do ich not. Pozostałe strony zawierają zdjęcia ikon oraz życia Akademii.",
    tocPages: "str. {pages}",
    tocReadOnline: "Czytaj na stronie",
    seeAlsoHeading: "Zobacz też",
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
    mapTitle: "Mapa dojazdu",
    mapPlaceholder: "Mapa – osadzenie zewnętrzne",
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
    galleryHeading: "Zdjęcia",
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
    copyright: "© {year} Akademia Ikony",
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
