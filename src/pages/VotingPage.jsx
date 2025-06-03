import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Loader2, ChevronDown, ChevronUp, Info, X } from "lucide-react";
import { FaThumbsUp, FaFingerprint } from "react-icons/fa6";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { useNavigate } from "react-router-dom";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

// Main Component
const VotingPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [nomineesByCategory, setNomineesByCategory] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expandedRules, setExpandedRules] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

  // Memoized derived values
  const categories = useMemo(
    () => Object.keys(nomineesByCategory),
    [nomineesByCategory]
  );

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  // Data fetching
  const fetchNominees = useCallback(async () => {
    if (Object.keys(nomineesByCategory).length > 0) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/getNominees`);
      const nominees = response.data.nominees;

      const grouped = nominees.reduce((acc, nominee) => {
        const category = nominee.awardCategory;
        if (!acc[category]) acc[category] = [];
        acc[category].push({
          ...nominee,
          userVotes: nominee.userVotes ?? 0,
          judgeVotes: nominee.judgeVotes ?? 0,
          adminVotes: nominee.adminVotes ?? 0,
          totalScore: nominee.totalScore ?? 0,
          userVoters: nominee.userVoters ?? nominee.voters ?? [],
        });
        return acc;
      }, {});

      setNomineesByCategory(grouped);
      if (!selectedCategory && Object.keys(grouped).length > 0) {
        setSelectedCategory(Object.keys(grouped)[0]);
      }
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Failed to fetch nominees",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  }, [nomineesByCategory, selectedCategory, showAlertMessage]);

  const fetchLeaderboard = useCallback(
    async (category) => {
      if (
        !category ||
        (leaderboard.length > 0 && leaderboard[0]?.awardCategory === category)
      ) {
        return;
      }

      try {
        const response = await axios.get(`${backendURL}/api/leaderboard`, {
          params: { awardCategory: category },
        });
        setLeaderboard(response.data.nominees);
      } catch (err) {
        showAlertMessage(
          err.response?.data?.message || "Failed to fetch leaderboard",
          "destructive"
        );
      }
    },
    [showAlertMessage]
  );

  // Effects
  useEffect(() => {
    fetchNominees();
  }, [fetchNominees]);

  useEffect(() => {
    if (selectedCategory) {
      fetchLeaderboard(selectedCategory);
    }
  }, [selectedCategory, fetchLeaderboard]);

  // Event handlers
  const handleVoteSelection = useCallback(
    (nominee) => {
      if (!userInfo) {
        setShowLoginModal(true);
        return;
      }
      if (nominee.userVoters.includes(userInfo._id)) {
        showAlertMessage(
          "You have already voted in this category",
          "destructive"
        );
        return;
      }
      setSelectedNominee(nominee);
      setShowConfirmation(true);
    },
    [userInfo, showAlertMessage]
  );

  const confirmVote = useCallback(async () => {
    if (!selectedNominee) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/submitVote/${selectedNominee._id}`,
        { voteType: "user" },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      setNomineesByCategory((prev) => {
        const updated = { ...prev };
        updated[selectedCategory] = updated[selectedCategory].map((nom) =>
          nom._id === selectedNominee._id
            ? { ...nom, ...response.data.nominee }
            : nom
        );
        return updated;
      });

      await fetchLeaderboard(selectedCategory);
      showAlertMessage(`Vote recorded for ${selectedNominee.name}`, "success");
      setShowConfirmation(false);
      setSelectedNominee(null);
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Failed to record vote",
        "destructive"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedNominee,
    selectedCategory,
    fetchLeaderboard,
    userInfo,
    showAlertMessage,
  ]);

  const openDetailsModal = useCallback((nominee) => {
    setShowDetailsModal(nominee);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setShowDetailsModal(null);
  }, []);

  const toggleRules = useCallback(() => {
    setExpandedRules((prev) => !prev);
  }, []);

  const handleCategorySelection = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedNominee(null);
  }, []);

  const openLeaderboardModal = useCallback(() => {
    if (selectedCategory) {
      setShowLeaderboardModal(true);
    } else {
      showAlertMessage("Please select a category first", "destructive");
    }
  }, [selectedCategory, showAlertMessage]);

  const closeLeaderboardModal = useCallback(() => {
    setShowLeaderboardModal(false);
  }, []);

  const handleSuggestNominee = useCallback(() => {
    navigate("/suggest-nominee");
  }, [navigate]);

  const handleViewSuggestedNominees = useCallback(() => {
    navigate("/suggested-nominees");
  }, [navigate]);

  // Memoized components
  const nomineeCards = useMemo(() => {
    if (!selectedCategory || !nomineesByCategory[selectedCategory]) return null;

    return nomineesByCategory[selectedCategory].map((nominee) => (
      <NomineeCard
        key={nominee._id}
        nominee={nominee}
        selectedNominee={selectedNominee}
        userInfo={userInfo}
        onVote={handleVoteSelection}
        onDetails={openDetailsModal}
      />
    ));
  }, [
    selectedCategory,
    nomineesByCategory,
    selectedNominee,
    userInfo,
    handleVoteSelection,
    openDetailsModal,
  ]);

  const leaderboardItems = useMemo(() => {
    if (!selectedCategory || leaderboard.length === 0) return null;

    return leaderboard.map((nominee, index) => (
      <LeaderboardItem key={nominee._id} nominee={nominee} index={index} />
    ));
  }, [leaderboard, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-accent-cream min-h-screen">
      <VotingHeader />

      <div className="grid grid-cols-1 gap-6">
        {/* Nomination Action Buttons - Stack on mobile */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mb-6">
          <button
            onClick={handleSuggestNominee}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm sm:text-base font-medium whitespace-nowrap">
            Suggest a Nominee
          </button>
          <button
            onClick={handleViewSuggestedNominees}
            className="px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-accent-cream transition-colors text-sm sm:text-base font-medium whitespace-nowrap">
            View Suggested Nominees
          </button>
        </div>

        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelection}
          onViewLeaderboard={openLeaderboardModal}
        />

        {selectedCategory && (
          <NomineesGrid
            selectedCategory={selectedCategory}
            nomineesByCategory={nomineesByCategory}
            nomineeCards={nomineeCards}
          />
        )}

        <VotingRules expandedRules={expandedRules} toggleRules={toggleRules} />
      </div>

      {/* Modals */}
      <VoteConfirmationModal
        showConfirmation={showConfirmation}
        selectedNominee={selectedNominee}
        selectedCategory={selectedCategory}
        isSubmitting={isSubmitting}
        onCancel={() => setShowConfirmation(false)}
        onConfirm={confirmVote}
      />

      <NomineeDetailsModal
        showDetailsModal={showDetailsModal}
        userInfo={userInfo}
        onClose={closeDetailsModal}
        onVote={handleVoteSelection}
      />

      <LeaderboardModal
        showLeaderboardModal={showLeaderboardModal}
        selectedCategory={selectedCategory}
        leaderboard={leaderboard}
        leaderboardItems={leaderboardItems}
        onClose={closeLeaderboardModal}
      />

      <LoginRequiredModal
        showLoginModal={showLoginModal}
        onCancel={() => setShowLoginModal(false)}
        onLogin={() => navigate("/login")}
      />

      {showAlert && (
        <AlertNotification
          alertConfig={alertConfig}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

// Sub-components
const NomineeCard = React.memo(
  ({ nominee, selectedNominee, userInfo, onVote, onDetails }) => (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        selectedNominee?._id === nominee._id
          ? "ring-4 ring-sunlit-gold/50 transform -translate-y-1 shadow-lg"
          : "hover:shadow-lg"
      }`}>
      <div
        className="h-40 sm:h-48 overflow-hidden relative cursor-pointer"
        onClick={() => onDetails(nominee)}>
        <img
          src={nominee.image || "/default-profile.jpg"}
          alt={nominee.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/default-profile.jpg";
          }}
        />
        {(nominee.userVoters || []).includes(userInfo?._id) && (
          <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
            <FaThumbsUp className="text-sm" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary truncate">
          {nominee.name}
        </h3>
        <p
          className="text-gray-600 text-sm mb-2 line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: nominee.bio || "No bio available",
          }}
        />
        <div className="flex justify-between items-center flex-wrap gap-2">
          <span className="text-xs font-semibold bg-accent-cream text-primary px-2 py-1 rounded">
            User Votes: {nominee.userVotes || 0}
          </span>
          <span className="text-xs font-semibold bg-sunlit-gold/20 text-sunlit-gold px-2 py-1 rounded">
            Score: {(nominee.totalScore || 0).toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => onVote(nominee)}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            (nominee.userVoters || []).includes(userInfo?._id)
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary text-white hover:bg-secondary"
          }`}
          disabled={(nominee.userVoters || []).includes(userInfo?._id)}>
          <FaFingerprint className="text-base" />
          {(nominee.userVoters || []).includes(userInfo?._id)
            ? "Voted"
            : "Vote Now"}
        </button>
      </div>
    </div>
  )
);

const LeaderboardItem = React.memo(({ nominee, index }) => (
  <div className="flex items-center justify-between p-3 bg-accent-cream rounded-lg">
    <div className="flex items-center space-x-3 min-w-0">
      <span className="text-sm font-bold text-primary flex-shrink-0">
        {index + 1}.
      </span>
      <span className="font-semibold text-sm truncate">{nominee.name}</span>
    </div>
    <div className="flex items-center space-x-2 ml-2">
      <span className="text-xs text-gray-600 whitespace-nowrap">
        <span className="font-semibold">Users:</span> {nominee.userVotes}
      </span>
      <span className="hidden sm:inline text-xs text-gray-600 whitespace-nowrap">
        <span className="font-semibold">Judge:</span>{" "}
        {nominee.judgeVotes ? "✓" : "✗"}
      </span>
      <span className="hidden sm:inline text-xs text-gray-600 whitespace-nowrap">
        <span className="font-semibold">Admin:</span>{" "}
        {nominee.adminVotes ? "✓" : "✗"}
      </span>
      <span className="text-xs font-semibold bg-sunlit-gold/20 text-sunlit-gold px-2 py-1 rounded whitespace-nowrap">
        {(nominee.totalScore || 0).toFixed(2)}
      </span>
    </div>
  </div>
));

const VotingHeader = React.memo(() => (
  <div className="mb-6 text-center">
    <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
      Vote for Global Heroes
    </h1>
    <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
      Your vote counts for 50% of the total score. One judge (30%) and one admin
      (20%) also cast a vote per category.
    </p>
  </div>
));

const CategorySelector = React.memo(
  ({ categories, selectedCategory, onSelect, onViewLeaderboard }) => (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
        <h2 className="text-lg font-semibold text-primary">Award Categories</h2>
        <button
          onClick={onViewLeaderboard}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            selectedCategory
              ? "bg-primary text-white hover:bg-secondary"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!selectedCategory}>
          View Leaderboard
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`px-3 py-1.5 rounded-full transition-colors text-xs sm:text-sm font-medium whitespace-nowrap ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-white text-primary hover:bg-accent-cream"
            }`}>
            {category}
          </button>
        ))}
      </div>
    </div>
  )
);

