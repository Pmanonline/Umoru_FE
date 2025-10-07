import React, { useState, useEffect } from "react";
import HeroSection from "./homePageComponents/HeroSection";
import AboutUs from "./homePageComponents/AboutUs";
import ServicesPage from "./homePageComponents/Services";
import PodcastBanner from "./homePageComponents/PodcastBanner";
import Testimonials from "./homePageComponents/Testimonials";
import { Resources, ScrollOverlay } from "./homePageComponents/Resources";
import BlogSection from "./homePageComponents/BlogSection";
import EventSection from "./homePageComponents/EventSection";

const Home = () => {
  const [hasUpcomingEvents, setHasUpcomingEvents] = useState(false);

  useEffect(() => {
    const checkEvents = async () => {
      try {
        const backendURL =
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_BACKEND_URL
            : "http://localhost:3001";
        const res = await fetch(`${backendURL}/api/getEvents`);
        const data = await res.json();
        const events = data.events || [];
        const now = new Date();
        const upcomingEvents = events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate > now;
        });
        setHasUpcomingEvents(upcomingEvents.length > 0);
      } catch (error) {
        console.error("Failed to check events:", error);
        setHasUpcomingEvents(false);
      }
    };
    checkEvents();
  }, []);

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
      {hasUpcomingEvents && <EventSection />}
      <BlogSection />
    </>
  );
};

export default Home;
