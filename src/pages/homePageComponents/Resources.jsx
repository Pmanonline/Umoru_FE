// import React from "react";
// import { motion } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import ResourcesImage from "../../assets/images/resources2.jpg";
// import { Link } from "react-router-dom";

// const Resources = () => {
//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     threshold: 0.2,
//   });

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
//     },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.1, transition: { duration: 0.3 } },
//   };

//   return (
//     <section
//       className="relative py-24 h-screen bg-accent-cream dark:bg-accent-charcoal overflow-hidden"
//       ref={ref}
//       style={{
//         backgroundImage: `url(${ResourcesImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         backgroundAttachment: "fixed", // Parallax effect
//       }}>
//       <div className="absolute inset-0 dark:bg-black/60 bg-black/30" />
//       <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-full">
//         <motion.div
//           className="text-center text-white"
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           variants={containerVariants}>
//           <h2 className="text-4xl sm:text-5xl font-montserrat-subrayada mb-4">
//             Unlock Valuable Resources
//           </h2>
//           <p className="text-lg sm:text-xl mb-6 max-w-lg mx-auto">
//             Dive into a treasure trove of guides, tutorials, and insights to
//             empower your data journey, spiritual growth, and personal success.
//           </p>
//           <motion.div
//             variants={buttonVariants}
//             whileHover="hover"
//             whileTap={{ scale: 0.95 }}>
//             <Link
//               to="/ResourcesPage"
//               className="inline-block bg-pink-400 hover:bg-pink-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300">
//               Explore Resources
//             </Link>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// const ScrollOverlay = () => {
//   return <></>;
// };

// export { Resources, ScrollOverlay };
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ResourcesImage from "../../assets/images/resources2.jpg";
import { Link } from "react-router-dom";
import { Archive, Download } from "lucide-react";

const Resources = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
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
    <section
      className="relative py-24 h-screen bg-accent-cream dark:bg-accent-charcoal overflow-hidden"
      ref={ref}
      style={{
        backgroundImage: `url(${ResourcesImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}>
      <div className="absolute inset-0 bg-black/30 dark:bg-black/70" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-full">
        <motion.div
          className="text-center text-white max-w-4xl"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}>
          <h2 className="text-5xl md:text-6xl font-bold font-montserrat-subrayada mb-6 bg-clip-text text-transparent bg-accent-teal">
            Resource Library
          </h2>

          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Guides, tutorials, and insights for your data journey and personal
            growth.
          </p>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mb-10">
            <div className="flex items-center bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <Archive className="w-5 h-5 mr-2 text-accent-teal" />
              <span className="font-semibold">50+ Resources</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <Download className="w-5 h-5 mr-2 text-accent-green" />
              <span className="font-semibold">500+ Downloads</span>
            </div>
          </div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}>
            <Link
              to="/ResourcesPage"
              className="relative inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-orange-600 hover:from-orange-500 hover:to-red-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 group overflow-hidden">
              {/* Icon */}
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>

              {/* Text */}
              <span className="relative z-10">Explore Resources</span>

              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out rounded-xl"></span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ScrollOverlay = () => {
  return <></>;
};

export { Resources, ScrollOverlay };
