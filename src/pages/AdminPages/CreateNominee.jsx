import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const CreateNominee = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { slug } = useParams();
  const navigate = useNavigate();
  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    awardCategory: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const awardCategories = [
    "Humanitarian of the Year",
    "Innovator of the Year",
    "Entrepreneur of the Year",
    "Youth Leader of the Year",
  ];

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  useEffect(() => {
    if (slug) {
      const fetchNominee = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${backendURL}/api/getNomineeBySlug/${slug}`,
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          setFormData({
            name: response.data.name || "",
            bio: response.data.bio || "",
            awardCategory: response.data.awardCategory || "",
          });
          if (response.data.image) {
            setMainImagePreview(response.data.image);
          }
          if (response.data.additionalImages?.length > 0) {
            setAdditionalImagesPreviews(response.data.additionalImages);
          }
        } catch (err) {
          showAlertMessage(
            err.response?.data?.message || "Failed to load nominee",
            "destructive"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchNominee();
    }
  }, [slug, userInfo, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, bio: value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlertMessage("File size should not exceed 5MB", "destructive");
        return;
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        showAlertMessage(
          "Please upload only JPEG or PNG images",
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
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        showAlertMessage(
          "Please upload only JPEG or PNG images",
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
    setIsSubmitting(true);
    setShowAlert(false);

    const trimmedData = {
      name: formData.name.trim(),
      bio: formData.bio.trim(),
      awardCategory: formData.awardCategory.trim(),
    };

    if (!trimmedData.name || !trimmedData.bio || !trimmedData.awardCategory) {
      showAlertMessage("Name, bio, and award category are required", "warning");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", trimmedData.name);
      formDataToSend.append("bio", trimmedData.bio);
      formDataToSend.append("awardCategory", trimmedData.awardCategory);
      if (mainImage) {
        formDataToSend.append("image", mainImage);
      }
      additionalImages.forEach((image) => {
        formDataToSend.append("additionalImages", image);
      });

      const url = slug ? `/api/updateNominee/${slug}` : "/api/createNominee";
      const method = slug ? "put" : "post";

      const response = await axios({
        method,
        url: `${backendURL}${url}`,
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      showAlertMessage(
        slug ? "Nominee updated successfully" : "Nominee created successfully",
        "success"
      );
      setTimeout(() => navigate("/Admin/NomineeList"), 1500);
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Failed to save nominee",
        "destructive"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen bg-accent-cream mt-12">
      <button
        onClick={() => navigate("/Admin/NomineeList")}
        className="flex items-center text-primary hover:text-primary/80 mb-4 sm:mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <h1 className="text-center text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
        {slug ? "Edit Nominee" : "Create a Nominee"}
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Award Category <span className="text-unity-coral">*</span>
              </label>
              <select
                name="awardCategory"
                value={formData.awardCategory}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required>
                <option value="">Select a category</option>
                {awardCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
            Bio
          </h2>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Bio <span className="text-unity-coral">*</span>
            </label>
            <ReactQuill
              theme="snow"
              placeholder="Write the nominee's bio..."
              className="h-56 sm:h-64 mb-10 sm:mb-12"
              value={formData.bio}
              onChange={handleQuillChange}
            />
          </div>
        </div>

        {/* Main Image Upload Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
            Main Image
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleMainImageChange}
                ref={mainImageInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => mainImageInputRef.current.click()}
                className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white text-primary rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary">
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
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
            Additional Images (Max 10)
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleAdditionalImagesChange}
                ref={additionalImagesInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => additionalImagesInputRef.current.click()}
                className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary  text-white text-primary rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary">
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
            disabled={isSubmitting}
            className={`flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-primary font-medium ${
              isSubmitting
                ? "bg-sunlit-gold/50"
                : "bg-primary text-white hover:bg-secondary"
            } transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : slug ? (
              "Update Nominee"
            ) : (
              "Create Nominee"
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
};

export default CreateNominee;
