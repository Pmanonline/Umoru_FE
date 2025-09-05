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
    <tr className="border-b border-accent-charcoal/20 dark:border-gray-800/20 hover:bg-white/50 dark:hover:bg-accent-creamDark/50 transition-colors">
      <td className="py-4 px-6 whitespace-nowrap">
        <div className="text-sm text-primary-dark dark:text-white">
          {moment(user.createdAt).format("MMM D, YYYY")}
        </div>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        {user.image ? (
          <img
            src={`${backendURL}/Uploads/${user.image}`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-accent-charcoal/20 dark:border-gray-800/20"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/default-profile.jpg";
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-accent-creamDark/90 flex items-center justify-center border border-accent-charcoal/20 dark:border-gray-800/20">
            <span className="text-xs text-accent-charcoal dark:text-white">
              No Image
            </span>
          </div>
        )}
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <span className="text-sm font-medium text-primary-light dark:text-primary-light">
          {user.name}
        </span>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <span className="text-sm text-primary-dark dark:text-white">
          {user.email}
        </span>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-accent-teal/20 text-accent-teal dark:bg-accent-teal/30 dark:text-accent-teal">
          {user.role || "User"}
        </span>
      </td>
      <td className="py-4 px-6 whitespace-nowrap flex space-x-2">
        <button
          onClick={() => onDeleteClick(user._id)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-accent-red to-accent-red/80 hover:from-accent-red/80 hover:to-accent-red/60 focus:ring-2 focus:ring-primary-light"
          title="Delete"
          aria-label={`Delete user ${user.name}`}>
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
});

