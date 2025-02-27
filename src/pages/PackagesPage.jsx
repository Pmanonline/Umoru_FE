import React from "react";
import { useNavigate } from "react-router-dom";

const PackagesPage = () => {
  const navigate = useNavigate();

  // Sample packages data
  const packages = [
    {
      id: 1,
      name: "Free Trial",
      description:
        "7 days free listing to activate your business on Essential-Direct Ng.",
      price: 0.0,
      validity: "7 days",
      targetCustomers: 100,
      marketing: "Basic Marketing",
    },
    {
      id: 2,
      name: "Classified",
      description: "Post 2 products, 2 photos, and 1 category on our platform.",
      price: 1000.0,
      validity: "One-off visibility",
      targetCustomers: 600,
      marketing: "Basic Marketing",
    },
    {
      id: 3,
      name: "Ordinary",
      description:
        "Register 3 products, 4 photos, and 2 categories on our platform.",
      price: 2500.0,
      validity: "One-off visibility",
      targetCustomers: 200,
      marketing: "Enhanced Marketing",
    },
    {
      id: 4,
      name: "Platinum",
      description:
        "Post 9 products, 8 photos, 4 keywords, and 4 categories. Visibility on local, nationwide, and global platforms.",
      price: 4500.0,
      validity: "12 months visibility",
      targetCustomers: 4000,
      marketing: "Advanced Marketing",
    },
    {
      id: 5,
      name: "Silver Listing",
      description:
        "Post 11 products, 12 photos, 12 keywords, and 7 categories. Boost to social platforms, and visibility locally, nationwide, and globally.",
      price: 9000.0,
      validity: "12 months visibility",
      targetCustomers: 100,
      marketing: "Advanced Marketing",
    },
    {
      id: 6,
      name: "Gold Listing",
      description:
        "Post 14 products, 15 photos, 16 keywords, and 7 categories. Boost to social platforms, and visibility locally, nationwide, and globally.",
      price: 9279.0,
      validity: "12 months visibility",
      targetCustomers: 100,
      marketing: "Advanced Marketing",
    },
    {
      id: 7,
      name: "Gold Plus",
      description:
        "Post 14 products, 15 photos, 10 keywords, and 7 categories. Visibility on all platforms and in all regions with strong marketing.",
      price: 789090.0,
      validity: "12 months visibility",
      targetCustomers: null,
      marketing: "Comprehensive Marketing",
    },
  ];

  // Handle upgrade button click
  const handleUpgrade = (packageId) => {
    navigate(`/payment/${packageId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-[#0d2042] py-24 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Choose from any of our listing Packages that suit your business
            needs
          </h1>
          <p className="text-lg text-blue-100 mb-4">
            Select a package to get your business listed on our marketing page.
          </p>
          <p className="text-sm text-blue-200">
            Your business visibility is enhanced based on your chosen package
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border hover:border-red-500 ${
                pkg.name === "Free Trial" ? "opacity-70" : ""
              }`}>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 underline">
                {pkg.name}
              </h3>

              <p className="text-gray-600 text-sm mb-6 min-h-[60px]">
                {pkg.description}
              </p>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-bold">Price:</span> ₦
                  {pkg.price.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">Validity:</span> {pkg.validity}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">Target Customers:</span>{" "}
                  {pkg.targetCustomers || "Unlimited"}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">Marketing:</span> {pkg.marketing}
                </p>
              </div>
              {/* {pkg.name !== "Free Trial" && (
                <button
                  onClick={() => handleUpgrade(pkg.id)}
                  className="w-auto px-2 mt-6 bg-[#FF4400] hover:bg-red-600 text-white py-2 rounded-md font-semibold hover:scale-105 transition-all duration-300">
                  Upgrade Now
                </button>
              )} */}
              <button
                onClick={() => handleUpgrade(pkg.id)}
                className="w-auto px-2 mt-6 bg-[#FF4400] hover:bg-red-600 text-white py-2 rounded-md font-semibold hover:scale-105 transition-all duration-300"
                disabled={pkg.name === "Free Trial"} // Disable button if it's the current plan
              >
                {pkg.name === "Free Trial" ? "Current Plan" : "Upgrade Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
