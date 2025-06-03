import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Alert, AlertDescription } from "../../../components/tools/Alert";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const AdminJudgeVoting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nomineesByCategory, setNomineesByCategory] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [adminVotes, setAdminVotes] = useState({}); // Track admin votes { category: nomineeId }
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const { userInfo } = useSelector((state) => state.auth);

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const fetchNominees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/getNominees`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const nominees = response.data.nominees;

      // Group nominees by category
      const grouped = nominees.reduce((acc, nominee) => {
        const category = nominee.awardCategory;
        if (!acc[category]) acc[category] = [];
        acc[category].push({
          ...nominee,
          // Fallback for older schema
          userVotes: nominee.userVotes ?? nominee.votes ?? 0,
          judgeVotes: nominee.judgeVotes ?? 0,
          adminVotes: nominee.adminVotes ?? 0,
          totalScore: nominee.totalScore ?? 0,
          userVoters: nominee.userVoters ?? nominee.voters ?? [],
          judgeVoters: nominee.judgeVoters ?? [],
          adminVoters: nominee.adminVoters ?? [],
        });
        return acc;
      }, {});

      setNomineesByCategory(grouped);
      // Initialize expanded state for all categories
      setExpandedCategories(
        Object.keys(grouped).reduce((acc, category) => {
          acc[category] = true;
          return acc;
        }, {})
      );
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Failed to fetch nominees",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchNominees();
  }, [fetchNominees]);

  const handleVote = async (nomineeId, voteType, category) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/submitVote/${nomineeId}`,
        { voteType },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      // Update local state
      setNomineesByCategory((prev) => {
        const updatedCategory = prev[category].map((nominee) =>
          nominee._id === nomineeId
            ? { ...nominee, ...response.data.nominee }
            : nominee
        );
        return { ...prev, [category]: updatedCategory };
      });

      if (voteType === "admin") {
        setAdminVotes((prev) => ({ ...prev, [category]: nomineeId }));
      }

      showAlertMessage(`Vote recorded successfully as ${voteType}`, "success");
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Failed to record vote",
        "destructive"
      );
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl bg-accent-cream mt-12">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary">
            Admin Voting Panel
          </h1>
          <p className="text-gray-600 mt-2 text-xs sm:text-sm">
            Vote for one nominee per category (Admin: 20%) and assign Judge
            votes (30%). User votes contribute 50%.
          </p>
        </div>
      </div>

      {/* Categories and Nominees */}
      {Object.keys(nomineesByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(nomineesByCategory).map(([category, nominees]) => (
            <div key={category} className="bg-white rounded-lg shadow-sm">
              <div
                className="flex items-center justify-between p-4 sm:p-6 cursor-pointer"
                onClick={() => toggleCategory(category)}>
                <h2 className="text-lg sm:text-xl font-semibold text-primary">
                  {category} {adminVotes[category] ? "(Voted)" : ""}
                </h2>
                {expandedCategories[category] ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
              {expandedCategories[category] && (
                <div className="p-4 sm:p-6 pt-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-primary text-white">
                        <tr>
                          <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                            Image
                          </th>
                          <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider w-2/12">
                            Name
                          </th>
                          <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider w-3/12">
                            Bio
                          </th>
                          <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                            User Votes (50%)
                          </th>
                          <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                            Judge Votes (30%)
                          </th>
                          <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                            Admin Votes (20%)
                          </th>
                          <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                            Total Score
                          </th>
                          <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider w-2/12">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {nominees.map((nominee) => (
                          <tr key={nominee._id} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                              {nominee.image ? (
                                <img
                                  src={nominee.image}
                                  alt={nominee.name}
                                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover border border-gray-200"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.src = "/default-profile.jpg";
                                  }}
                                />
                              ) : (
                                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">
                                    No Image
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                              <span className="text-xs sm:text-sm font-medium text-primary">
                                {nominee.name}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-2 sm:py-3">
                              <div
                                className="text-xs sm:text-sm text-gray-600 line-clamp-2"
                                dangerouslySetInnerHTML={{
                                  __html: nominee.bio,
                                }}
                              />
                            </td>
                            <td className="px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                              <span className="text-xs sm:text-sm text-gray-600">
                                {nominee.userVotes}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                              <span className="text-xs sm:text-sm text-gray-600">
                                {nominee.judgeVotes}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                              <span className="text-xs sm:text-sm text-gray-600">
                                {nominee.adminVotes}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                              <span className="text-xs sm:text-sm text-gray-600">
                                {nominee.totalScore.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap flex space-x-2">
                              <button
                                onClick={() =>
                                  handleVote(nominee._id, "admin", category)
                                }
                                className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-secondary disabled:bg-sunlitgold/50 disabled:cursor-not-allowed"
                                title="Vote as Admin"
                                aria-label={`Vote as Admin for ${nominee.name}`}
                                disabled={nominee.adminVoters.includes(
                                  userInfo._id
                                )}>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Admin Vote
                              </button>
                              <button
                                onClick={() =>
                                  handleVote(nominee._id, "judge", category)
                                }
                                className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-secondary disabled:bg-sunlitgold/50 disabled:cursor-not-allowed"
                                title="Assign Judge Vote"
                                aria-label={`Assign Judge Vote for ${nominee.name}`}>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Judge Vote
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg
              className="mx-auto w-10 sm:w-12 h-10 sm:h-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900">
            No nominees found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Create nominees to start voting.
          </p>
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
};

export default AdminJudgeVoting;
