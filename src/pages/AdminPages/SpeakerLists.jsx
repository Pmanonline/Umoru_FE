import React, { useEffect, useState, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Edit,
  PlusCircle,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const LoadingSpinner = memo(() => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
    <Loader2
      className="animate-spin text-teal-500 dark:text-teal-400"
      size={40}
    />
  </div>
));

const SpeakerTableRow = memo(({ speaker, onDeleteClick }) => (
  <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
    <td className="px-6 py-4 whitespace-nowrap min-w-[150px]">
      <span
        className="font-medium text-gray-900 dark:text-white"
        title={speaker.name}>
        {speaker.name}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      {speaker.image ? (
        <img
          src={speaker.image}
          alt={speaker.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback-image.png";
          }}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="text-gray-500 dark:text-gray-400" size={20} />
        </div>
      )}
    </td>
    <td className="px-6 py-4 min-w-[200px] max-w-[300px]">
      <span
        className="text-gray-700 dark:text-gray-300 block truncate"
        title={speaker.bio}>
        {speaker.bio.length > 50
          ? `${speaker.bio.substring(0, 50)}...`
          : speaker.bio}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
      <span
        className="text-gray-700 dark:text-gray-300 block truncate max-w-[250px]"
        title={speaker.email}>
        {speaker.email}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <button
        onClick={() => onDeleteClick(speaker._id)}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded flex-shrink-0">
        <Trash2 size={20} />
      </button>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Link
        to={`/Admin/CreateEditSpeaker/${speaker._id}`}
        className="text-teal-500 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors p-1 rounded flex-shrink-0">
        <Edit size={20} />
      </Link>
    </td>
  </tr>
));

export default function SpeakerLists() {
  const { userInfo } = useSelector((state) => state.auth);
  const [speakers, setSpeakers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [speakerIdToDelete, setSpeakerIdToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const fetchSpeakers = useCallback(async (startIndex = 0) => {
    try {
      startIndex === 0 ? setInitialLoading(true) : setLoading(true);

      const res = await fetch(
        `${backendURL}/api/getAllSpeakers?startIndex=${startIndex}&limit=9`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch speakers");
      }

      const data = await res.json();
      setSpeakers((prev) => (startIndex === 0 ? data : [...prev, ...data]));
      setShowMore(data.length === 9);
    } catch (error) {
      console.error("Error fetching speakers:", error);
      setAlertConfig({
        variant: "error",
        message: error.message || "Failed to fetch speakers",
      });
      setShowAlert(true);
    } finally {
      startIndex === 0 ? setInitialLoading(false) : setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers, userInfo]);

  const handleShowMore = useCallback(() => {
    if (!loading) {
      fetchSpeakers(speakers.length);
    }
  }, [fetchSpeakers, loading, speakers.length]);

  const openDeleteModal = useCallback((speakerId) => {
    setSpeakerIdToDelete(speakerId);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSpeakerIdToDelete("");
  }, []);

  const handleDeleteSpeaker = useCallback(async () => {
    try {
      const res = await fetch(
        `${backendURL}/api/deleteSpeaker/${speakerIdToDelete}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete speaker");
      }

      setSpeakers((prev) =>
        prev.filter((speaker) => speaker._id !== speakerIdToDelete)
      );
      setAlertConfig({
        variant: "success",
        message: "Speaker deleted successfully",
      });
      setShowAlert(true);
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting speaker:", error);
      setAlertConfig({
        variant: "error",
        message:
          error.message || "An error occurred while deleting the speaker",
      });
      setShowAlert(true);
    }
  }, [speakerIdToDelete, closeDeleteModal]);

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-3 max-w-6xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="my-5 ml-3">
        <Link to="/Admin/CreateEditSpeaker/">
          <button className="flex items-center gap-2 px-3 py-1 bg-teal-500 dark:bg-teal-400 text-white rounded hover:bg-teal-600 dark:hover:bg-teal-300 transition-colors duration-200">
            <PlusCircle size={16} />
            Create Speaker
          </button>
        </Link>
      </div>

      <div className="w-full">
        {speakers?.length > 0 ? (
          <div className="overflow-hidden shadow-md rounded-lg">
            <div className="overflow-x-auto scrollbar-thin scrollbar-track-gray-100 dark:scrollbar-track-gray-800 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 min-w-[900px]">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 whitespace-nowrap min-w-[150px]">
                      Name
                    </th>
                    <th className="px-6 py-3 whitespace-nowrap">Image</th>
                    <th className="px-6 py-3 min-w-[200px]">Bio</th>
                    <th className="px-6 py-3 whitespace-nowrap min-w-[200px]">
                      Email
                    </th>
                    <th className="px-6 py-3 whitespace-nowrap">Delete</th>
                    <th className="px-6 py-3 whitespace-nowrap">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {speakers.map((speaker) => (
                    <SpeakerTableRow
                      key={speaker._id}
                      speaker={speaker}
                      onDeleteClick={openDeleteModal}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {showMore && (
              <button
                onClick={handleShowMore}
                disabled={loading}
                className="w-full text-teal-500 dark:text-teal-400 py-4 text-sm hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-50 transition-colors duration-200 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                {loading ? (
                  <Loader2 className="animate-spin inline mr-2" size={16} />
                ) : (
                  "Show more"
                )}
              </button>
            )}
          </div>
        ) : (
          <p className="text-center py-4">No speakers found!</p>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this speaker? This action cannot
                be undone. All events associated with this speaker will be
                affected.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                  <X size={20} />
                </button>
                <button
                  onClick={handleDeleteSpeaker}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
