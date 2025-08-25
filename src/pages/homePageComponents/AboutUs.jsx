import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import segunHeroImage from "../../assets/images/UmorusPortrait.jpg";

const AboutUs = () => {
  const { ref: headingRef, inView: headingInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: contentRef, inView: contentInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const { ref: imageRef, inView: imageInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  };

  return (
    <section className="relative py-16 bg-accent-cream dark:bg-accent-charcoal">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content and Image */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Image */}
          <motion.div
            ref={imageRef}
            className="lg:w-1/3 w-full flex justify-center mb-6 lg:mb-0"
            initial="hidden"
            animate={imageInView ? "visible" : "hidden"}
            variants={imageVariants}>
            <img
              src={segunHeroImage}
              alt="Segun Umoru"
              className="rounded-lg shadow-md object-cover w-full max-w-xs h-auto border-4 border-white dark:border-accent-charcoal"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            ref={contentRef}
            className="lg:w-2/3 text-primary-dark dark:text-white"
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            variants={fadeInVariants}>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Data Scientist, Life Coach, Spiritual Guide
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Segun Umoru</h2>
            <p className="text-lg sm:text-xl mb-6">
              Segun Umoru is a dedicated professional with a passion for
              empowering others. With expertise in data analysis, Python, and AI
              modeling, Segun transforms complex data into actionable insights.
              Beyond technology, he offers personalized coaching and mentorship,
              blending faith-based principles to foster personal and
              professional growth.
            </p>
            <p className="text-lg sm:text-xl">
              His mission is to nurture spiritual journeys and guide individuals
              toward their fullest potential. Explore how Segun’s unique
              approach can benefit you through his services.
            </p>
            <motion.a
              href="/about-us"
              className="mt-6 inline-block bg-pink-400 hover:bg-pink-500 text-white py-2 px-4 rounded font-semibold transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Explore More
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