const LeaderboardModal = React.memo(
  ({
    showLeaderboardModal,
    selectedCategory,
    leaderboard,
    leaderboardItems,
    onClose,
  }) =>
    showLeaderboardModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-primary flex items-center">
              {selectedCategory} Leaderboard
              <span className="ml-2 relative group">
                <Info className="w-4 h-4 text-gray-500" />
                <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 w-56">
                  Ranked by total score: 50% user votes, 30% judge vote, 20%
                  admin vote.
                </div>
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          {leaderboard.length > 0 ? (
            <div className="divide-y">{leaderboardItems}</div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900">
                No leaderboard data available
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Nominees may not have received votes yet.
              </p>
            </div>
          )}
        </div>
      </div>
    )
);

const NomineesGrid = React.memo(
  ({ selectedCategory, nomineesByCategory, nomineeCards }) =>
    nomineesByCategory[selectedCategory] ? (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3">
          {selectedCategory} Nominees
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nomineeCards}
        </div>
      </div>
    ) : (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">
          No nominees available
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Check back later for voting opportunities.
        </p>
      </div>
    )
);

const VotingRules = React.memo(({ expandedRules, toggleRules }) => (
  <div className="bg-white rounded-lg shadow-sm">
    <div
      className="flex items-center justify-between p-4 cursor-pointer"
      onClick={toggleRules}>
      <h3 className="font-bold text-base text-primary">Voting Rules</h3>
      {expandedRules ? (
        <ChevronUp className="w-5 h-5 text-gray-600" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-600" />
      )}
    </div>
    {expandedRules && (
      <div className="p-4 pt-0">
        <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
          <li>One vote per user per category (50% of total score).</li>
          <li>One judge vote per category (30% of total score).</li>
          <li>One admin vote per category (20% of total score).</li>
          <li>Votes are final and cannot be changed.</li>
          <li>Ensure you are logged in to cast your vote.</li>
        </ul>
      </div>
    )}
  </div>
));

