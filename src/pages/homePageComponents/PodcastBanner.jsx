// // import React from "react";
// // import { motion } from "framer-motion";
// // import { useInView } from "react-intersection-observer";
// // import podcastImage from "../../assets/images/podcastImage2.png";

// // const PodcastBanner = () => {
// //   const { ref, inView } = useInView({
// //     triggerOnce: true,
// //     threshold: 0.2,
// //   });

// //   const fadeInVariants = {
// //     hidden: { opacity: 0, y: 30 },
// //     visible: {
// //       opacity: 1,
// //       y: 0,
// //       transition: { duration: 0.8, ease: "easeOut" },
// //     },
// //   };

// //   const buttonVariants = {
// //     hover: { scale: 1.1, transition: { duration: 0.3 } },
// //   };

// //   return (
// //     <>
// //       <section
// //         className="relative py-16 bg-accent-cream dark:bg-accent-charcoal"
// //         ref={ref}>
// //         <div className="absolute inset-0 bg-primary dark:bg-primary-dark" />
// //         <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
// //           <motion.div
// //             className="flex flex-col lg:flex-row-reverse items-center gap-8"
// //             initial="hidden"
// //             animate={inView ? "visible" : "hidden"}
// //             variants={fadeInVariants}>
// //             {/* Images with Overlays */}
// //             <div className="relative lg:w-1/2 w-full flex flex-col lg:flex-row justify-center gap-4">
// //               <img
// //                 src={podcastImage}
// //                 alt="Segun Umoru Podcast"
// //                 className="rounded-sm object-cover w-[90%] h-[90%]  dark:border-accent-charcoal"
// //                 loading="Lazy"
// //               />
// //               <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-teal/30 rounded-full blur-md" />
// //             </div>

// //             {/* Text and CTA */}
// //             <motion.div
// //               className="lg:w-1/2 text-center lg:text-left text-white"
// //               variants={fadeInVariants}>
// //               <h2 className="text-4xl sm:text-5xl font-montserrat-subrayada mb-4">
// //                 Umoru Podcast
// //               </h2>
// //               <p className="text-lg sm:text-xl mb-6">
// //                 Join Segun Umoru on a transformative journey blending
// //                 spirituality, data insights, and personal growth. Tune in for
// //                 inspiration and guidance.
// //               </p>
// //               <motion.a
// //                 href="/podcast"
// //                 className="inline-block  bg-secondary dark:bg-secondary-darkMode hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
// //                 variants={buttonVariants}
// //                 whileHover="hover"
// //                 whileTap={{ scale: 0.95 }}>
// //                 Listen Now
// //               </motion.a>
// //             </motion.div>
// //           </motion.div>
// //         </div>
// //       </section>
// //       {/* <section className="bg-gray-50 min-h-10">{""}</section> */}
// //     </>
// //   );
// // };

// // export default PodcastBanner;
// import React from "react";
// import { motion } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import podcastImage from "../../assets/images/podcastImage2.png";

// const PodcastBanner = () => {
//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     threshold: 0.2,
//   });

//   const fadeInVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.05, transition: { duration: 0.3 } },
//   };

//   return (
//     <>
//       <section
//         className="relative py-16 bg-accent-cream dark:bg-accent-charcoal"
//         ref={ref}>
//         <div className="absolute inset-0 bg-primary dark:bg-primary-dark" />
//         <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             className="flex flex-col lg:flex-row-reverse items-center gap-8"
//             initial="hidden"
//             animate={inView ? "visible" : "hidden"}
//             variants={fadeInVariants}>
//             {/* Images with Overlays */}
//             <div className="relative lg:w-1/2 w-full flex flex-col lg:flex-row justify-center gap-4">
//               <img
//                 src={podcastImage}
//                 alt="Segun Umoru Podcast"
//                 className="rounded-sm object-cover w-[90%] h-[90%]  dark:border-accent-charcoal"
//                 loading="Lazy"
//               />
//               <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-teal/30 rounded-full blur-md" />
//             </div>

