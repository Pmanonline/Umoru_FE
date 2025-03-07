import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronRight, ChevronLeft, Check, Save, Menu, X } from "lucide-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useDispatch, useSelector } from "react-redux";
import statesAndLGAs from "../../assets/json/statesAndLGAs.json";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import backendURL from "../../config";
import { useParams } from "react-router-dom";
import CategoryFetcher from "../../components/tools/CategoryFetcher";
import LoadingSpinner2 from "../../components/tools/loadingSpinner2";

const BACKEND_URL = backendURL;

const ProgressRing = ({ progress, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center group">
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke="#3b82f6"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
          {Math.round(progress)}%
        </span>
        <span className="text-xs text-gray-500">Complete</span>
      </div>
    </div>
  );
};

const LoadingSpinner = () => <LoadingSpinner2 />;

// Updated Business Info Section with dynamic categories and safe handling
const BusinessInfo = ({ formik, categories = [] }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-gray-800">
      Business Information
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        {
          name: "business_name",
          label: "Business Name",
          required: true,
          placeholder: "e.g., John's Agricultural Services",
        },
        {
          name: "business_line",
          label: "Business Type",
          required: true,
          placeholder: "e.g., Crops and Harvesting",
        },
        {
          name: "category_slug",
          label: "Business Category",
          required: true,
          type: "select",
          options:
            categories.length > 0
              ? ["", ...categories.map((cat) => cat.slug)]
              : ["", "Loading..."],
          optionLabels:
            categories.length > 0
              ? ["Select Category", ...categories.map((cat) => cat.name)]
              : ["Select Category", "Loading..."],
        },
        {
          name: "date_of_establishment",
          label: "Date Established",
          type: "date",
          required: true,
          placeholder: "YYYY-MM-DD",
        },
        {
          name: "number_of_staff",
          label: "Number of Staff",
          type: "number",
          min: 0,
          required: true,
          placeholder: "e.g., 10",
        },
        {
          name: "property_status",
          label: "Property Status",
          type: "select",
          options: ["", "rented", "owned"],
          optionLabels: ["Select Status", "Rented", "Owned"],
          required: true,
        },
        {
          name: "business_reg_number",
          label: "Registration Number",
          required: true,
          placeholder: "e.g., BR123456",
        },
      ].map((field) => (
        <div key={field.name} className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "select" ? (
            <select
              name={field.name}
              value={formik.values[field.name] || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched[field.name] && formik.errors[field.name] ? "border-red-400" : "border-gray-200"}`}>
              {field.options.map((option, idx) => (
                <option key={option} value={option}>
                  {field.optionLabels[idx]}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || "text"}
              name={field.name}
              value={formik.values[field.name] || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={field.min}
              placeholder={field.placeholder}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched[field.name] && formik.errors[field.name] ? "border-red-400" : "border-gray-200"}`}
              required={field.required}
            />
          )}
          {formik.touched[field.name] && formik.errors[field.name] && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors[field.name]}
            </p>
          )}
        </div>
      ))}
    </div>
  </section>
);

