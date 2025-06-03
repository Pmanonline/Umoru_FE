import React from "react";
import promoCardsData from "../../assets/json/promoCardData.json";
import { ArrowRight } from "lucide-react";

// Reusable PromoCard component
const PromoCard = ({ image, category, title, buttonText }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row">
      <img
        src={image}
        alt={`${title} promo image`}
        className="w-full sm:w-1/3 h-48 sm:h-auto object-cover"
      />
      <div className="p-5 flex flex-col justify-center w-full sm:w-2/3">
        <p className="text-xs font-medium text-accent-teal uppercase tracking-wide">
          {category}
        </p>
        <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mt-2 line-clamp-2">
          {title}
        </h3>
        <button className="mt-4 bg-secondary hover:bg-secondary-light text-white text-sm py-1 px-2 rounded-lg flex items-center w-fit font-semibold transition-colors">
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Main PromoSection component
const PromoSection = () => {
  return (
    <section className="bg-gradient-to-b from-primary to-primary-dark text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading and Subheading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Explore More with The Pride of the World
        </h2>
        <p className="mt-2 text-gray-200 text-center max-w-2xl mx-auto">
          Discover global promotions, deals, and special offers celebrating
          excellence across nations.
        </p>

        {/* Cards Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {promoCardsData.map((card) => (
            <PromoCard
              key={card.id}
              image={card.image}
              category={card.category}
              title={card.title}
              buttonText={card.buttonText}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
