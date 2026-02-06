import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { getMovies } from "../config/firestore";

function Movies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await getMovies();
        setMovies(moviesData || []);
      } catch (error) {
        console.error("Failed to fetch movies from Firebase:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Movies...</h1>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">No Movies Available</h1>
          <p className="text-white/60">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Now <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">Showing</span>
          </h1>
          <p className="text-white/60">Book your tickets now and experience cinema like never before</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-yellow-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20"
            >
              <div className="relative overflow-hidden">
                <img
                  src={movie.image || movie.poster || "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster"}
                  alt={movie.title}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs font-semibold">{movie.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => navigate(`/movies/${movie.id}`)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h2 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors line-clamp-1">
                  {movie.title}
                </h2>
                <div className="text-white/60 text-sm mt-1">{Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}</div>
                <div className="flex items-center gap-4 text-white/50 text-sm mt-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{movie.duration ? (typeof movie.duration === 'number' ? `${movie.duration} min` : movie.duration) : movie.duration}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <span className="text-yellow-400 font-bold">Rs. {movie.price || 250}</span>
                  <button
                    onClick={() => navigate(`/movies/${movie.id}`)}
                    className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Movies;
