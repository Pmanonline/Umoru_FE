import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

export default function CreateFamousPerson() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);
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
    category: "",
    country: "",
    continent: "",
    description: "",
    fullDescription: "",
    videoLink: "",
    videoDuration: "",
    profileLink: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);

  const categories = [
    "Politics",
    "Music",
    "Business",
    "Humanitarian",
    "Innovation",
    "Youth Development",
    "Environmental",
  ];

  const continents = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Australia",
    "Antarctica",
  ];

  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (!response.ok) throw new Error("Failed to fetch countries");
      const data = await response.json();
      const countryList = data.map((country) => ({
        name: country.name.common,
        code: country.cca2,
      }));
      setCountries(countryList.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      showAlertMessage("Failed to load countries", "destructive");
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setPageLoading(true);
      setError(null);
      await fetchCountries();

      try {
        if (slug) {
          const resPerson = await fetch(
            `${backendURL}/api/getFamousPersonBySlug/${slug}`
          );
          if (!resPerson.ok) throw new Error("Failed to fetch famous person");
          const person = await resPerson.json();

          setFormData({
            name: person.name || "",
            category: person.category || "",
            country: person.country || "",
            continent: person.continent || "",
            description: person.description || "",
            fullDescription: person.fullDescription || "",
            videoLink: person.videoLink || "",
            videoDuration: person.videoDuration || "",
            profileLink: person.profileLink || "",
          });

          if (person.image) {
            setMainImagePreview(person.image);
          }
          if (person.additionalImages && person.additionalImages.length > 0) {
            setAdditionalImagesPreviews(person.additionalImages);
          }
        }
      } catch (error) {
        setError(error.message);
        showAlertMessage(error.message, "destructive");
      } finally {
        setPageLoading(false);
      }
    };

    initializeData();
  }, [slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, fullDescription: value }));
  };

  const handleMainImageChange = (e) => {
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
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + additionalImages.length > 10) {
      showAlertMessage(
        "Cannot upload more than 10 additional images",
        "destructive"
      );
      return;
    }
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showAlertMessage("Each file size should not exceed 5MB", "destructive");
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
    });
    setAdditionalImages((prev) => [...prev, ...files]);
    setAdditionalImagesPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedData = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      country: formData.country.trim(),
      continent: formData.continent.trim(),
      description: formData.description.trim(),
      fullDescription: formData.fullDescription.trim(),
      videoLink: formData.videoLink.trim(),
      videoDuration: formData.videoDuration.trim(),
      profileLink: formData.profileLink.trim(),
    };

    const requiredFields = slug
      ? ["name", "category", "country", "continent", "description"]
      : ["name", "category", "country", "continent"];
    const missingFields = requiredFields.filter((field) => !trimmedData[field]);
    if (missingFields.length > 0) {
      showAlertMessage(
        `Please fill in the following required fields: ${missingFields.join(", ")}`,
        "warning"
      );
      return;
    }

    if (
      trimmedData.videoLink &&
      !/^[a-zA-Z0-9_-]{11}$/.test(trimmedData.videoLink)
    ) {
      showAlertMessage("Invalid YouTube video ID", "warning");
      return;
    }

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
      const personFormData = new FormData();
      personFormData.append("name", trimmedData.name);
      personFormData.append("category", trimmedData.category);
      personFormData.append("country", trimmedData.country);
      personFormData.append("continent", trimmedData.continent);
      personFormData.append("description", trimmedData.description);
      personFormData.append("fullDescription", trimmedData.fullDescription);
      personFormData.append("videoLink", trimmedData.videoLink);
      personFormData.append("videoDuration", trimmedData.videoDuration);
      personFormData.append("profileLink", trimmedData.profileLink);

      if (mainImage) {
        personFormData.append("image", mainImage);
      }
      additionalImages.forEach((image) => {
        personFormData.append("additionalImages", image);
      });

      const url = slug
        ? `${backendURL}/api/updateFamousPerson/${slug}`
        : `${backendURL}/api/createFamousPerson`;

      const response = await fetch(url, {
        method: slug ? "PUT" : "POST",
        body: personFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save famous person");
      }

      showAlertMessage(
        slug
          ? "Famous person updated successfully"
          : "Famous person created successfully",
        "success"
      );

      setTimeout(() => {
        navigate("/Admin/FamousPeopleList");
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      showAlertMessage(
        error.message || "Failed to save famous person",
        "destructive"
      );
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
      <div className="px-3 sm:px-4 py-6 sm:py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 py-6 sm:py-8 max-w-4xl mx-auto bg-accent-cream mt-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary hover:text-primary/80 mb-4 sm:mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <h1 className="text-center text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6">
        {slug ? "Edit Famous Person" : "Create a Famous Person"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                Name <span className="text-unity-coral">*</span>
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
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
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
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
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
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
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
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
            Description
          </h2>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                Short Description{" "}
                {slug && <span className="text-unity-coral">*</span>}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
                required={slug}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                Full Description
              </label>
              <ReactQuill
                theme="snow"
                placeholder="Write the full description..."
                className="h-48 sm:h-64 mb-4 sm:mb-6"
                value={formData.fullDescription}
                onChange={handleQuillChange}
              />
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
            Video Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                YouTube Video ID
              </label>
              <input
                type="text"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., dJQn4DqzMVQ"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
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

        {/* Profile Link Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
            Profile Link
          </h2>
          <input
            type="text"
            name="profileLink"
            value={formData.profileLink}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., https://example.com/profile"
          />
        </div>

        {/* Main Image Upload Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
            Main Image
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                ref={mainImageInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => mainImageInputRef.current.click()}
                className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white hover:bg-sunlit-gold rounded-lg">
                <Upload className="w-5 h-5 mr-2" />
                Choose Main Image
              </button>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Recommended size: 800x800px, max 5MB (JPEG, PNG)
              </p>
            </div>
            {mainImagePreview && (
              <div className="relative">
                <img
                  src={mainImagePreview}
                  alt="Main preview"
                  className="w-32 sm:w-40 h-32 sm:h-40 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMainImage(null);
                    setMainImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-unity-coral text-white rounded-full p-1 hover:bg-unity-coral/80">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Images Upload Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
            Additional Images (Gallery, Max 10)
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
                ref={additionalImagesInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => additionalImagesInputRef.current.click()}
                className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white hover:bg-sunlit-gold rounded-lg">
                <Upload className="w-5 h-5 mr-2" />
                Choose Additional Images
              </button>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Max 10 images, each max 5MB (JPEG, PNG)
              </p>
            </div>
          </div>
          {additionalImagesPreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {additionalImagesPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Additional preview ${index + 1}`}
                    className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute -top-2 -right-2 bg-unity-coral text-white rounded-full p-1 hover:bg-unity-coral/80">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white font-medium ${
              loading ? "bg-sunlitgold/50" : "bg-primary hover:bg-secondary"
            } transition-colors`}>
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : slug ? (
              "Update Famous Person"
            ) : (
              "Create Famous Person"
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
