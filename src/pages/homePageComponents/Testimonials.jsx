// import React from "react";
// import { motion } from "framer-motion";
// import { useInView } from "react-intersection-observer";

// const Testimonials = () => {
//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     threshold: 0.2,
//   });

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.2 },
//     },
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
//     },
//   };

//   const buttonVariants = {
//     hover: {
//       scale: 1.1,
//       rotate: 2,
//       transition: { duration: 0.3, yoyo: Infinity },
//     },
//   };

//   const testimonials = [
//     {
//       name: "Taiwo Lawrence",
//       role: "Data Analyst | SQL, Excel, Powerbi, Tableau, Snowflake",
//       quote:
//         "Mr Segun is an outstanding teacher in science, technology engineering and mathematics (STEM) courses. He prepared me for my GRE exam and also gave me foundation in Data Science. Be rest assured you will get value for your money. I encourage you to work with him in preparing for your STEM related projects/ exams/ courses.",
//       rating: 5.0,
//       date: "April 11, 2024",
//       service: "Business Analytics",
//       image:
//         "https://kummuni.com/storage/elementor/thumbs/university-student-black-man-and-portrait-at-camp-2023-11-27-05-07-06-utc-24-r4zbyyzuy9dbb7ycppxn69gy1dtsy3vu48ezut244e.jpg",
//     },
//     {
//       name: "Angela Omogbeme",
//       role: "Operations Manager",
//       quote: "He's patient and has a good knowledge of Data Science",
//       rating: 5.0,
//       date: "April 10, 2024",
//       service: "Business Analytics",
//       image:
//         "https://st.depositphotos.com/1508503/1348/i/450/depositphotos_13487091-stock-photo-pretty-african-american-college-student.jpg",
//     },
//     {
//       name: "Edwin Ajogun",
//       role: "Programme Manager @ Royal Academy of Engineering",
//       quote:
//         "I enjoyed working with Segun. He has helped upskill my knowledge in Excel, Python and PowerBi. I wholly recommend him.",
//       rating: 5.0,
//       date: "June 19, 2025",
//       service: "Training",
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM_hM8eJBXfU6fAy3J3MTMg9mDXMtb6bf-3A&s",
//     },
//     {
//       name: "Daniel Agbo, M.Sc.",
//       role: "Technical Communicator || Data Analyst || Business Analyst",
//       quote:
//         "Segun is a great resource. He has a good knowledge of the subject we worked on. We worked on a Python project. He has several ways of tackling a problem, which is one attribute I find interesting about him. He pays attention to detail and is critical in his approach to problem-solving. Yes, I would recommend Segun to anyone needing his services.",
//       rating: 4.8,
//       date: "March 2, 2025",
//       service: "Training",
//       image: "/path/to/daniel_agbo_image.jpg", // REPLACE WITH ACTUAL URL
//     },
//     {
//       name: "Dubem Ngwuluka LL.B, BL, MBA, OCA, CRB, CILR",
//       role: "Business Development Manager || Business Intelligence Analyst",
//       quote:
//         "Segun has proven himself to be an exemplary data analyst, capable of navigating the complexities of project management with finesse and expertise. His dedication, professionalism, and unwavering commitment to excellence have left a lasting impression on me and everyone involved in the project.",
//       rating: 5.0,
//       date: "April 20, 2024",
//       service: "Business Analytics",
//       image: "/path/to/dubem_ngwuluka_image.jpg", // REPLACE WITH ACTUAL URL
//     },
//     {
//       name: "Ayodele Shonubi",
//       role: "Data Analyst | Excel | SQL | PYTHON | POWER BI | TABLEAU",
//       quote:
//         "I really enjoyed working with him. He is exceptional at what he does.",
//       rating: 5.0,
//       date: "April 12, 2024",
//       service: "Business Analytics",
//       image: "/path/to/ayodele_shonubi_image.jpg", // REPLACE WITH ACTUAL URL
//     },
//     {
//       name: "RACHEAL ABIOLA",
//       role: "Data Analyst",
//       quote:
//         "You were a great help during my master's degree thesis and have helped many of my friends also. Highly recommend",
//       rating: 4.3,
//       date: "March 1, 2025",
//       service: "Technical Writing",
//       image: "/path/to/racheal_abiola_image.jpg", // REPLACE WITH ACTUAL URL
//     },
//     {
//       name: "Naomi Ndongala",
//       role: "Data Analyst | Merging Diverse Expertise with Data-Driven Solutions",
//       quote:
//         "Segun was very professional and prepared our sessions in advance. He understood my goals and was supportive even during out of office hours which I really appreciated. The sessions were tailored to my level and it was project-oriented, enabling me to provide real-world applications and advance my skillset. Segun really went above and beyond in order with his service and I would definitely recommend him to anyone interested!",
//       rating: 5.0,
//       date: "February 28, 2025",
//       service: "Training",
//       image: "/path/to/naomi_ndongala_image.jpg", // REPLACE WITH ACTUAL URL
//     },
//     {
//       name: "Ifeoma Augusta Adigwe",
//       role: "Data Scientist || Business Process Analyst || Machine learning || Python",
//       quote:
//         "I had the pleasure of working with Segun, and I was thoroughly impressed by his professionalism, reliability, and depth of expertise. He consistently delivered high-quality work, communicated effectively, and demonstrated a strong commitment to achieving results. Segun approaches every task with clarity and precision, and his ability to solve problems efficiently made working with him a smooth and productive experience.",
//       rating: 4.0,
//       date: "July 13, 2025",
//       service: "Training",
//       image: "/path/to/ifeoma_adigwe_image.jpg", // REPLACE WITH ACTUAL URL
//     },
//     {
//       name: "Shola Dare",
//       role: "Sales Manager at Wintrado Academy & Lead Contact Nigeria Wintrado Techn",
//       quote:
//         "It was a great time with Mr Segun, a great teacher in Data Analytics and Data Science. Nice being one your students",
//       rating: 5.0,
//       date: "June 19, 2025",
//       service: "Training",
//       image: "/path/to/shola_dare_image.jpg", // REPLACE WITH ACTUAL URL
//     },
//   ];
//   // const testimonials = [
//   //   {
//   //     name: "Aisha Bello",
//   //     role: "Data Analyst, Lagos",
//   //     quote:
//   //       "Segun’s Data Science Training transformed my career! I landed a job at a top firm in just 3 months after mastering Python and ML.",
//   //     image:
//   //       "https://kummuni.com/storage/elementor/thumbs/university-student-black-man-and-portrait-at-camp-2023-11-27-05-07-06-utc-24-r4zbyyzuy9dbb7ycppxn69gy1dtsy3vu48ezut244e.jpg",
//   //   },
//   //   {
//   //     name: "Kofi Mensah",
//   //     role: "Data Analyst, UK",
//   //     quote:
//   //       "His Life Coaching helped me find purpose. I started my own practice, thanks to his spiritual guidance in June 2025!",
//   //     image:
//   //       "https://st.depositphotos.com/1508503/1348/i/450/depositphotos_13487091-stock-photo-pretty-african-american-college-student.jpg",
//   //   },
//   //   {
//   //     name: "Priya Sharma",
//   //     role: "Software Engineer(AI, machine learning), Abuja",
//   //     quote:
//   //       "Mentoring with Segun gave me the confidence to lead projects. Promoted to senior role by June 2025!",
//   //     image:
//   //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM_hM8eJBXfU6fAy3J3MTMg9mDXMtb6bf-3A&s",
//   //   },
//   // ];

