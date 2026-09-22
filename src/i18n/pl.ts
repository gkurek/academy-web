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
  textPage: {
    tocLabel: "Na tej stronie",
    tocAriaLabel: "Na tej stronie",
  },
  workshop: {
    contactMailtoLabel: "Napisz do Pracowni",
    lightbox: {
      close: "Zamknij",
      closeAria: "Zamknij",
      previous: "Poprzednie",
      previousAria: "Poprzednie zdjęcie",
      next: "Następne",
      nextAria: "Następne zdjęcie",
      position: "{index} z {total}",
      openPhoto: "Powiększ zdjęcie: {alt}",
    },
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
    upcomingHeading: "Najbliższe",
    pillars: [
      {
        title: "Warsztaty",
        body: "Kurs roczny przedwstępny i wstępny oraz trzyletni doskonalący. Materiały na miejscu, praca indywidualna. Osobno Letnia Szkoła Światła — tygodniowe plenery w trybie rekolekcyjnym.",
        linkLabel: "Kurs i plener",
        href: "/warsztaty",
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
        body: "Prace Elżbiety Jackowskiej-Kurek i uczniów, stała wystawa w kościele, ikony na zamówienie.",
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
    eyebrowKurs: "Warsztaty · sezon {seasonLabel}",
    eyebrowPlener: "Plener {seasonLabel}",
    enrollmentSectionTitle: "Jak się zapisać",
    // Verbatim from brief-claude-code.md §8.
    legalNote:
      "Nauczanie w Akademii Ikony nie niesie za sobą żadnych skutków formalnych.",
    semesterProgramHeading: "Program kursu trzyletniego",
    semesterProgramIntro:
      "Sześć semestrów, każdy zamknięty własnym zadaniem malarskim.",
    plenerQuotesHeading: "Głosy z pleneru",
    whereWeWereHeading: "Gdzie byliśmy",
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
      "sceny-i-swieta": "Sceny i święta",
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
      close: "Zamknij",
      closeAria: "Zamknij",
      previous: "Poprzednia",
      previousAria: "Poprzednia",
      next: "Następna",
      nextAria: "Następna",
      position: "{index} z {total}",
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
        "Piszemy ikony dla parafii i osób prywatnych — na konkretne wezwanie, w ustalonym rozmiarze, w technice temperowej ze złoceniem.",
      linkLabel: "Jak zamówić ikonę",
    },
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
  exhibition: {
    facts: {
      srHeading: "Informacje praktyczne o wystawie",
      where: "Gdzie",
      when: "Kiedy",
      whenValue: "W godzinach otwarcia kościoła",
      admission: "Wstęp",
      admissionValue: "darmowy",
      currentEdition: "Bieżąca edycja",
      newEdition: "Nowa edycja",
      newEditionValue:
        "Wernisaż w czerwcu, w okolicach wspomnienia św. Brata Alberta (17 czerwca)",
      contactLink: "Dojazd i kontakt",
    },
    previewBanner: {
      label: "Zapowiedź",
      announcement: "Wernisaż nowej edycji: {date}",
      dateFallback: "[do uzupełnienia: data wernisażu]",
      newsLink: "Szczegóły w aktualnościach",
    },
    currentEdition: {
      heading: "Bieżąca edycja {year}",
      heroAlt: "Wernisaż edycji {year}",
      seasonIntro: "Edycji towarzyszy sezon wykładów „{theme}”.",
      seasonLink: "Program sezonu",
      posterCaption: "Plakat edycji {year}",
      posterPlaceholder: "[do uzupełnienia: plakat edycji {year}]",
      photoPlaceholder: "[do uzupełnienia: zdjęcia z wernisażu edycji {year}]",
    },
    galleryThumbsAria: "Miniatury zdjęć z wystawy",
    galleryCaption: "Zdjęcia z wernisażu i ekspozycji — kliknięcie otwiera powiększenie.",
    description: {
      heading: "Jak wygląda wystawa",
      photoPlaceholder: "[do uzupełnienia: zdjęcie wnętrza wystawy]",
    },
    tours: {
      title: "Oprowadzania kuratorskie",
      intro:
        "Oprowadzanie prowadzi Elżbieta Jackowska-Kurek: opowiada o warsztacie ikonografa, o wybranych ikonach z wystawy i o ich teologii.",
      currentEditionLabel: "Terminy edycji {year}",
      newEditionLabel: "Terminy nowej edycji {year}",
      dateFallback: "[data]",
      footnote:
        "Tematy z poprzednich edycji — daty bieżącej edycji [do uzupełnienia].",
    },
    previousEdition: {
      heading: "Poprzednie edycje",
      lead: "Co roku na wystawie pojawia się nowy zestaw ikon. Poniżej edycje z minionych lat.",
      viewPhotos: "Zobacz zdjęcia",
      iconCount: "{count} ikon",
      photoPlaceholder: "[do uzupełnienia: zdjęcia z edycji {year}]",
      photoThumbPlaceholder: "[do uzupełnienia]",
    },
    footer: {
      intro: "Zacznij tutaj",
      galleryLink: "Zobacz ikony w galerii",
      orderLink: "Chcesz napisać własną ikonę?",
    },
    upcoming: {
      biezaca: {
        title: "Wystawa ikon · edycja {year}",
        text: "Czynna w godzinach otwarcia kościoła",
        linkLabel: "O wystawie",
      },
      zapowiedz: {
        title: "Wernisaż {date}",
        text: "Zapraszamy na oprowadzenia kuratorskie po nowej edycji",
        linkLabel: "O wystawie",
      },
    },
  },
  publications: {
    breadcrumbHome: "Strona główna",
    title: "Publikacje",
    lead:
      "Na piętnaste urodziny Akademii wydaliśmy album podsumowujący piętnaście lat pracy. W tym dziale publikujemy też wybrane teksty z albumu i artykuły Elżbiety Jackowskiej-Kurek.",
    albumEyebrow: "Wydawnictwo Akademii",
    imprint: "Album jubileuszowy, Fundacja IKONA DZIŚ, {year}",
    albumFallback: "albumu",
    coverCaption: "Zdjęcie albumu",
    coverCaptionAlbum: "Okładka albumu",
    coverScanNote: "[docelowo skan okładki 23 × 23 cm, kadr kwadratowy]",
    coverScanNoteShort: "[docelowo skan okładki]",
    viewAlbum: "Zobacz album",
    orderAlbum: "Zamów",
    orderAlbumMailto: "Zamów album mailem",
    orderSpreadMailto: "Zamów album",
    mailtoSubject: "Zamówienie – album „Ikona dziś. Akademia Ikony 2010–2025”",
    spreadsHeading: "Rozkładówki",
    spreadsIntro:
      "Album ma format 23 × 23 cm — pojedyncza strona jest kwadratem, rozkładówka ma proporcje 2:1. Kliknięcie otwiera powiększenie.",
    spreadsIntroHub:
      "Kliknięcie otwiera powiększenie. Pełna galeria rozkładówek jest na stronie albumu.",
    spreadsIntroMobile:
      "Rozkładówka ma proporcje 2:1 — na telefonie stoi w jednej kolumnie, w całości. Powiększenie otwiera się poziomo.",
    spreadsFootnote: "Docelowo 8–12 rozkładówek. Skany w proporcji 2:1, pokazywane w całości.",
    showAllSpreads: "Pokaż wszystkie rozkładówki",
    spreadKindLabel: "rozkładówka",
    facts: {
      year: "Rok",
      pages: "Objętość",
      pagesValue: "{count} stron",
      pageCount: "Liczba stron",
      format: "Format",
      isbn: "ISBN",
      price: "Cena",
      availability: "Dostępność",
      availabilityAvailable: "Dostępny, wysyłka pocztą",
      availabilityAvailableShort: "Dostępny",
      availabilitySoldOut: "Wyczerpany",
      howToBuy: "Jak kupić",
      howToBuyValue:
        "Na wykładach w Kościele Środowisk Twórczych ({lecturesLink}) albo mailowo, z wysyłką pocztą.",
      lecturesLink: "terminy wykładów",
      publisher: "Wydawca",
      heading: "W skrócie",
      shippingNote: "Koszt wysyłki i dane do przelewu sekretariat poda w odpowiedzi.",
    },
    articlesHeading: "Artykuły",
    articlesLead:
      "Teksty z albumu oraz artykuły Elżbiety Jackowskiej-Kurek pisane dla różnych mediów. Najnowsze na górze.",
    sampleTag: "[przykład]",
    sourceFromAlbum: "Z albumu {title} · {year}",
    sourceFromMedia: "{outlet} · {year}",
    sourceAlbumMeta: "Z albumu",
    sourcePressMeta: "Pierwodruk:",
    aboutHeading: "O albumie",
    tocHeading: "Spis treści",
    tocLead:
      "Teksty opublikowane na stronie są oznaczone i prowadzą do pełnej wersji. Nazwiska wykładowców linkują do ich not.",
    tocLeadMobile:
      "Na telefonie lista stoi w jednej kolumnie; pozycje z opublikowanym tekstem mają złotą krechę z lewej i etykietę. Przy 20+ pozycjach pokazujemy pierwsze dziesięć i przycisk „Pokaż pełny spis”.",
    tocReadOnline: "Czytaj na stronie",
    tocShowFull: "Pokaż pełny spis ({count})",
    tocFootnote: "Pozycje z ciemniejszym tłem, złotą krechą z lewej i etykietą „Czytaj na stronie” mają opublikowany artykuł. Pełny spis liczy {count} tekstów.",
    authorsHeading: "Autorzy tekstów",
    authorsLecturers: "Wykładowcy",
    authorsParticipants: "Uczestnicy warsztatów i wykładów",
    lecturersLink: "Noty wykładowców",
    roles: {
      lecturer: "wykładowca",
      participant: "uczestnik",
    },
    excerptsHeading: "Fragmenty",
    originHeading: "Jak powstał album",
    seeAlsoHeading: "Zobacz też",
    seeAlsoLabel: "Zobacz też",
    allPublications: "Wszystkie publikacje",
    exhibitionLink: "Wystawa ikon w kościele",
    lecturesLinkFooter: "Cykl wykładów",
    lecturesScheduleLink: "Terminy wykładów",
    articleSourceHeading: "Źródło tekstu",
    articleSourceAlbumSentence:
      "Ten tekst pochodzi z albumu {title} wydanego przez Fundację IKONA DZIŚ.",
    articleSourceAlbumFacts: "{pages} stron · {format} · {price}",
    articleSourceViewAlbum: "Zobacz album",
    articleSourceOrder: "Zamów",
    articlePressNote:
      "Tekst ukazał się pierwotnie w {outlet} ({date}). Poniżej publikujemy go za zgodą redakcji.",
    articlePressReadOriginal: "Przeczytaj w {outlet}",
    articlePressTeaser:
      "Całość ukazała się w {outlet} ({date}). Poniżej zamieszczamy zajawkę.",
    articlePressTeaserLink: "Przeczytaj w {outlet}",
    lightbox: {
      close: "Zamknij",
      closeAria: "Zamknij",
      previous: "Poprzednia",
      previousAria: "Poprzednia rozkładówka",
      next: "Następna",
      nextAria: "Następna rozkładówka",
      position: "{index} z {total} · rozkładówka",
      openSpread: "Powiększ rozkładówkę: {alt}",
    },
  },
  contact: {
    breadcrumbHome: "Strona główna",
    addressHeading: "Adres",
    mapTitle: "Mapa dojazdu",
    mapPlaceholder: "Mapa — osadzenie zewnętrzne",
    organizerHeading: "Organizator",
    organizerLead: "Fundacja IKONA DZIŚ —",
    organizerLinkLabel: "ikonadzis.org",
    organizerTail: " Akademia Ikony jest jej projektem wiodącym.",
    onlineHeading: "Akademia w sieci",
    blogLinkLabel: "Blog — studiumikony.blogspot.com",
  },
  news: {
    title: "Aktualności",
    lead:
      "Wykłady, warsztaty, plenery, wystawy i spotkania w Akademii Ikony — oraz archiwum od 2012 roku, w jednym strumieniu wpisów.",
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
      plener: "Plener",
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
    breadcrumbHome: "Aktualności",
    allNewsLink: "Wszystkie aktualności",
    previousEntry: "Poprzedni",
    nextEntry: "Następny",
    previousEntryAria: "Poprzedni wpis: {title}",
    nextEntryAria: "Następny wpis: {title}",
    articleNavAriaLabel: "Nawigacja między wpisami",
    galleryHeading: "Zdjęcia",
    galleryMobileCaption: "Kliknij zdjęcie, aby powiększyć.",
    posterPlaceholder: "[do uzupełnienia: plakat]",
    ctaContact: "akademiaikony@gmail.com · 601 734 705",
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
