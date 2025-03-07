import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router

const EDriversBanner = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 overflow-hidden">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between min-h-[400px]">
        {/* Left: Text Content */}
        <div className="text-center md:text-left md:w-1/2 space-y-6 z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Hire Your Perfect Driver with E Drivers
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white opacity-90 max-w-md">
            Need a driver for an emergency, a trip, or long-term? We connect you
            with reliable, professional drivers—anytime, anywhere.
          </p>
          <Link to="/hire-driver" className="inline-block">
            <button className="group relative px-6 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-full text-lg shadow-lg hover:bg-yellow-500 hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Get a Driver Now
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </Link>
        </div>

        {/* Right: Image */}
        <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center md:justify-end relative z-10">
          <img
            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" // Placeholder: Happy driver/client
            alt="Happy driver with client"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-lg shadow-xl object-cover transform md:-rotate-3 hover:rotate-0 transition-transform duration-300"
          />
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill="white"
              d="M0,224L48,213.3C96,203,192,181,288,165.3C384,149,480,139,576,144C672,149,768,171,864,181.3C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default EDriversBanner;

// import React from "react";
// import { Link } from "react-router-dom";
// import { Car, Clock, MapPin, Shield } from "lucide-react";
// import Edrivers from "../../assets/images/Edrivers.jpeg";

// const EDriversBanner = () => {
//   return (
//     <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white overflow-hidden">
//       <div className="container mx-auto px-4 py-16 flex flex-col-reverse md:flex-row items-center">
//         {/* Text Content */}
//         <div className="w-full md:w-1/2 z-10">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
//             Your Trusted Driving Solution
//           </h1>
// <p className="text-lg mb-6 max-w-md">
//   Need a professional driver? Whether it's for an emergency, a special
//   occasion, or daily commute, we've got you covered.
// </p>

// {/* Key Features */}
// <div className="grid grid-cols-2 gap-4 mb-6">
//   <div className="flex items-center">
//     <Clock className="mr-2 text-yellow-300" />
//     <span>Flexible Booking</span>
//   </div>
//   <div className="flex items-center">
//     <MapPin className="mr-2 text-green-300" />
//     <span>Any Location</span>
//   </div>
//   <div className="flex items-center">
//     <Car className="mr-2 text-red-300" />
//     <span>Verified Drivers</span>
//   </div>
//   <div className="flex items-center">
//     <Shield className="mr-2 text-purple-300" />
//     <span>100% Safety</span>
//   </div>
// </div>

//           {/* CTA Button */}
//           <Link to="/book-driver">
//             <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-bold shadow-lg transition duration-300 transform hover:scale-105 flex items-center">
//               Book a Driver Now
//               <Car className="ml-2" />
//             </button>
//           </Link>
//         </div>

//         {/* Image Section */}
//         <div className="w-full md:w-1/2 mb-8 md:mb-0 relative">
//           <img
//             src={Edrivers}
//             alt="Professional Driver"
//             className="rounded-lg shadow-2xl transform translate-x-10 md:translate-x-0 md:scale-110 transition duration-500"
//           />
//           <div className="absolute inset-0 bg-blue-600 opacity-20 rounded-lg"></div>
//         </div>
//       </div>

//       {/* Background Design Elements */}
//       <div className="absolute top-0 right-0 opacity-20">
//         <svg width="400" height="400" viewBox="0 0 400 400">
//           <circle cx="300" cy="100" r="150" fill="white" />
//         </svg>
//       </div>
//     </div>
//   );
// };

// export default EDriversBanner;
