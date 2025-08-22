import React, { useEffect, useState, useCallback, memo } from "react";
import { Loader2, X } from "lucide-react";

const LoadingSpinner = memo(() => (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white bg-opacity-90 backdrop-blur-sm z-50 animate-in fade-in duration-300">
    <div className="relative">
      {/* Outer pulsing ring */}
      <div className="absolute inset-0 animate-ping">
        <div className="w-20 h-20 border-4 border-teal-200 rounded-full opacity-20"></div>
      </div>

      {/* Middle rotating ring */}
      <div
        className="absolute inset-2 animate-spin"
        style={{ animationDuration: "2s" }}>
        <div className="w-16 h-16 border-2 border-teal-300 border-t-transparent rounded-full opacity-40"></div>
      </div>

      {/* Inner content */}
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute animate-pulse">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full opacity-10"></div>
        </div>
        <Loader2
          className="animate-spin text-teal-500 dark:text-teal-400 drop-shadow-sm"
          size={40}
        />
      </div>

      {/* Floating particles */}
      <div
        className="absolute -top-2 -left-2 w-2 h-2 bg-teal-400 rounded-full animate-bounce opacity-60"
        style={{ animationDelay: "0s" }}></div>
      <div
        className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce opacity-70"
        style={{ animationDelay: "0.2s" }}></div>
      <div
        className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce opacity-50"
        style={{ animationDelay: "0.4s" }}></div>
      <div
        className="absolute -bottom-2 -right-2 w-2 h-2 bg-teal-400 rounded-full animate-bounce opacity-80"
        style={{ animationDelay: "0.6s" }}></div>
    </div>

    {/* Optional loading text with typewriter effect */}
    <div className="absolute mt-24 text-teal-600 font-medium text-sm animate-pulse">
      Loading<span className="animate-ping">...</span>
    </div>
  </div>
));
export default LoadingSpinner;
