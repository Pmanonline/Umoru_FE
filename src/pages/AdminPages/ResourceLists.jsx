import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";
import LoadingSpinner from "../../components/tools/LoaddingSpinner";

const ResourceList = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [totalResources, setTotalResources] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const showAlertMessage = (message, variant) => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${backendURL}/api/resources?startIndex=${(page - 1) * limit}&limit=${limit}&searchTerm=${searchTerm}`
        );
        const data = await res.json();
        if (res.ok) {
          setResources(data.resources);
          setTotalResources(data.totalResources);
        } else {
          throw new Error(data.message || "Failed to load resources");
        }
      } catch (err) {
        showAlertMessage("Failed to load resources!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [page, limit, searchTerm]);

  const handleDeleteConfirmation = (resourceId) => {
    setResourceToDelete(resourceId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (resourceToDelete) {
      try {
        const res = await fetch(
          `${backendURL}/api/resources/${resourceToDelete}`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          setResources(resources.filter((r) => r._id !== resourceToDelete));
          setTotalResources((prev) => prev - 1);
          showAlertMessage("Resource deleted successfully!", "success");
        } else {
          throw new Error("Failed to delete resource");
        }
      } catch (err) {
        showAlertMessage(err.message || "An error occurred", "error");
      } finally {
        setIsDeleteModalOpen(false);
        setResourceToDelete(null);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Resource Management
          </h1>
          <button
            onClick={() => navigate("/Admin/CreateEditResources")}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
            Create New Resource
          </button>
        </div>
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search resources..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2">Thumbnail</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Format</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr
                  key={resource._id}
                  className="bg-white border-b hover:bg-gray-50 transition duration-200">
                  <td className="px-4 py-2">
                    {resource.thumbnail ? (
                      <img
                        src={resource.thumbnail}
                        alt={resource.title}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {resource.title}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {resource.category}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{resource.format}</td>
                  <td className="px-4 py-2 flex space-x-3">
                    <button
                      onClick={() =>
                        navigate(`/Admin/CreateEditResources/${resource._id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 transition duration-200"
                      aria-label="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirmation(resource._id)}
                      className="text-red-600 hover:text-red-800 transition duration-200"
                      aria-label="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, totalResources)} of {totalResources}{" "}
            resources
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition duration-200"
              aria-label="Previous Page">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page * limit >= totalResources}
              className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition duration-200"
              aria-label="Next Page">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
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

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition duration-200"
                aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="py-4">
              <p className="text-gray-600">
                Are you sure you want to delete this resource? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
                <Check size={18} className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceList;