// Contact Details Section (unchanged)
const ContactDetails = ({ formik }) => {
  const states = statesAndLGAs.statesAndLGAs.map((state) => ({
    id: state.id,
    name: state.name,
  }));
  const selectedState = statesAndLGAs.statesAndLGAs.find(
    (state) => state.name === formik.values.state
  );
  const lgas = selectedState ? selectedState.local_governments : [];

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Contact Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Business Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="business_address"
            value={formik.values.business_address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched.business_address && formik.errors.business_address ? "border-red-400" : "border-gray-200"}`}
            rows="3"
            required
          />
          {formik.touched.business_address &&
            formik.errors.business_address && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.business_address}
              </p>
            )}
        </div>
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            value={formik.values.state}
            onChange={(e) => {
              formik.handleChange(e);
              formik.setFieldValue("city", "");
            }}
            onBlur={formik.handleBlur}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched.state && formik.errors.state ? "border-red-400" : "border-gray-200"}`}>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {formik.touched.state && formik.errors.state && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.state}</p>
          )}
        </div>
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            City (LGA) <span className="text-red-500">*</span>
          </label>
          <select
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched.city && formik.errors.city ? "border-red-400" : "border-gray-200"}`}
            disabled={!formik.values.state}>
            <option value="">Select City</option>
            {lgas.map((lga) => (
              <option key={lga.id} value={lga.name}>
                {lga.name}
              </option>
            ))}
          </select>
          {formik.touched.city && formik.errors.city && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.city}</p>
          )}
        </div>
        {[
          { name: "business_email", label: "Business Email", type: "email" },
          { name: "business_website", label: "Website", type: "url" },
          { name: "contact_person", label: "Contact Person" },
          {
            name: "contact_person_number",
            label: "Contact Phone",
            type: "tel",
          },
          {
            name: "contact_person_email",
            label: "Contact Email",
            type: "email",
          },
        ].map((field) => (
          <div key={field.name} className="group">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

const AdditionalDetails = ({ formik }) => {
  const addStaff = () => {
    const newStaff = [
      ...(formik.values.staff || []),
      { name: "", role: "", position: "" },
    ];
    formik.setFieldValue("staff", newStaff);
  };

  const removeStaff = (index) => {
    const updatedStaff = formik.values.staff.filter((_, i) => i !== index);
    formik.setFieldValue("staff", updatedStaff);
  };

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">
        Additional Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          {
            name: "nearest_bus_stop",
            label: "Nearest Bus Stop",
            placeholder: "e.g., Downtown Stop",
          },
          {
            name: "landmark",
            label: "Landmark",
            placeholder: "e.g., Near Park",
          },
          {
            name: "tin_number",
            label: "Tax ID Number",
            placeholder: "e.g., TIN123456789",
          },
          {
            name: "tax_reg_no",
            label: "Tax Registration Number",
            placeholder: "e.g., TAX123456",
          },
          {
            name: "services_rendered",
            label: "Services Offered",
            placeholder: "e.g., Delivery, Supply",
          },
          {
            name: "target_audience",
            label: "Target Audience",
            placeholder: "e.g., Farmers, Suppliers",
          },
          {
            name: "operation_hours",
            label: "Operation Hours",
            placeholder: "e.g., 9 AM - 5 PM",
          },
          {
            name: "expected_daily_income",
            label: "Expected Daily Income ($)",
            type: "number",
            min: 0,
            placeholder: "e.g., 1000",
          },
          {
            name: "social_media.facebook",
            label: "Facebook URL",
            placeholder: "e.g., https://facebook.com/example",
          },
          {
            name: "social_media.twitter",
            label: "Twitter URL",
            placeholder: "e.g., https://twitter.com/example",
          },
        ].map((field) => (
          <div key={field.name} className="group">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={
                field.name.includes("social_media")
                  ? formik.values.social_media[field.name.split(".")[1]] || ""
                  : formik.values[field.name] || ""
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={field.min}
              placeholder={field.placeholder}
              className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            />
          </div>
        ))}
        <div className="md:col-span-2 group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Business Description
          </label>
          <ReactQuill
            theme="snow"
            value={formik.values.business_description}
            onChange={(value) =>
              formik.setFieldValue("business_description", value)
            }
            placeholder="e.g., We provide agricultural services."
            className="bg-white rounded-md border border-gray-200 hover:border-blue-300 transition-all duration-200"
            modules={{
              toolbar: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
            }}
          />
        </div>
        <div className="md:col-span-2">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Staff</h3>
          {Array.isArray(formik.values.staff) &&
          formik.values.staff.length > 0 ? (
            formik.values.staff.map((staffMember, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 items-end">
                <div className="group">
                  <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Name
                  </label>
                  <input
                    type="text"
                    name={`staff[${index}].name`}
                    value={staffMember.name || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., John Doe"
                    className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
                  />
                </div>
                <div className="group">
                  <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Role
                  </label>
                  <input
                    type="text"
                    name={`staff[${index}].role`}
                    value={staffMember.role || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., Manager"
                    className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
                  />
                </div>
                <div className="group">
                  <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Position
                  </label>
                  <input
                    type="text"
                    name={`staff[${index}].position`}
                    value={staffMember.position || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., Lead"
                    className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
                  />
                </div>
                <div className="group">
                  <button
                    type="button"
                    onClick={() => removeStaff(index)}
                    className="w-full p-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200">
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No staff added yet.</p>
          )}
          <button
            type="button"
            onClick={addStaff}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200">
            Add Staff
          </button>
        </div>
      </div>
    </section>
  );
};

const PhotoUpload = ({
  formik,
  businessId,
  slug,
  profile,
  setBusinessId,
  token,
  showAlertMessage,
  onPhotosUpdated,
}) => {
  const [logoFile, setLogoFile] = useState(null);
  const [productFiles, setProductFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({
    logoLoading: false,
    productLoading: false,
    error: null,
    success: null,
  });
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [uploadedProductPhotos, setUploadedProductPhotos] = useState([]);

  // Fetch existing uploaded images when slug is available
  const fetchUploadedImages = useCallback(async () => {
    if (!slug) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/business/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      console.log("Fetched image data:", data);

      // Set logo from businessPhotos
      const logo = data.businessPhotos?.[0]?.photo_path || null;
      setUploadedLogo(logo);

      // Set product photos, parsing photo_paths if it's a string (JSON array)
      const productPhotos =
        data.productPhotos?.[0]?.photo_paths &&
        typeof data.productPhotos[0].photo_paths === "string"
          ? JSON.parse(data.productPhotos[0].photo_paths)
          : data.productPhotos?.[0]?.photo_paths || [];
      setUploadedProductPhotos(productPhotos || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      showAlertMessage(
        "Failed to fetch images: " + error.message,
        "destructive"
      );
    }
  }, [slug, token, showAlertMessage]);

  useEffect(() => {
    fetchUploadedImages();
  }, [fetchUploadedImages]);

  const handleLogoUpload = useCallback(async () => {
    if (!logoFile || !businessId) return;
    const formData = new FormData();
    formData.append("business_id", businessId);
    formData.append("photos", logoFile);

    setUploadStatus((prev) => ({
      ...prev,
      logoLoading: true,
      error: null,
      success: null,
    }));
    try {
      const response = await fetch(`${BACKEND_URL}/api/upload/business/logo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logo upload failed");
      }
      const data = await response.json();
      setUploadStatus((prev) => ({
        ...prev,
        logoLoading: false,
        success: "Logo uploaded successfully!",
      }));
      showAlertMessage("Logo uploaded successfully!", "success");
      const newLogo = data.image_url || URL.createObjectURL(logoFile);
      setUploadedLogo(newLogo);
      setLogoFile(null); // Reset file input
      // Update parent with new logo
      onPhotosUpdated({
        ...profile,
        businessPhotos: [{ photo_path: newLogo }],
      });
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        logoLoading: false,
        error: error.message,
        success: null,
      }));
      showAlertMessage(error.message, "destructive");
    }
  }, [logoFile, businessId, token, showAlertMessage, profile, onPhotosUpdated]);

  const handleProductPhotosUpload = useCallback(async () => {
    if (!productFiles.length || !businessId) return;
    const formData = new FormData();
    formData.append("business_id", businessId);
    productFiles.forEach((file) => formData.append("product_photos[]", file));

    setUploadStatus((prev) => ({
      ...prev,
      productLoading: true,
      error: null,
      success: null,
    }));
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/upload/business/product/images`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Product photos upload failed");
      }
      const data = await response.json();
      setUploadStatus((prev) => ({
        ...prev,
        productLoading: false,
        success: "Product photos uploaded successfully!",
      }));
      showAlertMessage("Product photos uploaded successfully!", "success");
      const newPhotos =
        data.image_urls ||
        productFiles.map((file) => URL.createObjectURL(file));
      setUploadedProductPhotos(newPhotos);
      setProductFiles([]); // Reset file input
      // Update parent with new product photos
      onPhotosUpdated({
        ...profile,
        productPhotos: [{ photo_paths: JSON.stringify(newPhotos) }],
      });
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        productLoading: false,
        error: error.message,
        success: null,
      }));
      showAlertMessage(error.message, "destructive");
    }
  }, [
    productFiles,
    businessId,
    token,
    showAlertMessage,
    profile,
    onPhotosUpdated,
  ]);

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Business Photos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Logo Upload */}
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Business Logo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files[0])}
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            disabled={uploadStatus.logoLoading}
          />
          <button
            type="button"
            onClick={handleLogoUpload}
            disabled={!logoFile || uploadStatus.logoLoading || !businessId}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center min-w-[100px]">
            {uploadStatus.logoLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
                Uploading...
              </>
            ) : profile?.businessPhotos?.length > 0 ? (
              "Update Logo"
            ) : (
              "Upload Logo"
            )}
          </button>
          {(uploadedLogo ||
            (profile?.businessPhotos?.length > 0 &&
              profile.businessPhotos[0].photo_path)) && (
            <div className="mt-2">
              <img
                src={uploadedLogo || profile.businessPhotos[0].photo_path}
                alt="Business Logo"
                loading="lazy"
                className="w-24 h-24 object-cover rounded-md border border-gray-200"
                onError={(e) => (e.target.src = defaultBusinessLogo)} // Fallback if image fails
              />
            </div>
          )}
        </div>

        {/* Product Photos Upload */}
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Product Photos (max 6)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setProductFiles(Array.from(e.target.files).slice(0, 6))
            }
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            disabled={uploadStatus.productLoading}
          />
          <button
            type="button"
            onClick={handleProductPhotosUpload}
            disabled={
              !productFiles.length || uploadStatus.productLoading || !businessId
            }
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center min-w-[140px]">
            {uploadStatus.productLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
                Uploading...
              </>
            ) : profile?.businessPhotos?.length > 0 ? (
              "Update Product Photos"
            ) : (
              "Upload Product Photos"
            )}
          </button>
          {(uploadedProductPhotos.length > 0 ||
            (profile?.productPhotos?.length > 0 &&
              profile.productPhotos[0].photo_paths)) && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {uploadedProductPhotos.length > 0
                ? uploadedProductPhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Product Photo ${index + 1}`}
                      loading="lazy"
                      className="w-20 h-20 object-cover rounded-md border border-gray-200"
                      onError={(e) => (e.target.src = defaultBusinessLogo)} // Fallback if image fails
                    />
                  ))
                : profile.productPhotos[0].photo_paths &&
                    typeof profile.productPhotos[0].photo_paths === "string"
                  ? JSON.parse(profile.productPhotos[0].photo_paths).map(
                      (photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Product Photo ${index + 1}`}
                          loading="lazy"
                          className="w-20 h-20 object-cover rounded-md border border-gray-200"
                          onError={(e) => (e.target.src = defaultBusinessLogo)} // Fallback if image fails
                        />
                      )
                    )
                  : profile.productPhotos[0].photo_paths?.map(
                      (photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Product Photo ${index + 1}`}
                          loading="lazy"
                          className="w-20 h-20 object-cover rounded-md border border-gray-200"
                          onError={(e) => (e.target.src = defaultBusinessLogo)} // Fallback if image fails
                        />
                      )
                    )}
            </div>
          )}
        </div>
      </div>

      {/* Alert for businessId requirement */}
      {!businessId && (
        <p className="text-xs text-red-500">
          Please save the form first to upload photos.
        </p>
      )}
    </section>
  );
};

