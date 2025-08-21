// import React, { useEffect, useState, useCallback, memo } from "react";
// import moment from "moment";
// import {
//   Trash2,
//   X,
//   ChevronDown,
//   User,
//   Mail,
//   Phone,
//   Globe,
//   Briefcase,
//   Target,
//   Users,
//   Building,
//   Calendar,
// } from "lucide-react";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import LoadingSpinner from "../../components/tools/LoaddingSpinner";
// import backendURL from "../../config";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const EventTableRow = memo(({ registration, onDelete }) => (
//   <tr
//     key={registration._id}
//     className="bg-white border-b hover:bg-gray-50 transition duration-200">
//     <td className="px-4 py-2">
//       <User size={16} className="inline mr-2 text-gray-600" />
//       {registration.fullName}
//     </td>
//     <td className="px-4 py-2">
//       <Mail size={16} className="inline mr-2 text-gray-600" />
//       {registration.email}
//     </td>
//     <td className="px-4 py-2">
//       <Phone size={16} className="inline mr-2 text-gray-600" />
//       {registration.mobileNumber}
//     </td>
//     <td className="px-4 py-2">
//       <Globe size={16} className="inline mr-2 text-gray-600" />
//       {registration.countryOfResidence}
//     </td>
//     <td className="px-4 py-2">
//       <Briefcase size={16} className="inline mr-2 text-gray-600" />
//       {registration.careerStatus}
//     </td>
//     <td className="px-4 py-2">
//       <Target size={16} className="inline mr-2 text-gray-600" />
//       {registration.interestAndAim}
//     </td>
//     <td className="px-4 py-2">
//       <Users size={16} className="inline mr-2 text-gray-600" />
//       {registration.managesImmigrantCommunity ? "Yes" : "No"}
//     </td>
//     <td className="px-4 py-2">
//       <Building size={16} className="inline mr-2 text-gray-600" />
//       {registration.company}
//     </td>
//     <td className="px-4 py-2">{registration.eventTitle}</td>
//     <td className="px-4 py-2">{registration.eventCategory}</td>
//     <td className="px-4 py-2">
//       <Calendar size={16} className="inline mr-2 text-gray-600" />
//       {moment(registration.registrationDate).format("MMMM D, HH:mm")}
//     </td>
//     <td className="px-4 py-2">
//       <button
//         onClick={() => onDelete(registration._id)}
//         className="text-red-600 hover:text-red-800 transition duration-200"
//         aria-label="Delete Registration">
//         <Trash2 size={18} />
//       </button>
//     </td>
//   </tr>
// ));

// const StatsDisplay = memo(({ totalRegistrations }) => (
//   <div className="flex gap-2 text-sm">
//     <span className="text-gray-700 font-semibold">
//       Total Registrations: {totalRegistrations}
//     </span>
//   </div>
// ));

// export default function EventRegistration() {
//   const [registrations, setRegistrations] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState("");
//   const [totalRegistrations, setTotalRegistrations] = useState(0);
//   const [availableEvents, setAvailableEvents] = useState([]);
//   const [allEvents, setAllEvents] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [registrationToDelete, setRegistrationToDelete] = useState(null); // State for individual deletion

//   const showAlertMessage = (message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);
//   };

//   const fetchAllEvents = useCallback(async () => {
//     try {
//       const res = await fetch(`${backendURL}/api/getAllRegisteredEvents`);
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error("Failed to fetch events");
//       }
//       const ListData = data.registrations;
//       const uniqueEvents = [
//         ...new Set(ListData.map((event) => event.eventTitle)),
//       ];
//       setAllEvents(uniqueEvents);
//     } catch (error) {
//       console.error("Error fetching all events:", error);
//       showAlertMessage("Failed to fetch events list", "error");
//     }
//   }, []);

//   const fetchRegistrations = useCallback(
//     async (pageNum = 1) => {
//       try {
//         setLoading(true);
//         const url = new URL(`${backendURL}/api/getAllRegisteredEvents`);
//         url.searchParams.append("startIndex", (pageNum - 1) * limit);
//         url.searchParams.append("limit", limit);
//         if (selectedEvent) {
//           url.searchParams.append("eventTitle", selectedEvent);
//         }

