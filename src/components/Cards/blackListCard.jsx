// import React from "react";
// import {
//   AlertTriangle,
//   Calendar,
//   ExternalLink,
//   Flag,
//   MoreVertical,
//   Shield,
//   User,
//   Building2,
// } from "lucide-react";

// const BlacklistCard = ({ entity }) => {
//   const {
//     id,
//     name,
//     type,
//     blacklistReason,
//     blacklistSeverity,
//     blacklistedDate,
//     blacklistReports,
//     category,
//     address,
//   } = entity;

//   const getSeverityColor = (severity) => {
//     switch (severity?.toLowerCase()) {
//       case "high":
//         return "bg-red-100 text-red-700";
//       case "medium":
//         return "bg-orange-100 text-orange-700";
//       case "low":
//         return "bg-yellow-100 text-yellow-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const getTypeIcon = (type) => {
//     return type?.toLowerCase() === "business" ? Building2 : User;
//   };

//   const TypeIcon = getTypeIcon(type);

//   return (
//     <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-100">
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center space-x-2">
//             <TypeIcon className="h-5 w-5 text-gray-500" />
//             <span className="text-sm text-gray-600 capitalize">
//               {type || "Unknown Type"}
//             </span>
//           </div>
//           <div
//             className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(blacklistSeverity)}`}>
//             {blacklistSeverity} Risk
//           </div>
//         </div>
//         <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
//         {category && (
//           <div className="flex flex-wrap gap-2 mb-2">
//             {category.split(",").map((cat, index) => (
//               <span
//                 key={index}
//                 className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                 {cat.trim()}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Body */}
//       <div className="p-4 space-y-4">
//         {/* Alert Reason */}
//         <div className="bg-red-50 rounded-lg p-3">
//           <div className="flex items-start">
//             <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
//             <p className="text-sm text-red-700">{blacklistReason}</p>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 gap-4 py-2">
//           <div className="flex items-center space-x-2">
//             <Flag className="h-4 w-4 text-gray-400" />
//             <span className="text-sm text-gray-600">
//               {blacklistReports} Reports
//             </span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Calendar className="h-4 w-4 text-gray-400" />
//             <span className="text-sm text-gray-600">
//               {new Date(blacklistedDate).toLocaleDateString()}
//             </span>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center justify-between pt-2 border-t border-gray-100">
//           <button
//             className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
//             onClick={() => window.open(`/report/${id}`, "_blank")}>
//             <Shield className="h-4 w-4" />
//             <span>View Full Report</span>
//           </button>

//           <div className="flex items-center space-x-2">
//             <button
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               aria-label="Share report">
//               <ExternalLink className="h-4 w-4 text-gray-400" />
//             </button>
//             <button
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               aria-label="More options">
//               <MoreVertical className="h-4 w-4 text-gray-400" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlacklistCard;

import React from "react";
import {
  AlertTriangle,
  Calendar,
  ExternalLink,
  Flag,
  MoreVertical,
  Shield,
  User,
  Building2,
} from "lucide-react";

const BlacklistCard = ({ entity }) => {
  const {
    id,
    name,
    type,
    blacklistReason,
    blacklistSeverity,
    blacklistedDate,
    blacklistReports,
    category,
    address,
    image, // Add image field
  } = entity;

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type) => {
    return type?.toLowerCase() === "business" ? Building2 : User;
  };

  const TypeIcon = getTypeIcon(type);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header with Image */}
      <div className="relative h-40 w-full">
        <img
          src={image || "https://via.placeholder.com/300x200"} // Fallback image
          alt={name}
          className="w-full h-full object-cover rounded-t-xl"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200"; // Fallback on error
          }}
        />
        {/* Overlay for Type and Severity */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
            <TypeIcon className="h-4 w-4 text-white" />
            <span className="text-xs text-white capitalize">
              {type || "Unknown Type"}
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
              blacklistSeverity
            )}`}>
            {blacklistSeverity} Risk
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        {category && (
          <div className="flex flex-wrap gap-2">
            {category.split(",").map((cat, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {cat.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Alert Reason */}
        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-700">{blacklistReason}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex items-center space-x-2">
            <Flag className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {blacklistReports} Reports
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {new Date(blacklistedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            onClick={() => window.open(`/report/${id}`, "_blank")}>
            <Shield className="h-4 w-4" />
            <span>View Full Report</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Share report">
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="More options">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlacklistCard;
