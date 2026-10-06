import { nbspDeep } from "@/lib/typography";
import type { AboutPageData, PrivacyPolicyPageData, WorkshopPageData } from "@/content/types";
import oAkademiiMeta from "../../content/pages/o-akademii.json";
import privacyPolicyMeta from "../../content/pages/polityka-prywatnosci.json";
import pracowniaMeta from "../../content/pages/pracownia.json";
import * as aboutParagraphs from "../../content/pages/o-akademii.mdx";
import ContactContent from "../../content/pages/kontakt.mdx";
import * as workshopParagraphs from "../../content/pages/pracownia.mdx";
import { assertMdxExports } from "@/content/validate";

type AboutParagraphExports = {
  audienceParagraphs: string[];
  historyParagraph: string;
  workshopParagraph: string;
};

const { audienceParagraphs, historyParagraph, workshopParagraph } = nbspDeep(
  assertMdxExports<AboutParagraphExports>(
    aboutParagraphs,
    ["audienceParagraphs", "historyParagraph", "workshopParagraph"],
    "content/pages/o-akademii.mdx",
  ),
);

type WorkshopParagraphExports = {
  curriculumParagraphs: string[];
};

const { curriculumParagraphs } = nbspDeep(
  assertMdxExports<WorkshopParagraphExports>(
    workshopParagraphs,
    ["curriculumParagraphs"],
    "content/pages/pracownia.mdx",
  ),
);

/** Page metadata from JSON — the MDX body is rendered by the route, so `body` is never loaded. */
type WithoutBody<T> = Omit<T, "body">;

export type LoadedAboutPage = WithoutBody<AboutPageData> & {
  audienceParagraphs: string[];
  historyParagraph: string;
  workshopParagraph: string;
};

export type LoadedWorkshopPage = WithoutBody<WorkshopPageData> & {
  curriculumParagraphs: string[];
};

export type LoadedContactPage = {
  Content: typeof ContactContent;
};

export type LoadedPrivacyPolicyPage = WithoutBody<PrivacyPolicyPageData>;

const aboutPageMeta = nbspDeep(oAkademiiMeta as WithoutBody<AboutPageData>);
const workshopPageMeta = nbspDeep(pracowniaMeta as WithoutBody<WorkshopPageData>);
const privacyPolicyPageMeta = nbspDeep(privacyPolicyMeta as WithoutBody<PrivacyPolicyPageData>);

export function getAboutPage(): LoadedAboutPage {
  return {
    ...aboutPageMeta,
    audienceParagraphs,
    historyParagraph,
    workshopParagraph,
  };
}

export function getWorkshopPage(): LoadedWorkshopPage {
  return {
    ...workshopPageMeta,
    curriculumParagraphs,
  };
}

export function getContactPage(): LoadedContactPage {
  return { Content: ContactContent };
}

export function getPrivacyPolicyPage(): LoadedPrivacyPolicyPage {
  return {
    ...privacyPolicyPageMeta,
  };
}
