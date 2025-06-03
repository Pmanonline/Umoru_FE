import React from "react";
import HeroSection from "./homeComponents/HeroSection ";
import FamousPeopleSection from "./homeComponents/FamousPeopleSection";
import StoriesSection from "./homeComponents/StoriesSection";
import PrideSection from "./homeComponents/PrideSection";
import Diamond from "../assets/images/diamond.png";
import PromoSection from "./homeComponents/PromoSection";
import ShortVideosSection from "./homeComponents/ShortVideosSection";
import GroupsYouMayLike from "../components/Cards/GroupsYouMayLike";
import SupportSection from "./homeComponents/SupportSection";
import AllEssentialGroup from "./homeComponents/AllEssentialGroup";
import RecommendedPeopleBanner from "../components/Banners/RecommendedPeopleBanner";
import GlobalPrideCategory from "./homeComponents/GlobalPrideCategory";
import VotingBanner from "../components/Banners/VotingBanner";
import MagazineBanner from "../components/Banners/TheAutographBanner";
import {
  BreakingNewsCarousel,
  TopTopicCarousel,
} from "../components/EnewsCarousel/BreakingNewsCarousel";

function Home() {
  return (
    <div>
      <HeroSection />
      {/* <StoriesSection /> */}
      <FamousPeopleSection />
      <PrideSection />
      <GlobalPrideCategory />
      <section className="mx-auto md:px-24 py-[2rem] bg-gray-50">
        <PromoSection />
      </section>
      <section className="mx-auto md:px- py-[rem] bg-gray-50">
        <ShortVideosSection />
      </section>

      <section className="mx-auto md:px-[rem] py-[2rem] bg-gray-50">
        <RecommendedPeopleBanner />
      </section>
      <section className="mx-auto md:px-[rem] py-[2rem] bg-gray-50">
        <SupportSection />
      </section>
      <section className="mx-auto md:px-[rem] py-[2rem] bg-gray-50">
        <BreakingNewsCarousel />
        <TopTopicCarousel />
      </section>

      <section className="mx-auto md:px-[rem] py-[2rem] bg-gray-50">
        <MagazineBanner />
      </section>

      <section className="mx-auto md:px-[rem] py-[2rem] bg-gray-50">
        <AllEssentialGroup />
      </section>
      <section className="mx-auto md:px-[3rem] py-[2rem] bg-gray-50">
        <GroupsYouMayLike />
      </section>
    </div>
  );
}

export default Home;
