// import React, { useEffect } from "react";
// import { motion } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import segunHeroImage from "../../assets/images/UmorusPortrait.jpg";

// const Hero = () => {
//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.3, delayChildren: 0.2 },
//     },
//   };

//   const childVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.1, boxShadow: "0 5px 15px rgba(16, 185, 129, 0.4)" },
//     tap: { scale: 0.95 },
//   };

//   // Cursor-following particle effect
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       const particles = document.querySelectorAll(".particle");
//       particles.forEach((particle) => {
//         const rect = particle.getBoundingClientRect();
//         const speed = 0.03;
//         const dx = (e.clientX - (rect.left + rect.width / 2)) * speed;
//         const dy = (e.clientY - (rect.top + rect.height / 2)) * speed;
//         particle.style.transform = `translate(${dx}px, ${dy}px)`;
//       });
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   return (
//     <section
//       ref={ref}
//       className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-900 via-purple-800 to-gray-800 mt-16">
//       {/* Blurred Background Image with Overlay */}
//       <div
//         className="absolute inset-0 bg-cover bg-center animate-pulse-slow blur-md"
//         style={{ backgroundImage: `url(${segunHeroImage})` }}
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

//       {/* Content and Image Columns */}
//       <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
//         <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 py-12">
//           {/* Text Content Column */}
//           <motion.div
//             className="text-white text-left max-w-lg"
//             initial="hidden"
//             animate={inView ? "visible" : "hidden"}
//             variants={containerVariants}>
//             <motion.h1
//               className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight font-montserrat-subrayada"
//               variants={childVariants}>
//               Segun Umoru
//               <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mt-2">
//                 Data | AI | Growth
//               </span>
//             </motion.h1>
//             <motion.p
//               className="text-lg sm:text-xl md:text-2xl mt-4"
//               variants={childVariants}>
//               Unlock the power of data analysis and AI, grow through expert
//               coaching and mentorship, and nurture your spiritual journey with
//               personalized guidance.
//             </motion.p>
//             <motion.div
//               className="mt-6 flex flex-col sm:flex-row gap-4"
//               variants={childVariants}>
//               <motion.a
//                 href="/learn"
//                 className="bg-accent-green hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold"
//                 variants={buttonVariants}
//                 whileHover="hover"
//                 whileTap="tap">
//                 Start Learning
//               </motion.a>
//               <motion.a
//                 href="/book"
//                 className="bg-accent-teal hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold"
//                 variants={buttonVariants}
//                 whileHover="hover"
//                 whileTap="tap">
//                 Book a Session
//               </motion.a>
//             </motion.div>
//           </motion.div>

//           {/* Image Column */}
//           <motion.div
//             className="max-w-xs sm:max-w-md"
//             initial="hidden"
//             animate={inView ? "visible" : "hidden"}
//             variants={childVariants}>
//             <img
//               src={segunHeroImage}
//               alt="Segun Umoru"
//               className="rounded-lg shadow-2xl object-cover w-full h-auto"
//             />
//           </motion.div>
//         </div>
//       </div>

//       {/* Particle Effects */}
//       {[...Array(12)].map((_, i) => (
//         <span
//           key={i}
//           className="particle absolute w-2 h-2 bg-white/30 rounded-full"
//           style={{
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//           }}
//         />
//       ))}
//     </section>
//   );
// };

// export default Hero;

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Hero = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 6px 20px rgba(16, 185, 129, 0.5)" },
    tap: { scale: 0.98 },
  };

  const ctaContainerVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  // Cursor-following particle effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const particles = document.querySelectorAll(".particle");
      particles.forEach((particle) => {
        const rect = particle.getBoundingClientRect();
        const speed = 0.02;
        const dx = (e.clientX - (rect.left + rect.width / 2)) * speed;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * speed;
        particle.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={ref}
      className="mt-12 relative min-h-[95vh] w-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-800 to-teal-900 dark:from-gray-800 dark:via-teal-800 dark:to-purple-800 py-8 lg:py-12">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 dark:from-black/60" />

      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 py-6 lg:py-8">
          {/* Text Content Column */}
          <motion.div
            className="text-white text-left max-w-md lg:max-w-lg"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}>
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
              variants={childVariants}>
              Segun Umoru
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300 mt-2">
                Data | AI | Growth
              </span>
            </motion.h1>
            <motion.p
              className="text-sm sm:text-base md:text-lg mt-3 text-gray-200"
              variants={childVariants}>
              Unlock data analysis and AI expertise, grow with tailored
              coaching, and enhance your spiritual journey with personalized
              guidance.
            </motion.p>

            <motion.div
              className="mt-5 w-full bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={ctaContainerVariants}
              whileHover="hover">
              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                variants={containerVariants}>
                <motion.a
                  href="/book"
                  className=" bg-gradient-to-r from-pink-500 to-orange-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/30 transform hover:-translate-y-0.5 text-sm sm:text-base flex-1 sm:flex-none"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap">
                  Know More
                </motion.a>
                <motion.a
                  href="/book"
                  className=" bg-gradient-to-r from-blue-700 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/30 transform hover:-translate-y-0.5 text-sm sm:text-base flex-1 sm:flex-none"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap">
                  Book a Session
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* <button className="bg-gradient-to-r from-blue-700 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/30 transform hover:-translate-y-0.5 text-sm sm:text-base flex-1 sm:flex-none">
                  Register Now
                </button> */}

          {/* Image Column */}
          <motion.div
            className="max-w-xs sm:max-w-sm md:max-w-md"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={childVariants}>
            <img
              src="/assets/images/dataImage.jpeg"
              alt="Segun Umoru"
              className="rounded-xl shadow-xl object-cover w-full h-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
            />
          </motion.div>
        </div>
      </div>

      {/* Particle Effects */}
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className="particle absolute w-1.5 h-1.5 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </section>
  );
};

export default Hero;
