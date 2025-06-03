import React, { useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { useNavigate } from "react-router-dom";
import countriesByContinent from "../assets/json/continentAndCountries.json";
import { ArrowLeft } from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const SuggestNominee = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    nomineeName: "",
    category: "Best Business Entrepreneur",
    nominationReason: "",
    whyDeserves: "",
    country: "",
    continent: "Africa",
    image: null,
  });
  const [availableCountries, setAvailableCountries] = useState(
    countriesByContinent.Africa
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [expandedRules, setExpandedRules] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "continent") {
      const newCountries = countriesByContinent[value] || [];
      setAvailableCountries(newCountries);
      if (!newCountries.includes(formData.country)) {
        setFormData((prev) => ({ ...prev, continent: value, country: "" }));
      } else {
        setFormData((prev) => ({ ...prev, continent: value }));
      }
    } else if (name === "image" && files && files[0]) {
      const file = files[0];
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        showAlertMessage("Please upload a JPEG or PNG image.", "destructive");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB in bytes
        showAlertMessage("Image size must be less than 5MB.", "destructive");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
      // Generate image preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      console.log("Image selected:", file.name); // Debug log
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!userInfo) {
        showAlertMessage("Please log in to submit a nomination", "destructive");
        navigate("/login");
        return;
      }

      if (!formData.image && !formData.nomineeName) {
        showAlertMessage("Nominee name and photo are required.", "destructive");
        return;
      }

      setIsSubmitting(true);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value instanceof File ? value : value);
        }
      });
      formDataToSend.append("nominator", userInfo._id);

      // Debug log for FormData contents
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      try {
        const response = await axios.post(
          `http://localhost:3001/api/createNomination`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        console.log("Submission response:", response.data);
        showAlertMessage("Nomination submitted successfully", "success");
        setFormData({
          nomineeName: "",
          category: "Best Business Entrepreneur",
          nominationReason: "",
          whyDeserves: "",
          country: "",
          continent: "Africa",
          image: null,
        });
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        console.error("Submission error:", err.response?.data || err.message);
        const errorMsg =
          err.response?.data?.message || "Failed to submit nomination";
        if (errorMsg.includes("Image upload failed")) {
          showAlertMessage(
            "Image upload failed. Please try a different image.",
            "destructive"
          );
        } else {
          showAlertMessage(errorMsg, "destructive");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, userInfo, navigate, showAlertMessage]
  );

  const toggleRules = useCallback(() => {
    setExpandedRules((prev) => !prev);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8  bg-accent-cream mt-16">
      <div className="text-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center text-primary hover:text-primary-light transition-colors duration-200"
          aria-label="Go back">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          Suggest a Nominee
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Nominate someone you believe deserves recognition. All submissions are
          reviewed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nominee Name */}
          <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-medium">
              Nominee Full Name
            </label>
            <input
              type="text"
              name="nomineeName"
              value={formData.nomineeName}
              onChange={handleChange}
              required
              placeholder="Enter the nominee's full name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-medium">
              Award Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="Best Business Entrepreneur">
                Best Business Entrepreneur
              </option>
              <option value="Humanitarian">Humanitarian of the Year</option>
              <option value="Innovation">Innovation Award</option>
              <option value="Emergency Services">
                Emergency Services Hero
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Nomination Reason */}
          <div className="space-y-1 md:col-span-2">
            <label className="block text-gray-700 text-sm font-medium">
              Nomination Reason
            </label>
            <input
              type="text"
              name="nominationReason"
              value={formData.nominationReason}
              onChange={handleChange}
              required
              placeholder="Briefly state why you're nominating this person"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Why Deserves */}
          <div className="space-y-1 md:col-span-2">
            <label className="block text-gray-700 text-sm font-medium">
              Why They Deserve This Award
            </label>
            <textarea
              name="whyDeserves"
              value={formData.whyDeserves}
              onChange={handleChange}
              placeholder="Describe their achievements and impact (minimum 50 characters)"
              minLength="50"
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Continent */}
          <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-medium">
              Continent
            </label>
            <select
              name="continent"
              value={formData.continent}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              {Object.keys(countriesByContinent).map((continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-medium">
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="">Select a country</option>
              {availableCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-1 md:col-span-2">
            <label className="block text-gray-700 text-sm font-medium">
              Nominee Photo
              <span className="text-xs text-gray-500 ml-1">
                Optional but recommended (JPEG/PNG, max 5MB)
              </span>
            </label>
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png"
              onChange={handleChange}
              ref={fileInputRef}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-xs max-h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Nomination"
          )}
        </button>
      </form>

      {/* Nomination Rules */}
      <div className="bg-white rounded-lg shadow-sm mt-6">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={toggleRules}>
          <h3 className="font-bold text-base text-primary">
            Nomination Guidelines
          </h3>
          {expandedRules ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </div>
        {expandedRules && (
          <div className="p-4 pt-0">
            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              <li>You may nominate one person per category.</li>
              <li>Provide detailed justification for your nomination.</li>
              <li>Photos help but are not mandatory.</li>
              <li>All nominations undergo review before approval.</li>
              <li>You must be logged in to submit a nomination.</li>
              <li>Nominations close on December 31st each year.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Alert Notification */}
      {showAlert && (
        <Alert
          variant={alertConfig.variant}
          onClose={() => setShowAlert(false)}>
          <AlertDescription>{alertConfig.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SuggestNominee;
