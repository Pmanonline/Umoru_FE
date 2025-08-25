// import React from "react";
// import { motion } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import segunHeroImage from "../assets/images/UmorusPortrait.jpg";

// const AboutUsPage = () => {
//   // Separate refs for different sections to avoid reusing contentRef
//   const { ref: heroContentRef, inView: heroContentInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   const { ref: imageRef, inView: imageInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.2,
//   });

//   const { ref: biographyRef, inView: biographyInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.2,
//   });

//   const { ref: achievementsRef, inView: achievementsInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.2,
//   });

//   const { ref: educationRef, inView: educationInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.2,
//   });

//   const { ref: tractionRef, inView: tractionInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.2,
//   });

//   const { ref: philosophyRef, inView: philosophyInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.2,
//   });

//   const { ref: ctaRef, inView: ctaInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.2,
//   });

//   // Faster, more responsive animations
//   const fadeInVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut",
//       },
//     },
//   };

//   const imageVariants = {
//     hidden: { opacity: 0, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//       },
//     },
//   };

//   // Staggered list animations
//   const listVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const listItemVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { duration: 0.4 },
//     },
//   };

//   return (
//     <section className="relative py-16 bg-accent-cream dark:bg-accent-charcoal">
//       <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Hero Section: Image and Introduction */}
//         <div className="flex flex-col lg:flex-row items-center gap-8 mb-12">
//           <motion.div
//             ref={imageRef}
//             className="lg:w-1/3 w-full flex justify-center mb-6 lg:mb-0"
//             initial="hidden"
//             animate={imageInView ? "visible" : "hidden"}
//             variants={imageVariants}>
//             <img
//               src={segunHeroImage}
//               alt="Segun Umoru"
//               className="rounded-lg shadow-md object-cover w-full max-w-xs h-auto border-4 border-white dark:border-accent-charcoal"
//             />
//           </motion.div>

//           <motion.div
//             ref={heroContentRef}
//             className="lg:w-2/3 text-primary-dark dark:text-white"
//             initial="hidden"
//             animate={heroContentInView ? "visible" : "hidden"}
//             variants={fadeInVariants}>
//             <motion.p
//               className="text-sm text-gray-600 dark:text-white mb-2"
//               variants={fadeInVariants}>
//               Data Scientist, Life Coach, Spiritual Guide
//             </motion.p>
//             <motion.h2
//               className="text-3xl sm:text-4xl font-bold mb-4"
//               variants={fadeInVariants}>
//               Segun Umoru
//             </motion.h2>
//             <motion.p
//               className="text-lg sm:text-xl mb-6"
//               variants={fadeInVariants}>
//               Segun Umoru is a visionary leader dedicated to empowering
//               individuals and organizations through data-driven insights and
//               holistic personal development. With a unique blend of expertise in
//               data science, artificial intelligence, and spiritual coaching,
//               Segun transforms complex challenges into opportunities for growth
//               and innovation.
//             </motion.p>
//             <motion.p
//               className="text-lg sm:text-xl mb-6"
//               variants={fadeInVariants}>
//               His mission is to guide people toward their fullest potential by
//               integrating analytical rigor with faith-based principles. Whether
//               through advanced AI modeling or personalized mentorship, Segun's
//               approach fosters meaningful change in both professional and
//               personal spheres.
//             </motion.p>
//             <motion.a
//               href="/services"
//               className="inline-block bg-pink-400 hover:bg-pink-500 dark:hover:bg-pink-600 text-white dark:text-white py-2 px-4 rounded font-semibold transition-colors duration-300"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               variants={fadeInVariants}>
//               Explore Services
//             </motion.a>
//           </motion.div>
//         </div>

