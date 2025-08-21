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
//     hover: { scale: 1.1, transition: { duration: 0.3 } },
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
//                 className="inline-block  bg-secondary dark:bg-secondary-darkMode hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
//                 variants={buttonVariants}
//                 whileHover="hover"
//                 whileTap={{ scale: 0.95 }}>
//                 Listen Now
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
import podcastImage from "../../assets/images/podcastImage2.png";

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
        className="relative py-16 bg-accent-cream dark:bg-accent-charcoal"
        ref={ref}>
        <div className="absolute inset-0 bg-primary dark:bg-primary-dark" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col lg:flex-row-reverse items-center gap-8"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeInVariants}>
            {/* Images with Overlays */}
            <div className="relative lg:w-1/2 w-full flex flex-col lg:flex-row justify-center gap-4">
              <img
                src={podcastImage}
                alt="Segun Umoru Podcast"
                className="rounded-sm object-cover w-[90%] h-[90%]  dark:border-accent-charcoal"
                loading="Lazy"
              />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-teal/30 rounded-full blur-md" />
            </div>

            {/* Text and CTA */}
            <motion.div
              className="lg:w-1/2 text-center lg:text-left text-white"
              variants={fadeInVariants}>
              <h2 className="text-4xl sm:text-5xl font-montserrat-subrayada mb-4">
                Umoru Podcast
              </h2>
              <p className="text-lg sm:text-xl mb-6">
                Join Segun Umoru on a transformative journey blending
                spirituality, data insights, and personal growth. Tune in for
                inspiration and guidance.
              </p>
              <motion.a
                href="/podcast"
                className="relative inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-red-600 hover:to-pink-900 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 group overflow-hidden"
                variants={buttonVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Listen Now
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-lg" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* <section className="bg-gray-50 min-h-10">{""}</section> */}
    </>
  );
};

export default PodcastBanner;