export default function AdminAllUsers() {
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
        showAlertMessage(data.message || "Failed to fetch users", "error");
      }
    } catch (error) {
      showAlertMessage(
        error.message || "An error occurred while fetching users",
        "error"
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
        showAlertMessage(data.message || "Failed to delete user", "error");
      }
    } catch (error) {
      showAlertMessage(
        error.message || "An error occurred while deleting user",
        "error"
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
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--primary-light) / 0.2)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "hsl(var(--primary))",
          pointBorderColor: "hsl(var(--primary))",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Activity Over Time",
          color: "hsl(var(--primary-dark))",
          font: { size: 16 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: {
            stepSize: 0.1,
            color: "hsl(var(--primary-dark))",
          },
          grid: {
            color: "hsl(var(--accent-charcoal) / 0.1)",
          },
        },
        x: {
          ticks: {
            color: "hsl(var(--primary-dark))",
          },
          grid: {
            color: "hsl(var(--accent-charcoal) / 0.1)",
          },
        },
      },
    };

    return <Line data={chartData} options={options} />;
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-accent-creamDark">
        <Loader2 className="w-8 h-8 text-accent-teal animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl bg-white dark:bg-accent-creamDark text-primary-dark dark:text-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark dark:text-white">
              My Dashboard
            </h1>
            <p className="text-sm sm:text-base text-accent-charcoal dark:text-white/80">
              Welcome back, {userInfo?.name || "Admin"}!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm sm:text-base text-accent-charcoal dark:text-white/80">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
            <RefreshCw className="w-4 h-4 text-accent-teal cursor-pointer" />
            <span className="text-sm font-semibold text-accent-green">
              PUBLIC
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
        <div className="bg-white/90 dark:bg-accent-creamDark/90 p-4 rounded-xl shadow-sm border border-accent-charcoal/20 dark:border-gray-800/20 flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-teal/20 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-accent-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-dark dark:text-white">
              {totalUsers}
            </p>
            <p className="text-sm sm:text-base text-accent-charcoal dark:text-white/80">
              Total Users
            </p>
          </div>
        </div>
        <div className="bg-white/90 dark:bg-accent-creamDark/90 p-4 rounded-xl shadow-sm border border-accent-charcoal/20 dark:border-gray-800/20 flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-teal/20 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-dark dark:text-white">
              {lastMonthUsers}
            </p>
            <p className="text-sm sm:text-base text-accent-charcoal dark:text-white/80">
              Last Month Users
            </p>
          </div>
        </div>
        <div className="bg-white/90 dark:bg-accent-creamDark/90 p-4 rounded-xl shadow-sm border border-accent-charcoal/20 dark:border-gray-800/20 flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-teal/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-accent-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-dark dark:text-white">
              0
            </p>
            <p className="text-sm sm:text-base text-accent-charcoal dark:text-white/80">
              Engagements
            </p>
          </div>
        </div>
        <div className="bg-white/90 dark:bg-accent-creamDark/90 p-4 rounded-xl shadow-sm border border-accent-charcoal/20 dark:border-gray-800/20 flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-teal/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-accent-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-dark dark:text-white">
              0%
            </p>
            <p className="text-sm sm:text-base text-accent-charcoal dark:text-white/80">
              User Verification
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-white/90 dark:bg-accent-creamDark/90 p-4 sm:p-5 rounded-xl shadow-sm border border-accent-charcoal/20 dark:border-gray-800/20 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-primary-dark dark:text-white">
              Activity Over Time
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setChartTimeframe("weekly")}
                className={`text-sm sm:text-base ${chartTimeframe === "weekly" ? "text-primary-light underline" : "text-accent-charcoal dark:text-white/80 hover:text-primary-light"}`}>
                Weekly
              </button>
              <button
                onClick={() => setChartTimeframe("monthly")}
                className={`text-sm sm:text-base ${chartTimeframe === "monthly" ? "text-primary-light underline" : "text-accent-charcoal dark:text-white/80 hover:text-primary-light"}`}>
                Monthly
              </button>
              <button
                onClick={() => setChartTimeframe("yearly")}
                className={`text-sm sm:text-base ${chartTimeframe === "yearly" ? "text-primary-light underline" : "text-accent-charcoal dark:text-white/80 hover:text-primary-light"}`}>
                Yearly
              </button>
            </div>
          </div>
          <div className="h-64">{renderLineChart()}</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/90 dark:bg-accent-creamDark/90 rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-accent-charcoal/20 dark:border-gray-800/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary-dark dark:text-white">
            Manage Users
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-accent-teal" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 sm:py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-gray-800/20 bg-white/90 dark:bg-gray-800/90 text-primary-dark dark:text-white placeholder-accent-charcoal/50 dark:placeholder-white/50 focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
              aria-label="Search users by name or email"
            />
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 sm:py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-gray-800/20 bg-white/90 dark:bg-gray-800/90 text-primary-dark dark:text-white focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
              aria-label="Filter by role">
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
            className="px-4 py-2 sm:py-3 border-2 border-accent-charcoal/20 dark:border-gray-800/20 rounded-xl text-sm sm:text-base text-primary-dark dark:text-white hover:bg-primary-light/10 dark:hover:bg-primary-darkMode/10 transition-all focus:ring-2 focus:ring-primary-light"
            aria-label="Reset filters">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/90 dark:bg-accent-creamDark/90 shadow-sm rounded-xl overflow-hidden border border-accent-charcoal/20 dark:border-gray-800/20">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-accent-charcoal/20 dark:divide-gray-800/20">
              <thead className="bg-primary-dark dark:bg-primary-darkMode text-white">
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
              <tbody className="bg-white dark:bg-accent-creamDark divide-y divide-accent-charcoal/20 dark:divide-gray-800/20">
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
              <div className="px-6 py-4 border-t border-accent-charcoal/20 dark:border-gray-800/20 flex justify-between items-center">
                <button
                  onClick={() => fetchUsers(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center px-4 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-xl ${
                    currentPage === 1
                      ? "text-accent-charcoal/50 dark:text-white/50 bg-white/50 dark:bg-accent-creamDark/50 cursor-not-allowed"
                      : "text-primary-dark dark:text-white bg-primary-light/20 dark:bg-primary-darkMode/20 hover:bg-primary-light/30 dark:hover:bg-primary-darkMode/30"
                  } focus:ring-2 focus:ring-primary-light`}
                  aria-label="Previous page">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Previous
                </button>
                <span className="text-sm sm:text-base text-accent-charcoal dark:text-white/80">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => fetchUsers(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-4 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-xl ${
                    currentPage === totalPages
                      ? "text-accent-charcoal/50 dark:text-white/50 bg-white/50 dark:bg-accent-creamDark/50 cursor-not-allowed"
                      : "text-primary-dark dark:text-white bg-primary-light/20 dark:bg-primary-darkMode/20 hover:bg-primary-light/30 dark:hover:bg-primary-darkMode/30"
                  } focus:ring-2 focus:ring-primary-light`}
                  aria-label="Next page">
                  Next
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-accent-charcoal dark:text-white/80 mb-4">
              <svg
                className="mx-auto h-12 w-12"
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
            <h3 className="text-lg sm:text-xl font-medium text-primary-dark dark:text-white">
              No users found
            </h3>
            <p className="mt-1 text-sm sm:text-base text-accent-charcoal dark:text-white/80">
              {searchTerm || filterRole
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating a new user"}
            </p>
            <div className="mt-6">
              <Link
                to="/Admin/CreateUser"
                className="inline-flex items-center px-4 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light focus:ring-2 focus:ring-primary-light"
                aria-label="Create new user">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                New User
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="delete-modal-title"
          aria-modal="true">
          <div className="bg-white dark:bg-accent-creamDark rounded-xl shadow-xl max-w-md w-full p-6 border border-accent-charcoal/20 dark:border-gray-800/20">
            <h3
              id="delete-modal-title"
              className="text-lg sm:text-xl font-semibold text-primary-dark dark:text-white mb-2">
              Are you sure you want to delete this user?
            </h3>
            <p className="text-sm sm:text-base text-accent-charcoal dark:text-white/80 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 sm:py-3 text-sm sm:text-base text-primary-dark dark:text-white border-2 border-accent-charcoal/20 dark:border-gray-800/20 rounded-xl hover:bg-primary-light/10 dark:hover:bg-primary-darkMode/10 transition-all focus:ring-2 focus:ring-primary-light"
                aria-label="Cancel">
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex items-center px-4 py-2 sm:py-3 text-sm sm:text-base text-white bg-gradient-to-r from-accent-red to-accent-red/80 hover:from-accent-red/80 hover:to-accent-red/60 rounded-xl focus:ring-2 focus:ring-primary-light"
                aria-label="Confirm delete user">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseTime={5000}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
            {alertConfig.variant === "success" ? (
              <CheckCircle className="w-5 h-5 text-accent-green ml-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-accent-red ml-2" />
            )}
          </Alert>
        </div>
      )}
    </div>
  );
}
