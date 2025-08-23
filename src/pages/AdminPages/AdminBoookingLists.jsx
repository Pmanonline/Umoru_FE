import React, { useEffect, useState, useCallback, memo } from "react";
import moment from "moment";
import {
  Trash2,
  X,
  User,
  Mail,
  Phone,
  MessageSquare,
  Tag,
  Calendar,
} from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import LoadingSpinner from "../../components/tools/LoaddingSpinner";
import backendURL from "../../config";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BookingTableRow = memo(({ booking, onDelete }) => (
  <tr
    key={booking._id}
    className="bg-white dark:bg-gray-700 border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200">
    <td className=" whitespace-nowrap px-4 py-2 text-gray-900 dark:text-gray-100">
      <User
        size={16}
        className="inline mr-2 text-gray-600 dark:text-gray-300"
      />
      {booking.name}
    </td>
    <td className=" whitespace-nowrap  px-4 py-2 text-gray-900 dark:text-gray-100">
      <Mail
        size={16}
        className="inline mr-2 text-gray-600 dark:text-gray-300"
      />
      {booking.email}
    </td>
    <td className=" whitespace-nowrap  px-4 py-2 text-gray-900 dark:text-gray-100">
      <Phone
        size={16}
        className="inline mr-2 text-gray-600 dark:text-gray-300"
      />
      {booking.phone}
    </td>
    <td className=" whitespace-normal min-w-[12rem]  px-4 py-2 text-gray-900 dark:text-gray-100">
      <MessageSquare
        size={16}
        className="inline mr-2 text-gray-600 dark:text-gray-300"
      />
      {booking.message.length > 100
        ? `${booking.message.substring(0, 100)}...`
        : booking.message}
    </td>
    <td className="whitespace-nowrap  px-4 py-2 text-gray-900 dark:text-gray-100">
      <Tag size={16} className="inline mr-2 text-gray-600 dark:text-gray-300" />
      {booking.status}
    </td>
    <td className="whitespace-nowrap  px-4 py-2 text-gray-900 dark:text-gray-100">
      <Calendar
        size={16}
        className="inline mr-2 text-gray-600 dark:text-gray-300"
      />
      {moment(booking.createdAt).format("MMMM D, HH:mm")}
    </td>
    <td className="whitespace-nowrap  px-4 py-2">
      <button
        onClick={() => onDelete(booking._id)}
        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition duration-200"
        aria-label="Delete Booking">
        <Trash2 size={18} />
      </button>
    </td>
  </tr>
));

const StatsDisplay = memo(({ totalBookings }) => (
  <div className="flex gap-2 text-sm">
    <span className="text-gray-700 dark:text-gray-300 font-semibold">
      Total Bookings: {totalBookings}
    </span>
  </div>
));

export default function AdminBoookingLists() {
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const fetchBookings = useCallback(
    async (pageNum = 1) => {
      try {
        setLoading(true);
        const url = new URL(`${backendURL}/api/getAllBookings`);
        url.searchParams.append("startIndex", (pageNum - 1) * limit);
        url.searchParams.append("limit", limit);

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(data);
        setTotalBookings(data.length); // Adjust if API returns total count
      } catch (error) {
        console.error("Error fetching bookings:", error);
        showAlertMessage("Failed to fetch bookings", "error");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchBookings(page);
  }, [fetchBookings, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDeleteBooking = useCallback(async (bookingId) => {
    setBookingToDelete(bookingId);
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteBooking = useCallback(async () => {
    if (!bookingToDelete) return;

    try {
      const res = await fetch(
        `${backendURL}/api/deleteBooking/${bookingToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setBookings(bookings.filter((b) => b._id !== bookingToDelete));
        setTotalBookings((prev) => prev - 1);
        showAlertMessage("Booking deleted successfully!", "success");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      showAlertMessage(error.message || "Failed to delete booking", "error");
    } finally {
      setShowDeleteModal(false);
      setBookingToDelete(null);
    }
  }, [bookingToDelete, bookings]);

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Bookings
          </h1>
          <StatsDisplay totalBookings={totalBookings} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Booked At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <BookingTableRow
                  key={booking._id}
                  booking={booking}
                  onDelete={handleDeleteBooking}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, totalBookings)} of {totalBookings} bookings
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200">
              <ChevronLeft
                size={16}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page * limit >= totalBookings}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200">
              <ChevronRight
                size={16}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center border-b dark:border-gray-600 pb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Delete
              </h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBookingToDelete(null);
                }}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition duration-200">
                <X size={20} />
              </button>
            </div>
            <div className="py-4">
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this booking? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBookingToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200">
                Cancel
              </button>
              <button
                onClick={confirmDeleteBooking}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition duration-200">
                <Trash2 size={18} className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Alert
        variant={alertConfig.variant}
        show={showAlert}
        onClose={() => setShowAlert(false)}
        autoClose={true}
        autoCloseTime={5000}>
        <AlertDescription>{alertConfig.message}</AlertDescription>
      </Alert>
    </div>
  );
}
