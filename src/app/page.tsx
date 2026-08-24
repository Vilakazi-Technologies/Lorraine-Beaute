import { Hero } from "@/components/hero";
import { SkinAnalysisBanner } from "@/components/skin-analysis-banner";
import { Collections } from "@/components/collections";
import { Bestsellers } from "@/components/bestsellers";
import { StorySection } from "@/components/story-section";
import { ReviewsSection } from "@/components/reviews-section";
import { InstagramGallery } from "@/components/instagram-gallery";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SkinAnalysisBanner />
      <Collections />
      <Bestsellers />
      <StorySection />
      <ReviewsSection />
      <InstagramGallery />
    </main>
  );
}
