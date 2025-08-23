import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "../tools/Alert";
import LoadingSpinner from "../tools/LoaddingSpinner";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const BookingModal = ({
  isOpen,
  onClose,
  title = "Book a Session",
  endpoint = "/api/createBooking", // 🔑 makes it reusable for different APIs
  onSuccess, // 🔑 optional callback after successful submit
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch(`${backendURL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });

        if (onSuccess) onSuccess(); // 🔑 callback for parent to hook into

        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 5000);
      } else {
        throw new Error("Failed to submit booking request");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Escape key + body scroll lock
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const formVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}>
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Title + Close */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close modal">
                  ✕
                </button>
              </div>

              {/* Alert Messages */}
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6">
                  <Alert
                    variant={
                      submitStatus === "success" ? "success" : "destructive"
                    }
                    show
                    autoClose
                    autoCloseTime={5000}>
                    <AlertDescription>
                      {submitStatus === "success"
                        ? "Booking request submitted successfully! We'll get back to you soon."
                        : "Failed to submit booking. Please try again."}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.phone
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg resize-none dark:bg-gray-700 dark:text-white ${
                      errors.message
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    maxLength={500}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{formData.message.length}/500</span>
                    {errors.message && (
                      <p className="text-red-500">{errors.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold py-3 px-6 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Submitting...</span>
                    </div>
                  ) : (
                    "Submit Booking Request"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