//         {/* Biography Section */}
//         <motion.div
//           ref={biographyRef}
//           className="mb-12"
//           initial="hidden"
//           animate={biographyInView ? "visible" : "hidden"}
//           variants={fadeInVariants}>
//           <motion.h3
//             className="text-2xl sm:text-3xl font-semibold text-primary-dark dark:text-white mb-4"
//             variants={fadeInVariants}>
//             Biography
//           </motion.h3>
//           <motion.p
//             className="text-base sm:text-lg text-gray-700 dark:text-white"
//             variants={fadeInVariants}>
//             Born and raised in Lagos, Nigeria, Segun Umoru developed an early
//             passion for problem-solving and human connection. His curiosity for
//             technology and spirituality shaped his multifaceted career. Over the
//             past decade, Segun has become a trusted advisor to businesses and
//             individuals, leveraging his technical expertise and empathetic
//             approach to drive transformative outcomes. His work spans
//             industries, from tech startups to global enterprises, and his
//             coaching has empowered countless individuals to achieve clarity and
//             purpose.
//           </motion.p>
//         </motion.div>

//         {/* Career Achievements */}
//         <motion.div
//           ref={achievementsRef}
//           className="mb-12"
//           initial="hidden"
//           animate={achievementsInView ? "visible" : "hidden"}
//           variants={fadeInVariants}>
//           <motion.h3
//             className="text-2xl sm:text-3xl font-semibold text-primary-dark dark:text-white mb-4"
//             variants={fadeInVariants}>
//             Career Achievements
//           </motion.h3>
//           <motion.ul
//             className="list-disc list-inside text-base sm:text-lg text-gray-700 dark:text-white space-y-2"
//             variants={listVariants}
//             initial="hidden"
//             animate={achievementsInView ? "visible" : "hidden"}>
//             <motion.li variants={listItemVariants}>
//               Led data science initiatives at a Fortune 500 tech company,
//               developing AI models that improved operational efficiency by 25%.
//             </motion.li>
//             <motion.li variants={listItemVariants}>
//               Founded a coaching platform that has mentored over 500 individuals
//               in personal and professional development since 2018.
//             </motion.li>
//             <motion.li variants={listItemVariants}>
//               Published articles on AI ethics and spiritual growth in leading
//               journals, influencing industry standards and personal development
//               practices.
//             </motion.li>
//             <motion.li variants={listItemVariants}>
//               Keynote speaker at international conferences on data science and
//               leadership, including TechCrunch Disrupt and TEDx Lagos.
//             </motion.li>
//           </motion.ul>
//         </motion.div>

//         {/* Education */}
//         <motion.div
//           ref={educationRef}
//           className="mb-12"
//           initial="hidden"
//           animate={educationInView ? "visible" : "hidden"}
//           variants={fadeInVariants}>
//           <motion.h3
//             className="text-2xl sm:text-3xl font-semibold text-primary-dark dark:text-white mb-4"
//             variants={fadeInVariants}>
//             Education
//           </motion.h3>
//           <motion.ul
//             className="list-disc list-inside text-base sm:text-lg text-gray-700 dark:text-white space-y-2"
//             variants={listVariants}
//             initial="hidden"
//             animate={educationInView ? "visible" : "hidden"}>
//             <motion.li variants={listItemVariants}>
//               Master's Degree in Data Science, University of Lagos, Nigeria
//               (2015)
//             </motion.li>
//             <motion.li variants={listItemVariants}>
//               Bachelor's Degree in Computer Science, Obafemi Awolowo University,
//               Nigeria (2012)
//             </motion.li>
//             <motion.li variants={listItemVariants}>
//               Certified Life Coach, International Coaching Federation (ICF),
//               2017
//             </motion.li>
//             <motion.li variants={listItemVariants}>
//               Advanced Certificate in Artificial Intelligence, MIT Online, 2019
//             </motion.li>
//           </motion.ul>
//         </motion.div>

