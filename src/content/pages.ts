import { nbspDeep } from "@/lib/typography";
import type { AboutPageData, PrivacyPolicyPageData, WorkshopPageData } from "@/content/types";
import oAkademiiMeta from "../../content/pages/o-akademii.json";
import privacyPolicyMeta from "../../content/pages/polityka-prywatnosci.json";
import pracowniaMeta from "../../content/pages/pracownia.json";
import * as aboutParagraphs from "../../content/pages/o-akademii.mdx";
import ContactContent from "../../content/pages/kontakt.mdx";
import * as workshopParagraphs from "../../content/pages/pracownia.mdx";
import { getLecturerProfileHref } from "@/content/lecturers";
import { getSiteSettings } from "@/content/settings";
import { assertMdxExports } from "@/content/validate";

/** Inline link in an MDX-exported paragraph: a lecturer profile or a site-settings link. */
type InlineLinkSource = { text: string; lecturer: string } | { text: string; link: "foundation" };
type ParagraphSource = string | (string | InlineLinkSource)[];

/** Resolved paragraph segment — plain text or a link ready to render. */
export type ParagraphSegment = string | { text: string; href: string; external: boolean };

type AboutParagraphExports = {
  audienceParagraphs: string[];
  historyParagraphs: ParagraphSource[];
  workshopParagraph: string;
};

function resolveSegment(segment: string | InlineLinkSource): ParagraphSegment {
  if (typeof segment === "string") {
    return segment;
  }

  if ("lecturer" in segment) {
    const href = getLecturerProfileHref(segment.lecturer);
    if (!href) {
      throw new Error(`content/pages/o-akademii.mdx: lecturer "${segment.lecturer}" has no profile`);
    }
    return { text: segment.text, href, external: false };
  }

  return { text: segment.text, href: getSiteSettings().ecosystem.foundationUrl, external: true };
}

function resolveParagraph(paragraph: ParagraphSource): ParagraphSegment[] {
  return typeof paragraph === "string" ? [paragraph] : paragraph.map(resolveSegment);
}

const { audienceParagraphs, historyParagraphs: historySources, workshopParagraph } = nbspDeep(
  assertMdxExports<AboutParagraphExports>(
    aboutParagraphs,
    ["audienceParagraphs", "historyParagraphs", "workshopParagraph"],
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
  historyParagraphs: ParagraphSegment[][];
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
    historyParagraphs: historySources.map(resolveParagraph),
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
