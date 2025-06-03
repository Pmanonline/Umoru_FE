import React from "react";
import partnersData from "../../assets/json/PartnersData.json";
import SupportImage from "../../assets/images/SuppoertImage.png";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

// Reusable PartnerIcon component
const PartnerIcon = ({ name, image }) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={image} // Directly use the URL from the JSON
        alt={name}
        className="h-12 w-12 rounded-full object-cover border-2 border-accent-cream hover:border-primary transition-all duration-300"
      />
      <p className="text-xs text-gray-600 mt-2 text-center line-clamp-1">
        {name}
      </p>
    </div>
  );
};

// Main SupportSection component
const SupportSection = () => {
  return (
    <section className="w-full">
      {/* Background Image Section */}
      <div
        className="relative bg-cover bg-center h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-end"
        style={{ backgroundImage: `url(${SupportImage})` }}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-primary bg-opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 text-white text-right pr-4 sm:pr-6 md:pr-12 max-w-6xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
            SUPPORT THE NEXT <br /> PRIDE OF THE WORLD
          </h2>
          <Link to={"/fund"}>
            <button className="mt-3 sm:mt-4 inline-block text-sm sm:text-base bg-primary  hover:bg-white text-white hover:bg-sunlit-gold hover:text-primary duration-300 hover:scale-105 font-semibold px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg">
              Click Here To Find Out More And Donate
            </button>
          </Link>
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-accent-cream py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Heading with Decorative Elements */}
          <div className="relative flex items-center justify-center mb-4 sm:mb-6">
            <ChevronDown className="h-6 w-6 text-primary mr-2" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              OUR PARTNERS
            </h3>
            <ChevronDown className="h-6 w-6 text-primary ml-2 transform rotate-180" />
          </div>

          {/* Dummy Text */}
          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto">
            Ornallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum
            venenatis. Curabitur tempor qua eros tempus lacinia. Nam bi
          </p>

          {/* Partner Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
            {partnersData.map((partner) => (
              <PartnerIcon
                key={partner.id}
                name={partner.name}
                image={partner.image}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
