import React from "react";

const StoriesSection = () => {
  // Sample data for stories (replace with actual data)
  const stories = [
    {
      id: 1,
      title: "The Journey of John Adebayo",
      image: "/path/to/story-image-1.jpg",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipiscing elit. Aperiam minima porro, ut hic doloremque, voluptate dolore ad, deserunt obcaecati quasi esse ab? Officiis aut eaque et delectus expedita architecto cupiditate.",
    },
    {
      id: 2,
      title: "Aisha Bello's Legacy",
      image: "/path/to/story-image-2.jpg",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipiscing elit. Aperiam minima porro, ut hic doloremque, voluptate dolore ad, deserunt obcaecati quasi esse ab? Officiis aut eaque et delectus expedita architecto cupiditate.",
    },
    {
      id: 3,
      title: "Chukwuma Okeke's Impact",
      image: "/path/to/story-image-3.jpg",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipiscing elit. Aperiam minima porro, ut hic doloremque, voluptate dolore ad, deserunt obcaecati quasi esse ab? Officiis aut eaque et delectus expedita architecto cupiditate.",
    },
  ];

  return (
    <section
      className="w-full py-12 px-4 bg-gradient-to-b from-white to-green-50 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 64, 0, 0.05), rgba(0, 128, 0, 0.02))`,
      }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800 text-center mb-10">
          Our Inspiring Stories
        </h2>

        {/* Loading State or Content */}
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-gray-300">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {story.description}
                  </p>
                  <a
                    href={`/story/${story.id}`}
                    className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 hover:scale-105 transition-all duration-200">
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-green-800">
            <p className="text-xl">No stories yet. Check back later.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StoriesSection;
