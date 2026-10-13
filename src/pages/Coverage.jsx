import { useState } from "react";
import CoverageMap from "./CoverageMap";

import coverageData from "../data/warehouses.json";

const Coverage = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Search suggestions
    const suggestions =
        searchText.trim() === ""
            ? []
            : coverageData.filter((location) =>
                  location.district
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
              );

    // Search button
    const handleSearch = () => {
        if (!searchText.trim()) return;

        const foundLocation = coverageData.find((location) =>
            location.district
                .toLowerCase()
                .includes(searchText.toLowerCase())
        );

        if (foundLocation) {
            setSelectedLocation(foundLocation);
        } else {
            alert("District not found!");
        }
    };

    // Suggestion click
    const handleSuggestionClick = (location) => {
        setSearchText(location.district);
        setSelectedLocation(location);
    };

    // Enter press
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <section className="py-16 md:py-24 bg-base-100">
            <div className="container mx-auto px-4">

                {/* Heading */}
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold">
                        We are available in{" "}
                        <span className="text-primary">
                            64 districts
                        </span>
                    </h1>

                    <p className="mt-4 text-base-content/60">
                        Find our delivery coverage across Bangladesh.
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-xl mx-auto mt-8 mb-10">
                    <div className="flex gap-2">

                        {/* Input + Suggestions */}
                        <div className="relative flex-1">

                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) =>
                                    setSearchText(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Search district..."
                                className="input input-bordered w-full h-12"
                            />

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-[1000] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">

                                    {suggestions
                                        .slice(0, 5)
                                        .map((location) => (
                                            <button
                                                key={location.district}
                                                type="button"
                                                onClick={() =>
                                                    handleSuggestionClick(
                                                        location
                                                    )
                                                }
                                                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3"
                                            >
                                                <span className="text-lg">
                                                    📍
                                                </span>

                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {location.district}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {location.region}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            )}

                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="btn bg-[#C6EF4A] border-none text-black hover:bg-[#B9E83E]"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Map */}
                <div className="max-w-6xl mx-auto">
                    <CoverageMap
                        selectedLocation={selectedLocation}
                    />
                </div>

            </div>
        </section>
    );
};

export default Coverage;