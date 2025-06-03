// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Alert, AlertDescription } from "../../components/tools/Alert";

// const backendURL =
//   import.meta.env.MODE === "production"
//     ? import.meta.env.VITE_BACKEND_URL
//     : "http://localhost:3001";

// const CreateRecommendedPerson = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     title: "",
//     award: "",
//     category: "",
//     description: "",
//     fullDescription: "",
//     year: "",
//     timeframe: "Daily",
//     videoLink: "",
//     videoDuration: "",
//     profileLink: "",
//   });
//   const [image, setImage] = useState(null);
//   const [additionalImages, setAdditionalImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });

//   const categories = [
//     "Politics",
//     "Music",
//     "Business",
//     "Humanitarian",
//     "Innovation",
//     "Youth Development",
//     "Environmental",
//   ];

//   const showAlertMessage = (message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//   };

//   // Fetch existing person for editing
//   useEffect(() => {
//     if (slug) {
//       setIsLoading(true);
//       fetch(`${backendURL}/api/getRecommendedPersonBySlug/${slug}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setFormData({
//             name: data.name,
//             title: data.title,
//             award: data.award,
//             category: data.category,
//             description: data.description,
//             fullDescription: data.fullDescription,
//             year: data.year,
//             timeframe: data.timeframe,
//             videoLink: data.videoLink,
//             videoDuration: data.videoDuration,
//             profileLink: data.profileLink,
//           });
//           setIsLoading(false);
//         })
//         .catch((err) => {
//           showAlertMessage("Failed to fetch person data.", "destructive");
//           setIsLoading(false);
//           console.error(err);
//         });
//     }
//   }, [slug]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       data.append(key, value);
//     });
//     if (image) data.append("image", image);
//     additionalImages.forEach((img) => data.append("additionalImages", img));

//     try {
//       const url = slug
//         ? `${backendURL}/api/updateRecommendedPerson/${slug}`
//         : `${backendURL}/api/createRecommendedPerson`;
//       const method = slug ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         body: data,
//       });
//       const result = await res.json();

//       if (!res.ok) throw new Error(result.error || "Failed to save person");
//       showAlertMessage(
//         slug
//           ? "Recommended person updated successfully"
//           : "Recommended person created successfully",
//         "success"
//       );

//       setTimeout(() => {
//         navigate("/Admin/RecommendedPersonList");
//       }, 1500);
//     } catch (err) {
//       showAlertMessage(err.message || "Failed to save person.", "destructive");
//       console.error("Error saving person:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
//               aria-label="Go back">
//               <ArrowLeft className="w-5 h-5 mr-2" />
//               Back
//             </button>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               {slug ? "Edit" : "Create"} Recommended Person
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/admin/recommended")}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium">
//             Cancel
//           </button>
//         </div>

