import { GalleryPage } from "@/components/gallery/GalleryPage";
import { mainNav, sectionNav } from "@/navigation";

const mainNavActive = mainNav.find((item) => item.href === "/ikony")!.label;
const sectionActive = sectionNav.ikony[0].label;

type IconsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function IconsPage({ searchParams }: IconsPageProps) {
  const params = await searchParams;

  return (
    <GalleryPage
      active={mainNavActive}
      sectionActive={sectionActive}
      searchParams={params}
    />
  );
}