//             {/* Text and CTA */}
//             <motion.div
//               className="lg:w-1/2 text-center lg:text-left text-white"
//               variants={fadeInVariants}>
//               <h2 className="text-4xl sm:text-5xl font-montserrat-subrayada mb-4">
//                 Umoru Podcast
//               </h2>
//               <p className="text-lg sm:text-xl mb-6">
//                 Join Segun Umoru on a transformative journey blending
//                 spirituality, data insights, and personal growth. Tune in for
//                 inspiration and guidance.
//               </p>
//               <motion.a
//                 href="/podcast"
//                 className="relative inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-red-600 hover:to-pink-900 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 group overflow-hidden"
//                 variants={buttonVariants}
//                 whileHover="hover"
//                 whileTap={{ scale: 0.95 }}>
//                 <svg
//                   className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
//                   fill="currentColor"
//                   viewBox="0 0 20 20">
//                   <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
//                 </svg>
//                 Listen Now
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-lg" />
//               </motion.a>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>
//       {/* <section className="bg-gray-50 min-h-10">{""}</section> */}
//     </>
//   );
// };

// export default PodcastBanner;

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import podcastImage from "../../assets/images/podcastimage3.png";

const PodcastBanner = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <>
      <section
        className="relative py-16 bg-accent-cream dark:bg-accent-charcoal h-[90vh]"
        ref={ref}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary-dark/50 dark:from-primary-dark/70 dark:via-primary/50" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            className="flex flex-col lg:flex-row-reverse items-center gap-8"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeInVariants}>
            {/* Images with Overlays */}
            <div className="relative lg:w-1/2 w-full flex flex-col lg:flex-row justify-center gap-4">
              <img
                src={podcastImage}
                className="rounded-lg object-cover w-[90%] h-[90%] border-2 border-white/20 dark:border-accent-charcoal/50 "
                loading="lazy"
              />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-teal/30 dark:bg-accent-teal/20 rounded-full blur-md" />
            </div>

            {/* Text and CTA */}
            <motion.div
              className="lg:w-1/2 text-center lg:text-left text-white"
              variants={fadeInVariants}>
              <h2 className="text-4xl sm:text-5xl font-semibold mb-4 bg-gradient-to-r from-secondary via-primary  dark:from-secondary-light dark:via-teal-300 bg-clip-text text-transparent">
                Umoru Podcast
              </h2>
              <p className="text-lg sm:text-xl mb-6">
                Join Segun Umoru on a transformative journey blending
                spirituality, data insights, and personal growth. Tune in for
                inspiration and guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="https://open.spotify.com/show/1gEbkeViieEWX3afbXPZJw?si=_wCZaxTTSLSH9JHS__2-iw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-secondary/50 dark:from-green-600 dark:to-emerald-700 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group overflow-hidden"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.7 15.8c-.5 0-4.3-2.7-5.7-2.7s-5.2 2.7-5.7 2.7c-.3 0-.6-.3-.6-.6 0-3.8 4.2-7.3 5.4-7.8v-2c0-.3.3-.6.6-.6s.6.3.6.6v2c1.2.5 5.4 4 5.4 7.8 0 .3-.3.6-.6.6z" />
                  </svg>
                  Spotify
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-lg" />
                </motion.a>
                <motion.a
                  href="https://podcasts.apple.com/us/podcast/faith-talk-show/id1702484346"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-2 bg-gradient-to-r from-primary to-green-500 text-white dark:from-gray-700 dark:to-gray-800 text-black dark:text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg hover:shadow-gray-400/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group overflow-hidden"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-10v8h2v-8h-2zm0-2v-4h2v4h-2z" />
                  </svg>
                  Apple Podcasts
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-lg" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* <section className="bg-gray-50 min-h-10">{""}</section> */}
    </>
  );
};

export default PodcastBanner;
