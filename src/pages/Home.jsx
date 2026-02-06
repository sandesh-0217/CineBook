import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Play, Star, Calendar, Clock, Sparkles } from "lucide-react";
import { getMovies } from "../config/firestore";
import { MOVIES } from "../data/movies";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await getMovies();
        // If Firebase returns empty, fall back to local MOVIES data
        const moviesToUse = (moviesData && moviesData.length > 0) ? moviesData : MOVIES;
        setMovies(moviesToUse.slice(0, 7));
      } catch (error) {
        console.error("Failed to fetch movies from Firebase:", error);
        // Fall back to local MOVIES data on error
        setMovies(MOVIES.slice(0, 7));
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Memoize particles to prevent re-renders
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }));
  }, []);

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        
        {/* Animated Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Experience Cinema Like Never Before</span>
          </div>
           
          <h1 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight">
            <span className="text-white">Welcome to </span>
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              CineBook
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/movies"
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Book Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>

            <button
              type="button"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              See Location
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Popular <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">Movies</span>
          </h2>
          <p className="text-white/70 text-lg">Scroll to explore trending picks</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : (
          <>
            <div className="flex space-x-6 overflow-x-auto py-8 scrollbar-hide scroll-smooth">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="group flex-shrink-0 w-72 bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:border-yellow-500/50 transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/20"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={movie.image || movie.poster || "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster"}
                      alt={movie.title}
                      className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={handleImageError}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm font-semibold">{movie.rating}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        to={`/movies/${movie.id}`}
                        className="block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 rounded-lg text-center hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {movie.title}
                      </h3>
                    </div>
                    <p className="text-white/60 text-sm mb-3">{Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}</p>
                    <div className="flex items-center gap-4 text-white/50 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Now Showing</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{movie.duration ? (typeof movie.duration === 'number' ? `${movie.duration} min` : movie.duration) : movie.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">
            &copy; 2026 <span className="font-bold text-white">CineBook</span>. All rights reserved.
          </p>
          <p className="text-white/40 text-sm mt-2">
            Made with ❤️ for movie enthusiasts
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
