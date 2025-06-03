import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  MessageCircle,
  CheckCircle,
  Lock,
  RefreshCw,
} from "lucide-react";
import moment from "moment";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const UserTableRow = React.memo(({ user, onDeleteClick }) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {moment(user.createdAt).format("MMM D, YYYY")}
        </div>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        {user.image ? (
          <img
            src={`${backendURL}/uploads/${user.image}`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/default-profile.jpg";
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">No Image</span>
          </div>
        )}
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <span className="text-sm font-medium text-blue-600">{user.name}</span>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <span className="text-sm text-gray-900">{user.email}</span>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {user.role || "User"}
        </span>
      </td>
      <td className="py-4 px-6 whitespace-nowrap flex space-x-2">
        <button
          onClick={() => onDeleteClick(user._id)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
});

export default function AdminALlUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [chartTimeframe, setChartTimeframe] = useState("weekly");

  const { userInfo } = useSelector((state) => state.auth);
  const limit = 5;

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const debounceSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 500),
    []
  );

  useEffect(() => {
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]);

  const fetchUsers = useCallback(async (page = 1, search = "", role = "") => {
    setIsLoading(true);
    try {
      let url = `${backendURL}/api/getUsers?page=${page}&limit=${limit}&sort=desc`;
      if (search) url += `&searchTerm=${search}`;
      if (role) url += `&role=${role}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        setTotalPages(data.totalPages);
        setLastMonthUsers(data.lastMonthUsers);
        setCurrentPage(page);
      } else {
        showAlertMessage(
          data.message || "Failed to fetch users",
          "destructive"
        );
      }
    } catch (error) {
      showAlertMessage(
        error.message || "An error occurred while fetching users",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const roles = useMemo(() => {
    const uniqueRoles = [
      ...new Set(users.map((user) => user.role || "User")),
    ].sort();
    return uniqueRoles;
  }, [users]);

  useEffect(() => {
    if (!userInfo) return;

    fetchUsers(currentPage, debouncedSearchTerm, filterRole);
  }, [userInfo, currentPage, debouncedSearchTerm, filterRole, fetchUsers]);

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `${backendURL}/api/deleteUserById/${userIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setTotalUsers((prev) => prev - 1);
        showAlertMessage("User deleted successfully", "success");
        setDeleteOpen(false);
      } else {
        showAlertMessage(
          data.message || "Failed to delete user",
          "destructive"
        );
      }
    } catch (error) {
      showAlertMessage(
        error.message || "An error occurred while deleting user",
        "destructive"
      );
    }
  };

  const handleDeleteClick = (userId) => {
    setUserIdToDelete(userId);
    setDeleteOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterRole("");
  };

  const renderLineChart = () => {
    const dataMap = {
      weekly: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [0.1, 0.2, 0.3, 0.2, 0.4, 0.5, 0.3],
      },
      monthly: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        values: [0.5, 0.7, 0.6, 0.8],
      },
      yearly: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        values: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.5, 0.4, 0.3, 0.2, 0.1, 0.3],
      },
    };

    const { labels, values } = dataMap[chartTimeframe];

    const chartData = {
      labels,
      datasets: [
        {
          label: "Activity",
          data: values,
          borderColor: "rgba(37, 99, 235, 1)", // blue-600
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(37, 99, 235, 1)",
          pointBorderColor: "rgba(37, 99, 235, 1)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Activity Over Time" },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: { stepSize: 0.1 },
        },
      },
    };

    return <Line data={chartData} options={options} />;
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 md:p-6 lg:p-8 max-w-7xl bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, {userInfo?.name || "Admin"}!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
            <RefreshCw className="w-4 h-4 text-gray-500 cursor-pointer" />
            <span className="text-sm font-semibold text-green-600">PUBLIC</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{lastMonthUsers}</p>
            <p className="text-sm text-gray-500">Last Month Users</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">Engagements</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">0%</p>
            <p className="text-sm text-gray-500">User Verification</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">No</p>
            <p className="text-sm text-gray-500">Business Verification</p>
          </div>
        </div>
      </div>

      {/* Subscription and Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Chart Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Activity Over Time
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setChartTimeframe("weekly")}
                className={`text-sm ${chartTimeframe === "weekly" ? "text-blue-600 underline" : "text-gray-500"}`}>
                Weekly
              </button>
              <button
                onClick={() => setChartTimeframe("monthly")}
                className={`text-sm ${chartTimeframe === "monthly" ? "text-blue-600 underline" : "text-gray-500"}`}>
                Monthly
              </button>
              <button
                onClick={() => setChartTimeframe("yearly")}
                className={`text-sm ${chartTimeframe === "yearly" ? "text-blue-600 underline" : "text-gray-500"}`}>
                Yearly
              </button>
            </div>
          </div>
          <div className="h-64">{renderLineChart()}</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Manage Users</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date Registered
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <UserTableRow
                    key={user._id}
                    user={user}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => fetchUsers(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    currentPage === 1
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  }`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => fetchUsers(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    currentPage === totalPages
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  }`}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterRole
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating a new user"}
            </p>
            <div className="mt-6">
              <Link
                to="/Admin/CreateUser"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New User
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Are you sure you want to delete this user?
            </h3>
            <p className="text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex items-center px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                <Trash2 className="w-5 h-5 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Component */}
      {showAlert && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert
            variant={alertConfig.variant}
            onClose={() => setShowAlert(false)}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
