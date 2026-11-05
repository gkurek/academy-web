// Panel UI strings — labels from design/README-panel.md §6.
export const pl = {
  meta: {
    title: "Panel redakcyjny · Akademia Ikony",
  },
  header: {
    signature: "AKADEMIA IKONY",
    signatureSeparator: "–",
    subtitle: "Panel redakcyjny",
    publicSite: "Strona publiczna",
    externalNewTab: "(otwiera się w nowej karcie)",
    logout: "Wyloguj",
    themeToggle: "Ciemny motyw",
  },
  tabs: {
    ariaLabel: "Sekcje panelu",
    analytics: "Analityka",
    workshops: "Warsztaty",
    lectures: "Wykłady",
    news: "Aktualności",
  },
  analytics: {
    openPostHog: "Otwórz w PostHog",
    period: {
      label: "Okres",
      days7: "7 dni",
      days30: "30 dni",
      days90: "90 dni",
      year: "Rok",
    },
    aggregation: {
      label: "Jeden słupek to",
      day: "Dzień",
      week: "Tydzień",
      month: "Miesiąc",
    },
    metric: {
      label: "Miara",
      views: "Odsłony",
      visitors: "Odwiedzający (dziennie)",
      visitorsShort: "Odwiedzający",
    },
    asOf: (date: string, time: string) => `stan z ${date}, ${time}`,
    sampleNote: "dane nowej strony przykładowe, do czasu podłączenia PostHoga",
    visits: {
      title: "Odsłony i odwiedzający",
      totalViews: "odsłon",
      totalVisitors: "odwiedzających (suma dzienna)",
      visitorsNote:
        "Odwiedzających liczymy osobno każdego dnia. Przy słupku tygodnia lub miesiąca i w sumie za okres to suma dziennych odwiedzających, nie liczba różnych osób.",
      legendAria: "Legenda",
      legendNew: (range: string) => `Nowa strona · ${range}`,
      legendOld: "Stara strona · ten sam okres rok wcześniej",
      seriesNew: "Nowa strona",
      seriesOld: "Stara strona",
      oldNoteTitle: "Stara strona liczyła ruch inaczej.",
      oldNoteBody:
        "Dane pochodzą ze statystyk WordPressa, który liczył odsłony i odwiedzających po swojemu i nie odsiewał części botów. Porównuj kształt i kierunek zmian, nie same liczby.",
      oldNoteNone: "Za ten okres nie ma danych starej strony, wykres pokazuje tylko nową.",
      oldNotePartial: "Za część tego okresu nie ma danych starej strony: tam widać tylko nową.",
      chartAria: (metric: string, range: string) =>
        `Wykres słupkowy: ${metric}, nowa strona i stara strona, ${range}`,
      tableCaption: (metric: string) => `${metric}: nowa i stara strona`,
      tableColumnBucket: "Okres",
    },
    pages: {
      title: "Najczęstsze strony",
      oldViews: (views: string) => `stara strona: ${views}`,
      oldNote: (months: string) =>
        `Stara strona: odsłony za miesiące ${months}. WordPress zapisywał je miesiącami i w innej tabeli niż wykres wyżej, więc sumy się różnią. Na liście nie ma starych adresów, których nowa strona nie ma.`,
      oldNoteNone: "Za ten okres nie ma danych starej strony.",
    },
    sources: {
      title: "Źródła wejść",
      search: "Wyszukiwarki",
      direct: "Wejścia bezpośrednie",
      social: "Media społecznościowe",
      referral: "Inne strony",
    },
    devices: {
      title: "Urządzenia",
      desktop: "Komputer",
      mobile: "Telefon",
      tablet: "Tablet",
    },
    cta: {
      title: "Kliknięcia w zapisy i kontakt",
      description:
        "Kliknięcie to otwarcie programu pocztowego albo wybieranie numeru. Nie wiemy, ile zgłoszeń zostało naprawdę wysłanych.",
      course: "Kurs roczny i trzyletni: zapisy",
      courseShort: "Kurs: zapisy",
      summer: "Letnia Szkoła Światła: zapisy",
      summerShort: "Letnia Szkoła: zapisy",
      lectures: "Wykłady: zapisy",
      lecturesShort: "Wykłady: zapisy",
      email: "E-mail",
      phone: "Telefon",
    },
    breakdownAria: (title: string, items: string) => `${title}: ${items}`,
    tableColumnItem: "Pozycja",
    tableColumnValue: "Liczba",
    card: {
      loading: "Wczytywanie danych…",
      empty: "Brak danych za ten okres.",
      emptyVisitsTitle: "Nie ma jeszcze danych",
      emptyVisitsBody:
        "Pierwsze liczby pojawią się dzień po uruchomieniu nowej strony, pełny obraz tygodnia po siedmiu dniach.",
      errorTitle: "Nie udało się pobrać danych",
      errorBody: "PostHog nie odpowiedział. To zwykle chwilowe. Spróbuj ponownie za minutę albo otwórz dane bezpośrednio w PostHog.",
      retry: "Pobierz ponownie",
      errorCode: (code: string, time: string) => `Kod błędu: ${code} · ${time}`,
    },
  },
} as const;
