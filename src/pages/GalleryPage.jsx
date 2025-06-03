import React, { useState } from "react";
import { Camera } from "lucide-react";
import ImageGallery from "react-image-gallery";
import { motion } from "framer-motion";
import "react-image-gallery/styles/css/image-gallery.css";

const GalleryPage = () => {
  const images = [
    {
      original:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      description:
        "Honoring first responders at the 2023 Pride of the World Gala.",
      originalAlt: "2023 Emergency Services Award Ceremony",
      thumbnailAlt: "2023 Emergency Services Award Ceremony thumbnail",
    },
    {
      original:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      description: "Young leaders at a 2022 mentorship workshop in Lagos.",
      originalAlt: "Youth Development Program Workshop",
      thumbnailAlt: "Youth Development Program Workshop thumbnail",
    },
    {
      original:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      description: "Celebrating local heroes in Abuja, 2021.",
      originalAlt: "Community Heroes Fund Event",
      thumbnailAlt: "Community Heroes Fund Event thumbnail",
    },
    {
      original:
        "https://images.unsplash.com/photo-1543269865-0a740d43b90c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1543269865-0a740d43b90c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      description: "Award recipients at the inaugural gala in 2019.",
      originalAlt: "2019 Pride of the World Gala",
      thumbnailAlt: "2019 Pride of the World Gala thumbnail",
    },
    {
      original:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      description: "Graduates of the 2020 Youth Development Program.",
      originalAlt: "Youth Program Graduation",
      thumbnailAlt: "Youth Program Graduation thumbnail",
    },
    {
      original:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      description: "Volunteers at a 2022 community cleanup in Port Harcourt.",
      originalAlt: "Community Cleanup Event",
      thumbnailAlt: "Community Cleanup Event thumbnail",
    },
  ];

  const renderItem = (item) => {
    return (
      <motion.div
        className="image-gallery-image"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}>
        <img src={item.original} alt={item.originalAlt} loading="lazy" />
        {item.description && (
          <div className="image-gallery-description">{item.description}</div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-accent-cream mt-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8 sm:py-12 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="text-primary" size={28} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Pride of the World Gallery
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto">
            Relive the moments that define our journey—celebrating the world's
            heroes through events, ceremonies, and community initiatives.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <div className="custom-gallery">
            <ImageGallery
              items={images}
              renderItem={renderItem}
              showPlayButton={false}
              showFullscreenButton={true}
              showThumbnails={true}
              thumbnailPosition="bottom"
              autoPlay={false}
              slideDuration={450}
              slideInterval={5000}
              additionalClass="rounded-lg overflow-hidden"
            />
          </div>
        </motion.div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">
            Support Our Mission
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            Your contributions help us continue celebrating the world's heroes.
            Be a part of our story today.
          </p>
          <button
            onClick={() => (window.location.href = "/fund")}
            className="inline-block px-5 sm:px-6 py-2 sm:py-3 bg-primary text-white  font-bold rounded-full hover:bg-secondary transition-all duration-300">
            Donate Now
          </button>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .custom-gallery :global(.image-gallery) {
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .custom-gallery :global(.image-gallery-slide) {
          background: #f8fafc;
        }

        .custom-gallery :global(.image-gallery-image) {
          max-height: 70vh;
          object-fit: contain;
        }

        .custom-gallery :global(.image-gallery-description) {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 1rem;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
        }

        .custom-gallery :global(.image-gallery-thumbnail.active),
        .custom-gallery :global(.image-gallery-thumbnail:hover),
        .custom-gallery :global(.image-gallery-thumbnail:focus) {
          border: 3px solid #f59e0b;
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;
