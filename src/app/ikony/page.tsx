import { GalleryPage } from "@/components/gallery/GalleryPage";
import { mainNav, sectionNav } from "@/navigation";

const mainNavActive = mainNav.find((item) => item.href === "/ikony")!.label;
const sectionActive = sectionNav.ikony[0].label;

export default function IconsPage() {
  return <GalleryPage active={mainNavActive} sectionActive={sectionActive} />;
}
