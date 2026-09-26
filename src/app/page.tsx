import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { Button } from "@/components/core/Button";
import { Hero } from "@/components/content/Hero";
import { Testimonial } from "@/components/content/Testimonial";
import { UpcomingHighlights } from "@/components/home/UpcomingHighlights";
import { Pillars } from "@/components/home/Pillars";
import { FeaturedIcons } from "@/components/home/FeaturedIcons";
import { pl } from "@/i18n/pl";

export const revalidate = 86400;

export default function Home() {
  const { hero, testimonial } = pl.home;

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <Hero title={hero.title} lead={hero.lead} image={hero.image}>
          <div className="flex flex-col sm:flex-row gap-space-4 mt-space-6">
            <Button href="/warsztaty" size="lg">
              {hero.ctaPrimary}
            </Button>
            <Button href="/wyklady" size="lg" variant="secondary">
              {hero.ctaSecondary}
            </Button>
          </div>
        </Hero>
        <UpcomingHighlights />
        <Pillars />
        <Testimonial quote={testimonial.quote} author={testimonial.author} />
        <FeaturedIcons />
      </main>
      <Footer />
    </>
  );
}
