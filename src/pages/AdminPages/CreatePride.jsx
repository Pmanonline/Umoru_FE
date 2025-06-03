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

// Fetch countries from REST Countries API
const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    return data
      .map((country) => country.name.common)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

export default function CreatePride() {
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
    award: "",
    category: "",
    description: "",
    fullDescription: "",
    country: "",
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
    "Sports",
    "Music",
    "Banking",
    "Business",
    "Philantropist",
  ];

  useEffect(() => {
    const initializeData = async () => {
      setPageLoading(true);
      setError(null);

      // Fetch countries
      const fetchedCountries = await fetchCountries();
      setCountries(["", ...fetchedCountries]);

      try {
        if (slug) {
          const resPride = await fetch(
            `${backendURL}/api/getPrideBySlug/${slug}`
          );
          if (!resPride.ok) throw new Error("Failed to fetch pride entry");
          const pride = await resPride.json();

          setFormData({
            name: pride.name || "",
            award: pride.award || "",
            category: pride.category || "",
            description: pride.description || "",
            fullDescription: pride.fullDescription || "",
            country: pride.country || "",
            videoLink: pride.videoLink || "",
            videoDuration: pride.videoDuration || "",
            profileLink: pride.profileLink || "",
          });

          if (pride.image) {
            setMainImagePreview(pride.image);
          }
          if (pride.additionalImages && pride.additionalImages.length > 0) {
            setAdditionalImagesPreviews(pride.additionalImages);
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

    // Trim all string fields
    const trimmedData = {
      name: formData.name.trim(),
      award: formData.award.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      fullDescription: formData.fullDescription.trim(),
      country: formData.country.trim(),
      videoLink: formData.videoLink.trim(),
      videoDuration: formData.videoDuration.trim(),
      profileLink: formData.profileLink.trim(),
    };

    // Validate required fields
    const requiredFields = slug
      ? ["name", "award", "category", "country", "description"]
      : ["name", "award", "category", "country"];
    const missingFields = requiredFields.filter((field) => !trimmedData[field]);
    if (missingFields.length > 0) {
      showAlertMessage(
        `Please fill in the following required fields: ${missingFields.join(", ")}`,
        "warning"
      );
      return;
    }

    // Validate videoLink if provided
    if (
      trimmedData.videoLink &&
      !/^[a-zA-Z0-9_-]{11}$/.test(trimmedData.videoLink)
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
      const prideFormData = new FormData();
      prideFormData.append("name", trimmedData.name);
      prideFormData.append("award", trimmedData.award);
      prideFormData.append("category", trimmedData.category);
      prideFormData.append("description", trimmedData.description);
      prideFormData.append("fullDescription", trimmedData.fullDescription);
      prideFormData.append("country", trimmedData.country);
      prideFormData.append("videoLink", trimmedData.videoLink);
      prideFormData.append("videoDuration", trimmedData.videoDuration);
      prideFormData.append("profileLink", trimmedData.profileLink);

      if (mainImage) {
        prideFormData.append("image", mainImage);
      }
      additionalImages.forEach((image) => {
        prideFormData.append("additionalImages", image);
      });

      const url = slug
        ? `${backendURL}/api/updatePride/${slug}`
        : `${backendURL}/api/createPride`;

      const response = await fetch(url, {
        method: slug ? "PUT" : "POST",
        body: prideFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save pride entry");
      }

      showAlertMessage(
        slug
          ? "Pride entry updated successfully"
          : "Pride entry created successfully",
        "success"
      );

      setTimeout(() => {
        navigate("/Admin/PrideInCategoryList");
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      showAlertMessage(
        error.message || "Failed to save pride entry",
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
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary hover:text-primary-light mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <h1 className="text-center text-3xl font-bold text-primary mb-8">
        {slug
          ? "Edit The Pride Of The World In Category"
          : "Create a Pride Of The World In Category"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Awardee Names"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Award/Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="award"
                value={formData.award}
                onChange={handleInputChange}
                placeholder="Enter award or title detail"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required>
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Description
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description{" "}
                {slug && <span className="text-red-500">*</span>}
              </label>
              <textarea
                placeholder="Short summary of the award/recognition"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
                required={slug}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <ReactQuill
                theme="snow"
                placeholder="Write the full description..."
                className="h-64 mb-12"
                value={formData.fullDescription}
                onChange={handleQuillChange}
              />
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Video Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Video ID
              </label>
              <input
                type="text"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., dJQn4DqzMVQ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Duration
              </label>
              <input
                type="text"
                name="videoDuration"
                value={formData.videoDuration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 3:45"
              />
            </div>
          </div>
        </div>

        {/* Profile Link Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Profile Link
          </h2>
          <input
            type="text"
            name="profileLink"
            value={formData.profileLink}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., https://example.com/profile"
          />
        </div>

        {/* Main Image Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Main Image
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
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
                className="flex items-center px-2 py-1 bg-primary text-white rounded-lg hover:bg-primary-light">
                <Upload className="w-5 h-5 mr-2" />
                Choose Cover Image
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Recommended size: 800x800px, max 5MB (JPEG, PNG)
              </p>
            </div>
            {mainImagePreview && (
              <div className="relative">
                <img
                  src={mainImagePreview}
                  alt="Main preview"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMainImage(null);
                    setMainImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Images Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Additional Images (Gallery, Max 10)
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
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
                className="flex items-center px-2 py-1 bg-primary text-white rounded-lg hover:bg-primary-light">
                <Upload className="w-5 h-5 mr-2" />
                Choose Additional Images
              </button>
              <p className="text-sm text-gray-500 mt-2">
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
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
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
            className={`flex items-center justify-center px-3 py-2 rounded-lg text-white font-medium ${
              loading ? "bg-primary/50" : "bg-primary hover:bg-primary-light"
            } transition-colors`}>
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : slug ? (
              "Update Pride Entry"
            ) : (
              "Create Pride Entry"
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