//         {/* Traction and Impact */}
//         <motion.div
//           ref={tractionRef}
//           className="mb-12"
//           initial="hidden"
//           animate={tractionInView ? "visible" : "hidden"}
//           variants={fadeInVariants}>
//           <motion.h3
//             className="text-2xl sm:text-3xl font-semibold text-primary-dark dark:text-white mb-4"
//             variants={fadeInVariants}>
//             Traction & Impact
//           </motion.h3>
//           <motion.p
//             className="text-base sm:text-lg text-gray-700 dark:text-white mb-4"
//             variants={fadeInVariants}>
//             Segun's work has made a tangible impact, both in the tech industry
//             and in the lives of those he coaches. His data-driven solutions have
//             powered business growth, while his coaching programs have
//             transformed personal journeys.
//           </motion.p>
//           <motion.ul
//             className="list-disc list-inside text-base sm:text-lg text-gray-700 dark:text-white space-y-2"
//             variants={listVariants}
//             initial="hidden"
//             animate={tractionInView ? "visible" : "hidden"}>
//             <motion.li variants={listItemVariants}>
//               Over 1,000 hours of one-on-one coaching delivered globally.
//             </motion.li>
//             <motion.li variants={listItemVariants}>
//               Developed predictive models adopted by 10+ organizations, driving
//               millions in revenue savings.
//             </motion.li>
//             <motion.li variants={listItemVariants}>
//               95% satisfaction rate from coaching clients, based on post-session
//               surveys.
//             </motion.li>
//             <motion.li variants={listItemVariants}>
//               Mentored 50+ aspiring data scientists through free community
//               workshops in Nigeria.
//             </motion.li>
//           </motion.ul>
//         </motion.div>

//         {/* Personal Philosophy */}
//         <motion.div
//           ref={philosophyRef}
//           className="mb-12"
//           initial="hidden"
//           animate={philosophyInView ? "visible" : "hidden"}
//           variants={fadeInVariants}>
//           <motion.h3
//             className="text-2xl sm:text-3xl font-semibold text-primary-dark dark:text-white mb-4"
//             variants={fadeInVariants}>
//             Personal Philosophy
//           </motion.h3>
//           <motion.p
//             className="text-base sm:text-lg text-gray-700 dark:text-white"
//             variants={fadeInVariants}>
//             Segun believes that true success lies at the intersection of
//             intellect, empathy, and faith. His philosophy, rooted in the
//             principle of "purpose over profit," emphasizes holistic
//             growth—nurturing the mind, body, and spirit. By combining
//             data-driven decision-making with spiritual guidance, Segun helps
//             individuals and organizations align their actions with their deepest
//             values, creating lasting impact.
//           </motion.p>
//         </motion.div>

//         {/* Call to Action */}
//         <motion.div
//           ref={ctaRef}
//           className="text-center"
//           initial="hidden"
//           animate={ctaInView ? "visible" : "hidden"}
//           variants={fadeInVariants}>
//           <motion.h3
//             className="text-2xl sm:text-3xl font-semibold text-primary-dark dark:text-white mb-4"
//             variants={fadeInVariants}>
//             Ready to Transform Your Journey?
//           </motion.h3>
//           <motion.p
//             className="text-base sm:text-lg text-gray-700 dark:text-white mb-6"
//             variants={fadeInVariants}>
//             Whether you're seeking data-driven solutions or personal growth,
//             Segun Umoru is here to guide you. Connect with him today to explore
//             how his expertise can empower your future.
//           </motion.p>
//           <motion.a
//             href="/contact"
//             className="inline-block bg-pink-400 hover:bg-pink-500 dark:hover:bg-pink-600 text-white dark:text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-pink-500/20"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             variants={fadeInVariants}>
//             Get in Touch
//           </motion.a>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default AboutUsPage;
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import BookingModal from "../components/Modals/BookingModal";
import segunHeroImage from "../assets/images/UmorusPortrait.jpg";

