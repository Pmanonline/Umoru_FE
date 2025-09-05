import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import segunHeroImage from "../../assets/images/heroimage.jpg";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import LoadingSpinner from "../../components/tools/LoaddingSpinner";
import BookingModal from "../../components/Modals/BookingModal";
import { Link } from "react-router-dom";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut" },
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

  const ctaContainerVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, delay: 0.4 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  // Enhanced cursor-following particle effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const particles = document.querySelectorAll(".particle");
      particles.forEach((particle, index) => {
        const rect = particle.getBoundingClientRect();
        const speed = 0.015 + index * 0.002;
        const dx = (e.clientX - (rect.left + rect.width / 2)) * speed;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * speed;
        particle.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <section
        ref={ref}
        className="mt-12 relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-800 to-teal-900 dark:from-gray-800 dark:via-teal-800 dark:to-purple-800 flex items-center justify-center">
        {/* Enhanced Background Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 dark:from-black/70" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-900/20 to-transparent" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center min-h-[80vh] lg:min-h-[75vh]">
              {/* Text Content Column */}
              <motion.div
                className="text-white space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1"
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={containerVariants}>
                <motion.div variants={childVariants} className="space-y-4">
                  <motion.h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                    variants={childVariants}>
                    <span className="block">Segun Umoru</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-300 to-blue-400 mt-2">
                      Data | AI | Growth
                    </span>
                  </motion.h1>

                  <motion.div
                    className="w-20 h-1 bg-gradient-to-r from-green-400 to-teal-300 mx-auto lg:mx-0 rounded-full"
                    variants={childVariants}
                  />
                </motion.div>

                <motion.p
                  className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-xl mx-auto lg:mx-0"
                  variants={childVariants}>
                  Unlock data analysis and AI expertise, grow with tailored
                  coaching, and enhance your spiritual journey with personalized
                  guidance.
                </motion.p>

                <motion.div
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 lg:p-6 shadow-2xl border border-white/20 max-w-xl mx-auto lg:mx-0"
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={ctaContainerVariants}
                  whileHover="hover">
                  <motion.div
                    className="flex flex-col sm:flex-row gap-3 lg:gap-4"
                    variants={containerVariants}>
                    <Link to="/about-us" className="flex-1">
                      <motion.div
                        className="bg-gradient-to-r from-pink-500 to-orange-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/30 text-center text-base"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap">
                        Know More
                      </motion.div>
                    </Link>

                    <motion.button
                      onClick={() => setIsModalOpen(true)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-teal-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 text-center text-base"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap">
                      Book a Session
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Image Column */}
              <motion.div
                className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={imageVariants}>
                <div className="relative group">
                  {/* Image Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-blue-500 to-teal-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                  <div className="relative">
                    <img
                      src={segunHeroImage}
                      alt="Segun Umoru"
                      className="relative z-10 w-full max-w-sm lg:max-w-md rounded-2xl shadow-2xl object-cover aspect-[6/5] opacity-70 hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                    />

                    {/* Image Border Effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-green-400/50 to-teal-300/50" />
                  </div>

                  {/* Floating Elements around Image */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full opacity-70 animate-bounce delay-300" />
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full opacity-70 animate-bounce delay-700" />
                  <div className="absolute top-1/2 -right-8 w-6 h-6 bg-gradient-to-r from-green-400 to-teal-300 rounded-full opacity-60 animate-pulse" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Particle Effects */}
        {[...Array(15)].map((_, i) => (
          <motion.span
            key={i}
            className="particle absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-light">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/70 rounded-full mt-2"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book a Session with Segun"
        endpoint="/api/createBooking"
        onSuccess={() => console.log("Booking completed in Hero section!")}
      />
    </>
  );
};

export default Hero;
