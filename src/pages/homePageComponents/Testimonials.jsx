import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Testimonials = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      rotate: 2,
      transition: { duration: 0.3, yoyo: Infinity },
    },
  };

  const testimonials = [
    {
      name: "Aisha Bello",
      role: "Data Analyst, Lagos",
      quote:
        "Segun’s Data Science Training transformed my career! I landed a job at a top firm in just 3 months after mastering Python and ML.",
      image:
        "https://kummuni.com/storage/elementor/thumbs/university-student-black-man-and-portrait-at-camp-2023-11-27-05-07-06-utc-24-r4zbyyzuy9dbb7ycppxn69gy1dtsy3vu48ezut244e.jpg",
    },
    {
      name: "Kofi Mensah",
      role: "Data Analyst, UK",
      quote:
        "His Life Coaching helped me find purpose. I started my own practice, thanks to his spiritual guidance in June 2025!",
      image:
        "https://st.depositphotos.com/1508503/1348/i/450/depositphotos_13487091-stock-photo-pretty-african-american-college-student.jpg",
    },
    {
      name: "Priya Sharma",
      role: "Software Engineer(AI, machine learning), Abuja",
      quote:
        "Mentoring with Segun gave me the confidence to lead projects. Promoted to senior role by June 2025!",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM_hM8eJBXfU6fAy3J3MTMg9mDXMtb6bf-3A&s",
    },
  ];

  return (
    <section
      className="relative py-16 bg-[#3523bf] dark:bg-accent-charcoal"
      ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-charcoal/20 dark:from-transparent dark:to-accent-charcoal/40" />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-montserrat-subrayada text-white dark:text-white mb-12">
          What My Students Say
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg text-white"
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}>
              <div className="flex justify-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                />
              </div>
              <blockquote className="text-lg italic mb-4">
                "{testimonial.quote}"
              </blockquote>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-300 dark:text-gray-400">
                {testimonial.role}
              </p>
              <motion.a
                // href={`/testimonial/${testimonial.name.toLowerCase()}`}
                className="mt-4 inline-block text-accent-teal hover:text-accent-green"
                variants={buttonVariants}
                whileHover="hover">
                ▶ {testimonial.name}'s Testimonial
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

// import React from "react";
// import { Star, Quote } from "lucide-react";

// const Testimonials = () => {
//   const testimonials = [
//     {
//       name: "Aisha Bello",
//       role: "Data Analyst, Lagos",
//       quote:
//         "Segun's Data Science Training transformed my career! I landed a job at a top firm in just 3 months after mastering Python and ML.",
//       image:
//         "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//       rating: 5,
//     },
//     {
//       name: "Kofi Mensah",
//       role: "Life Coach, London UK",
//       quote:
//         "His Life Coaching helped me find purpose. I started my own practice, thanks to his spiritual guidance in June 2025!",
//       image:
//         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//       rating: 5,
//     },
//     {
//       name: "Priya Sharma",
//       role: "AI Engineer, Abuja",
//       quote:
//         "Mentoring with Segun gave me the confidence to lead projects. Promoted to senior role by June 2025!",
//       image:
//         "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
//       rating: 5,
//     },
//   ];

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         className={`w-4 h-4 ${
//           i < rating
//             ? "text-yellow-400 fill-yellow-400"
//             : "text-gray-300 dark:text-gray-600"
//         }`}
//       />
//     ));
//   };

//   return (
//     <section className="py-16 bg-white dark:bg-gray-900">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//             What My Students Say
//           </h2>
//           <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//             Real success stories from amazing students
//           </p>
//         </div>

//         {/* Testimonials Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {testimonials.map((testimonial, index) => (
//             <div
//               key={index}
//               className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
//               {/* Quote Icon */}
//               <Quote className="w-8 h-8 text-teal-500 mb-4" />

//               {/* Quote */}
//               <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
//                 "{testimonial.quote}"
//               </p>

//               {/* Rating */}
//               <div className="flex space-x-1 mb-4">
//                 {renderStars(testimonial.rating)}
//               </div>

//               {/* Profile */}
//               <div className="flex items-center space-x-4">
//                 <img
//                   src={testimonial.image}
//                   alt={testimonial.name}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 <div>
//                   <h4 className="font-semibold text-gray-900 dark:text-white">
//                     {testimonial.name}
//                   </h4>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {testimonial.role}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Simple CTA */}
//         <div className="text-center mt-12">
//           <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
//             Join Our Success Stories
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;
