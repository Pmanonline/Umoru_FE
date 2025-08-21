import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  ArrowLeft,
  Clock,
  Tag,
  Star,
  Upload,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const StyledImagePreview = ({ imagePreview, onRemove }) => (
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

export default function CreatePosts() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "uncategorized",
    content: "",
    authorId: "",
    readTime: "5 min read",
    tags: "",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const fetchAuthors = async () => {
    try {
      const res = await fetch(`${backendURL}/api/getAllAuthors`);
      if (!res.ok) throw new Error("Failed to fetch authors");
      const data = await res.json();
      return data.map((author) => ({
        id: author._id,
        name: author.name,
      }));
    } catch (error) {
      throw new Error(`Error fetching authors: ${error.message}`);
    }
  };

  const fetchPost = async (id) => {
    try {
      const res = await fetch(`${backendURL}/api/getPostById/${id}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      return await res.json();
    } catch (error) {
      throw new Error(`Error fetching post: ${error.message}`);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setPageLoading(true);
      try {
        const fetchedAuthors = await fetchAuthors();
        setAuthors(fetchedAuthors);

        if (postId) {
          const post = await fetchPost(postId);
          setFormData({
            title: post.title || "",
            category: post.category || "uncategorized",
            content: post.content || "",
            authorId: post.authorId || "",
            readTime: post.readTime || "5 min read",
            tags: post.tags?.join(", ") || "",
            featured: post.featured || false,
          });
          setImagePreview(post.image || null);
        }
      } catch (error) {
        setAlertConfig({ variant: "error", message: error.message });
        setShowAlert(true);
      } finally {
        setPageLoading(false);
      }
    };
    initializeData();
  }, [postId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: tags.join(", ") }));
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

      if (file.size > 5 * 1024 * 1024) {
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.authorId.trim()
    ) {
      setAlertConfig({
        variant: "error",
        message: "Title, content, and author are required",
      });
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const postFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags" && Array.isArray(value)) {
          postFormData.append(key, value.join(","));
        } else if (value) {
          postFormData.append(key, value);
        }
      });
      if (selectedFile) {
        postFormData.append("image", selectedFile);
      }

      const url = postId
        ? `${backendURL}/api/updatePost/${postId}`
        : `${backendURL}/api/createPost`;
      const response = await fetch(url, {
        method: postId ? "PUT" : "POST",
        body: postFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save post");
      }

      const result = await response.json();
      setAlertConfig({
        variant: "success",
        message: postId
          ? "Post updated successfully"
          : "Post created successfully",
      });
      setShowAlert(true);
      setTimeout(() => navigate("/Admin/BlogPosts"), 1500);
    } catch (error) {
      console.error("Submission error:", error);
      setAlertConfig({
        variant: "error",
        message: error.message || "Failed to save post",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2
          className="animate-spin text-teal-500 dark:text-teal-400"
          size={48}
        />
      </div>
    );
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 mb-4">
        <ArrowLeft className="mr-2" size={24} />
        Back
      </button>
      <h1 className="text-center text-3xl my-7 font-semibold">
        {postId ? "Edit Post" : "Create a Post"}
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          required>
          <option value="uncategorized">Select a category</option>
          <option value="Web3-&-Blockchain-Education">
            Web3 & Blockchain Education
          </option>
          <option value="Web3 & Blockchain Trends">
            Web3 & Blockchain Trends
          </option>
          <option value="Big Data & A.I Trends">Big Data & A.I Trends</option>
          <option value="Big Data & A.I Education">
            Big Data & A.I Education
          </option>
          <option value="Data in Web3/DeFi">Data in Web3/DeFi</option>
        </select>
        <select
          name="authorId"
          value={formData.authorId}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          required>
          <option value="">Select an author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="readTime"
          value={formData.readTime}
          onChange={handleInputChange}
          placeholder="Read Time (e.g., 5 min read)"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          required
        />
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleTagsChange}
          placeholder="Tags (comma-separated, e.g., tech, web3)"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          required
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="mr-2 accent-teal-500 dark:accent-teal-400"
          />
          <label htmlFor="featured" className="flex items-center">
            <Star
              size={20}
              className="text-yellow-500 dark:text-yellow-400 mr-2"
            />
            Featured
          </label>
        </div>
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
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={formData.content}
          onChange={handleQuillChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 dark:bg-teal-400 text-white rounded hover:bg-teal-600 dark:hover:bg-teal-300 transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600">
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : postId ? (
            "Update Post"
          ) : (
            "Publish Post"
          )}
        </button>
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
