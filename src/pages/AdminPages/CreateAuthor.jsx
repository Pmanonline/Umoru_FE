import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X, Upload, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const StyledImagePreview = ({ imagePreview, onRemove }) => {
  return (
    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
      <img
        src={imagePreview}
        alt="preview"
        className="w-full h-full object-cover rounded-lg"
      />
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Remove image">
        <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
};

export default function CreateAuthor() {
  const { authorId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    website: "",
    socialMedia: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  useEffect(() => {
    const fetchAuthor = async () => {
      if (authorId) {
        try {
          const res = await fetch(
            `${backendURL}/api/getAuthorById/${authorId}`
          );
          const author = await res.json();
          console.log(author, "Author fetched");

          if (author) {
            setFormData({
              name: author.name,
              email: author.email,
              bio: author.bio,
              website: author.website,
              socialMedia: author.socialMedia,
            });
            setImagePreview(author.image);
          }
        } catch (error) {
          setAlertConfig({
            variant: "error",
            message: "Failed to fetch author",
          });
          setShowAlert(true);
        }
      }
    };
    fetchAuthor();
  }, [authorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        setAlertConfig({
          variant: "error",
          message:
            "You can only upload image files (jpeg, jpg, png, gif, svg)!",
        });
        setShowAlert(true);
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Validate file size (optional, can adjust limit as needed)
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setAlertConfig({
          variant: "error",
          message: "File size should not exceed 5MB",
        });
        setShowAlert(true);
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setAlertConfig({
        variant: "error",
        message: "Name and email are required",
      });
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const authorFormData = new FormData();
      Object.keys(formData).forEach((key) => {
        authorFormData.append(key, formData[key]);
      });

      if (selectedFile) {
        authorFormData.append("image", selectedFile);
      }

      let response;
      if (authorId) {
        response = await fetch(`${backendURL}/api/updateAuthor/${authorId}`, {
          method: "PUT",
          body: authorFormData,
        });
      } else {
        response = await fetch(`${backendURL}/api/createAuthor`, {
          method: "POST",
          body: authorFormData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save author");
      }

      const data = await response.json();
      console.log("Response data:", data);

      setAlertConfig({
        variant: "success",
        message: authorId
          ? "Author updated successfully"
          : "Author created successfully",
      });
      setShowAlert(true);
      setTimeout(() => navigate("/Admin/Authors"), 1500);
    } catch (error) {
      console.error("Error saving author:", error);
      setAlertConfig({
        variant: "error",
        message: error.message || "Failed to save author",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!authorId) return;

    if (window.confirm("Are you sure you want to delete this author?")) {
      setLoading(true);
      try {
        const response = await fetch(
          `${backendURL}/api/deleteAuthor/${authorId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete author");
        }

        setAlertConfig({
          variant: "success",
          message: "Author deleted successfully",
        });
        setShowAlert(true);
        setTimeout(() => navigate("/Admin/Authors"), 1500);
      } catch (error) {
        console.error("Error deleting author:", error);
        setAlertConfig({
          variant: "error",
          message: error.message || "Failed to delete author",
        });
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 mb-4">
        <ArrowLeft className="mr-2" size={24} />
        Back
      </button>
      <h1 className="text-center text-3xl my-7 font-semibold">
        {authorId ? "Edit Author" : "Create an Author"}
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          required
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Bio"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 h-24 resize-y"
        />
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="Website"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
        />
        <input
          type="text"
          name="socialMedia"
          value={formData.socialMedia}
          onChange={handleInputChange}
          placeholder="Social Media"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
        />
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 dark:border-teal-400 border-dotted p-3 bg-white dark:bg-gray-800">
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
            className="flex items-center gap-2 px-4 py-2 border border-teal-500 dark:border-teal-400 text-teal-500 dark:text-teal-400 hover:bg-teal-500/10 dark:hover:bg-teal-400/10 rounded transition-colors duration-200">
            <Upload size={20} />
            Choose File
          </button>
          {imagePreview && (
            <StyledImagePreview
              imagePreview={imagePreview}
              onRemove={handleRemoveImage}
            />
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 dark:bg-teal-400 text-white rounded hover:bg-teal-600 dark:hover:bg-teal-300 transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600">
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : authorId ? (
              "Update Author"
            ) : (
              "Create Author"
            )}
          </button>
          {authorId && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600">
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                "Delete Author"
              )}
            </button>
          )}
        </div>
        {showAlert && (
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseTime={5000}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
