import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

export default function CreateAward() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const [formData, setFormData] = useState({
    name: "",
    award: "",
    category: "",
    state: "",
    country: "",
    continent: "",
    year: "",
    description: "",
    fullDescription: "",
    achievements: [],
    socialMedia: { twitter: "", facebook: "", linkedin: "", website: "" },
    profileLink: "",
    videoID: "",
    videoDuration: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [continents] = useState([
    "Africa",
    "North America",
    "South America",
    "Asia",
    "Europe",
    "Australia",
    "Antarctica",
  ]);

  const categories = [
    "Politics",
    "Sports",
    "Music",
    "Banking",
    "Business",
    "Philanthropy",
    "Humanitarian",
    "Innovation",
    "Youth Development",
    "Environmental",
    "Diaspora",
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryList = response.data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(countryList.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        showAlertMessage("Failed to load countries", "destructive");
      }
    };

    const initializeData = async () => {
      setPageLoading(true);
      setError(null);

      try {
        if (slug) {
          const resAward = await fetch(
            `${backendURL}/api/getAwardBySlug/${slug}`
          );
          if (!resAward.ok) throw new Error("Failed to fetch award");
          const award = await resAward.json();

          setFormData({
            name: award.name || "",
            award: award.award || "",
            category: award.category || "",
            state: award.state || "",
            country: award.country || "",
            continent: award.continent || "",
            year: award.year ? award.year.toString() : "",
            description: award.description || "",
            fullDescription: award.fullDescription || "",
            achievements: award.achievements || [],
            socialMedia: award.socialMedia || {
              twitter: "",
              facebook: "",
              linkedin: "",
              website: "",
            },
            profileLink: award.profileLink || "",
            videoID: award.videoID || "",
            videoDuration: award.videoDuration || "",
          });

          if (award.image) {
            setImagePreview(award.image);
          }
        }
      } catch (error) {
        setError(error.message);
        showAlertMessage(error.message, "destructive");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCountries();
    initializeData();
  }, [slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [name]: value },
    }));
  };

  const handleAchievementsChange = (e, index) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = e.target.value;
    setFormData((prev) => ({ ...prev, achievements: newAchievements }));
  };

  const addAchievement = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ""],
    }));
  };

  const removeAchievement = (index) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, fullDescription: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlertMessage("File size should not exceed 5MB", "destructive");
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        showAlertMessage(
          "Please upload only image files (JPEG, PNG, GIF)",
          "destructive"
        );
        return;
      }

      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim all string fields
    const trimmedData = {
      name: formData.name.trim(),
      award: formData.award.trim(),
      category: formData.category.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      continent: formData.continent.trim(),
      year: formData.year.trim(),
      description: formData.description.trim(),
      fullDescription: formData.fullDescription.trim(),
      achievements: formData.achievements.map((ach) => ach.trim()),
      socialMedia: {
        twitter: formData.socialMedia.twitter.trim(),
        facebook: formData.socialMedia.facebook.trim(),
        linkedin: formData.socialMedia.linkedin.trim(),
        website: formData.socialMedia.website.trim(),
      },
      profileLink: formData.profileLink.trim(),
      videoID: formData.videoID.trim(),
      videoDuration: formData.videoDuration.trim(),
    };

    // Validate required fields
    const requiredFields = [
      "name",
      "award",
      "category",
      "country",
      "continent",
      "year",
      "description",
    ];
    const missingFields = requiredFields.filter((field) => !trimmedData[field]);
    if (missingFields.length > 0) {
      showAlertMessage(
        `Please fill in the following required fields: ${missingFields.join(", ")}`,
        "warning"
      );
      return;
    }

    // Validate year
    const yearNumber = parseInt(trimmedData.year, 10);
    if (
      isNaN(yearNumber) ||
      yearNumber < 1900 ||
      yearNumber > new Date().getFullYear()
    ) {
      showAlertMessage(
        `Year must be a valid number between 1900 and ${new Date().getFullYear()}`,
        "warning"
      );
      return;
    }

    // Validate videoID if provided
    if (
      trimmedData.videoID &&
      !/^[a-zA-Z0-9_-]{11}$/.test(trimmedData.videoID)
    ) {
      showAlertMessage("Invalid YouTube video ID", "warning");
      return;
    }

    // Validate videoDuration if provided
    if (
      trimmedData.videoDuration &&
      !/^\d{1,2}:\d{2}$/.test(trimmedData.videoDuration)
    ) {
      showAlertMessage(
        "Video duration must be in MM:SS format (e.g., 3:45)",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const awardFormData = new FormData();
      awardFormData.append("name", trimmedData.name);
      awardFormData.append("award", trimmedData.award);
      awardFormData.append("category", trimmedData.category);
      awardFormData.append("state", trimmedData.state);
      awardFormData.append("country", trimmedData.country);
      awardFormData.append("continent", trimmedData.continent);
      awardFormData.append("year", yearNumber);
      awardFormData.append("description", trimmedData.description);
      awardFormData.append("fullDescription", trimmedData.fullDescription);
      awardFormData.append(
        "achievements",
        JSON.stringify(trimmedData.achievements)
      );
      awardFormData.append(
        "socialMedia",
        JSON.stringify(trimmedData.socialMedia)
      );
      awardFormData.append("profileLink", trimmedData.profileLink);
      awardFormData.append("videoID", trimmedData.videoID);
      awardFormData.append("videoDuration", trimmedData.videoDuration);

      if (selectedFile) {
        awardFormData.append("image", selectedFile);
      }

      console.log("FormData entries being sent:");
      for (const [key, value] of awardFormData.entries()) {
        console.log(`${key}:`, value);
      }

      const url = slug
        ? `${backendURL}/api/updateAward/${slug}`
        : `${backendURL}/api/createAward`;

      const response = await fetch(url, {
        method: slug ? "PUT" : "POST",
        body: awardFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save award");
      }

      showAlertMessage(
        slug ? "Award updated successfully" : "Award created successfully",
        "success"
      );

      setTimeout(() => {
        navigate("/Admin/AwardList");
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      showAlertMessage(error.message || "Failed to save award", "destructive");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen bg-accent-cream mt-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary hover:text-primary/80 mb-4 sm:mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <h1 className="text-center text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
        {slug ? "Edit Award" : "Create an Award"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Awardee Name <span className="text-unity-coral">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Award Title <span className="text-unity-coral">*</span>
              </label>
              <input
                type="text"
                name="award"
                value={formData.award}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-unity-coral">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-unity-coral">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required>
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Continent <span className="text-unity-coral">*</span>
              </label>
              <select
                name="continent"
                value={formData.continent}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required>
                <option value="">Select a continent</option>
                {continents.map((continent) => (
                  <option key={continent} value={continent}>
                    {continent}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                State (Optional)
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Year <span className="text-unity-coral">*</span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
            Description
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Short Description <span className="text-unity-coral">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <ReactQuill
                theme="snow"
                placeholder="Write the full description..."
                className="h-56 sm:h-64 mb-10 sm:mb-12"
                value={formData.fullDescription}
                onChange={handleQuillChange}
              />
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
            Achievements
          </h2>
          {formData.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={achievement}
                onChange={(e) => handleAchievementsChange(e, index)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => removeAchievement(index)}
                className="text-unity-coral hover:text-unity-coral/80">
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAchievement}
            className="text-primary hover:text-primary/80 mt-2">
            + Add Achievement
          </button>
        </div>

        {/* Social Media Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
            Social Media Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              name="twitter"
              placeholder="Twitter URL"
              value={formData.socialMedia.twitter}
              onChange={handleSocialMediaChange}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="url"
              name="facebook"
              placeholder="Facebook URL"
              value={formData.socialMedia.facebook}
              onChange={handleSocialMediaChange}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={formData.socialMedia.linkedin}
              onChange={handleSocialMediaChange}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="url"
              name="website"
              placeholder="Website URL"
              value={formData.socialMedia.website}
              onChange={handleSocialMediaChange}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Profile Link Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
            Profile Link
          </h2>
          <input
            type="text"
            name="profileLink"
            value={formData.profileLink}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="whos who slug"
          />
        </div>

        {/* Video Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
            Video Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                YouTube Video ID
              </label>
              <input
                type="text"
                name="videoID"
                value={formData.videoID}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., dJQn4DqzMVQ"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Video Duration
              </label>
              <input
                type="text"
                name="videoDuration"
                value={formData.videoDuration}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 3:45"
              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
            Awardee Image
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-sunlit-gold text-primary rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary">
                <Upload className="w-5 h-5 mr-2" />
                Choose File
              </button>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Recommended size: 800x800px, max 5MB (JPEG, PNG)
              </p>
            </div>
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-32 sm:w-40 h-32 sm:h-40 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-unity-coral text-white rounded-full p-1 hover:bg-unity-coral/80">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center px-4 sm:px-3  sm:py-3 rounded-lg font-medium text-primary ${
              loading
                ? "bg-sunlitgold/50"
                : "bg-primary text-red-50 hover:bg-secondary"
            } transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}>
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : slug ? (
              "Update Award"
            ) : (
              "Create Award"
            )}
          </button>
        </div>

        {/* Alert Component */}
        {showAlert && (
          <div className="fixed bottom-4 right-4 z-50">
            <Alert
              variant={alertConfig.variant}
              onClose={() => setShowAlert(false)}>
              <AlertDescription>{alertConfig.message}</AlertDescription>
            </Alert>
          </div>
        )}
      </form>
    </div>
  );
}
