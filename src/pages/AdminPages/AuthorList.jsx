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

const AuthorTableRow = memo(({ author, onDeleteClick }) => (
  <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
    <td className="px-6 py-4 whitespace-nowrap min-w-[150px]">
      <span
        className="font-medium text-gray-900 dark:text-white"
        title={author.name}>
        {author.name}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      {author.image ? (
        <img
          src={author.image}
          alt={author.name}
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
        title={author.bio}>
        {author.bio.length > 50
          ? `${author.bio.substring(0, 50)}...`
          : author.bio}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
      <span
        className="text-gray-700 dark:text-gray-300 block truncate max-w-[250px]"
        title={author.email}>
        {author.email}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <button
        onClick={() => onDeleteClick(author._id)}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded flex-shrink-0">
        <Trash2 size={20} />
      </button>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Link
        to={`/Admin/CreateAuthor/${author._id}`}
        className="text-teal-500 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors p-1 rounded flex-shrink-0">
        <Edit size={20} />
      </Link>
    </td>
  </tr>
));

export default function AuthorList() {
  const { userInfo } = useSelector((state) => state.auth);
  const [authors, setAuthors] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [authorIdToDelete, setAuthorIdToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const fetchAuthors = useCallback(async (startIndex = 0) => {
    try {
      startIndex === 0 ? setInitialLoading(true) : setLoading(true);

      const res = await fetch(
        `${backendURL}/api/getAllAuthors?startIndex=${startIndex}&limit=9`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch authors");
      }

      const data = await res.json();
      setAuthors((prev) => (startIndex === 0 ? data : [...prev, ...data]));
      setShowMore(data.length === 9);
    } catch (error) {
      console.error("Error fetching authors:", error);
      setAlertConfig({
        variant: "error",
        message: error.message || "Failed to fetch authors",
      });
      setShowAlert(true);
    } finally {
      startIndex === 0 ? setInitialLoading(false) : setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors, userInfo]);

  const handleShowMore = useCallback(() => {
    if (!loading) {
      fetchAuthors(authors.length);
    }
  }, [fetchAuthors, loading, authors.length]);

  const openDeleteModal = useCallback((authorId) => {
    setAuthorIdToDelete(authorId);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setAuthorIdToDelete("");
  }, []);

  const handleDeleteAuthor = useCallback(async () => {
    try {
      const res = await fetch(
        `${backendURL}/api/deleteAuthor/${authorIdToDelete}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete author");
      }

      setAuthors((prev) =>
        prev.filter((author) => author._id !== authorIdToDelete)
      );
      setAlertConfig({
        variant: "success",
        message: "Author deleted successfully",
      });
      setShowAlert(true);
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting author:", error);
      setAlertConfig({
        variant: "error",
        message: error.message || "An error occurred while deleting the author",
      });
      setShowAlert(true);
    }
  }, [authorIdToDelete, closeDeleteModal]);

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-3 max-w-6xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="my-5 ml-3">
        <Link to="/Admin/CreateAuthor">
          <button className="flex items-center gap-2 px-3 py-1 bg-teal-500 dark:bg-teal-400 text-white rounded hover:bg-teal-600 dark:hover:bg-teal-300 transition-colors duration-200">
            <PlusCircle size={16} />
            Create Author
          </button>
        </Link>
      </div>

      <div className="w-full">
        {authors?.length > 0 ? (
          <div className="overflow-hidden shadow-md rounded-lg">
            {/* Scrollable container with auto side scroll */}
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
                  {authors.map((author) => (
                    <AuthorTableRow
                      key={author._id}
                      author={author}
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
          <p className="text-center py-4">No authors found!</p>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this author? This action cannot
                be undone. All posts associated with this author will be
                affected.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                  <X size={20} />
                </button>
                <button
                  onClick={handleDeleteAuthor}
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
