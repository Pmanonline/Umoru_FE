import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HeroImage from "../../assets/images/HeroImage.jpg";
import HeroImages1 from "../../assets/images/HeroImages1.jpg";
import HeroImages2 from "../../assets/images/HeroImages2.jpg";
import HeroImages3 from "../../assets/images/HeroImages3.jpeg";
import HeroImages4 from "../../assets/images/HeroImages4.jpg";
import HeroImages5 from "../../assets/images/HeroImages5.jpg";
import HeroImages6 from "../../assets/images/HeroImage.jpg";

const HeroSection = () => {
  const scrollRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const scrollContainer = isMobile
      ? mobileScrollRef.current
      : scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let startTime;

    const scroll = (timestamp) => {
      if (!startTime) startTime = timestamp;

      if (!isHovered && scrollContainer) {
        const elapsed = timestamp - startTime;
        const scrollSpeed = 0.05;

        if (isMobile) {
          // Horizontal scrolling for mobile
          scrollContainer.scrollLeft =
            (elapsed * scrollSpeed) %
            (scrollContainer.scrollWidth - scrollContainer.clientWidth || 1);

          if (
            scrollContainer.scrollLeft >=
            scrollContainer.scrollWidth - scrollContainer.clientWidth
          ) {
            startTime = timestamp;
          }
        } else {
          // Vertical scrolling for desktop
          scrollContainer.scrollTop =
            (elapsed * scrollSpeed) %
            (scrollContainer.scrollHeight - scrollContainer.clientHeight || 1);

          if (
            scrollContainer.scrollTop >=
            scrollContainer.scrollHeight - scrollContainer.clientHeight
          ) {
            startTime = timestamp;
          }
        }
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isHovered, isMobile]);

  const projectItems = [
    {
      id: 1,
      image: HeroImages1,
      title: "Global Innovator",
      category: "Technology",
    },
    {
      id: 2,
      image: HeroImages2,
      title: "Cultural Ambassador",
      category: "Arts",
    },
    {
      id: 3,
      image: HeroImages3,
      title: "Environmental Champion",
      category: "Sustainability",
    },
    {
      id: 4,
      image: HeroImages4,
      title: "Humanitarian Leader",
      category: "Social Good",
    },
    {
      id: 5,
      image: HeroImages5,
      title: "Scientific Pioneer",
      category: "Science",
    },
    {
      id: 6,
      image: HeroImages6,
      title: "Global Visionary",
      category: "Leadership",
    },
  ];

  return (
    <div
      className="w-full text-white min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${HeroImage}), linear-gradient(to bottom, rgba(30, 58, 138, 0.1), rgba(30, 58, 138, 0.3))`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Overlay for fade effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary/90"></div>

      {/* Main hero content */}
      <div className="sm:container mx-auto px-4 py-16 lg:py-24 relative z-10 mid:mt-5">
        <div className="max-w-4xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8">
            CELEBRATE
            <br />
            GLOBAL HEROES
          </h1>
          <p className="text-md mb-8 max-w-xl">
            Discover the inspiring stories of heroes from every corner of the
            world, celebrated for their achievements in culture, innovation,
            sustainability, and leadership. The Pride of the World honors the
            diverse excellence that unites us all.
          </p>

          <Link to={"/continent-awards"}>
            <button className="bg-secondary hover:bg-secondary-light text-white font-bold py-3 px-8 rounded-sm transition-colors sm:mb-8 md:mb-0">
              EXPLORE THE PRIDE OF THE WORLD
            </button>
          </Link>
        </div>
      </div>

      {/* Vertical auto-scrolling portfolio section (Desktop) */}
      <div
        className="hidden md:block absolute top-[15%] right-0 w-[30%] h-[85%] transform -skew-x-12 bg-accent-cream bg-opacity-90 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div
          ref={scrollRef}
          className="flex flex-col h-full overflow-y-auto scrollbar-hide p-4 gap-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {projectItems.map((project) => (
            <div
              key={project.id}
              className="flex-shrink-0 w-full h-48 bg-gray-700 rounded-lg overflow-hidden relative group transform hover:scale-105 transition-transform duration-300">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <h3 className="text-lg font-bold text-white">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-300">{project.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal auto-scrolling portfolio section (Mobile) */}
      <div className="md:hidden w-full px-4 pb-8 relative">
        <div
          ref={mobileScrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {projectItems.map((project) => (
            <div
              key={project.id}
              className="flex-shrink-0 w-48 h-48 bg-gray-700 rounded-lg overflow-hidden relative group transform hover:scale-105 transition-transform duration-300">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <h3 className="text-lg font-bold text-white">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-300">{project.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
