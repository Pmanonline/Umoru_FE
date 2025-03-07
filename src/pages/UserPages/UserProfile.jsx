import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Save,
  Menu,
  X,
  Edit,
} from "lucide-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import FacialVerification from "../../components/tools/FacialVerification";
import { useDispatch, useSelector } from "react-redux";
import statesAndLGAs from "../../assets/json/statesAndLGAs.json";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import backendURL from "../../config";
import LoadingSpinner from "../../components/tools/LoaddingSpinner";

// Progress Ring Component with hover effect
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

// Form Section Components with smaller font and hover effects
const PersonalInfo = ({ formik }) => (
  <section className="space-y-5">
    <h5 className="text-sm text-gray-700">
      Enter accurate information to the best of your knowledge.
    </h5>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        { name: "first_name", label: "First Name", required: true },
        { name: "middle_name", label: "Middle Name" },
        { name: "last_name", label: "Last Name", required: true },
        { name: "date_of_birth", label: "Date of Birth", type: "date" },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: ["", "male", "female", "other"],
          optionLabels: ["Select Gender", "Male", "Female", "Other"],
        },
        {
          name: "marital_status",
          label: "Marital Status",
          type: "select",
          options: ["", "single", "married", "divorced", "widowed"],
          optionLabels: [
            "Select Status",
            "Single",
            "Married",
            "Divorced",
            "Widowed",
          ],
        },
        {
          name: "religion",
          label: "Religion",
          type: "select",
          options: [
            "",
            "christianity",
            "islam",
            "judaism",
            "hinduism",
            "other",
          ],
          optionLabels: [
            "Select Religion",
            "Christianity",
            "Islam",
            "Judaism",
            "Hinduism",
            "Other",
          ],
        },
        {
          name: "number_of_children",
          label: "Number of Children",
          type: "number",
          min: 0,
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
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched[field.name] && formik.errors[field.name]
                  ? "border-red-400"
                  : "border-gray-200"
              }`}>
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
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={field.min}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched[field.name] && formik.errors[field.name]
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
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

// Updated ContactInfo with State and LGA Dropdowns
const ContactInfo = React.memo(
  ({
    formik,
    handleSocialMediaChange,
    addSocialMediaField,
    removeSocialMediaField,
  }) => {
    const states = useMemo(
      () =>
        statesAndLGAs.statesAndLGAs.map((state) => ({
          id: state.id,
          name: state.name,
        })),
      []
    );
    const selectedState = useMemo(
      () =>
        statesAndLGAs.statesAndLGAs.find(
          (state) => state.name === formik.values.state
        ),
      [formik.values.state]
    );
    const lgas = useMemo(
      () => (selectedState ? selectedState.local_governments : []),
      [selectedState]
    );

    const handleStateChange = (e) => {
      formik.handleChange(e);
      formik.setFieldValue("city", ""); // Reset city when state changes
    };

    return (
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="group">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched.phone && formik.errors.phone
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
              required
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.phone}</p>
            )}
          </div>
          <div className="group">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              State <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={formik.values.state}
              onChange={handleStateChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched.state && formik.errors.state
                  ? "border-red-400"
                  : "border-gray-200"
              }`}>
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
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched.city && formik.errors.city
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
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
        </div>
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
              formik.touched.address && formik.errors.address
                ? "border-red-400"
                : "border-gray-200"
            }`}
            rows="3"
            required
          />
          {formik.touched.address && formik.errors.address && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.address}</p>
          )}
        </div>
        <div className="space-y-3">
          <label className="block text-xs font-medium text-gray-600">
            Social Media Links
          </label>
          {formik.values.social_media_links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <input
                type="url"
                value={link}
                onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                onBlur={formik.handleBlur}
                className={`flex-1 p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                  formik.touched.social_media_links?.[index] &&
                  formik.errors.social_media_links?.[index]
                    ? "border-red-400"
                    : "border-gray-200"
                }`}
                placeholder="https://example.com"
              />
              <button
                type="button"
                onClick={() => removeSocialMediaField(index)}
                className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                disabled={formik.values.social_media_links.length <= 1}>
                <X size={14} />
              </button>
            </div>
          ))}
          {formik.errors.social_media_links && (
            <p className="text-xs text-red-500">
              Please enter valid URLs or leave empty
            </p>
          )}
          <button
            type="button"
            onClick={addSocialMediaField}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200">
            Add Social Media
          </button>
        </div>
      </section>
    );
  }
);

const ProfessionalInfo = ({ formik }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-gray-800">
      Professional Details
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        { name: "current_place_of_work", label: "Current Place of Work" },
        { name: "last_place_of_work", label: "Last Place of Work" },
        {
          name: "qualification",
          label: "Qualification",
          type: "select",
          options: [
            "",
            "high_school",
            "undergraduate",
            "postgraduate",
            "other",
          ],
          optionLabels: [
            "Select Qualification",
            "High School",
            "Undergraduate",
            "Postgraduate",
            "Other",
          ],
        },
        {
          name: "profession",
          label: "Profession",
          type: "select",
          options: [
            "",
            "Engineer",
            "Doctor",
            "Teacher",
            "Software Developer",
            "Accountant",
            "Other",
          ],
          optionLabels: [
            "Select Profession",
            "Engineer",
            "Doctor",
            "Teacher",
            "Software Developer",
            "Accountant",
            "Other",
          ],
        },
      ].map((field) => (
        <div key={field.name} className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              name={field.name}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched[field.name] && formik.errors[field.name]
                  ? "border-red-400"
                  : "border-gray-200"
              }`}>
              {field.options.map((option, idx) => (
                <option key={option} value={option}>
                  {field.optionLabels[idx]}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name={field.name}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            />
          )}
          {formik.touched[field.name] && formik.errors[field.name] && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors[field.name]}
            </p>
          )}
        </div>
      ))}
      {/* Custom Profession Input (shown if "Other" is selected) */}
      {formik.values.profession === "Other" && (
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Custom Profession
          </label>
          <input
            type="text"
            name="custom_profession"
            value={formik.values.custom_profession}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            placeholder="Enter your profession"
          />
        </div>
      )}
      {/* Bio with ReactQuill */}
      <div className="md:col-span-2 group">
        <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
          Bio
        </label>
        <ReactQuill
          theme="snow"
          value={formik.values.bio}
          onChange={(value) => formik.setFieldValue("bio", value)}
          placeholder="Tell us about yourself..."
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
    </div>
  </section>
);

