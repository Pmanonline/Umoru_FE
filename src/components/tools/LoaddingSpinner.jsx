import React, { useEffect, useState, useCallback, memo } from "react";
import { Loader2, X } from "lucide-react";

const LoadingSpinner = memo(() => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
    <Loader2
      className="animate-spin text-teal-500 dark:text-teal-400"
      size={40}
    />
  </div>
));
export default LoadingSpinner;
