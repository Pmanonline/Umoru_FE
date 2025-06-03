import React, { useState } from "react";
import {
  Plus,
  Minus,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AwardTypesPage = () => {
  const [openAward, setOpenAward] = useState(null);

  const awards = [
    {
      title: "Emergency Services Award",
      icon: <ShieldCheck className="text-unity-coral" size={28} />,
      description:
        "Recognizing first responders who risk their lives daily to protect and serve communities worldwide.",
      details: [
        {
          question: "What is the Emergency Services Award?",
          answer:
            "This award honors firefighters, police officers, paramedics, and other emergency personnel who demonstrate exceptional bravery and dedication in crisis situations across the world.",
        },
        {
          question: "Who is eligible?",
          answer:
            "Active or retired first responders nominated by their peers, communities, or organizations for outstanding acts of service.",
        },
        {
          question: "How are recipients selected?",
          answer:
            "A panel of experts reviews nominations based on impact, courage, and community benefit. Finalists are announced annually.",
        },
        {
          question: "What do recipients receive?",
          answer:
            "Recipients are awarded a certificate, a cash prize, and recognition at our annual Pride of the World Fund gala.",
        },
      ],
    },
    {
      title: "Youth Development Program",
      icon: <Sparkles className="text-sunlit-gold" size={28} />,
      description:
        "Empowering the next generation of leaders through education and mentorship initiatives worldwide.",
      details: [
        {
          question: "What is the Youth Development Program?",
          answer:
            "This program supports young individuals by funding educational scholarships, leadership training, and community projects that foster innovation and growth.",
        },
        {
          question: "Who can participate?",
          answer:
            "Youth aged 15-25 who demonstrate academic excellence, leadership potential, or community involvement are eligible to apply or be nominated.",
        },
        {
          question: "How does it work?",
          answer:
            "Selected participants receive mentorship, funding for projects, and access to workshops. Annual awards are given to top performers.",
        },
        {
          question: "What is the impact?",
          answer:
            "Over 500 youths have been empowered since 2020, with projects ranging from tech startups to environmental campaigns.",
        },
      ],
    },
    {
      title: "Community Heroes Fund",
      icon: <HeartHandshake className="text-secondary" size={28} />,
      description:
        "Celebrating unsung heroes making significant local impacts in communities worldwide.",
      details: [
        {
          question: "What is the Community Heroes Fund?",
          answer:
            "This fund recognizes individuals or small groups who have made transformative contributions to their local communities, often without formal recognition.",
        },
        {
          question: "Who qualifies as a Community Hero?",
          answer:
            "Anyone who has initiated or led impactful community projects, such as building schools, organizing health drives, or supporting vulnerable groups.",
        },
        {
          question: "How are heroes chosen?",
          answer:
            "Community nominations are reviewed by our committee, with emphasis on measurable impact and selflessness.",
        },
        {
          question: "What support do heroes receive?",
          answer:
            "Heroes receive grants to expand their work, public recognition, and invitations to network with other changemakers.",
        },
      ],
    },
  ];

  const toggleAward = (index) => {
    setOpenAward(openAward === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-accent-cream mt-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8 sm:py-12 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Pride of the World Award Types
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto">
            Discover the different awards we offer to celebrate the world's
            unsung heroes, from first responders to community changemakers.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="space-y-6">
          {awards.map((award, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleAward(index)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary"
                aria-expanded={openAward === index}
                aria-controls={`award-details-${index}`}>
                <div className="flex items-center gap-4">
                  <div>{award.icon}</div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-primary">
                      {award.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {award.description}
                    </p>
                  </div>
                </div>
                <div>
                  {openAward === index ? (
                    <Minus className="text-primary" size={24} />
                  ) : (
                    <Plus className="text-primary" size={24} />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {openAward === index && (
                  <motion.div
                    id={`award-details-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="space-y-4">
                      {award.details.map((detail, detailIndex) => (
                        <div key={detailIndex}>
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                            {detail.question}
                          </h4>
                          <p className="text-gray-600 text-sm sm:text-base">
                            {detail.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">
            Support Our Awards
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            Your donations help us recognize and empower the world's heroes.
            Join us in making a difference today.
          </p>
          <button
            onClick={() => (window.location.href = "/fund")}
            className="inline-block px-5 sm:px-6 py-2 sm:py-3 bg-primary text-white  font-bold rounded-full hover:bg-secondary transition-all duration-300">
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AwardTypesPage;
