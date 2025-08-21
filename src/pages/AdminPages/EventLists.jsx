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

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
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
  const [eventToDelete, setEventToDelete] = useState(null);

  // Function to show alert message
  const showAlertMessage = (message, variant) => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${backendURL}/api/getEvents?startIndex=${(page - 1) * limit}&limit=${limit}&searchTerm=${searchTerm}`
        );
        const data = await res.json();
        setEvents(data.events);
        console.log(data);
        setTotalEvents(data.totalEvents);
      } catch (err) {
        showAlertMessage("Failed to load events!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [page, limit, searchTerm]);

  const handleDeleteConfirmation = (eventId) => {
    setEventToDelete(eventId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (eventToDelete) {
      try {
        const res = await fetch(
          `${backendURL}/api/deleteEvent/${eventToDelete}`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          setEvents(events.filter((event) => event._id !== eventToDelete));
          showAlertMessage("Event deleted successfully!", "success");
        } else {
          showAlertMessage("Failed to delete event!", "error");
          throw new Error("Failed to delete event");
        }
      } catch (err) {
        showAlertMessage(err.message || "An error occurred", "error");
      } finally {
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <button
            onClick={() => navigate("/Admin/CreateEditEvents")}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
            Create New Event
          </button>
        </div>
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search events..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events?.map((event) => (
                  <tr
                    key={event._id}
                    className="bg-white border-b hover:bg-gray-50 transition duration-200">
                    <td className="px-4 py-2">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {event.eventType}
                    </td>
                    <td className="px-4 py-2 flex space-x-3">
                      <button
                        onClick={() =>
                          navigate(`/Admin/CreateEditEvents/${event._id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                        aria-label="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirmation(event._id)}
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
              {Math.min(page * limit, totalEvents)} of {totalEvents} events
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
                disabled={page * limit >= totalEvents}
                className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition duration-200"
                aria-label="Next Page">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
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

      {/* Delete Confirmation Modal */}
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
                Are you sure you want to delete this event? This action cannot
                be undone.
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

export default EventList;
