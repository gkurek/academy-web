import type { AboutPageData, WorkshopPageData } from "@/content/types";
import oAkademiiMeta from "../../content/pages/o-akademii.json";
import pracowniaMeta from "../../content/pages/pracownia.json";
import * as aboutParagraphs from "../../content/pages/o-akademii.mdx";
import * as workshopParagraphs from "../../content/pages/pracownia.mdx";

type AboutParagraphExports = {
  audienceParagraphs: string[];
  historyParagraph: string;
  workshopParagraph: string;
};

const { audienceParagraphs, historyParagraph, workshopParagraph } =
  aboutParagraphs as unknown as AboutParagraphExports;

type WorkshopParagraphExports = {
  curriculumParagraphs: string[];
};

const { curriculumParagraphs } = workshopParagraphs as unknown as WorkshopParagraphExports;

export type LoadedAboutPage = AboutPageData & {
  audienceParagraphs: string[];
  historyParagraph: string;
  workshopParagraph: string;
};

export type LoadedWorkshopPage = WorkshopPageData & {
  curriculumParagraphs: string[];
};

const aboutPageMeta = oAkademiiMeta as AboutPageData;
const workshopPageMeta = pracowniaMeta as WorkshopPageData;

export function getAboutPage(): LoadedAboutPage | undefined {
  return {
    ...aboutPageMeta,
    body: "",
    audienceParagraphs,
    historyParagraph,
    workshopParagraph,
  };
}

export function getWorkshopPage(): LoadedWorkshopPage | undefined {
  return {
    ...workshopPageMeta,
    body: "",
    curriculumParagraphs,
  };
}