// Review & Submit Section (updated to safely handle staff)
const ReviewSubmit = ({ formik, businessId }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-gray-800">Review & Submit</h2>
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-base font-semibold text-gray-700 mb-3">
        Your Business Profile Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">
            Business Information
          </h4>
          <p>Name: {formik.values.business_name || "Not provided"}</p>
          <p>Type: {formik.values.business_line || "Not provided"}</p>
          <p>Category: {formik.values.category_slug || "Not provided"}</p>
          <p>
            Established: {formik.values.date_of_establishment || "Not provided"}
          </p>
          <p>Staff: {formik.values.number_of_staff || "0"}</p>
          <p>Property: {formik.values.property_status || "Not provided"}</p>
          <p>Reg No: {formik.values.business_reg_number || "Not provided"}</p>
        </div>
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">Contact Details</h4>
          <p>Address: {formik.values.business_address || "Not provided"}</p>
          <p>
            Location: {formik.values.city || "Not provided"},{" "}
            {formik.values.state || "Not provided"}
          </p>
          <p>Email: {formik.values.business_email || "Not provided"}</p>
          <p>Website: {formik.values.business_website || "Not provided"}</p>
          <p>Contact: {formik.values.contact_person || "Not provided"}</p>
          <p>Phone: {formik.values.contact_person_number || "Not provided"}</p>
          <p>
            Contact Email:{" "}
            {formik.values.contact_person_email || "Not provided"}
          </p>
        </div>
        <div className="md:col-span-2 mt-4">
          <h4 className="font-semibold text-blue-600 mb-2">
            Additional Details
          </h4>
          <p>Bus Stop: {formik.values.nearest_bus_stop || "Not provided"}</p>
          <p>Landmark: {formik.values.landmark || "Not provided"}</p>
          <p>TIN: {formik.values.tin_number || "Not provided"}</p>
          <p>Tax Reg: {formik.values.tax_reg_no || "Not provided"}</p>
          <p>Services: {formik.values.services_rendered || "Not provided"}</p>
          <p>Audience: {formik.values.target_audience || "Not provided"}</p>
          <p>Hours: {formik.values.operation_hours || "Not provided"}</p>
          <p>
            Expected Daily Income: ${formik.values.expected_daily_income || "0"}
          </p>
          <p>
            Facebook: {formik.values.social_media.facebook || "Not provided"}
          </p>
          <p>Twitter: {formik.values.social_media.twitter || "Not provided"}</p>
          <div>
            <span>Description:</span>
            <div
              className="mt-1 text-gray-600 ql-editor"
              dangerouslySetInnerHTML={{
                __html: formik.values.business_description || "Not provided",
              }}
            />
          </div>
          <div>
            <span>Staff:</span>
            {Array.isArray(formik.values.staff) &&
            formik.values.staff.length > 0 ? (
              formik.values.staff.map((s, i) => (
                <p key={i}>
                  {s.name} - {s.role} ({s.position})
                </p>
              ))
            ) : (
              <p>Not provided</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BusinessProfile = () => {
  const dispatch = useDispatch();
  const { userInfo, token } = useSelector((state) => state.auth);
  const { slug } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [businessId, setBusinessId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null,
    success: null,
    isDraft: false,
  });
  const [completionData, setCompletionData] = useState({
    business: 0,
    contact: 0,
    additional: 0,
    photos: 0,
    overall: 0,
  });

  const validationSchema = Yup.object({
    business_name: Yup.string().required("Business name is required"),
    business_line: Yup.string().required("Business type is required"),
    category_slug: Yup.string().required("Category is required"),
    date_of_establishment: Yup.date().required(
      "Establishment date is required"
    ),
    number_of_staff: Yup.number()
      .min(0)
      .required("Number of staff is required"),
    property_status: Yup.string().required("Property status is required"),
    business_reg_number: Yup.string().required(
      "Registration number is required"
    ),
    business_address: Yup.string().required("Business address is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
  });

  const initialFetchDone = useRef(false);
  const formik = useFormik({
    initialValues: {
      business_name: "",
      business_line: "",
      category_slug: "",
      date_of_establishment: "",
      number_of_staff: "",
      property_status: "",
      business_reg_number: "",
      expected_daily_income: "",
      business_email: "",
      business_website: "",
      business_address: "",
      state: "",
      city: "",
      contact_person: "",
      contact_person_number: "",
      contact_person_email: "",
      nearest_bus_stop: "",
      landmark: "",
      tin_number: "",
      tax_reg_no: "",
      services_rendered: "",
      target_audience: "",
      operation_hours: "",
      business_description: "",
      social_media: { facebook: "", twitter: "" },
      staff: [],
    },
    validationSchema,
    onSubmit: async (values) => await handleSubmit(values),
  });

  const handlePhotosUpdated = useCallback((updatedProfile) => {
    setProfile(updatedProfile); // Update profile with new photos
  }, []);

  const steps = [
    {
      id: 1,
      title: "Business Info",
      component: (props) => <BusinessInfo {...props} categories={categories} />,
      weight: 30,
    },
    { id: 2, title: "Contact Details", component: ContactDetails, weight: 30 },
    {
      id: 3,
      title: "Additional Details",
      component: AdditionalDetails,
      weight: 20,
    },
    {
      id: 4,
      title: "Photos",
      component: (props) => (
        <PhotoUpload
          {...props}
          businessId={businessId}
          slug={slug}
          profile={profile}
          setBusinessId={setBusinessId}
          token={token.token}
          showAlertMessage={showAlertMessage}
          onPhotosUpdated={handlePhotosUpdated}
        />
      ),
      weight: 10,
    },
    {
      id: 5,
      title: "Review & Submit",
      component: (props) => <ReviewSubmit {...props} businessId={businessId} />,
      weight: 10,
    },
  ];

  const calculateCompletionStatus = useCallback(() => {
    const businessFields = [
      "business_name",
      "business_line",
      "category_slug",
      "date_of_establishment",
      "number_of_staff",
      "property_status",
      "business_reg_number",
    ];
    const businessComplete = businessFields.filter(
      (field) => formik.values[field]
    ).length;
    const businessPercentage = Math.min(
      100,
      Math.round((businessComplete / businessFields.length) * 100)
    );

    const contactFields = ["business_address", "state", "city"];
    const contactComplete = contactFields.filter(
      (field) => formik.values[field]
    ).length;
    const contactPercentage = Math.min(
      100,
      Math.round((contactComplete / contactFields.length) * 100)
    );

    const additionalFields = [
      "services_rendered",
      "target_audience",
      "business_description",
    ];
    const additionalComplete = additionalFields.filter(
      (field) => formik.values[field]
    ).length;
    const additionalPercentage = Math.min(
      100,
      Math.round((additionalComplete / additionalFields.length) * 100)
    );

    // Check for photo existence: use profile.businessPhotos and profile.productPhotos
    const hasPhotos =
      (profile?.businessPhotos?.length > 0 ||
        profile?.productPhotos?.length > 0) &&
      currentStep >= 4;

    const photosPercentage = hasPhotos ? 100 : 0;

    const totalWeight = 100; // Sum of weights (30 + 30 + 20 + 20 = 100)
    const overallPercentage = Math.round(
      (businessPercentage * 30 +
        contactPercentage * 30 +
        additionalPercentage * 20 +
        photosPercentage * 20) /
        totalWeight
    );

    setCompletionData({
      business: businessPercentage,
      contact: contactPercentage,
      additional: additionalPercentage,
      photos: photosPercentage,
      overall: overallPercentage,
    });
  }, [formik.values, currentStep, profile, businessId]);

  const fetchBusinessProfile = useCallback(async () => {
    if (!slug) return;
    try {
      setFormStatus((prev) => ({ ...prev, loading: true, error: null }));
      const response = await fetch(`${BACKEND_URL}/api/business/${slug}`, {
        headers: { Authorization: `Bearer ${token.token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch business profile"
        );
      }
      const data = await response.json();
      if (data.business) {
        const businessData = {
          ...data.business,
          staff: data.business.staff
            ? typeof data.business.staff === "string"
              ? JSON.parse(data.business.staff)
              : Array.isArray(data.business.staff)
                ? data.business.staff
                : []
            : [],
          social_media: data.business.social_media
            ? typeof data.business.social_media === "string"
              ? JSON.parse(data.business.social_media)
              : data.business.social_media
            : { facebook: "", twitter: "" },
          businessPhotos: data.businessPhotos || [],
          productPhotos: data.productPhotos || [],
        };
        setProfile(businessData);
        formik.setValues({ ...formik.initialValues, ...businessData });
        setBusinessId(data.business.id);
      }
    } catch (error) {
      showAlertMessage(error.message, "destructive");
    } finally {
      setFormStatus((prev) => ({ ...prev, loading: false }));
    }
  }, [token.token, showAlertMessage, slug]);

  useEffect(() => {
    const fetchData = async () => {
      if (!initialFetchDone.current && slug) {
        await fetchBusinessProfile();
        initialFetchDone.current = true;
      }
    };
    fetchData();
  }, [fetchBusinessProfile, slug]);

  useEffect(() => {
    calculateCompletionStatus();
  }, [formik.values, currentStep, calculateCompletionStatus, businessId]);

  const handleApiCall = useCallback(
    async (url, method, data, isDraft = false) => {
      try {
        setFormStatus((prev) => ({
          ...prev,
          loading: true,
          error: null,
          success: null,
          isDraft,
        }));
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify({ ...data, is_draft: isDraft }), // Changed isDraft to is_draft for consistency
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Request failed");
        }
        const result = await response.json();
        const successMessage = isDraft
          ? "Draft saved successfully"
          : method === "POST"
            ? "Business profile created successfully!"
            : "Business profile updated successfully!";
        showAlertMessage(successMessage, "success");
        setFormStatus((prev) => ({
          ...prev,
          loading: false,
          success: true,
          isDraft,
        }));
        return result;
      } catch (error) {
        showAlertMessage(error.message, "destructive");
        setFormStatus((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
          success: null,
          isDraft,
        }));
        throw error;
      }
    },
    [token.token, showAlertMessage]
  );

  const handleSubmit = useCallback(
    async (values) => {
      try {
        let result;
        if (slug) {
          result = await handleApiCall(
            `${BACKEND_URL}/api/business/edit/${slug}`,
            "PUT",
            values,
            false
          );
        } else {
          result = await handleApiCall(
            `${BACKEND_URL}/api/create/business/profile`,
            "POST",
            values,
            false
          );
          setBusinessId(result.data.id);
        }
        setCurrentStep(steps.length + 1);
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
    [handleApiCall, slug]
  );

  const saveDraft = useCallback(async () => {
    try {
      if (slug) {
        await handleApiCall(
          `${BACKEND_URL}/api/business/edit/${slug}`,
          "PUT",
          formik.values,
          true
        );
      } else {
        const result = await handleApiCall(
          `${BACKEND_URL}/api/create/business/profile`,
          "POST",
          formik.values,
          true
        );
        setBusinessId(result.data.id);
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, [formik.values, handleApiCall, slug]);

  const handleNext = useCallback(() => {
    formik.validateForm().then((errors) => {
      const stepFields = {
        1: [
          "business_name",
          "business_line",
          "category_slug",
          "date_of_establishment",
          "number_of_staff",
          "property_status",
          "business_reg_number",
        ],
        2: ["business_address", "state", "city"],
        3: [],
        4: [],
        5: [],
      };
      const relevantErrors = Object.keys(errors).filter((key) =>
        stepFields[currentStep].includes(key)
      );
      if (relevantErrors.length === 0) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      } else {
        formik.setTouched(
          relevantErrors.reduce((acc, key) => ({ ...acc, [key]: true }), {})
        );
        showAlertMessage(
          "Please fix the errors before proceeding",
          "destructive"
        );
      }
    });
  }, [currentStep, formik, showAlertMessage]);

  return (
    <div className="mid:mt-6">
      <CategoryFetcher onCategoriesLoaded={setCategories} />
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row p-3 md:p-5">
        <aside className="hidden lg:block w-64 bg-white shadow-md rounded-lg p-5 sticky top-5 h-[calc(100vh-2.5rem)]">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Business Setup
          </h2>
          <div className="flex justify-center mb-5">
            <ProgressRing progress={completionData.overall} />
          </div>
          <nav className="space-y-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`w-full flex items-center p-2 rounded-md text-sm transition-all duration-200 ${currentStep === step.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}`}>
                <span
                  className={`w-5 h-5 mr-2 flex items-center justify-center rounded-full text-xs ${currentStep > step.id ? "bg-green-500 text-white" : currentStep === step.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                  {currentStep > step.id ? <Check size={12} /> : step.id}
                </span>
                {step.title}
                <span className="ml-auto text-xs font-medium">
                  {step.id === 1
                    ? `${completionData.business}%`
                    : step.id === 2
                      ? `${completionData.contact}%`
                      : step.id === 3
                        ? `${completionData.additional}%`
                        : step.id === 4
                          ? `${completionData.photos}%`
                          : ""}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <div
          className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md p-5 transition-transform duration-300 z-50 lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">Business Setup</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex justify-center mb-5">
            <ProgressRing progress={completionData.overall} size={90} />
          </div>
          <nav className="space-y-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentStep(step.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center p-2 rounded-md text-sm transition-all duration-200 ${currentStep === step.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}`}>
                <span
                  className={`w-5 h-5 mr-2 flex items-center justify-center rounded-full text-xs ${currentStep > step.id ? "bg-green-500 text-white" : currentStep === step.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                  {currentStep > step.id ? <Check size={12} /> : step.id}
                </span>
                {step.title}
                <span className="ml-auto text-xs font-medium">
                  {step.id === 1
                    ? `${completionData.business}%`
                    : step.id === 2
                      ? `${completionData.contact}%`
                      : step.id === 3
                        ? `${completionData.additional}%`
                        : step.id === 4
                          ? `${completionData.photos}%`
                          : ""}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 bg-white shadow-md rounded-lg p-2 md:p-2 lg:ml-5 mt-4 lg:mt-0">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-xl font-bold text-gray-800">
              {currentStep <= steps.length
                ? `Step ${currentStep}: ${steps[currentStep - 1].title}`
                : "Business Profile Complete"}
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Menu size={18} />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {formStatus.loading ? (
              <LoadingSpinner />
            ) : currentStep <= steps.length ? (
              steps[currentStep - 1].component({ formik, categories })
            ) : (
              <div className="text-center space-y-5 py-12 bg-gray-50 rounded-lg border border-green shadow-sm max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-5 ring-2 ring-green">
                  <Check className="text-green" size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-lg font-bold text-green-600">
                  Business Profile Submitted Successfully
                </h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your business profile is now complete! View it or manage it
                  from your dashboard.
                </p>
                <button
                  type="button"
                  className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  onClick={() => (window.location.href = `/user/Allbusiness`)}>
                  Dismiss
                </button>
              </div>
            )}

            {currentStep <= steps.length &&
              currentStep !== 4 &&
              !formStatus.loading && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-center">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors duration-200">
                      <ChevronLeft size={18} className="mr-1" /> Previous
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={saveDraft}
                      disabled={formStatus.loading}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50">
                      <Save size={18} className="inline mr-1" /> Save Draft
                    </button>
                    <button
                      type={currentStep === steps.length ? "submit" : "button"}
                      onClick={
                        currentStep === steps.length ? undefined : handleNext
                      }
                      disabled={formStatus.loading}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50">
                      {currentStep === steps.length ? "Submit" : "Next"}{" "}
                      <ChevronRight size={18} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              )}
          </form>
        </main>

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
      </div>
    </div>
  );
};

export default BusinessProfile;
