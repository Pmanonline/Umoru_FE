import React, { useState } from "react";
import { motion } from "framer-motion";
import BookingModal from "../../components/Modals/BookingModal";

const ServicesV3 = () => {
  const [activeHex, setActiveHex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bookingService, setBookingService] = useState(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const services = [
    {
      id: 1,
      title: "Data Science Training",
      shortTitle: "Data Science",
      description:
        "Master Python, SQL, and machine learning with expert guidance. Build predictive models and uncover insights from complex datasets.",
      icon: "📊",
      color: "cyan",
      bgGradient:
        "from-cyan-200/20 to-blue-200/20 dark:from-cyan-900/20 dark:to-blue-900/20",
      borderGradient:
        "from-cyan-400 to-blue-400 dark:from-cyan-600 dark:to-blue-600",
      textGradient:
        "from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400",
      features: [
        "Python & SQL",
        "Machine Learning",
        "Data Visualization",
        "Statistical Analysis",
      ],
      duration: "12 weeks",
    },
    {
      id: 2,
      title: "Life Coaching",
      shortTitle: "Life Coaching",
      description:
        "Personal growth through faith and spirituality. Discover your purpose and align your life with your deepest values and beliefs.",
      icon: "✨",
      color: "purple",
      bgGradient:
        "from-purple-200/20 to-pink-200/20 dark:from-purple-900/20 dark:to-pink-900/20",
      borderGradient:
        "from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600",
      textGradient:
        "from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400",
      features: [
        "Spiritual Guidance",
        "Life Purpose",
        "Goal Setting",
        "Personal Growth",
      ],
      duration: "8 weeks",
    },
    {
      id: 3,
      title: "Professional Mentoring",
      shortTitle: "Mentoring",
      description:
        "Career acceleration through strategic guidance. Develop leadership skills and advance to senior positions with confidence.",
      icon: "🚀",
      color: "green",
      bgGradient:
        "from-green-200/20 to-teal-200/20 dark:from-green-900/20 dark:to-teal-900/20",
      borderGradient:
        "from-green-400 to-teal-400 dark:from-green-600 dark:to-teal-600",
      textGradient:
        "from-green-500 to-teal-500 dark:from-green-400 dark:to-teal-400",
      features: [
        "Career Strategy",
        "Leadership Skills",
        "Network Building",
        "Performance Coaching",
      ],
      duration: "10 weeks",
    },
  ];

  const HexagonShape = ({ children, className, isActive, service }) => (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 173.2"
        className={`w-full h-full transition-all duration-500 ${
          isActive ? "drop-shadow-2xl" : "drop-shadow-lg"
        }`}>
        <defs>
          <linearGradient
            id={`defaultGradient-${service?.id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <stop
              offset="0%"
              stopColor={
                service?.color === "cyan"
                  ? "#e0f2fe" // Light cyan
                  : service?.color === "purple"
                    ? "#ede9fe" // Light purple
                    : "#d1fae5" // Light green
              }
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor={
                service?.color === "cyan"
                  ? "#bfdbfe" // Lighter cyan
                  : service?.color === "purple"
                    ? "#ddd6fe" // Lighter purple
                    : "#a7f3d0" // Lighter green
              }
              stopOpacity="0.3"
            />
          </linearGradient>
          <linearGradient
            id={`gradient-${service?.id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <stop
              offset="0%"
              stopColor={
                service?.color === "cyan"
                  ? "#06b6d4"
                  : service?.color === "purple"
                    ? "#8b5cf6"
                    : "#10b981"
              }
              stopOpacity="0.8"
            />
            <stop
              offset="100%"
              stopColor={
                service?.color === "cyan"
                  ? "#3b82f6"
                  : service?.color === "purple"
                    ? "#ec4899"
                    : "#14b8a6"
              }
              stopOpacity="0.8"
            />
          </linearGradient>
        </defs>
        <polygon
          points="50,0 150,0 200,86.6 150,173.2 50,173.2 0,86.6"
          className={`transition-all duration-500 ${
            isActive
              ? "fill-white/10 stroke-white/50 dark:fill-gray-800/10 dark:stroke-white/70"
              : "fill-white/5 stroke-white/20 hover:fill-white/8 dark:fill-gray-800/5 dark:stroke-white/30 dark:hover:fill-gray-800/8"
          }`}
          strokeWidth="2"
          style={{
            fill: isActive
              ? `url(#gradient-${service?.id})`
              : `url(#defaultGradient-${service?.id})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {children}
      </div>
    </div>
  );

  return (
    <section
      className="min-h-[70vh] bg-gradient-to-br from-gray-100 via-blue-100 to-gray-100 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      onMouseMove={handleMouseMove}>
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none mix-blend-screen opacity-20 transition-all duration-1000 ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)",
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10 animate-pulse text-gray-400/20 dark:text-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}>
            <svg width="30" height="30" viewBox="0 0 40 40">
              <polygon
                points="20,2 35,15 35,25 20,38 5,25 5,15"
                fill="currentColor"
              />
            </svg>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 dark:from-white dark:to-blue-400 leading-tight">
              Services
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-gray-400 to-blue-400 dark:from-gray-600 dark:to-blue-300 rounded-full mt-2"></div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-white max-w-2xl mx-auto">
            Three interconnected paths to transformation, designed to elevate
            every aspect of your professional and personal journey
          </p>
        </div>

        <div className="relative mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6 sm:gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="w-64 h-64 cursor-pointer transform transition-all duration-500 hover:scale-105"
                onClick={() => setActiveHex(service.id)}>
                <HexagonShape
                  isActive={activeHex === service.id}
                  service={service}
                  className="relative">
                  <div
                    className={`text-4xl mb-2 transition-all duration-500 ${
                      activeHex === service.id ? "scale-125 rotate-12" : ""
                    }`}>
                    {service.icon}
                  </div>
                  <h3
                    className={`text-lg sm:text-xl font-bold text-center mb-2 transition-all duration-500 ${
                      activeHex === service.id
                        ? `bg-gradient-to-r ${service.textGradient} bg-clip-text text-transparent`
                        : "text-gray-800 dark:text-white"
                    }`}>
                    {service.shortTitle}
                  </h3>
                  <div className="text-center text-sm sm:text-base text-gray-600 dark:text-white space-y-1">
                    <div className="font-semibold">Custom Pricing</div>
                    <div>{service.duration}</div>
                  </div>
                </HexagonShape>
              </div>
            ))}
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="50%" stopColor="rgba(6,182,212,0.5)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
              </linearGradient>
            </defs>
            <line
              x1="25%"
              y1="50%"
              x2="75%"
              y2="50%"
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              className="animate-pulse"
            />
          </svg>
        </div>

        {activeHex && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 z-50"
            onClick={() => setActiveHex(null)}>
            <div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-auto shadow-2xl transform transition-all duration-300 scale-100 opacity-100 relative"
              onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-100 text-2xl font-bold"
                onClick={() => setActiveHex(null)}>
                &times;
              </button>

              {services
                .filter((service) => service.id === activeHex)
                .map((service) => (
                  <div key={service.id}>
                    <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
                      {service.title}
                    </h4>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-white mb-4 sm:mb-6">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4 sm:mb-6">
                      {service.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-gray-800 dark:text-white">
                          <div className="w-2 h-2 rounded-full mr-2 bg-gradient-to-r from-gray-400 to-blue-400 dark:from-gray-600 dark:to-blue-300"></div>
                          <span className="text-sm sm:text-base lg:text-lg">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r ${service.borderGradient} text-white dark:text-white font-semibold text-sm sm:text-base hover:scale-105 transition-all duration-300 shadow-md`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setBookingService(service);
                      }}>
                      Start Your Journey
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12 sm:mt-16">
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">
              Ready to Transform Your Future?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-white">
              Choose your path or combine multiple services for maximum impact
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button
              onClick={() => setBookingService({ title: "Free Consultation" })}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400 text-white dark:text-white font-semibold text-sm sm:text-base rounded-lg hover:scale-105 transition-all duration-300 shadow-md hover:shadow-cyan-500/20 dark:hover:shadow-cyan-400/20">
              Book Free Consultation
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white/10 dark:bg-gray-800/10 text-gray-800 dark:text-white font-semibold text-sm sm:text-base rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 border border-gray-300 dark:border-gray-600">
              View All Packages
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={!!bookingService}
        onClose={() => setBookingService(null)}
        title={`Book ${bookingService?.title}`}
        endpoint="/api/bookings"
        onSuccess={() => console.log("Booking submitted successfully")}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ServicesV3;
