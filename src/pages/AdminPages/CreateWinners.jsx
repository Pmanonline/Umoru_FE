import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { ArrowLeft } from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const CreateEditWinnerPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    award: "",
    awardCategory: "",
    year: new Date().getFullYear(),
    description: "",
    image: null,
  });
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
    "Emergency Services",
    "Young Achiever",
    "Community Champion",
    "Lifetime Achievement",
    "Environmental Hero",
  ];

  // Fetch winner data for editing
  useEffect(() => {
    if (slug) {
      const fetchWinner = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${backendURL}/api/getWinnerBySlug/${slug}`,
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          setFormData({
            name: response.data.name,
            award: response.data.award,
            awardCategory: response.data.awardCategory,
            year: response.data.year,
            description: response.data.description,
            image: null,
          });
        } catch (err) {
          showAlertMessage(
            err.response?.data?.message || "Failed to fetch winner",
            "destructive"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchWinner();
    }
  }, [slug, userInfo]);

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("award", formData.award);
    data.append("awardCategory", formData.awardCategory);
    data.append("year", formData.year);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      let response;
      if (slug) {
        // Update winner
        response = await axios.put(
          `${backendURL}/api/updateWinner/${slug}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create winner
        response = await axios.post(`${backendURL}/api/createWinner`, data, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      showAlertMessage(response.data.message, "success");
      setTimeout(() => {
        navigate("/Admin/AdminWinnersListPage");
      }, 1500);
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Failed to save winner",
        "destructive"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto  px-4 mt-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-green-600 hover:text-green-800 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <h1 className="text-3xl font-bold text-green-800 mb-8">
        {slug ? "Edit Winner" : "Create Winner"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700">
            Winner Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter winner's name"
          />
        </div>

        {/* Award */}
        <div>
          <label
            htmlFor="award"
            className="block text-sm font-medium text-gray-700">
            Award Title
          </label>
          <input
            type="text"
            id="award"
            name="award"
            value={formData.award}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter award title"
          />
        </div>

        {/* Award Category */}
        <div>
          <label
            htmlFor="awardCategory"
            className="block text-sm font-medium text-gray-700">
            Award Category
          </label>
          <select
            id="awardCategory"
            name="awardCategory"
            value={formData.awardCategory}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
            <option value="">Select a category</option>
            {awardCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
            min="2000"
            max={new Date().getFullYear()}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="5"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter winner's description"
          />
        </div>

        {/* Image */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700">
            Winner Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-100 file:text-green-800 file:hover:bg-green-200"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/winners")}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : slug ? (
              "Update Winner"
            ) : (
              "Create Winner"
            )}
          </button>
        </div>
      </form>

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
    </div>
  );
};

export default CreateEditWinnerPage;
