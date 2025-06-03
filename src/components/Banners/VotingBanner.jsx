import React from "react";

const VotingBanner = () => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-lime-900 text-white py-8 px-4 md:px-8 rounded-xl shadow-lg mb-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-2/3 mb-6 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Nominate & Vote for Nigeria's Heroes
          </h2>
          <p className="text-lg mb-4">
            Help recognize outstanding Nigerians by voting for your favorite
            nominees across various categories. Your vote matters in determining
            the next Pride of Nigeria!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-6 rounded-lg transition duration-300">
              View Nominees
            </button>
            <button className="bg-white hover:bg-gray-100 text-green-800 font-bold py-3 px-6 rounded-lg transition duration-300">
              Learn How to Nominate
            </button>
          </div>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <div className="bg-white text-green-800 p-4 rounded-lg shadow-md w-full max-w-xs">
            <h3 className="font-bold text-lg mb-2">Voting Timeline</h3>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Nominations:</span> Oct 1-25
              </p>
              <p>
                <span className="font-semibold">Voting:</span> Nov 1-30
              </p>
              <p>
                <span className="font-semibold">Results:</span> Dec 15
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingBanner;
