import { HeroCarousel } from "../components/HeroCarousel";
import { CategoriesGrid, FeaturedStrip, TrustBar, Heritage, InstagramSection, VisitUs, GoldMarquee } from "../components/HomeSections";

export default function Home() {
  return (
    <main data-testid="home-page">
      <HeroCarousel />
      <GoldMarquee />
      <CategoriesGrid />
      <FeaturedStrip />
      <TrustBar />
      <Heritage />
      <GoldMarquee items={["Necklaces", "Jhumkas", "Tops", "Bracelets", "Men's Collection", "Women's Collection"]} />
      <InstagramSection />
      <VisitUs />
    </main>
  );
}
