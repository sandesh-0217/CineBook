import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, Calendar, Clock, MapPin, Ticket, ChevronLeft, Play } from "lucide-react";
import { getMovies, getShowtimesByMovie } from "../config/firestore";

const theatres = [
  { id: 1, name: "Grand Cinema", location: "Downtown", priceMultiplier: 1.0 },
  { id: 2, name: "City Plex", location: "Mall Road", priceMultiplier: 1.2 },
  { id: 3, name: "IMAX Arena", location: "Tech Park", priceMultiplier: 1.5 }
];

function MoviesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const moviesData = await getMovies();
        const foundMovie = moviesData.find(m => m.id === id);
        
        if (foundMovie) {
          setMovie(foundMovie);
        }
      } catch (error) {
        console.error("Failed to fetch movie from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (selectedTheatre && movie) {
        // Always generate local showtimes
        const localShowtimes = generateShowtimes(movie.id, selectedTheatre.id);
        setShowtimes(localShowtimes);
        // Don't auto-select - let user choose
        setSelectedDate(null);
        setSelectedShowtime(null);
      }
    };
    fetchShowtimes();
  }, [selectedTheatre, movie]);

  const generateShowtimes = (movieId, theatreId) => {
    const times = ["10:30 AM", "2:00 PM", "6:00 PM", "9:30 PM"];
    const dates = [];
    // Generate dates for next 5 days
    for (let i = 0; i < 5; i++) {
      dates.push(new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
    
    const showtimeList = [];
    dates.forEach((date) => {
      times.forEach((time) => {
        showtimeList.push({
          id: `${movieId}-${theatreId}-${date}-${time}`,
          time,
          date
        });
      });
    });
    
    return showtimeList;
  };

  // Get unique dates for date selection
  const uniqueDates = [...new Set(showtimes.map(s => s.date))].slice(0, 5);

  const handleBooking = () => {
    if (selectedTheatre && selectedShowtime) {
      navigate("/booking", {
        state: {
          movie,
          theatre: selectedTheatre,
          showtime: selectedShowtime
        }
      });
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-24 left-8 z-10 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </button>



      {/* Hero Section with Backdrop */}
      <div className="relative">
        {/* Backdrop Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url(${movie.image || movie.poster || "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster"})`,
            filter: 'blur(8px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie.image || movie.poster || "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster"}
                alt={movie.title}
                className="w-72 h-[450px] object-cover rounded-2xl shadow-2xl"
                onError={handleImageError}
              />
            </div>

            {/* Movie Details */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{movie.title}</h1>
              
              {/* Rating & Duration */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <span className="font-bold">{movie.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-white/70 px-3 py-1 rounded-full border border-white/20">
                  <Clock className="w-5 h-5" />
                  <span>{movie.duration ? (typeof movie.duration === 'number' ? `${movie.duration} min` : movie.duration) : movie.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-white/70 px-3 py-1 rounded-full border border-white/20">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.releaseDate || movie.release_date || "2024"}</span>
                </div>
              </div>

              {/* Genre */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Array.isArray(movie.genre) ? movie.genre.map((g, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm">
                    {g}
                  </span>
                )) : (
                  <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm">
                    {movie.genre}
                  </span>
                )}
              </div>

              {/* Synopsis */}
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                {movie.synopsis || movie.overview}
              </p>

              {/* Trailer Button */}
              {movie.trailerId && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors mb-8"
                >
                  <Play className="w-5 h-5" />
                  Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setShowTrailer(false)}>
          <div className="relative w-full max-w-4xl mx-4" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${movie.trailerId}?autoplay=1`}
                title="Movie Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Theatre Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Select Theatre</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {theatres.map((theatre) => (
            <button
              key={theatre.id}
              onClick={() => setSelectedTheatre(theatre)}
              className={`p-6 rounded-xl border transition-all ${
                selectedTheatre?.id === theatre.id
                  ? "bg-yellow-500/20 border-yellow-500"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">{theatre.name}</h3>
              </div>
              <p className="text-white/60">{theatre.location}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Showtime Selection */}
      {selectedTheatre && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-white mb-8">Select Showtime</h2>
          
          {/* Date Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Select Date</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {uniqueDates.map((dateStr, index) => {
                const date = new Date(dateStr);
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDate(dateStr);
                      setSelectedShowtime(null);
                    }}
                    className={`flex-shrink-0 p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-yellow-500/20 border-yellow-500"
                        : "bg-white/10 border-white/20 hover:bg-white/20"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-white/60 text-sm">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-white font-bold text-xl">
                        {date.getDate()}
                      </div>
                      <div className="text-white/60 text-sm">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Time Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Select Time</h3>
            {selectedDate ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {showtimes.filter(s => s.date === selectedDate).map((showtime, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedShowtime(showtime)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedShowtime?.id === showtime.id
                        ? "bg-yellow-500 text-black font-bold"
                        : "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    }`}
                  >
                    {showtime.time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-white/60">Please select a date first to see available times</p>
            )}
          </div>
        </div>
      )}

      {/* Book Now Button */}
      {selectedTheatre && selectedShowtime && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBooking}
            className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl rounded-xl hover:shadow-2xl hover:shadow-yellow-500/50 transition-all"
          >
            Book Now - Rs. {Math.round((movie.price || 250) * selectedTheatre.priceMultiplier)}
          </button>
        </div>
      )}
    </div>
  );
}

export default MoviesDetails;