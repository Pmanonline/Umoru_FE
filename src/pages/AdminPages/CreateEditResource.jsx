import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgress } from "@mui/material";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { IoArrowBack } from "react-icons/io5";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const CreateEditResource = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const resourceFileInputRef = useRef(null);
  const thumbnailFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    format: "PDF",
    size: "",
    duration: "",
    author: [],
    description: "",
    tags: "",
  });
  const [resourceFile, setResourceFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const showAlertMessage = useCallback((message, variant) => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const categories = useMemo(
    () => [
      { value: "Spirituality", label: "Spirituality" },
      { value: "Health & Wellness", label: "Health & Wellness" },
      { value: "Education", label: "Education" },
      { value: "Finance", label: "Finance" },
      { value: "Arts & Creativity", label: "Arts & Creativity" },
    ],
    []
  );

  const formats = useMemo(
    () => [
      { value: "PDF", label: "PDF" },
      { value: "MP3", label: "MP3" },
      { value: "MP4", label: "MP4" },
      { value: "EPUB", label: "EPUB" },
    ],
    []
  );

  // Fetch available authors
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch(`${backendURL}/api/getAllAuthors`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setAuthors(data);
        } else {
          throw new Error(data.message || "Failed to fetch authors");
        }
      } catch (error) {
        showAlertMessage("Failed to fetch authors", "error");
      }
    };
    fetchAuthors();
  }, [showAlertMessage]);

  // Fetch resource for editing
  useEffect(() => {
    const fetchResource = async () => {
      if (resourceId) {
        try {
          setLoading(true);
          const res = await fetch(`${backendURL}/api/resources/${resourceId}`);
          const resource = await res.json();
          if (resource.success) {
            setFormData({
              title: resource.data.title || "",
              category: resource.data.category || "",
              format: resource.data.format || "PDF",
              size: resource.data.size || "",
              duration: resource.data.duration || "",
              author: resource.data.author || [],
              description: resource.data.description || "",
              tags: resource.data.tags?.join(",") || "",
            });
            setThumbnailPreview(resource.data.thumbnail || null);
          } else {
            throw new Error(resource.message || "Failed to fetch resource");
          }
        } catch (error) {
          showAlertMessage("Failed to fetch resource", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchResource();
  }, [resourceId, showAlertMessage]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleAuthorChange = useCallback((e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      author: typeof value === "string" ? value.split(",") : value,
    }));
  }, []);

  const handleQuillChange = useCallback((value) => {
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  }, []);

  const handleResourceFileChange = useCallback((e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setResourceFile(file);
    }
  }, []);

  const handleThumbnailFileChange = useCallback((e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.category ||
      !formData.format ||
      !formData.size ||
      formData.author.length === 0 ||
      !formData.description ||
      (!resourceId && !resourceFile)
    ) {
      const missingFields = [];
      if (!formData.title) missingFields.push("Title");
      if (!formData.category) missingFields.push("Category");
      if (!formData.format) missingFields.push("Format");
      if (!formData.size) missingFields.push("Size");
      if (formData.author.length === 0) missingFields.push("Author");
      if (!formData.description) missingFields.push("Description");
      if (!resourceId && !resourceFile) missingFields.push("Resource file");
      showAlertMessage(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const resourceFormData = new FormData();
      resourceFormData.append("title", formData.title);
      resourceFormData.append("category", formData.category);
      resourceFormData.append("format", formData.format);
      resourceFormData.append("size", formData.size);
      resourceFormData.append("duration", formData.duration);
      resourceFormData.append("author", JSON.stringify(formData.author));
      resourceFormData.append("description", formData.description);
      resourceFormData.append("tags", formData.tags);

      if (resourceFile) {
        resourceFormData.append("resource", resourceFile);
      }
      if (thumbnailFile) {
        resourceFormData.append("thumbnail", thumbnailFile);
      }

      const url = resourceId
        ? `${backendURL}/api/resources/${resourceId}`
        : `${backendURL}/api/resources`;
      const method = resourceId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: resourceFormData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.details
            ? `Validation failed: ${Object.values(data.details)
                .filter(Boolean)
                .join(", ")}`
            : data.message || "Failed to save resource"
        );
      }

      showAlertMessage(
        resourceId
          ? "Resource updated successfully"
          : "Resource created successfully",
        "success"
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/Admin/ResourceList");
    } catch (error) {
      showAlertMessage(error.message || "Failed to save resource", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="p-3 max-w-3xl mx-auto min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200">
          <IoArrowBack className="mr-2" size={24} />
          Back
        </button>

        <h1 className="text-center text-3xl my-7 font-semibold">
          {resourceId ? "Edit Resource" : "Create a Resource"}
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            required
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
          />

          <FormControl fullWidth required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              label="Category">
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel id="format-label">Format</InputLabel>
            <Select
              labelId="format-label"
              id="format"
              name="format"
              value={formData.format}
              onChange={handleInputChange}
              label="Format">
              {formats.map((fmt) => (
                <MenuItem key={fmt.value} value={fmt.value}>
                  {fmt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Size"
            required
            id="size"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            fullWidth
            placeholder="e.g., 2.3 MB"
          />

          <TextField
            label="Duration"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            fullWidth
            placeholder="e.g., 45 min read"
          />

          <FormControl fullWidth required>
            <InputLabel id="author-label">Authors</InputLabel>
            <Select
              labelId="author-label"
              id="author"
              name="author"
              multiple
              value={formData.author}
              onChange={handleAuthorChange}
              input={
                <OutlinedInput id="select-multiple-chip" label="Authors" />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const author = authors.find((a) => a._id === value);
                    return author ? (
                      <Chip key={value} label={author.name} />
                    ) : null;
                  })}
                </Box>
              )}>
              {authors.map((author) => (
                <MenuItem key={author._id} value={author._id}>
                  {author.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Tags (comma-separated)"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            fullWidth
            placeholder="e.g., meditation, wellness"
          />

          <Box className="flex flex-col gap-4">
            <Box className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
              <input
                type="file"
                accept="application/pdf,audio/mpeg,video/mp4,application/epub+zip"
                onChange={handleResourceFileChange}
                ref={resourceFileInputRef}
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                onClick={() => resourceFileInputRef.current.click()}
                color="primary">
                Choose Resource File
              </Button>
              {resourceFile && <span>{resourceFile.name}</span>}
            </Box>

            <Box className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                ref={thumbnailFileInputRef}
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                onClick={() => thumbnailFileInputRef.current.click()}
                color="primary">
                Choose Thumbnail
              </Button>
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="thumbnail preview"
                  className="w-[15rem] h-[10rem] object-cover"
                />
              )}
            </Box>
          </Box>

          <ReactQuill
            theme="snow"
            placeholder="Write resource description..."
            className="h-72 mb-12"
            value={formData.description}
            onChange={handleQuillChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#14532d" },
            }}>
            {loading ? (
              <CircularProgress size={24} />
            ) : resourceId ? (
              "Update Resource"
            ) : (
              "Create Resource"
            )}
          </Button>
        </form>

        {showAlert && (
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseTime={5000}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
            {alertConfig.variant === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
            )}
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default CreateEditResource;
