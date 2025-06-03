import React, { useState } from "react";
import {
  CheckCircle,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "../components/tools/Alert";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const FundPage = () => {
  const navigate = useNavigate();
  const [donationAmount, setDonationAmount] = useState(5000);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    program: "Where most needed",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const presetAmounts = [1000, 2500, 5000, 10000, 25000, 50000];
  const impactStories = [
    {
      title: "Emergency Services Award",
      description: "Supporting first responders who risk their lives daily",
      icon: <ShieldCheck className="text-primary" size={24} />,
    },
    {
      title: "Youth Development Program",
      description: "Empowering the next generation of Nigerian leaders",
      icon: <Sparkles className="text-sunlit-gold" size={24} />,
    },
    {
      title: "Community Heroes Fund",
      description: "Recognizing unsung heroes making local impacts",
      icon: <HeartHandshake className="text-secondary" size={24} />,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDonate = async () => {
    if (!formData.name || !formData.email) {
      setError("Please provide your name and email.");
      return;
    }
    if (donationAmount < 100) {
      setError("Donation amount must be at least ₦100.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${backendURL}/api/payments/initialize`,
        {
          name: formData.name,
          email: formData.email,
          amount: donationAmount,
          program: formData.program,
        }
      );
      if (response.data.success) {
        window.location.href = response.data.authorization_url;
      } else {
        setError(response.data.message || "Failed to initiate payment.");
      }
    } catch (err) {
      setError("An error occurred while initiating payment.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent-cream mt-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8 sm:py-12 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Pride of the World Fund
              </h1>
              <p className="text-lg sm:text-xl mb-6">
                A helping hand for the nation's unsung heroes. Support verified
                organizations making real impact across the world.
              </p>
              <button
                // onClick={() => navigate("#donate")}
                className="px-5 sm:px-6 py-2 sm:py-3 rounded-full font-bold bg-primary text-white hover:bg-opacity-90">
                Donate Now
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="Community heroes"
                className="rounded-xl shadow-2xl border-4 border-accent-cream"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-6" id="donate">
          {/* Donation Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6">
              Make a Difference Today
            </h2>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold mb-4">Your Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  disabled={isLoading}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold mb-4">
                Select your donation amount (₦)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`py-2 sm:py-3 rounded-lg font-medium ${
                      donationAmount === amount
                        ? "bg-sunlit-gold text-primary"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    disabled={isLoading}>
                    {amount.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₦
                </span>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) =>
                    setDonationAmount(Math.max(100, Number(e.target.value)))
                  }
                  min="100"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Custom amount"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold mb-4">
                Where should your donation go?
              </h3>
              <select
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                disabled={isLoading}>
                <option>Where most needed</option>
                <option>Emergency Services Award</option>
                <option>Youth Development Program</option>
                <option>Community Heroes Fund</option>
              </select>
            </div>
            <button
              onClick={handleDonate}
              className="w-full bg-sunlit-gold hover:bg-secondary text-white bg-primary font-bold py-3 sm:py-4 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50"
              disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-primary"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Donate ₦${donationAmount.toLocaleString()} Now`
              )}
            </button>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <CheckCircle className="text-primary mr-2" size={16} />
              <span>Secure payment processed by Paystack</span>
            </div>
          </div>

          {/* Impact Stories */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h3 className="font-bold text-lg sm:text-xl mb-4">Your Impact</h3>
              <div className="space-y-4">
                {impactStories.map((story, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">{story.icon}</div>
                    <div>
                      <h4 className="font-semibold">{story.title}</h4>
                      <p className="text-sm text-gray-600">
                        {story.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h3 className="font-bold text-lg sm:text-xl mb-4">
                Why Give With Us?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-primary mt-1" size={16} />
                  <span>100% of donations go directly to programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-primary mt-1" size={16} />
                  <span>Verified and vetted organizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-primary mt-1" size={16} />
                  <span>Regular impact reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-primary mt-1" size={16} />
                  <span>Tax-deductible donations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
            Trusted by Organizations Across the World
          </h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Partnering with PNF has allowed us to expand our youth programs to 3 new states.",
                author: "John James, IAYPN",
                role: "Program Director",
              },
              {
                quote:
                  "The Emergency Services Award has transformed how we support our first responders.",
                author: "Amina Yusuf",
                role: "TMES Coordinator",
              },
              {
                quote:
                  "Transparent reporting makes PNF our preferred giving platform.",
                author: "Chinedu Okoro",
                role: "Corporate Donor",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="mb-4 text-sunlit-gold">★★★★★</div>
                <p className="text-gray-700 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundPage;
