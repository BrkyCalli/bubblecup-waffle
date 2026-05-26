import { AnnouncementBanner } from "@/components/sections/AnnouncementBanner";
import { Hero } from "@/components/sections/Hero";
import { CampaignCards } from "@/components/sections/CampaignCards";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Story } from "@/components/sections/Story";
import { Reviews } from "@/components/sections/Reviews";
import { InstagramGrid } from "@/components/sections/InstagramGrid";

export default function HomePage() {
  return (
    <>
      <AnnouncementBanner />
      <Hero />
      <CampaignCards />
      <FeaturedProducts />
      <Story />
      <Reviews />
      <InstagramGrid />
    </>
  );
}
