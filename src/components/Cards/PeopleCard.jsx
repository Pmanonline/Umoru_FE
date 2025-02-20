import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, ExternalLink, Share2, Phone, User } from "lucide-react";

function PeopleCard({ person }) {
  const handleShare = (person) => {
    // Implement share functionality
    console.log("Sharing profile:", person.name);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative max-w-[600px]">
      <div className="relative">
        <img
          src={person?.image || "https://via.placeholder.com/300x200"}
          alt={person?.name}
          className="w-full h-36 object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200";
          }}
        />
        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
          {person?.profession && (
            <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs flex items-center">
              <User size={12} className="mr-1.5" />
              {person.profession}
            </div>
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {person?.name || "Unnamed Person"}
        </h3>

        {person?.skills && (
          <div className="flex flex-wrap gap-2 mb-2">
            {person.skills.split(",").map((skill, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {skill.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-1 text-blue-500" />
            <span>{person?.location || "Location not available"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail size={16} className="mr-1 text-red-500" />
            <span>{person?.email || "Email not provided"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone size={16} className="mr-1 text-green-500" />
            <span>{person?.phone || "Phone not available"}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handleShare(person)}
            className="px-2 py-1 border bg-gray-100 text-sm flex rounded-full transition-colors hover:border-blue-500 hover:border"
            aria-label="Share">
            <Share2 size={12} className="text-blue-500 mr-1 mt-1" /> Share
          </button>
          <Link
            to={`/people/${person?.id}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors hover:rotate-1">
            View Profile
            <ExternalLink size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PeopleCard;
