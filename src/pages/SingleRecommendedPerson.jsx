import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, PlayCircle, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const SingleRecommendedPerson = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${backendURL}/api/getRecommendedPersonBySlug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setPerson(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
        console.error(err);
      });
  }, [slug]);

  const openImageModal = (image) => setCurrentImage(image);
  const closeImageModal = () => setCurrentImage(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-md mx-auto">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {error || "Person not found"}
        </h3>
        <p className="text-gray-600">
          Please check the URL or try again later.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-green-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={person.image || "https://via.placeholder.com/150"}
            alt={person.name}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-200 mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={person.image || "https://via.placeholder.com/150"}
              alt={person.name}
              className="w-48 h-48 rounded-full object-cover border-4 border-white cursor-pointer"
              onClick={() => openImageModal(person.image)}
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">{person.name}</h1>
              <p className="text-xl mt-2">{person.title}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {person.category}
                </span>
                <span className="text-sm">{person.year}</span>
                <span className="text-sm">{person.timeframe}</span>
              </div>
              <p className="text-lg mt-2">{person.award}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-green-900 mb-4">
                Details
              </h2>
              <ul className="space-y-3">
                {person.profileLink && (
                  <li>
                    <a
                      href={person.profileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-700 hover:text-green-800">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Profile
                    </a>
                  </li>
                )}
                {person.videoLink && (
                  <li>
                    <button
                      onClick={() => setVideoModalOpen(true)}
                      className="flex items-center text-green-700 hover:text-green-800">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Watch Video ({person.videoDuration || "N/A"})
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-green-900 mb-4">
                About {person.name}
              </h2>
              <div className="prose max-w-none">
                {person.fullDescription ? (
                  <ReactQuill
                    value={person.fullDescription}
                    readOnly
                    theme="bubble"
                    className="ql-editor-custom"
                  />
                ) : (
                  <p className="text-gray-600">{person.description}</p>
                )}
              </div>

              {person.additionalImages &&
                person.additionalImages.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-green-900 mb-4">
                      Gallery
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {person.additionalImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative w-full pb-[100%] cursor-pointer"
                          onClick={() => openImageModal(image)}>
                          <img
                            src={image}
                            alt={`${person.name} gallery ${index + 1}`}
                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {videoModalOpen && person.videoLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-green-900">
                {person.name} Video
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${person.videoLink}`}
                  title={`${person.name} video`}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300">
              <X size={32} />
            </button>
            <img
              src={currentImage}
              alt="Full-size image"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleRecommendedPerson;
