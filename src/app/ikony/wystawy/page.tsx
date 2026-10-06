import type { Metadata } from "next";

import { ExhibitionPage } from "@/components/exhibition/ExhibitionPage";
import {
  getExhibitionNowNext,
  getExhibitionPage,
  getFirstAnnualExhibitionYear,
  getLastFinishedAnnualExhibition,
  getLatestAnnualExhibition,
  getLatestAnnualExhibitionWithPhotos,
} from "@/content/exhibition";
import { navTitle } from "@/navigation";

export const revalidate = 86400;

const path = "/ikony/wystawy";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function ExhibitionRoutePage() {
  return (
    <ExhibitionPage
      path={path}
      page={getExhibitionPage()}
      latestAnnual={getLatestAnnualExhibition()}
      lastFinished={getLastFinishedAnnualExhibition()}
      latestWithPhotos={getLatestAnnualExhibitionWithPhotos()}
      nowNext={getExhibitionNowNext()}
      firstAnnualYear={getFirstAnnualExhibitionYear()}
    />
  );
}
