import React from "react";

const PrideSection = () => {
  // Sample data for pride events or highlights (replace with actual data)
  const prideItems = [
    {
      id: 1,
      title: "Global Hero Awards",
      image: "/path/to/event-image-1.jpg",
      description:
        "Celebrate the world's most inspiring individuals across cultures and industries. Join us in honoring global excellence in innovation and leadership.",
    },
    {
      id: 2,
      title: "World Impact Day",
      image: "/path/to/event-image-2.jpg",
      description:
        "A global initiative to showcase community efforts uniting people from every continent. Experience the power of collective action worldwide.",
    },
    {
      id: 3,
      title: "International Youth Summit",
      image: "/path/to/event-image-3.jpg",
      description:
        "Empowering young leaders from diverse nations to shape a brighter future. Discover the next generation of global change-makers.",
    },
    {
      id: 4,
      title: "Global Cultural Festival",
      image: "/path/to/event-image-4.jpg",
      description:
        "A vibrant celebration of the world's cultures, uniting traditions and talents from every corner of the globe.",
    },
  ];

  return (
    <section
      className="w-full py-12 px-4 bg-gradient-to-b from-white to-accent-cream relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(30, 58, 138, 0.05), rgba(30, 58, 138, 0.02))`,
      }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-center mb-10">
          There's More About The Pride of the World Than You Think
        </h2>

        {/* Pride Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl justify-center mx-auto">
          {prideItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-300">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Content */}
              <div className="p-3">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {item.description}
                </p>
                <a
                  href={`/event/${item.id}`}
                  className="mt-4 inline-block underline text-secondary rounded-md hover:text-secondary-light hover:scale-105 transition-all duration-200">
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrideSection;
