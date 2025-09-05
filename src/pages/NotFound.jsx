import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-cream dark:bg-accent-creamDark px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div
        className="max-w-md mx-auto text-center bg-accent-cream/90 dark:bg-accent-creamDark/90 rounded-xl shadow-sm border border-accent-charcoal/20 dark:border-gray-800/20 p-6 sm:p-8"
        role="alert"
        aria-labelledby="not-found-title"
        aria-describedby="not-found-description">
        {/* Custom SVG for 404 */}
        <div className="mb-6 flex justify-center">
          <svg
            className="w-24 h-24 sm:w-32 sm:h-32 text-accent-teal"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1
          id="not-found-title"
          className="text-2xl sm:text-3xl font-bold text-primary-dark dark:text-white mb-4">
          404 - Page Not Found
        </h1>

        {/* Description */}
        <p
          id="not-found-description"
          className="text-sm sm:text-base text-accent-charcoal dark:text-white/80 mb-6">
          Oops! It looks like you’ve wandered off the path. The page you’re
          looking for doesn’t exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center px-5 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light rounded-lg transition-colors focus:ring-2 focus:ring-primary-light"
          aria-label="Return to homepage">
          <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Back to Home
        </Link>

        {/* Footer Branding */}
        <div className="mt-6 text-xs sm:text-sm text-accent-charcoal dark:text-white/80">
          • Secured Access •
        </div>
      </div>
    </div>
  );
};

export default NotFound;
