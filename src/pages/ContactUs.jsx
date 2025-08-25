import React, { useState, useCallback } from "react";
import emailjs from "emailjs-com";
import { CircularProgress } from "@mui/material";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";
import ResourcesImage from "../assets/images/resources2.jpg";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.message) {
      showAlertMessage("All fields are required", "error");
      return;
    }

    setLoading(true);
    try {
      const templateParams = {
        to_name: "Segun Umoru",
        from_name: formData.fullName,
        message: formData.message,
        reply_to: formData.email,
      };

      const result = await emailjs.send(
        "service_mfruavt",
        "template_cst1uc9",
        templateParams,
        "9Tp4XEvOsWGi69ktz"
      );

      if (result.status === 200) {
        showAlertMessage("Message sent successfully!", "success");
        setFormData({ fullName: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      showAlertMessage("Failed to send message. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:min-h-screen bg-accent-cream dark:bg-accent-creamDark text-primary-dark dark:text-white">
      {/* Hero Section */}
      <div className="relative min-h-[50vh] mid:min-h-[10vh] bg-primary-dark dark:bg-primary-darkMode bg-hero-gradient dark:bg-hero-gradient-dark overflow-hidden">
        <img
          src={ResourcesImage}
          alt="Contact us background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 z-10 max-w-7xl">
          <div className="text-center text-white mid:mt-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-light">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
              Have questions or feedback? Reach out to us, and we'll get back to
              you soon!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
        {/* Contact Form */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary-dark dark:text-white">
            Send Us a Message
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm sm:text-base font-medium mb-1 text-accent-charcoal dark:text-white">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-gray-800/20 bg-white/90 dark:bg-gray-800/90 text-primary-dark dark:text-white placeholder-accent-charcoal/50 dark:placeholder-white/50 focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
                  placeholder="Your full name"
                  aria-required="true"
                  aria-describedby="fullName-error"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base font-medium mb-1 text-accent-charcoal dark:text-white">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-gray-800/20 bg-white/90 dark:bg-gray-800/90 text-primary-dark dark:text-white placeholder-accent-charcoal/50 dark:placeholder-white/50 focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
                  placeholder="Your email"
                  aria-required="true"
                  aria-describedby="email-error"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm sm:text-base font-medium mb-1 text-accent-charcoal dark:text-white">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-gray-800/20 bg-white/90 dark:bg-gray-800/90 text-primary-dark dark:text-white placeholder-accent-charcoal/50 dark:placeholder-white/50 focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all resize-y"
                placeholder="Your message"
                aria-required="true"
                aria-describedby="message-error"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white dark:text-white rounded-xl font-semibold text-sm sm:text-base hover:from-primary-light hover:to-secondary-light transition-all focus:ring-2 focus:ring-primary-light disabled:opacity-50"
              aria-label="Send message">
              {loading ? (
                <CircularProgress size={24} className="text-white" />
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </section>

        {showAlert && (
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseTime={5000}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
            {alertConfig.variant === "success" ? (
              <CheckCircle className="w-5 h-5 text-accent-green ml-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-accent-red ml-2" />
            )}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
