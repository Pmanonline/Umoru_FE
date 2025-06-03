import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Eye,
  Star,
  MessageCircle,
  Trophy,
  Heart,
  Lock,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";
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

const AdminSkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse p-4 bg-white rounded-2xl shadow-md w-full">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
          <div className="flex space-x-4">
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo, token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    awards: { total: 0, lastMonth: 0, recent: [], categories: {} },
    famousPeople: { total: 0, recent: [], categories: {} },
    nominees: { total: 0, recent: [], awardCategories: {} },
    prideEntries: { total: 0, recent: [], categories: {} },
    recommendedPeople: { total: 0, recent: [], categories: {} },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [chartTimeframe, setChartTimeframe] = useState("weekly");

  const showAlertMessage = (message, variant = "default") => {
    setShowAlert(false);
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        const endpoints = [
          {
            name: "awards",
            url: "/getAwards?limit=3",
            process: (data) => ({
              total: data.totalAwards,
              lastMonth: data.lastMonthAwards,
              recent: data.awards,
              categories: data.awards.reduce((acc, award) => {
                acc[award.category] = (acc[award.category] || 0) + 1;
                return acc;
              }, {}),
            }),
          },
          {
            name: "famousPeople",
            url: "/getFamousPeople?limit=3",
            process: (data) => ({
              total: data.totalPeople,
              recent: data.people,
              categories: data.people.reduce((acc, person) => {
                acc[person.category] = (acc[person.category] || 0) + 1;
                return acc;
              }, {}),
            }),
          },
          {
            name: "nominees",
            url: "/getNominees?limit=3",
            process: (data) => ({
              total: data.totalNominees,
              recent: data.nominees,
              awardCategories: data.nominees.reduce((acc, nominee) => {
                acc[nominee.awardCategory] =
                  (acc[nominee.awardCategory] || 0) + 1;
                return acc;
              }, {}),
            }),
          },
          {
            name: "prideEntries",
            url: "/getPrideEntries?limit=3",
            process: (data) => ({
              total: data.totalPrideEntries,
              recent: data.prideEntries,
              categories: data.prideEntries.reduce((acc, entry) => {
                acc[entry.category] = (acc[entry.category] || 0) + 1;
                return acc;
              }, {}),
            }),
          },
          {
            name: "recommendedPeople",
            url: "/getRecommendedPersons?limit=3",
            process: (data) => ({
              total: data.totalPeople,
              recent: data.people,
              categories: data.people.reduce((acc, person) => {
                acc[person.category] = (acc[person.category] || 0) + 1;
                return acc;
              }, {}),
            }),
          },
        ];

        const results = await Promise.all(
          endpoints.map(async ({ name, url, process }) => {
            const response = await fetch(`${backendURL}/api${url}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            if (!response.ok) {
              throw new Error(`Failed to fetch ${name} stats`);
            }
            return { name, data: process(data) };
          })
        );

        const newStats = results.reduce((acc, { name, data }) => {
          acc[name] = data;
          return acc;
        }, {});
        setStats(newStats);
        showAlertMessage("Stats loaded successfully", "success");
      } catch (err) {
        setError("Failed to load stats. Please try again.");
        showAlertMessage(err.message || "Network error.", "destructive");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userInfo, token, navigate]);

  const renderLineChart = () => {
    // Mock data for activity over time (since endpoints don't provide time-series data)
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

  return (
    <div className="min-h-screen bg-white p-6">
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
      {loading ? (
        <>
          <AdminSkeletonGrid />
        </>
      ) : error ? (
        <p className="text-red-600" aria-live="polite">
          {error}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.awards.total}
                </p>
                <p className="text-sm text-gray-500">Total Awards</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.famousPeople.total}
                </p>
                <p className="text-sm text-gray-500">Total Famous People</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.nominees.total}
                </p>
                <p className="text-sm text-gray-500">Total Nominees</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.prideEntries.total}
                </p>
                <p className="text-sm text-gray-500">Total Pride Entries</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.recommendedPeople.total}
                </p>
                <p className="text-sm text-gray-500">
                  Total Recommended People
                </p>
              </div>
            </div>
          </div>

          {/* Subscription and Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </>
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
          </Alert>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
