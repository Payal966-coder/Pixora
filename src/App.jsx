import React, { useEffect, useState } from "react";
import axios from "axios";

// --- Professional SVG Icons (Inline) ---

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const IconHeart = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${filled ? "text-red-500" : "text-gray-700"}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-800">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconExternalLink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);


const API_KEY = "ZKuU9Qu3PmyyjOfD0NxHBMXZAKZTq6gTbx3J0zwxFoix39Zvjj78JUzx";
const API = "https://api.pexels.com/v1/search";

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("minimalist");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null); // Tracking download status
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("pixora_favs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pixora_favs", JSON.stringify(favorites));
  }, [favorites]);

  const fetchImages = async (searchQuery) => {
    try {
      setLoading(true);
      const { data } = await axios(`${API}?query=${searchQuery}&per_page=30`, {
        headers: { Authorization: API_KEY },
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") fetchImages(query);
  };

  const toggleFavorite = (e, img) => {
    e.stopPropagation();
    const isFav = favorites.find((f) => f.id === img.id);
    if (isFav) {
      setFavorites(favorites.filter((f) => f.id !== img.id));
    } else {
      setFavorites([...favorites, img]);
    }
  };

  // --- Pakka Download Logic (Blob approach) ---
  const downloadImage = async (e, url, id) => {
    e.stopPropagation();
    setDownloadingId(id); // Set loading state for this image
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `pixora-${id}.jpg`; // Unique filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl); // Clean up memory
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image. It might be blocked by the API provider.");
    } finally {
      setDownloadingId(null); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased font-sans">
      
      {/* Pixora Header */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-5 py-4 flex items-center gap-6 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-2">
            <div className="bg-gray-950 text-white text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-inner">P</div>
            <h1 className="text-2xl font-extrabold tracking-tighter text-gray-950">Pixora</h1>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <IconSearch />
          </div>
          <input
            type="text"
            placeholder="Search for high-resolution images..."
            className="w-full bg-gray-100 hover:bg-gray-200/70 border border-gray-100 rounded-full pl-12 pr-6 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition duration-200 text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        
        <div className="flex items-center gap-3">
            <button className="relative p-3 rounded-full hover:bg-gray-100 transition">
                <IconHeart filled={favorites.length > 0} />
                {favorites.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {favorites.length}
                    </span>
                )}
            </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-5 md:p-8 lg:p-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center mt-32 gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-950 rounded-full animate-spin"></div>
            <p className="font-semibold text-gray-600 tracking-wide">Fetching visuals...</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 space-y-5">
            {images.map((item) => {
              const isFav = favorites.some((f) => f.id === item.id);
              const isDownloading = downloadingId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="relative break-inside-avoid group cursor-zoom-in rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 bg-gray-50"
                >
                  <img
                    src={item.src.large}
                    alt={item.photographer}
                    className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => toggleFavorite(e, item)}
                        className={`p-2.5 rounded-full backdrop-blur-sm transition duration-150 ${isFav ? 'bg-red-500/90 text-white' : 'bg-white/80 hover:bg-white text-gray-900'}`}
                      >
                        <IconHeart filled={isFav} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-white text-sm font-semibold truncate drop-shadow-sm flex-1">
                            {item.photographer}
                        </span>
                        <button
                            onClick={(e) => downloadImage(e, item.src.original, item.id)}
                            disabled={isDownloading}
                            className={`p-2.5 rounded-full shadow-lg transition duration-150 ${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-white/90 hover:bg-white'}`}
                        >
                            {isDownloading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <IconDownload />}
                        </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Image Modal (Bada Show Karne ke liye) */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[60] bg-gray-950/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 overflow-y-auto"
            onClick={() => setSelectedImage(null)}
        >
            <div 
                className="bg-white rounded-[32px] overflow-hidden max-w-7xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-6 right-6 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full transition"
                >
                    <IconClose />
                </button>

                {/* Big Image Section */}
                <div className="flex-1 bg-gray-100 overflow-hidden flex items-center justify-center border-r border-gray-100 p-2">
                    <img 
                        src={selectedImage.src.original} 
                        alt={selectedImage.photographer}
                        className="max-h-[60vh] md:max-h-[90vh] w-full object-contain rounded-2xl"
                    />
                </div>

                {/* Side Panel Details */}
                <div className="w-full md:w-96 p-8 flex flex-col justify-between bg-white">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                             <div className="w-14 h-14 rounded-full bg-gray-950 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                                {selectedImage.photographer[0]}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Photographer</p>
                                <h2 className="text-2xl font-extrabold tracking-tight text-gray-950">{selectedImage.photographer}</h2>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2.5">
                            <p className="text-sm text-gray-600 flex justify-between">
                                <span className="font-medium text-gray-500">Original Resolution</span>
                                <span className="font-mono text-gray-900">{selectedImage.width} x {selectedImage.height} PX</span>
                            </p>
                            <p className="text-sm text-gray-600 flex justify-between">
                                <span className="font-medium text-gray-500">ID</span>
                                <span className="font-mono text-gray-900">{selectedImage.id}</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-10 flex flex-col gap-4">
                        <div className="flex gap-3">
                            <button 
                                onClick={(e) => toggleFavorite(e, selectedImage)}
                                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold transition duration-200 text-lg ${
                                    favorites.some(f => f.id === selectedImage.id) 
                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                            >
                                <IconHeart filled={favorites.some(f => f.id === selectedImage.id)} />
                                {favorites.some(f => f.id === selectedImage.id) ? "Saved" : "Save to Favorites"}
                            </button>
                            <a 
                                href={selectedImage.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition text-gray-700"
                                title="View on Pexels"
                            >
                                <IconExternalLink />
                            </a>
                        </div>
                        
                        <button 
                            onClick={(e) => downloadImage(e, selectedImage.src.original, selectedImage.id)}
                            disabled={downloadingId === selectedImage.id}
                            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-extrabold transition duration-200 text-xl shadow-md ${downloadingId === selectedImage.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-950 hover:bg-gray-800 text-white'}`}
                        >
                             {downloadingId === selectedImage.id ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <IconDownload />}
                            {downloadingId === selectedImage.id ? "Downloading..." : "Download High-Res"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;