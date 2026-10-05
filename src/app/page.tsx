import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { Button } from "@/components/core/Button";
import { Hero } from "@/components/content/Hero";
import { Testimonial } from "@/components/content/Testimonial";
import { UpcomingHighlights } from "@/components/home/UpcomingHighlights";
import { Pillars } from "@/components/home/Pillars";
import { FeaturedIcons } from "@/components/home/FeaturedIcons";
import { getHomePage } from "@/content/home";
import { getCurrentSeasonLabel } from "@/content/lectures";
import { pl } from "@/i18n/pl";
import { fillTemplate } from "@/lib/fillTemplate";

export const revalidate = 86400;

export default function Home() {
  const { hero, pillars, testimonial } = getHomePage();
  const { hero: heroLabels } = pl.home;

  return (
    <SectionPageShell path="/" flush>
      <Hero title={hero.title} lead={hero.lead} image={hero.image}>
        <div className="flex flex-col sm:flex-row gap-space-4 mt-space-6">
          <Button href="/warsztaty" size="lg">
            {heroLabels.ctaPrimary}
          </Button>
          <Button href="/wyklady" size="lg" variant="secondary">
            {fillTemplate(heroLabels.ctaSecondary, { season: getCurrentSeasonLabel() })}
          </Button>
        </div>
      </Hero>
      <UpcomingHighlights />
      <Pillars pillars={pillars} />
      <Testimonial quote={testimonial.quote} author={testimonial.author} />
      <FeaturedIcons />
    </SectionPageShell>
  );
}
