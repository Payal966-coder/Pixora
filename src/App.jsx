import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "ZKuU9Qu3PmyyjOfD0NxHBMXZAKZTq6gTbx3J0zwxFoix39Zvjj78JUzx";
const API = "https://api.pexels.com/v1/search";

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature");
  const [loading, setLoading] = useState(false);

  const fetchImages = async (searchQuery) => {
    try {
      setLoading(true);
      const { data } = await axios(`${API}?query=${searchQuery}&per_page=20`, {
        headers: {
          Authorization: API_KEY,
        },
      });
      setImages(data.photos);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(query);
  }, []);

  const handleSearch = () => {
    if (query.trim() !== "") {
      fetchImages(query);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200">

      <div className="text-center py-10 bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
          📸 Modern Image Gallery
        </h1>
        <p className="mt-3 text-lg opacity-90">
          Search and download high quality images
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="flex shadow-lg rounded-full overflow-hidden bg-white">
          <input
            type="text"
            placeholder="Search images..."
            className="flex-1 px-6 py-3 outline-none text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 transition duration-300"
          >
            Search
          </button>
        </div>
      </div>
      {loading && (
        <p className="text-center mt-10 text-lg font-medium text-gray-600">
          Loading images...
        </p>
      )}

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
            >
              <img
                src={item.src.large}
                alt={item.photographer}
                className="w-full h-60 object-cover"
              />

              <div className="p-5">
                <h2 className="text-lg font-semibold truncate">
                  {item.photographer}
                </h2>

                <a
                  href={item.src.original}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-300"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default App;