const VoteConfirmationModal = React.memo(
  ({
    showConfirmation,
    selectedNominee,
    selectedCategory,
    isSubmitting,
    onCancel,
    onConfirm,
  }) =>
    showConfirmation &&
    selectedNominee && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full animate-fade-in">
          <div className="p-6">
            <h3 className="text-xl font-bold text-primary mb-4">
              Confirm Your Vote
            </h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-accent-cream flex-shrink-0">
                <img
                  src={selectedNominee.image || "/default-profile.jpg"}
                  alt={selectedNominee.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-lg truncate">
                  {selectedNominee.name}
                </h4>
                <p className="text-gray-600 text-sm truncate">
                  {selectedCategory}
                </p>
              </div>
            </div>
            <p className="mb-6 text-gray-600 text-sm">
              You're about to vote for{" "}
              <span className="font-semibold">{selectedNominee.name}</span>.
              Your vote contributes 50% to their score. This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}>
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <FaFingerprint />
                    Confirm Vote
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
);

const NomineeDetailsModal = React.memo(
  ({ showDetailsModal, userInfo, onClose, onVote }) =>
    showDetailsModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold text-primary truncate max-w-[80%]">
              {showDetailsModal.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <img
                src={showDetailsModal.image || "/default-profile.jpg"}
                alt={showDetailsModal.name}
                className="w-full h-60 object-cover rounded-lg"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/default-profile.jpg";
                }}
              />
            </div>
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-primary">
                {showDetailsModal.awardCategory}
              </h4>
              <div
                className="text-gray-600 text-sm"
                dangerouslySetInnerHTML={{
                  __html: showDetailsModal.bio || "No bio available",
                }}
              />
            </div>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <span className="text-xs font-semibold bg-accent-cream text-primary px-2 py-1 rounded">
                User Votes: {showDetailsModal.userVotes || 0}
              </span>
              <span className="text-xs font-semibold bg-global-teal/20 text-global-teal px-2 py-1 rounded">
                Judge Vote:{" "}
                {showDetailsModal.judgeVotes ? "Voted" : "Not Voted"}
              </span>
              <span className="text-xs font-semibold bg-unity-coral/20 text-unity-coral px-2 py-1 rounded">
                Admin Vote:{" "}
                {showDetailsModal.adminVotes ? "Voted" : "Not Voted"}
              </span>
            </div>
            <div className="text-center mb-4">
              <span className="text-xs font-semibold bg-sunlit-gold/20 text-sunlit-gold px-2 py-1 rounded">
                Total Score: {(showDetailsModal.totalScore || 0).toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onVote(showDetailsModal);
              }}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                (showDetailsModal.userVoters || []).includes(userInfo?._id)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-primary text-white hover:bg-secondary"
              }`}
              disabled={(showDetailsModal.userVoters || []).includes(
                userInfo?._id
              )}>
              <FaFingerprint className="text-lg" />
              {(showDetailsModal.userVoters || []).includes(userInfo?._id)
                ? "Voted"
                : "Vote Now"}
            </button>
          </div>
        </div>
      </div>
    )
);

const LoginRequiredModal = React.memo(
  ({ showLoginModal, onCancel, onLogin }) =>
    showLoginModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full animate-fade-in">
          <div className="p-6">
            <h3 className="text-xl font-bold text-primary mb-4">
              Login Required
            </h3>
            <p className="mb-6 text-gray-600 text-sm">
              You need to be logged in to cast your vote. Please log in to
              continue.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={onLogin}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
);

const AlertNotification = React.memo(({ alertConfig, onClose }) => (
  <div className="fixed bottom-4 right-4 z-50 max-w-xs w-full">
    <Alert variant={alertConfig.variant} onClose={onClose}>
      <AlertDescription className="text-sm">
        {alertConfig.message}
      </AlertDescription>
    </Alert>
  </div>
));

export default VotingPage;