//         const res = await fetch(url);
//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.message || "Failed to fetch registrations");
//         }

//         setRegistrations(data.registrations);
//         setTotalRegistrations(data.totalRegistrations);

//         if (pageNum === 1) {
//           const currentEvents = [
//             ...new Set(data.registrations.map((r) => r.eventTitle)),
//           ];
//           setAvailableEvents(currentEvents);
//         }
//       } catch (error) {
//         console.error("Error fetching registrations:", error);
//         showAlertMessage("Failed to fetch event registrations", "error");
//       } finally {
//         setLoading(false);
//         setInitialLoading(false);
//       }
//     },
//     [selectedEvent, limit]
//   );

//   const handleFilter = useCallback((event) => {
//     setSelectedEvent(event);
//     setRegistrations([]);
//     setPage(1);
//   }, []);

//   useEffect(() => {
//     fetchAllEvents();
//   }, [fetchAllEvents]);

//   useEffect(() => {
//     fetchRegistrations(page);
//   }, [fetchRegistrations, page, selectedEvent]);

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleDeleteByEvent = useCallback(async () => {
//     if (!selectedEvent) {
//       showAlertMessage("Please select an event to delete", "error");
//       return;
//     }

//     try {
//       const res = await fetch(`${backendURL}/api/handleDeleteByEvent`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ eventTitle: selectedEvent }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to delete registrations");
//       }

//       showAlertMessage(
//         `Deleted all registrations for ${selectedEvent}`,
//         "success"
//       );

//       setSelectedEvent("");
//       setShowDeleteModal(false);
//       fetchRegistrations(page);
//       fetchAllEvents();
//     } catch (error) {
//       console.error("Error deleting registrations:", error);
//       showAlertMessage("Failed to delete registrations", "error");
//     }
//   }, [selectedEvent, fetchRegistrations, fetchAllEvents, page]);

//   const handleDeleteRegistration = useCallback(async (registrationId) => {
//     setRegistrationToDelete(registrationId);
//     setShowDeleteModal(true); // Reuse the existing modal for individual deletion
//   }, []);

//   const confirmDeleteRegistration = useCallback(async () => {
//     if (!registrationToDelete) return;

//     try {
//       const res = await fetch(
//         `${backendURL}/api/deleteEvent/${registrationToDelete}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (res.ok) {
//         setRegistrations(
//           registrations.filter((r) => r._id !== registrationToDelete)
//         );
//         setTotalRegistrations((prev) => prev - 1);
//         showAlertMessage("Registration deleted successfully!", "success");
//       } else {
//         throw new Error("Failed to delete registration");
//       }
//     } catch (error) {
//       console.error("Error deleting registration:", error);
//       showAlertMessage("Failed to delete registration", "error");
//     } finally {
//       setShowDeleteModal(false);
//       setRegistrationToDelete(null);
//     }
//   }, [registrationToDelete, registrations]);

//   if (initialLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">
//             Event Registrations
//           </h1>
//           <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
//             Create New Registration
//           </button>
//         </div>
//         <div className="mb-6">
//           <div className="relative">
//             <select
//               value={selectedEvent}
//               onChange={(e) => handleFilter(e.target.value)}
//               className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500">
//               <option value="">All Events</option>
//               {allEvents.map((event) => (
//                 <option key={event} value={event}>
//                   {event}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown
//               className="absolute left-3 top-2.5 text-gray-400"
//               size={18}
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left text-gray-500">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//               <tr>
//                 <th className="px-4 py-2">Full Name</th>
//                 <th className="px-4 py-2">Email</th>
//                 <th className="px-4 py-2">Mobile Number</th>
//                 <th className="px-4 py-2">Country</th>
//                 <th className="px-4 py-2">Career Status</th>
//                 <th className="px-4 py-2">Interest & Aim</th>
//                 <th className="px-4 py-2">Manages Community</th>
//                 <th className="px-4 py-2">Company</th>
//                 <th className="px-4 py-2">Event Title</th>
//                 <th className="px-4 py-2">Event Category</th>
//                 <th className="px-4 py-2">Registered Date/Time</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {registrations.map((registration) => (
//                 <EventTableRow
//                   key={registration._id}
//                   registration={registration}
//                   onDelete={handleDeleteRegistration}
//                 />
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
//           <span>
//             Showing {(page - 1) * limit + 1} to{" "}
//             {Math.min(page * limit, totalRegistrations)} of {totalRegistrations}{" "}
//             registrations
//           </span>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => handlePageChange(Math.max(page - 1, 1))}
//               disabled={page === 1}
//               className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition duration-200">
//               <ChevronLeft size={16} />
//             </button>
//             <button
//               onClick={() => handlePageChange(page + 1)}
//               disabled={page * limit >= totalRegistrations}
//               className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition duration-200">
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center border-b pb-3">
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Confirm Delete
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setRegistrationToDelete(null);
//                 }}
//                 className="text-gray-500 hover:text-gray-700 transition duration-200">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="py-4">
//               <p className="text-gray-600">
//                 {registrationToDelete
//                   ? "Are you sure you want to delete this registration? This action cannot be undone."
//                   : `Are you sure you want to delete all registrations for ${
//                       selectedEvent || "the selected event"
//                     }? This action cannot be undone.`}
//               </p>
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setRegistrationToDelete(null);
//                 }}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200">
//                 Cancel
//               </button>
//               <button
//                 onClick={
//                   registrationToDelete
//                     ? confirmDeleteRegistration
//                     : handleDeleteByEvent
//                 }
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
//                 <Trash2 size={18} className="inline mr-2" /> Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Alert
//         variant={alertConfig.variant}
//         show={showAlert}
//         onClose={() => setShowAlert(false)}
//         autoClose={true}
//         autoCloseTime={5000}>
//         <AlertDescription>{alertConfig.message}</AlertDescription>
//       </Alert>
//     </div>
//   );
// }
import React, { useEffect, useState, useCallback, memo } from "react";
import moment from "moment";
import {
  Trash2,
  X,
  ChevronDown,
  User,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Target,
  Users,
  Building,
  Calendar,
} from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import LoadingSpinner from "../../components/tools/LoaddingSpinner";
import backendURL from "../../config";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EventTableRow = memo(({ registration }) => (
  <tr
    key={registration._id}
    className="bg-white border-b hover:bg-gray-50 transition duration-200">
    <td className="px-4 py-2">
      <User size={16} className="inline mr-2 text-gray-600" />
      {registration.fullName}
    </td>
    <td className="px-4 py-2">
      <Mail size={16} className="inline mr-2 text-gray-600" />
      {registration.email}
    </td>
    <td className="px-4 py-2">
      <Phone size={16} className="inline mr-2 text-gray-600" />
      {registration.mobileNumber}
    </td>
    <td className="px-4 py-2">
      <Globe size={16} className="inline mr-2 text-gray-600" />
      {registration.countryOfResidence}
    </td>
    <td className="px-4 py-2">
      <Briefcase size={16} className="inline mr-2 text-gray-600" />
      {registration.careerStatus}
    </td>
    <td className="px-4 py-2">
      <Target size={16} className="inline mr-2 text-gray-600" />
      {registration.interestAndAim}
    </td>
    <td className="px-4 py-2">
      <Users size={16} className="inline mr-2 text-gray-600" />
      {registration.managesImmigrantCommunity ? "Yes" : "No"}
    </td>
    <td className="px-4 py-2">
      <Building size={16} className="inline mr-2 text-gray-600" />
      {registration.company}
    </td>
    <td className="px-4 py-2">{registration.eventTitle}</td>
    <td className="px-4 py-2">{registration.eventCategory}</td>
    <td className="px-4 py-2">
      <Calendar size={16} className="inline mr-2 text-gray-600" />
      {moment(registration.registrationDate).format("MMMM D, HH:mm")}
    </td>
  </tr>
));

const StatsDisplay = memo(({ totalRegistrations }) => (
  <div className="flex gap-2 text-sm">
    <span className="text-gray-700 font-semibold">
      Total Registrations: {totalRegistrations}
    </span>
  </div>
));

export default function EventRegistration() {
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
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

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const fetchAllEvents = useCallback(async () => {
    try {
      const res = await fetch(`${backendURL}/api/getAllRegisteredEvents`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }
      const ListData = data.registrations;
      const uniqueEvents = [
        ...new Set(ListData.map((event) => event.eventTitle)),
      ];
      setAllEvents(uniqueEvents);
    } catch (error) {
      console.error("Error fetching all events:", error);
      showAlertMessage("Failed to fetch events list", "error");
    }
  }, []);

  const fetchRegistrations = useCallback(
    async (pageNum = 1) => {
      try {
        setLoading(true);
        const url = new URL(`${backendURL}/api/getAllRegisteredEvents`);
        url.searchParams.append("startIndex", (pageNum - 1) * limit);
        url.searchParams.append("limit", limit);
        if (selectedEvent) {
          url.searchParams.append("eventTitle", selectedEvent);
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch registrations");
        }

        setRegistrations(data.registrations);
        setTotalRegistrations(data.totalRegistrations);

        if (pageNum === 1) {
          const currentEvents = [
            ...new Set(data.registrations.map((r) => r.eventTitle)),
          ];
          setAvailableEvents(currentEvents);
        }
      } catch (error) {
        console.error("Error fetching registrations:", error);
        showAlertMessage("Failed to fetch event registrations", "error");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [selectedEvent, limit]
  );

  const handleFilter = useCallback((event) => {
    setSelectedEvent(event);
    setRegistrations([]);
    setPage(1);
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  useEffect(() => {
    fetchRegistrations(page);
  }, [fetchRegistrations, page, selectedEvent]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDeleteByEvent = useCallback(async () => {
    if (!selectedEvent) {
      showAlertMessage("Please select an event to delete", "error");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/api/handleDeleteByEvent`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventTitle: selectedEvent }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete registrations");
      }

      showAlertMessage(
        data.message ||
          `Deleted ${data.deletedCount} registration(s) for ${selectedEvent}`,
        "success"
      );

      setSelectedEvent("");
      setShowDeleteModal(false);
      fetchRegistrations(page);
      fetchAllEvents();
    } catch (error) {
      console.error("Error deleting registrations:", error);
      showAlertMessage(
        error.message || "Failed to delete registrations",
        "error"
      );
    }
  }, [selectedEvent, fetchRegistrations, fetchAllEvents, page]);

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Event Registrations
          </h1>
        </div>
        <div className="mb-6">
          <div className="relative">
            <select
              value={selectedEvent}
              onChange={(e) => handleFilter(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">All Events</option>
              {allEvents.map((event) => (
                <option key={event} value={event}>
                  {event}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Mobile Number</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Career Status</th>
                <th className="px-4 py-2">Interest & Aim</th>
                <th className="px-4 py-2">Manages Community</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Event Title</th>
                <th className="px-4 py-2">Event Category</th>
                <th className="px-4 py-2">Registered Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <EventTableRow
                  key={registration._id}
                  registration={registration}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, totalRegistrations)} of {totalRegistrations}{" "}
            registrations
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition duration-200">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page * limit >= totalRegistrations}
              className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition duration-200">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        {selectedEvent && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors duration-200">
            <Trash2 size={18} /> Delete
          </button>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700 transition duration-200">
                <X size={20} />
              </button>
            </div>
            <div className="py-4">
              <p className="text-gray-600">
                Are you sure you want to delete all registrations for{" "}
                <span className="font-semibold">{selectedEvent}</span>? This
                action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200">
                Cancel
              </button>
              <button
                onClick={handleDeleteByEvent}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
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
