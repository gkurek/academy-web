import type { AboutPageData, PrivacyPolicyPageData, WorkshopPageData } from "@/content/types";
import oAkademiiMeta from "../../content/pages/o-akademii.json";
import privacyPolicyMeta from "../../content/pages/polityka-prywatnosci.json";
import pracowniaMeta from "../../content/pages/pracownia.json";
import * as aboutParagraphs from "../../content/pages/o-akademii.mdx";
import ContactContent from "../../content/pages/kontakt.mdx";
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

export type LoadedContactPage = {
  Content: typeof ContactContent;
};

export type LoadedPrivacyPolicyPage = PrivacyPolicyPageData;

const aboutPageMeta = oAkademiiMeta as AboutPageData;
const workshopPageMeta = pracowniaMeta as WorkshopPageData;
const privacyPolicyPageMeta = privacyPolicyMeta as PrivacyPolicyPageData;

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

export function getContactPage(): LoadedContactPage {
  return { Content: ContactContent };
}

export function getPrivacyPolicyPage(): LoadedPrivacyPolicyPage {
  return {
    ...privacyPolicyPageMeta,
    body: "",
  };
}