const ReviewSubmit = ({ formik }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-gray-800">Review & Submit</h2>
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-base font-semibold text-gray-700 mb-3">
        Your Profile Summary
      </h3>
      <div className="mb-5">
        {/* Display Verification Image */}
        {formik.values.UserImage ? (
          <div className="mt-3">
            <span className="text-sm font-semibold text-blue-600">
              Verification Photo:
            </span>
            <img
              src={formik.values.UserImage}
              alt="User Verification"
              className="mt-2 w-32 h-32 object-cover rounded-md border border-gray-300"
            />
          </div>
        ) : (
          <p className="mt-3">Verification Photo: Not provided</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">
            Personal Information
          </h4>
          <p>
            Full Name:{" "}
            {`${formik.values.first_name} ${formik.values.middle_name} ${formik.values.last_name}`}
          </p>
          <p>Date of Birth: {formik.values.date_of_birth || "Not provided"}</p>
          <p>Gender: {formik.values.gender || "Not provided"}</p>
          <p>
            Marital Status: {formik.values.marital_status || "Not provided"}
          </p>
          <p>Religion: {formik.values.religion || "Not provided"}</p>
          <p>Number of Children: {formik.values.number_of_children || "0"}</p>
        </div>
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">
            Contact Information
          </h4>
          <p>Phone: {formik.values.phone}</p>
          <p>
            Location:{" "}
            {`${formik.values.city || "Not provided"}, ${formik.values.state || "Not provided"}`}
          </p>
          <p>Address: {formik.values.address}</p>
          <div>
            <span>Social Media:</span>
            <ul className="list-disc pl-4 mt-1">
              {formik.values.social_media_links.filter((link) => link).length >
              0 ? (
                formik.values.social_media_links.map((link, index) =>
                  link ? (
                    <li
                      key={index}
                      className="hover:text-blue-500 transition-colors">
                      {link}
                    </li>
                  ) : null
                )
              ) : (
                <li>No links provided</li>
              )}
            </ul>
          </div>
        </div>
        <div className="md:col-span-2 mt-4">
          <h4 className="font-semibold text-blue-600 mb-2">
            Professional Details
          </h4>
          <p>
            Profession:{" "}
            {formik.values.profession === "Other"
              ? formik.values.custom_profession || "Not provided"
              : formik.values.profession || "Not provided"}
          </p>
          <p>
            Current Workplace:{" "}
            {formik.values.current_place_of_work || "Not provided"}
          </p>
          <p>
            Previous Workplace:{" "}
            {formik.values.last_place_of_work || "Not provided"}
          </p>
          <p>Qualification: {formik.values.qualification || "Not provided"}</p>
          <div>
            <span>Bio:</span>
            <div
              className="mt-1 text-gray-600 ql-editor"
              dangerouslySetInnerHTML={{
                __html: formik.values.bio || "Not provided",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FacialVerificationStep = ({ onComplete }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-gray-800">Facial Verification</h2>
    <p className="text-sm text-gray-600">
      Please complete the facial verification process to verify your identity.
    </p>
    <FacialVerification onComplete={onComplete} />
  </section>
);

const UserProfile = React.memo(() => {
  const { userInfo, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userSlug, setUserSlug] = useState(null); // Default to null for new users
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Start in edit mode for new users
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
    personal: 0,
    contact: 0,
    professional: 0,
    verification: 0,
    overall: 0,
  });

  const validationSchema = Yup.object({
    first_name: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters"),
    last_name: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    phone: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
      .required("Phone number is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City (LGA) is required"),
    address: Yup.string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters"),
    social_media_links: Yup.array().of(
      Yup.string()
        .url("Invalid URL format")
        .nullable()
        .matches(
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          "Invalid URL"
        )
    ),
  });

  const handleApiCall = useCallback(
    async (url, data, isDraft = false) => {
      try {
        setFormStatus((prev) => ({
          ...prev,
          loading: true,
          error: null,
          success: null,
          isDraft,
        }));
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Request failed");
        }
        const result = await response.json();
        showAlertMessage(
          isDraft
            ? "Draft saved successfully"
            : "Profile updated successfully!",
          "success"
        );
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
    [dispatch, token.token, showAlertMessage]
  );

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const cleanedData = {
          ...values,
          social_media_links: values.social_media_links.filter((link) =>
            link?.trim()
          ),
        };
        await handleApiCall(
          `${backendURL}/api/create/user/profile`,
          cleanedData,
          false
        );
        setIsEditMode(false); // Switch to view mode after submission
        setCurrentStep(1); // Reset to first step
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
    [handleApiCall]
  );

  const initialFetchDone = useRef(false);
  const formik = useFormik({
    initialValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      marital_status: "",
      religion: "",
      number_of_children: "",
      phone: "",
      state: "",
      city: "",
      address: "",
      social_media_links: [""],
      current_place_of_work: "",
      last_place_of_work: "",
      qualification: "",
      profession: "",
      custom_profession: "",
      bio: "",
      UserImage: null,
    },
    validationSchema,
    onSubmit: useCallback(handleSubmit, [token.token]), // Memoized onSubmit
  });

  const steps = [
    {
      id: 1,
      title: "Personal Information",
      component: PersonalInfo,
      weight: 30,
    },
    {
      id: 2,
      title: "Contact",
      component: (props) => (
        <ContactInfo
          {...props}
          handleSocialMediaChange={handleSocialMediaChange}
          addSocialMediaField={addSocialMediaField}
          removeSocialMediaField={removeSocialMediaField}
        />
      ),
      weight: 30,
    },
    { id: 3, title: "Professional", component: ProfessionalInfo, weight: 20 },
    {
      id: 4,
      title: "Facial Verification",
      component: (props) => (
        <FacialVerificationStep
          {...props}
          onComplete={handleVerificationComplete}
        />
      ),
      weight: 10,
    },
    { id: 5, title: "Review & Submit", component: ReviewSubmit, weight: 10 },
  ];

  const calculateCompletionStatus = useCallback(() => {
    // ... (unchanged calculateCompletionStatus logic)
    const personalFields = [
      "first_name",
      "last_name",
      "date_of_birth",
      "gender",
      "marital_status",
      "religion",
    ];
    const personalComplete = personalFields.filter(
      (field) => formik.values[field]
    ).length;
    const personalPercentage = Math.min(
      100,
      Math.round((personalComplete / personalFields.length) * 100)
    );

    const contactFields = ["phone", "state", "city", "address"];
    const contactComplete = contactFields.filter(
      (field) => formik.values[field]
    ).length;
    const contactPercentage = Math.min(
      100,
      Math.round((contactComplete / contactFields.length) * 100)
    );

    const professionalFields = [
      "current_place_of_work",
      "last_place_of_work",
      "qualification",
      "profession",
      "bio",
    ];
    const professionalComplete = professionalFields.filter(
      (field) =>
        formik.values[field] ||
        (field === "profession" &&
          formik.values[field] === "Other" &&
          formik.values.custom_profession)
    ).length;
    const professionalPercentage = Math.min(
      100,
      Math.round((professionalComplete / professionalFields.length) * 100)
    );

    const verificationPercentage =
      isVerificationComplete || formik.values.UserImage ? 100 : 0;

    const totalWeight = steps.reduce((sum, step) => sum + step.weight, 0);
    const overallPercentage = Math.round(
      (personalPercentage * steps[0].weight +
        contactPercentage * steps[1].weight +
        professionalPercentage * steps[2].weight +
        verificationPercentage * steps[3].weight) /
        totalWeight
    );

    setCompletionData({
      personal: personalPercentage,
      contact: contactPercentage,
      professional: professionalPercentage,
      verification: verificationPercentage,
      overall: overallPercentage,
    });
  }, [formik.values, isVerificationComplete]);

  const fetchUserSlug = useCallback(async () => {
    try {
      const response = await fetch(`${backendURL}/api/user/${userInfo.slug}`, {
        headers: { Authorization: `Bearer ${token.token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }
      const data = await response.json();
      const newSlug = data?.data?.user?.contact?.slug;
      setUserSlug(newSlug || null); // Set to null if no slug exists
      console.log("Fetched slug:", newSlug);
      return newSlug;
    } catch (error) {
      // Only show alert if it's not a "not found" error for new users
      if (!error.message.includes("not found")) {
        showAlertMessage(error.message, "destructive");
      }
      return null;
    }
  }, [userInfo?.slug, token.token, showAlertMessage]);

  const fetchProfile = useCallback(
    async (slugToUse) => {
      const slug = slugToUse || userSlug;
      if (!slug) {
        // No profile data yet for new user - set to edit mode and skip alert
        setIsEditMode(true);
        setFormStatus((prev) => ({ ...prev, loading: false }));
        return;
      }
      try {
        setFormStatus((prev) => ({ ...prev, loading: true, error: null }));
        const response = await fetch(`${backendURL}/api/profile/${slug}`, {
          headers: { Authorization: `Bearer ${token.token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Profile not found") {
            // No profile yet - set to edit mode without alert
            setIsEditMode(true);
            setFormStatus((prev) => ({ ...prev, loading: false }));
            return;
          }
          throw new Error(errorData.message || "Failed to fetch profile data");
        }
        const data = await response.json();
        if (data.contact) {
          const newValues = {
            ...formik.initialValues,
            ...data.contact,
            UserImage: data.userPhoto,
            social_media_links: data.contact.social_media_links?.length
              ? data.contact.social_media_links
              : [""],
          };
          formik.setValues(newValues);
          setIsEditMode(false); // Switch to view mode if profile exists
          if (data.userPhoto) {
            setIsVerificationComplete(true);
          }
        }
      } catch (error) {
        if (!error.message.includes("not found")) {
          showAlertMessage(error.message, "destructive");
          setFormStatus((prev) => ({ ...prev, error: error.message }));
        } else {
          setIsEditMode(true); // Start in edit mode for new users
        }
      } finally {
        setFormStatus((prev) => ({ ...prev, loading: false }));
      }
    },
    [userSlug, formik.initialValues, token.token, showAlertMessage]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!initialFetchDone.current) {
        const slug = await fetchUserSlug();
        if (slug) {
          await fetchProfile(slug);
        }
        initialFetchDone.current = true;
      }
    };
    fetchData();
  }, [fetchUserSlug, fetchProfile]);

  useEffect(() => {
    calculateCompletionStatus();
  }, [formik.values, currentStep, calculateCompletionStatus]);

  const handleVerificationComplete = useCallback(() => {
    setIsVerificationComplete(true);
    setCurrentStep(5);
  }, []);

  const handleNext = useCallback(() => {
    formik.validateForm().then((errors) => {
      const stepFields = {
        1: ["first_name", "last_name"],
        2: ["phone", "state", "city", "address"],
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

  const handleSocialMediaChange = useCallback(
    (index, value) => {
      const updatedLinks = [...formik.values.social_media_links];
      updatedLinks[index] = value;
      formik.setFieldValue("social_media_links", updatedLinks);
    },
    [formik]
  );

  const addSocialMediaField = useCallback(() => {
    formik.setFieldValue("social_media_links", [
      ...formik.values.social_media_links,
      "",
    ]);
  }, [formik]);

  const removeSocialMediaField = useCallback(
    (index) => {
      const updatedLinks = [...formik.values.social_media_links];
      updatedLinks.splice(index, 1);
      formik.setFieldValue("social_media_links", updatedLinks);
    },
    [formik]
  );

  const saveDraft = useCallback(async () => {
    try {
      await handleApiCall(
        `${backendURL}/api/create/user/profile`,
        formik.values,
        true
      );
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, [formik.values, handleApiCall]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row p-3 md:p-5">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:block w-64 bg-white shadow-md rounded-lg p-5 sticky top-5 h-[calc(100vh-2.5rem)]">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Profile Setup</h2>
        <div className="flex justify-center mb-5">
          <ProgressRing progress={completionData.overall} />
        </div>
        <nav className="space-y-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full flex items-center p-2 rounded-md text-sm transition-all duration-200 ${
                currentStep === step.id
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              disabled={!isEditMode} // Disable navigation unless in edit mode
            >
              <span
                className={`w-5 h-5 mr-2 flex items-center justify-center rounded-full text-xs ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                }`}>
                {currentStep > step.id ? <Check size={12} /> : step.id}
              </span>
              {step.title}
              <span className="ml-auto text-xs font-medium">
                {step.id === 1
                  ? `${completionData.personal}%`
                  : step.id === 2
                    ? `${completionData.contact}%`
                    : step.id === 3
                      ? `${completionData.professional}%`
                      : step.id === 4
                        ? `${completionData.verification}%`
                        : ""}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md p-5 transition-transform duration-300 z-50 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">Profile Setup</h2>
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
              className={`w-full flex items-center p-2 rounded-md text-sm transition-all duration-200 ${
                currentStep === step.id
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              disabled={!isEditMode} // Disable navigation unless in edit mode
            >
              <span
                className={`w-5 h-5 mr-2 flex items-center justify-center rounded-full text-xs ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                }`}>
                {currentStep > step.id ? <Check size={12} /> : step.id}
              </span>
              {step.title}
              <span className="ml-auto text-xs font-medium">
                {step.id === 1
                  ? `${completionData.personal}%`
                  : step.id === 2
                    ? `${completionData.contact}%`
                    : step.id === 3
                      ? `${completionData.professional}%`
                      : step.id === 4
                        ? `${completionData.verification}%`
                        : ""}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white shadow-md rounded-lg p-2 md:p-2 lg:ml-5 mt-4 lg:mt-0">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold text-gray-800">
            {isEditMode
              ? currentStep <= steps.length
                ? `Step ${currentStep}: ${steps[currentStep - 1].title}`
                : "Profile Complete"
              : "Profile Summary"}
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <Menu size={18} />
          </button>
        </div>

        {formStatus.loading ? (
          <LoadingSpinner />
        ) : !isEditMode ? (
          <div className="space-y-6">
            {/* Verification Image */}
            <div className="flex justify-center mb-6">
              {formik.values.UserImage ? (
                <div className="relative">
                  <img
                    src={formik.values.UserImage}
                    alt="User Verification"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 shadow-md"
                  />
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Verified
                  </span>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium shadow-md">
                  No Photo
                </div>
              )}
            </div>

            {/* Profile Summary */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3">
                    Personal Information
                  </h3>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p>
                      <span className="font-medium">Full Name:</span>{" "}
                      {`${formik.values.first_name} ${formik.values.middle_name} ${formik.values.last_name}`.trim() ||
                        "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Date of Birth:</span>{" "}
                      {formik.values.date_of_birth || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Gender:</span>{" "}
                      {formik.values.gender || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Marital Status:</span>{" "}
                      {formik.values.marital_status || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Religion:</span>{" "}
                      {formik.values.religion || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Number of Children:</span>{" "}
                      {formik.values.number_of_children || "0"}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {formik.values.phone || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {`${formik.values.city || "Not provided"}, ${formik.values.state || "Not provided"}`}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {formik.values.address || "Not provided"}
                    </p>
                    <div>
                      <span className="font-medium">Social Media:</span>
                      <ul className="list-disc pl-4 mt-1 text-xs">
                        {formik.values.social_media_links.filter((link) => link)
                          .length > 0 ? (
                          formik.values.social_media_links.map(
                            (link, index) =>
                              link && (
                                <li
                                  key={index}
                                  className="hover:text-blue-500 transition-colors">
                                  {link}
                                </li>
                              )
                          )
                        ) : (
                          <li>No links provided</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3 mt-4">
                    Professional Details
                  </h3>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p>
                      <span className="font-medium">Profession:</span>{" "}
                      {formik.values.profession === "Other"
                        ? formik.values.custom_profession || "Not provided"
                        : formik.values.profession || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Current Workplace:</span>{" "}
                      {formik.values.current_place_of_work || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Previous Workplace:</span>{" "}
                      {formik.values.last_place_of_work || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Qualification:</span>{" "}
                      {formik.values.qualification || "Not provided"}
                    </p>
                    <div>
                      <span className="font-medium">Bio:</span>
                      <div
                        className="mt-1 text-gray-600 ql-editor text-xs"
                        dangerouslySetInnerHTML={{
                          __html: formik.values.bio || "Not provided",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
              <Edit size={16} className="mr-2" /> Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            {currentStep <= steps.length ? (
              steps[currentStep - 1].component({ formik })
            ) : (
              <div className="text-center space-y-5 py-12 bg-gray-50 rounded-lg border border-green-200 shadow-sm max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-5 ring-2 ring-green-300">
                  <Check size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-lg font-bold text-green-600">
                  Profile Submitted Successfully
                </h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your profile is now complete! Explore the platform and manage
                  your details from your dashboard.
                </p>
                <button
                  type="button"
                  className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => (window.location.href = "/user/MyDashBoad")}>
                  Go to Dashboard
                </button>
              </div>
            )}

            {/* Navigation */}
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
                      {currentStep === steps.length ? "Submit" : "Next"}
                      <ChevronRight size={18} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              )}
          </form>
        )}

        {/* Alert Component */}
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
      </main>
    </div>
  );
});

export default UserProfile;