//   return (
//     <section
//       className="relative py-16 bg-[#3523bf] dark:bg-accent-charcoal"
//       ref={ref}>
//       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-charcoal/20 dark:from-transparent dark:to-accent-charcoal/40" />
//       <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h2 className="text-4xl font-montserrat-subrayada text-white dark:text-white mb-12">
//           What My Students Say
//         </h2>
//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           variants={containerVariants}>
//           {testimonials.map((testimonial, index) => (
//             <motion.div
//               key={index}
//               className="p-6 rounded-lg text-white"
//               variants={cardVariants}
//               whileHover={{
//                 scale: 1.05,
//                 transition: { duration: 0.3 },
//               }}>
//               <div className="flex justify-center mb-4">
//                 <img
//                   src={testimonial.image}
//                   alt={testimonial.name}
//                   className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
//                 />
//               </div>
//               <blockquote className="text-lg italic mb-4">
//                 "{testimonial.quote}"
//               </blockquote>
//               <p className="font-semibold">{testimonial.name}</p>
//               <p className="text-sm text-gray-300 dark:text-gray-400">
//                 {testimonial.role}
//               </p>
//               <motion.a
//                 // href={`/testimonial/${testimonial.name.toLowerCase()}`}
//                 className="mt-4 inline-block text-accent-teal hover:text-accent-green"
//                 variants={buttonVariants}
//                 whileHover="hover">
//                 ▶ {testimonial.name}'s Testimonial
//               </motion.a>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Testimonials = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
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
      name: "Taiwo Lawrence",
      role: "Data Analyst | SQL, Excel, Powerbi, Tableau, Snowflake",
      quote:
        "Mr Segun is an outstanding teacher in science, technology engineering and mathematics (STEM) courses. He prepared me for my GRE exam and also gave me foundation in Data Science. Be rest assured you will get value for your money. I encourage you to work with him in preparing for your STEM related projects/ exams/ courses.",
      rating: 5.0,
      date: "April 11, 2024",
      service: "Business Analytics",
      image:
        "https://kummuni.com/storage/elementor/thumbs/university-student-black-man-and-portrait-at-camp-2023-11-27-05-07-06-utc-24-r4zbyyzuy9dbb7ycppxn69gy1dtsy3vu48ezut244e.jpg",
      videoUrl: "https://www.youtube.com/embed/placeholder1", // REPLACE WITH ACTUAL VIDEO URL
    },
    {
      name: "Angela Omogbeme",
      role: "Operations Manager",
      quote: "He's patient and has a good knowledge of Data Science",
      rating: 5.0,
      date: "April 10, 2024",
      service: "Business Analytics",
      image:
        "https://st.depositphotos.com/1508503/1348/i/450/depositphotos_13487091-stock-photo-pretty-african-american-college-student.jpg",
      videoUrl: "https://www.youtube.com/embed/placeholder2", // REPLACE WITH ACTUAL VIDEO URL
    },
    {
      name: "Edwin Ajogun",
      role: "Programme Manager @ Royal Academy of Engineering",
      quote:
        "I enjoyed working with Segun. He has helped upskill my knowledge in Excel, Python and PowerBi. I wholly recommend him.",
      rating: 5.0,
      date: "June 19, 2025",
      service: "Training",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM_hM8eJBXfU6fAy3J3MTMg9mDXMtb6bf-3A&s",
      videoUrl: "https://www.youtube.com/embed/placeholder3", // REPLACE WITH ACTUAL VIDEO URL
    },
    {
      name: "Daniel Agbo, M.Sc.",
      role: "Technical Communicator || Data Analyst || Business Analyst",
      quote:
        "Segun is a great resource. He has a good knowledge of the subject we worked on. We worked on a Python project. He has several ways of tackling a problem, which is one attribute I find interesting about him. He pays attention to detail and is critical in his approach to problem-solving. Yes, I would recommend Segun to anyone needing his services.",
      rating: 4.8,
      date: "March 2, 2025",
      service: "Training",
      image: "/path/to/daniel_agbo_image.jpg", // REPLACE WITH ACTUAL URL
      videoUrl: "https://www.youtube.com/embed/placeholder4", // REPLACE WITH ACTUAL VIDEO URL
    },
    {
      name: "Dubem Ngwuluka LL.B, BL, MBA, OCA, CRB, CILR",
      role: "Business Development Manager || Business Intelligence Analyst",
      quote:
        "Segun has proven himself to be an exemplary data analyst, capable of navigating the complexities of project management with finesse and expertise. His dedication, professionalism, and unwavering commitment to excellence have left a lasting impression on me and everyone involved in the project.",
      rating: 5.0,
      date: "April 20, 2024",
      service: "Business Analytics",
      image: "/path/to/dubem_ngwuluka_image.jpg", // REPLACE WITH ACTUAL URL
      videoUrl: "https://www.youtube.com/embed/placeholder5", // REPLACE WITH ACTUAL VIDEO URL
    },
    {
      name: "Ayodele Shonubi",
      role: "Data Analyst | Excel | SQL | PYTHON | POWER BI | TABLEAU",
      quote:
        "I really enjoyed working with him. He is exceptional at what he does.",
      rating: 5.0,
      date: "April 12, 2024",
      service: "Business Analytics",
      image: "/path/to/ayodele_shonubi_image.jpg", // REPLACE WITH ACTUAL URL
      videoUrl: "https://www.youtube.com/embed/placeholder6", // REPLACE WITH ACTUAL VIDEO URL
    },
    {
      name: "RACHEAL ABIOLA",
      role: "Data Analyst",
      quote:
        "You were a great help during my master's degree thesis and have helped many of my friends also. Highly recommend",
      rating: 4.3,
      date: "March 1, 2025",
      service: "Technical Writing",
      image: "/path/to/racheal_abiola_image.jpg", // REPLACE WITH ACTUAL URL
      videoUrl: "https://www.youtube.com/embed/placeholder7", // REPLACE WITH ACTUAL VIDEO URL
    },
    {
      name: "Naomi Ndongala",
      role: "Data Analyst | Merging Diverse Expertise with Data-Driven Solutions",
      quote:
        "Segun was very professional and prepared our sessions in advance. He understood my goals and was supportive even during out of office hours which I really appreciated. The sessions were tailored to my level and it was project-oriented, enabling me to provide real-world applications and advance my skillset. Segun really went above and beyond in order with his service and I would definitely recommend him to anyone interested!",
      rating: 5.0,
      date: "February 28, 2025",
      service: "Training",
      image: "/path/to/naomi_ndongala_image.jpg", // REPLACE WITH ACTUAL URL
      videoUrl: "https://www.youtube.com/embed/placeholder8", // REPLACE WITH ACTUAL VIDEO URL
    },
    {
      name: "Ifeoma Augusta Adigwe",
      role: "Data Scientist || Business Process Analyst || Machine learning || Python",
      quote:
        "I had the pleasure of working with Segun, and I was thoroughly impressed by his professionalism, reliability, and depth of expertise. He consistently delivered high-quality work, communicated effectively, and demonstrated a strong commitment to achieving results. Segun approaches every task with clarity and precision, and his ability to solve problems efficiently made working with him a smooth and productive experience.",
      rating: 4.0,
      date: "July 13, 2025",
      service: "Training",
      image: "/path/to/ifeoma_adigwe_image.jpg", // REPLACE WITH ACTUAL URL
      videoUrl: "https://www.youtube.com/embed/placeholder9", // REPLACE WITH ACTUAL VIDEO URL
    },
    {
      name: "Shola Dare",
      role: "Sales Manager at Wintrado Academy & Lead Contact Nigeria Wintrado Techn",
      quote:
        "It was a great time with Mr Segun, a great teacher in Data Analytics and Data Science. Nice being one your students",
      rating: 5.0,
      date: "June 19, 2025",
      service: "Training",
      image: "/path/to/shola_dare_image.jpg", // REPLACE WITH ACTUAL URL
      videoUrl: "https://www.youtube.com/embed/placeholder10", // REPLACE WITH ACTUAL VIDEO URL
    },
  ];

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <section
      className="relative py-16 bg-[#3523bf] dark:bg-accent-charcoal"
      ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-dark/30 dark:to-accent-charcoal/50" />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-montserrat-subrayada text-white dark:text-white mb-12">
          What My Students Say
        </h2>
        <div className="overflow-x-auto scrollbar-hide snap-x">
          <motion.div
            className="flex gap-5 py-4"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="min-w-[240px] sm:min-w-[260px] p-4 rounded-lg bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm text-white snap-center"
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}>
                <div className="flex justify-center mb-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-secondary/50 dark:border-teal-400/50 shadow-md"
                  />
                </div>
                <blockquote className="text-xs sm:text-sm italic mb-3 line-clamp-4">
                  "{truncateText(testimonial.quote)}"
                  {testimonial.quote.length > 150 && (
                    <button
                      onClick={() => setSelectedTestimonial(testimonial)}
                      className="ml-1 text-secondary dark:text-teal-400 hover:text-teal-300 dark:hover:text-teal-300 text-xs font-semibold">
                      Read All
                    </button>
                  )}
                </blockquote>
                <p className="font-semibold text-xs sm:text-sm">
                  {testimonial.name}
                </p>
                <p className="text-xxs sm:text-xs text-gray-300 dark:text-gray-400">
                  {testimonial.role}
                </p>
                <p className="text-xxs sm:text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {testimonial.date} | {testimonial.service} | Rating:{" "}
                  {testimonial.rating}
                </p>
                <motion.a
                  // href={`/testimonial/${testimonial.name.toLowerCase()}`}
                  className="mt-3 inline-block text-secondary dark:text-teal-400 hover:text-teal-300 dark:hover:text-teal-300 text-xs"
                  variants={buttonVariants}
                  whileHover="hover">
                  ▶ {testimonial.name}'s Testimonial
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Read All Modal */}
        {selectedTestimonial && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setSelectedTestimonial(null);
              setIsPlaying(false);
            }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full text-black dark:text-white relative"
              onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl font-bold"
                onClick={() => {
                  setSelectedTestimonial(null);
                  setIsPlaying(false);
                }}>
                ×
              </button>
              <h3 className="text-xl font-semibold mb-4">
                {selectedTestimonial.name}'s Testimonial
              </h3>
              <div className="flex justify-center mb-4">
                <img
                  src={selectedTestimonial.image}
                  alt={selectedTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-secondary/50 dark:border-teal-400/50"
                />
              </div>
              <blockquote className="text-base italic mb-4">
                "{selectedTestimonial.quote}"
              </blockquote>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedTestimonial.role}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedTestimonial.date} | {selectedTestimonial.service} |
                Rating: {selectedTestimonial.rating}
              </p>
              {selectedTestimonial.videoUrl && (
                <div className="mt-4">
                  <div className="relative w-full aspect-video">
                    <iframe
                      src={
                        selectedTestimonial.videoUrl +
                        (isPlaying ? "" : "?autoplay=0")
                      }
                      title={`${selectedTestimonial.name}'s Video Testimonial`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                    {!isPlaying && (
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-4xl font-bold rounded-lg hover:bg-black/70 transition-colors duration-300">
                        ▶
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
