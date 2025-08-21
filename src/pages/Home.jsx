import React from "react";
import HeroSection from "./homePageComponents/HeroSection";
import AboutUs from "./homePageComponents/AboutUs";
import ServicesPage from "./homePageComponents/Services";
import PodcastBanner from "./homePageComponents/PodcastBanner";
import Testimonials from "./homePageComponents/Testimonials";
import { Resources, ScrollOverlay } from "./homePageComponents/Resources";
import BlogSection from "./homePageComponents/BlogSection";
import EventSection from "./homePageComponents/EventSection";
// import SpiritualResources from "../components/SpiritualResources";
// import TelegramChannel from "../components/TelegramChannel";
// import Support from "../components/Support";

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <ServicesPage />

      <PodcastBanner />
      <Resources />
      <ScrollOverlay />
      <Testimonials />
      <podcastImage />

      <EventSection />
      <BlogSection />
      {/* <FAQ />  */}
    </>
  );
};

export default Home;
