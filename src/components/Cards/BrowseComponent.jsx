import React, { useState, useMemo } from "react";
import { Search, MapPin, Grid, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import businesses from "../../assets/json/businessData.json";
import { SearchBar } from "../../pages/pagesections/homeHero";
import peopleData from "../../assets/json/peopleData.json";

export const FilterBusiness = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const navigate = useNavigate();

  const LocationTag = ({ name, count, onClick }) => (
    <div
      className="inline-block bg-white rounded-full px-3 py-1 text-xs mr-2 mb-2 hover:bg-blue-50 transition-colors cursor-pointer border"
      onClick={onClick}>
      {name} ({count})
    </div>
  );

  const CategoryTag = ({ name, count, onClick }) => (
    <div
      className="inline-block bg-white rounded-full px-3 py-1 text-xs mr-2 mb-2 hover:bg-gray-100 transition-colors cursor-pointer border"
      onClick={onClick}>
      {name} ({count})
    </div>
  );

  // Process locations and categories from businesses data
  const { locations, categories } = useMemo(() => {
    const locationMap = new Map();
    const categoryMap = new Map();

    businesses.forEach((business) => {
      // Process locations
      if (business.location) {
        const count = locationMap.get(business.location) || 0;
        locationMap.set(business.location, count + 1);
      }

      // Process categories
      if (business.category) {
        const count = categoryMap.get(business.category) || 0;
        categoryMap.set(business.category, count + 1);
      }
    });

    // Convert maps to sorted arrays
    const locationArray = Array.from(locationMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const categoryArray = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      locations: locationArray,
      categories: categoryArray,
    };
  }, []);

  const handleLocationClick = (locationItem) => {
    const searchParams = new URLSearchParams();
    searchParams.set("location", locationItem.name);
    searchParams.set("category", "All"); // Reset category
    searchParams.set("query", ""); // Reset search query
    navigate(`/searchPage?${searchParams.toString()}`);
  };

  const handleCategoryClick = (categoryItem) => {
    const searchParams = new URLSearchParams();
    searchParams.set("category", categoryItem.name);
    searchParams.set("location", "All"); // Reset location
    searchParams.set("query", ""); // Reset search query
    navigate(`/searchPage?${searchParams.toString()}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <span className="mx-3">
        {" "}
        <SearchBar />
      </span>

      {/* Browse Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Section */}
        <div className="bg-blue-500 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin size={18} />
              Browse by Location
            </h2>
          </div>
          <div className="mb-4">
            {locations
              .slice(0, showAllLocations ? locations.length : 9)
              .map((location, index) => (
                <LocationTag
                  key={index}
                  name={location.name}
                  count={location.count}
                  onClick={() => handleLocationClick(location)}
                />
              ))}
          </div>
          {locations.length > 9 && (
            <button
              className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl"
              onClick={() => setShowAllLocations(!showAllLocations)}>
              {showAllLocations ? "See Less" : "See More"}
            </button>
          )}
        </div>

        {/* Categories Section */}
        <div className="bg-gray-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Grid size={18} />
              Browse By Categories
            </h2>
          </div>
          <div className="mb-4">
            {categories
              .slice(0, showAllCategories ? categories.length : 6)
              .map((category, index) => (
                <CategoryTag
                  key={index}
                  name={category.name}
                  count={category.count}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
          </div>
          {categories.length > 6 && (
            <button
              className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl"
              onClick={() => setShowAllCategories(!showAllCategories)}>
              {showAllCategories ? "See Less" : "See More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const FilterPeople = () => {
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showAllProfessions, setShowAllProfessions] = useState(false);
  const navigate = useNavigate();

  const LocationTag = ({ name, count, onClick }) => (
    <div
      className="inline-block bg-white rounded-full px-3 py-1 text-xs mr-2 mb-2 hover:bg-green-50 transition-colors cursor-pointer border"
      onClick={onClick}>
      {name} ({count})
    </div>
  );

  const ProfessionTag = ({ name, count, onClick }) => (
    <div
      className="inline-block bg-white rounded-full px-3 py-1 text-xs mr-2 mb-2 hover:bg-gray-100 transition-colors cursor-pointer border"
      onClick={onClick}>
      {name} ({count})
    </div>
  );

  // Process locations and professions from people data
  const { locations, professions } = useMemo(() => {
    const locationMap = new Map();
    const professionMap = new Map();

    peopleData.forEach((person) => {
      // Process locations
      if (person.location) {
        const count = locationMap.get(person.location) || 0;
        locationMap.set(person.location, count + 1);
      }

      // Process professions
      if (person.profession) {
        const count = professionMap.get(person.profession) || 0;
        professionMap.set(person.profession, count + 1);
      }
    });

    // Convert maps to sorted arrays
    const locationArray = Array.from(locationMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const professionArray = Array.from(professionMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      locations: locationArray,
      professions: professionArray,
    };
  }, []);

  const handleLocationClick = (locationItem) => {
    const searchParams = new URLSearchParams();
    searchParams.set("location", locationItem.name);
    searchParams.set("profession", "All"); // Reset profession
    searchParams.set("query", ""); // Reset search query
    navigate(`/searchPage/people?${searchParams.toString()}`);
  };

  const handleProfessionClick = (professionItem) => {
    const searchParams = new URLSearchParams();
    searchParams.set("profession", professionItem.name);
    searchParams.set("location", "All"); // Reset location
    searchParams.set("query", ""); // Reset search query
    navigate(`/searchPage/people?${searchParams.toString()}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <span className="mx-3">
        <SearchBar initialSearchOption="People" />
      </span>

      {/* Browse Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Section */}
        <div className="bg-blue-500 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin size={18} />
              Browse People by Location
            </h2>
          </div>
          <div className="mb-4">
            {locations
              .slice(0, showAllLocations ? locations.length : 9)
              .map((location, index) => (
                <LocationTag
                  key={index}
                  name={location.name}
                  count={location.count}
                  onClick={() => handleLocationClick(location)}
                />
              ))}
          </div>
          {locations.length > 9 && (
            <button
              className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl"
              onClick={() => setShowAllLocations(!showAllLocations)}>
              {showAllLocations ? "See Less" : "See More"}
            </button>
          )}
        </div>

        {/* Professions Section */}
        <div className="bg-gray-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Briefcase size={18} />
              Browse By Profession
            </h2>
          </div>
          <div className="mb-4">
            {professions
              .slice(0, showAllProfessions ? professions.length : 6)
              .map((profession, index) => (
                <ProfessionTag
                  key={index}
                  name={profession.name}
                  count={profession.count}
                  onClick={() => handleProfessionClick(profession)}
                />
              ))}
          </div>
          {professions.length > 6 && (
            <button
              className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl"
              onClick={() => setShowAllProfessions(!showAllProfessions)}>
              {showAllProfessions ? "See Less" : "See More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