//         {/* Alert Component */}
//         {showAlert && (
//           <Alert
//             variant={alertConfig.variant}
//             show={showAlert}
//             onClose={() => setShowAlert(false)}
//             autoClose={true}
//             autoCloseTime={5000}>
//             <AlertDescription>{alertConfig.message}</AlertDescription>
//           </Alert>
//         )}

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
//           <div className="space-y-8">
//             {/* Personal Info */}
//             <div className="border-b pb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Personal Information
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                     placeholder="Enter full name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Recommended For <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                     placeholder="Enter title (e.g., CEO)"
//                   />
//                 </div>
//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Award <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="award"
//                     value={formData.award}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                     placeholder="Enter award name"
//                   />
//                 </div> */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
//                     <option value="" disabled>
//                       -- Select Category --
//                     </option>
//                     {categories.map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Year <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="year"
//                     value={formData.year}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                     placeholder="Enter year (e.g., 2024)"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Timeframe <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="timeframe"
//                     value={formData.timeframe}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
//                     {["Daily", "Weekly", "Monthly", "Yearly"].map((tf) => (
//                       <option key={tf} value={tf}>
//                         {tf}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="border-b pb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Description
//               </h2>
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Short Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows="4"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                     placeholder="Enter a brief description"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Description
//                   </label>
//                   <ReactQuill
//                     theme="snow"
//                     value={formData.fullDescription}
//                     onChange={(value) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         fullDescription: value,
//                       }))
//                     }
//                     className="h-64 sm:h-80 mb-12 bg-white rounded-lg border border-gray-300"
//                     placeholder="Write the full description..."
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Media */}
//             <div className="border-b pb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Media
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Video Link (YouTube ID)
//                   </label>
//                   <input
//                     type="text"
//                     name="videoLink"
//                     value={formData.videoLink}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                     placeholder="Enter YouTube video ID"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Video Duration
//                   </label>
//                   <input
//                     type="text"
//                     name="videoDuration"
//                     value={formData.videoDuration}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                     placeholder="Enter duration (e.g., 3:45)"
//                   />
//                 </div>
//                 <div className="col-span-1 sm:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Profile Link
//                   </label>
//                   <input
//                     type="text"
//                     name="profileLink"
//                     value={formData.profileLink}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                     placeholder="Enter profile URL"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Images */}
//             <div className="pb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Images
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Main Image
//                   </label>
//                   <div className="mt-1 flex flex-col gap-2">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => setImage(e.target.files[0])}
//                       className="hidden"
//                       id="image-upload"
//                     />
//                     <label
//                       htmlFor="image-upload"
//                       className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors duration-200">
//                       <Upload className="w-5 h-5 mr-2" />
//                       Upload Main Image
//                     </label>
//                     {image && (
//                       <div className="flex items-center gap-2">
//                         <img
//                           src={URL.createObjectURL(image)}
//                           alt="Main image preview"
//                           className="w-16 h-16 object-cover rounded-lg"
//                         />
//                         <span className="text-sm text-gray-600 truncate max-w-xs">
//                           {image.name}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Additional Images (up to 10)
//                   </label>
//                   <div className="mt-1 flex flex-col gap-2">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={(e) => setAdditionalImages([...e.target.files])}
//                       className="hidden"
//                       id="additional-images-upload"
//                     />
//                     <label
//                       htmlFor="additional-images-upload"
//                       className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors duration-200">
//                       <Upload className="w-5 h-5 mr-2" />
//                       Upload Additional Images
//                     </label>
//                     {additionalImages.length > 0 && (
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {additionalImages.map((img, index) => (
//                           <div key={index} className="relative">
//                             <img
//                               src={URL.createObjectURL(img)}
//                               alt={`Additional image ${index + 1}`}
//                               className="w-16 h-16 object-cover rounded-lg"
//                             />
//                             <button
//                               onClick={() =>
//                                 setAdditionalImages(
//                                   additionalImages.filter((_, i) => i !== index)
//                                 )
//                               }
//                               className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
//                               aria-label="Remove image">
//                               <X className="w-4 h-4" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="mt-8 flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={() => navigate("/admin/recommended")}
//               className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 ${
//                 isLoading ? "opacity-50 cursor-not-allowed" : ""
//               }`}>
//               {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
//               {isLoading
//                 ? "Saving..."
//                 : slug
//                   ? "Update Person"
//                   : "Create Person"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Custom Styles */}
//       <style jsx>{`
//         .animate-fade-in {
//           animation: fadeIn 0.3s ease-in;
//         }
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .ql-container {
//           min-height: 10rem;
//           max-height: 20rem;
//           overflow-y: auto;
//         }
//         @media (max-width: 640px) {
//           .ql-container {
//             max-height: 15rem;
//           }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default CreateRecommendedPerson;
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Alert, AlertDescription } from "../../components/tools/Alert";

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

const CreateRecommendedPerson = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    award: "",
    category: "",
    description: "",
    fullDescription: "",
    year: "",
    country: "", // Added country field
    timeframe: "Daily",
    videoLink: "",
    videoDuration: "",
    profileLink: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
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

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Fetch countries and existing person for editing
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);

      // Fetch countries
      const fetchedCountries = await fetchCountries();
      setCountries(["", ...fetchedCountries]);

      if (slug) {
        try {
          const res = await fetch(
            `${backendURL}/api/getRecommendedPersonBySlug/${slug}`
          );
          if (!res.ok) throw new Error("Failed to fetch person data");
          const data = await res.json();

          setFormData({
            name: data.name || "",
            title: data.title || "",
            award: data.award || "",
            category: data.category || "",
            description: data.description || "",
            fullDescription: data.fullDescription || "",
            year: data.year || "",
            country: data.country || "", // Populate country
            timeframe: data.timeframe || "Daily",
            videoLink: data.videoLink || "",
            videoDuration: data.videoDuration || "",
            profileLink: data.profileLink || "",
          });

          if (data.image) {
            setImagePreview(data.image);
          }
          if (data.additionalImages && data.additionalImages.length > 0) {
            setAdditionalImagesPreviews(data.additionalImages);
          }
        } catch (err) {
          showAlertMessage("Failed to fetch person data.", "destructive");
          console.error(err);
        }
      }
      setIsLoading(false);
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
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
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
    setIsLoading(true);

    // Trim all string fields
    const trimmedData = {
      name: formData.name.trim(),
      title: formData.title.trim(),
      award: formData.award ? formData.award.trim() : "",
      category: formData.category.trim(),
      description: formData.description.trim(),
      fullDescription: formData.fullDescription.trim(),
      year: formData.year.trim(),
      country: formData.country.trim(), // Trim country
      timeframe: formData.timeframe.trim(),
      videoLink: formData.videoLink.trim(),
      videoDuration: formData.videoDuration.trim(),
      profileLink: formData.profileLink.trim(),
    };

    // Validate required fields
    const requiredFields = [
      "name",
      "title",
      "category",
      "year",
      "country",
      "timeframe",
    ];
    const missingFields = requiredFields.filter((field) => !trimmedData[field]);
    if (missingFields.length > 0) {
      showAlertMessage(
        `Please fill in the following required fields: ${missingFields.join(", ")}`,
        "warning"
      );
      setIsLoading(false);
      return;
    }

    // Validate videoLink if provided
    if (
      trimmedData.videoLink &&
      !/^[a-zA-Z0-9_-]{11}$/.test(trimmedData.videoLink)
    ) {
      showAlertMessage("Invalid YouTube video ID", "warning");
      setIsLoading(false);
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
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(trimmedData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) data.append("image", image);
      additionalImages.forEach((img) => data.append("additionalImages", img));

      const url = slug
        ? `${backendURL}/api/updateRecommendedPerson/${slug}`
        : `${backendURL}/api/createRecommendedPerson`;
      const method = slug ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to save person");
      showAlertMessage(
        slug
          ? "Recommended person updated successfully"
          : "Recommended person created successfully",
        "success"
      );

      setTimeout(() => {
        navigate("/Admin/RecommendedPersonList");
      }, 1500);
    } catch (err) {
      showAlertMessage(err.message || "Failed to save person.", "destructive");
      console.error("Error saving person:", err);
    } finally {
      setIsLoading(false);
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
    <section className="min-h-screen bg-accent-cream py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center text-primary hover:text-primary-light transition-colors duration-200"
          aria-label="Go back">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              {slug ? "Edit" : "Create"} Global Ambassador
            </h1>
          </div>
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="space-y-8">
            {/* Personal Info */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recommended For <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Enter title (e.g., CEO)"
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
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200">
                    <option value="" disabled>
                      -- Select Category --
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
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
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200">
                    <option value="" disabled>
                      -- Select Country --
                    </option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Enter year (e.g., 2024)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeframe <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200">
                    {["Daily", "Weekly", "Monthly", "Yearly"].map((tf) => (
                      <option key={tf} value={tf}>
                        {tf}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Description
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Enter a brief description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={formData.fullDescription}
                    onChange={handleQuillChange}
                    className="h-64 sm:h-80 mb-12 bg-white rounded-lg border border-gray-300"
                    placeholder="Write the full description..."
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Media</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Link (YouTube ID)
                  </label>
                  <input
                    type="text"
                    name="videoLink"
                    value={formData.videoLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Enter YouTube video ID"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Enter duration (e.g., 3:45)"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Link
                  </label>
                  <input
                    type="text"
                    name="profileLink"
                    value={formData.profileLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Enter profile URL"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="pb-6">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Images
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Image
                  </label>
                  <div className="mt-1 flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      ref={mainImageInputRef}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-light transition-colors duration-200">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Main Image
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Main image preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Images (up to 10)
                  </label>
                  <div className="mt-1 flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      ref={additionalImagesInputRef}
                      className="hidden"
                      id="additional-images-upload"
                    />
                    <label
                      htmlFor="additional-images-upload"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-light transition-colors duration-200">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Additional Images
                    </label>
                    {additionalImagesPreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {additionalImagesPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Additional image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              aria-label="Remove image">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/recommended")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors duration-200 flex items-center gap-2 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading
                ? "Saving..."
                : slug
                  ? "Update Ambassador"
                  : "Create Ambassador"}
            </button>
          </div>
        </form>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .ql-container {
          min-height: 10rem;
          max-height: 20rem;
          overflow-y: auto;
        }
        @media (max-width: 640px) {
          .ql-container {
            max-height: 15rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CreateRecommendedPerson;
