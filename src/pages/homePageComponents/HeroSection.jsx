// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import { Link } from "react-router-dom";
// import BookingModal from "../../components/Modals/BookingModal";

// const Hero = () => {
//   const [currentService, setCurrentService] = useState(0);
//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Services for carousel (replace with Segun Umoru services)
//   const services = [
//     "Data Analytics Solutions",
//     "AI-Driven Insights",
//     "Personalized Growth Coaching",
//     "Spiritual Guidance",
//   ];

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.3, delayChildren: 0.2 },
//     },
//   };

//   const buttonVariants = {
//     hover: {
//       scale: 1.05,
//       boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
//       transition: { duration: 0.2 },
//     },
//     tap: { scale: 0.98 },
//   };

//   const childVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   const carouselVariants = {
//     hidden: { opacity: 0, x: 100 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { duration: 0.5 },
//     },
//     exit: { opacity: 0, x: -100, transition: { duration: 0.5 } },
//   };

//   // Carousel animation effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentService((prev) => (prev + 1) % services.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [services.length]);

//   return (
//     <section
//       ref={ref}
//       className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
//       style={{
//         backgroundImage:
//           "url('https://via.placeholder.com/1920x1080?text=Segun+Umoru+Hero+Image')",
//       }}>
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

//       <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
//         <div className="container mx-auto max-w-7xl">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
//             {/* Text Content Column */}
//             <motion.div
//               className="text-gray-200 space-y-6 lg:space-y-8 text-center lg:text-left"
//               initial="hidden"
//               animate={inView ? "visible" : "hidden"}
//               variants={containerVariants}>
//               <motion.h1
//                 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
//                 variants={childVariants}>
//                 <span className="block">Segun Umoru</span>
//                 <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-gray-500 to-secondary mt-2">
//                   Data | AI | Growth
//                 </span>
//               </motion.h1>
//               <motion.p
//                 className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-xl mx-auto lg:mx-0"
//                 variants={childVariants}>
//                 Unlock data analysis and AI expertise, grow with tailored
//                 coaching, and enhance your spiritual journey with personalized
//                 guidance.
//               </motion.p>
//               <motion.div
//                 className="flex flex-col sm:flex-row gap-4"
//                 variants={childVariants}>
//                 <Link>
//                   <motion.button
//                     onClick={() => setIsModalOpen(true)}
//                     className="flex-1 bg-secondary/80 hover:from-secondary hover:to-primary text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 text-center text-base"
//                     a
//                     variants={buttonVariants}
//                     whileHover="hover"
//                     whileTap="tap">
//                     Book a Session
//                   </motion.button>
//                 </Link>
//               </motion.div>
//             </motion.div>

//             {/* Carousel Column */}
//             <motion.div
//               className="relative text-center lg:text-right"
//               initial="hidden"
//               animate={inView ? "visible" : "hidden"}
//               variants={childVariants}>
//               <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-4">
//                 Major Services
//               </h2>
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={currentService}
//                   className="inline-block bg-white/90 text-gray-900 font-medium py-2 px-4 rounded-lg shadow-md"
//                   variants={carouselVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="exit">
//                   {services[currentService]}
//                 </motion.div>
//               </AnimatePresence>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//       <BookingModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title="Book a Session with Segun"
//         endpoint="/api/createBooking"
//         onSuccess={() => console.log("Booking completed in Hero section!")}
//       />
//     </section>
//   );
// };

// export default Hero;
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import BookingModal from "../../components/Modals/BookingModal";

const Hero = () => {
  const [currentService, setCurrentService] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Services for carousel (replace with Segun Umoru services)
  const services = [
    "Data Analytics Solutions",
    "AI-Driven Insights",
    "Personalized Growth Coaching",
    "Spiritual Guidance",
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const carouselVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "absolute",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      position: "absolute",
      transition: { duration: 0.5, ease: "easeInOut" },
    }),
  };

  // Carousel animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://via.placeholder.com/1920x1080?text=Segun+Umoru+Hero+Image')",
      }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
            {/* Text Content Column */}
            <motion.div
              className="text-gray-200 space-y-6 lg:space-y-8 text-center lg:text-left"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={containerVariants}>
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                variants={childVariants}>
                <span className="block">Segun Umoru</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-gray-500 to-secondary mt-2">
                  Data | AI | Growth
                </span>
              </motion.h1>
              <motion.p
                className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-xl mx-auto lg:mx-0"
                variants={childVariants}>
                Unlock data analysis and AI expertise, grow with tailored
                coaching, and enhance your spiritual journey with personalized
                guidance.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={childVariants}>
                <Link>
                  <motion.button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-secondary/80 hover:from-secondary hover:to-primary text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 text-center text-base"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap">
                    Book a Session
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Carousel Column - Fixed Height Container with Slide Animation */}
            <motion.div
              className="relative text-center lg:text-right"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={childVariants}>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-4">
                Major Services
              </h2>
              {/* Fixed height container to prevent layout shift */}
              <div className="relative h-16 flex items-center justify-center lg:justify-end overflow-hidden">
                <AnimatePresence mode="wait" custom={1}>
                  <motion.div
                    key={currentService}
                    custom={1}
                    variants={carouselVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full flex items-center justify-center lg:justify-end">
                    <div className="inline-block bg-white/90 text-gray-900 font-medium py-3 px-6 rounded-lg shadow-md whitespace-nowrap">
                      {services[currentService]}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book a Session with Segun"
        endpoint="/api/createBooking"
        onSuccess={() => console.log("Booking completed in Hero section!")}
      />
    </section>
  );
};

export default Hero;
