// StatCard Component (kept separate for reusability)
const StatCard = ({ title, number, description, className = "" }) => (
  <div
    className={`p-6 rounded-lg shadow-sm flex-shrink-0 w-[280px] md:w-auto ${className}`}>
    <h1 className="text-2xl font-bold text-center mb-3">{title}</h1>
    <h3 className="text-4xl font-bold text-center mb-3">
      {number.toLocaleString()}
    </h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

// EDirectNumbers Component
const EDirectNumbers = () => {
  const stats = [
    {
      title: "Registered Businesses",
      number: 51,
      description: "Total number of businesses registered on the platform",
      className: "bg-blue-50 hover:shadow-lg",
    },
    {
      title: "Registered Users",
      number: 22,
      description: "Total number of users registered on the platform",
      className: "bg-[#f6fef8] hover:shadow-lg",
    },
    {
      title: "Blacklisted Companies",
      number: 0,
      description: "Total number of blacklisted businesses and users",
      className: "bg-red-50 hover:shadow-lg",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 px-4">
      <h2 className="text-4xl font-semibold text-center text-blue-500 mb-4">
        E-direct in Numbers
      </h2>
      <p className="text-center text-gray-600 mb-8">
        A quick overview of the key statistics at a glance.
      </p>

      {/* Sidescroll on medium and below, grid on larger screens */}
      <div className="md:grid md:grid-cols-3 md:gap-6 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            number={stat.number}
            description={stat.description}
            className={stat.className}
          />
        ))}
      </div>
    </div>
  );
};

export default EDirectNumbers;