const AboutUsPage = () => {
  // State for booking modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Separate refs for different sections
  const { ref: heroContentRef, inView: heroContentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: imageRef, inView: imageInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: biographyRef, inView: biographyInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: achievementsRef, inView: achievementsInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: educationRef, inView: educationInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: tractionRef, inView: tractionInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: philosophyRef, inView: philosophyInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: ctaRef, inView: ctaInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="relative py-12 sm:py-16 bg-accent-cream dark:bg-accent-charcoal mid:mt-6serv">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl  max-w-5xl mx-auto">
        {/* Hero Section: Image and Introduction */}
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 mb-12 sm:mb-16">
          <motion.div
            ref={imageRef}
            className="lg:w-1/3 w-full flex justify-center mb-6 sm:mb-8 lg:mb-0"
            initial="hidden"
            animate={imageInView ? "visible" : "hidden"}
            variants={imageVariants}>
            <img
              src={segunHeroImage}
              alt="Segun Umoru"
              className="rounded-lg shadow-md object-cover w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] h-[320px] sm:h-[360px] lg:h-[400px] border-4 border-white dark:border-accent-charcoal"
            />
          </motion.div>

          <motion.div
            ref={heroContentRef}
            className="lg:w-2/3 text-primary-dark dark:text-white"
            initial="hidden"
            animate={heroContentInView ? "visible" : "hidden"}
            variants={fadeInVariants}>
            <motion.p
              className="text-sm sm:text-base text-gray-600 dark:text-white mb-2 sm:mb-3"
              variants={fadeInVariants}>
              Data Scientist, Life Coach, Spiritual Guide
            </motion.p>
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
              variants={fadeInVariants}>
              Segun Umoru
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6"
              variants={fadeInVariants}>
              Segun Umoru is a visionary leader dedicated to empowering
              individuals and organizations through data-driven insights and
              holistic personal development. With a unique blend of expertise in
              data science, artificial intelligence, and spiritual coaching,
              Segun transforms complex challenges into opportunities for growth
              and innovation.
            </motion.p>
            <motion.p
              className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6"
              variants={fadeInVariants}>
              His mission is to guide people toward their fullest potential by
              integrating analytical rigor with faith-based principles. Whether
              through advanced AI modeling or personalized mentorship, Segun's
              approach fosters meaningful change in both professional and
              personal spheres.
            </motion.p>
          </motion.div>
        </div>

        {/* Biography Section */}
        <motion.div
          ref={biographyRef}
          className="mb-12 sm:mb-16"
          initial="hidden"
          animate={biographyInView ? "visible" : "hidden"}
          variants={fadeInVariants}>
          <motion.h3
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-dark dark:text-white mb-3 sm:mb-4"
            variants={fadeInVariants}>
            Biography
          </motion.h3>
          <motion.p
            className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-white"
            variants={fadeInVariants}>
            Born and raised in Lagos, Nigeria, Segun Umoru developed an early
            passion for problem-solving and human connection. His curiosity for
            technology and spirituality shaped his multifaceted career. Over the
            past decade, Segun has become a trusted advisor to businesses and
            individuals, leveraging his technical expertise and empathetic
            approach to drive transformative outcomes. His work spans
            industries, from tech startups to global enterprises, and his
            coaching has empowered countless individuals to achieve clarity and
            purpose.
          </motion.p>
        </motion.div>

        {/* Career Achievements */}
        <motion.div
          ref={achievementsRef}
          className="mb-12 sm:mb-16"
          initial="hidden"
          animate={achievementsInView ? "visible" : "hidden"}
          variants={fadeInVariants}>
          <motion.h3
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-dark dark:text-white mb-3 sm:mb-4"
            variants={fadeInVariants}>
            Career Achievements
          </motion.h3>
          <motion.ul
            className="list-disc list-inside text-base sm:text-lg lg:text-xl text-gray-700 dark:text-white space-y-2 sm:space-y-3"
            variants={listVariants}
            initial="hidden"
            animate={achievementsInView ? "visible" : "hidden"}>
            <motion.li variants={listItemVariants}>
              Led data science initiatives at a Fortune 500 tech company,
              developing AI models that improved operational efficiency by 25%.
            </motion.li>
            <motion.li variants={listItemVariants}>
              Founded a coaching platform that has mentored over 500 individuals
              in personal and professional development since 2018.
            </motion.li>
            <motion.li variants={listItemVariants}>
              Published articles on AI ethics and spiritual growth in leading
              journals, influencing industry standards and personal development
              practices.
            </motion.li>
            <motion.li variants={listItemVariants}>
              Keynote speaker at international conferences on data science and
              leadership, including TechCrunch Disrupt and TEDx Lagos.
            </motion.li>
          </motion.ul>
        </motion.div>

        {/* Education */}
        <motion.div
          ref={educationRef}
          className="mb-12 sm:mb-16"
          initial="hidden"
          animate={educationInView ? "visible" : "hidden"}
          variants={fadeInVariants}>
          <motion.h3
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-dark dark:text-white mb-3 sm:mb-4"
            variants={fadeInVariants}>
            Education
          </motion.h3>
          <motion.ul
            className="list-disc list-inside text-base sm:text-lg lg:text-xl text-gray-700 dark:text-white space-y-2 sm:space-y-3"
            variants={listVariants}
            initial="hidden"
            animate={educationInView ? "visible" : "hidden"}>
            <motion.li variants={listItemVariants}>
              Master's Degree in Data Science, University of Lagos, Nigeria
              (2015)
            </motion.li>
            <motion.li variants={listItemVariants}>
              Bachelor's Degree in Computer Science, Obafemi Awolowo University,
              Nigeria (2012)
            </motion.li>
            <motion.li variants={listItemVariants}>
              Certified Life Coach, International Coaching Federation (ICF),
              2017
            </motion.li>
            <motion.li variants={listItemVariants}>
              Advanced Certificate in Artificial Intelligence, MIT Online, 2019
            </motion.li>
          </motion.ul>
        </motion.div>

        {/* Traction and Impact */}
        <motion.div
          ref={tractionRef}
          className="mb-12 sm:mb-16"
          initial="hidden"
          animate={tractionInView ? "visible" : "hidden"}
          variants={fadeInVariants}>
          <motion.h3
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-dark dark:text-white mb-3 sm:mb-4"
            variants={fadeInVariants}>
            Traction & Impact
          </motion.h3>
          <motion.p
            className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-white mb-4 sm:mb-6"
            variants={fadeInVariants}>
            Segun's work has made a tangible impact, both in the tech industry
            and in the lives of those he coaches. His data-driven solutions have
            powered business growth, while his coaching programs have
            transformed personal journeys.
          </motion.p>
          <motion.ul
            className="list-disc list-inside text-base sm:text-lg lg:text-xl text-gray-700 dark:text-white space-y-2 sm:space-y-3"
            variants={listVariants}
            initial="hidden"
            animate={tractionInView ? "visible" : "hidden"}>
            <motion.li variants={listItemVariants}>
              Over 1,000 hours of one-on-one coaching delivered globally.
            </motion.li>
            <motion.li variants={listItemVariants}>
              Developed predictive models adopted by 10+ organizations, driving
              millions in revenue savings.
            </motion.li>
            <motion.li variants={listItemVariants}>
              95% satisfaction rate from coaching clients, based on post-session
              surveys.
            </motion.li>
            <motion.li variants={listItemVariants}>
              Mentored 50+ aspiring data scientists through free community
              workshops in Nigeria.
            </motion.li>
          </motion.ul>
        </motion.div>

        {/* Personal Philosophy */}
        <motion.div
          ref={philosophyRef}
          className="mb-12 sm:mb-16"
          initial="hidden"
          animate={philosophyInView ? "visible" : "hidden"}
          variants={fadeInVariants}>
          <motion.h3
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-dark dark:text-white mb-3 sm:mb-4"
            variants={fadeInVariants}>
            Personal Philosophy
          </motion.h3>
          <motion.p
            className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-white"
            variants={fadeInVariants}>
            Segun believes that true success lies at the intersection of
            intellect, empathy, and faith. His philosophy, rooted in the
            principle of "purpose over profit," emphasizes holistic
            growth—nurturing the mind, body, and spirit. By combining
            data-driven decision-making with spiritual guidance, Segun helps
            individuals and organizations align their actions with their deepest
            values, creating lasting impact.
          </motion.p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          ref={ctaRef}
          className="text-center"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={fadeInVariants}>
          <motion.h3
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-dark dark:text-white mb-3 sm:mb-4"
            variants={fadeInVariants}>
            Ready to Transform Your Journey?
          </motion.h3>
          <motion.p
            className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-white mb-4 sm:mb-6"
            variants={fadeInVariants}>
            Whether you're seeking data-driven solutions or personal growth,
            Segun Umoru is here to guide you. Book a session today to explore
            how his expertise can empower your future.
          </motion.p>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="inline-block bg-pink-400 hover:bg-pink-500 dark:hover:bg-pink-600 text-white dark:text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-300 shadow-md hover:shadow-pink-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={fadeInVariants}>
            Book a Session
          </motion.button>
        </motion.div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Book a Session with Segun"
          endpoint="/api/bookings"
          onSuccess={() => console.log("Booking submitted successfully")}
        />
      </div>
    </section>
  );
};

export default AboutUsPage;
