import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, Calendar, Clock, MapPin, Ticket, ChevronLeft, Play } from "lucide-react";
import moviesData from "../data/movies";

const theatres = [
  { id: 1, name: "Grand Cinema", location: "Downtown", priceMultiplier: 1.0 },
  { id: 2, name: "City Plex", location: "Mall Road", priceMultiplier: 1.2 },
  { id: 3, name: "IMAX Arena", location: "Tech Park", priceMultiplier: 1.5 }
];

const generateShowtimes = (movieId, theatreId) => {
  const times = ["10:30 AM", "2:00 PM", "6:00 PM", "9:30 PM"];
  return times.map((time, index) => ({
    id: `${movieId}-${theatreId}-${index}`,
    time,
    date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
};

function MoviesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const foundMovie = moviesData.find(m => m.id === parseInt(id));
    setMovie(foundMovie);
  }, [id]);

  useEffect(() => {
    if (selectedTheatre && movie) {
      const times = generateShowtimes(movie.id, selectedTheatre.id);
      setShowtimes(times);
    }
  }, [selectedTheatre, movie]);

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

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
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
            backgroundImage: `url(${movie.image})`,
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
                src={movie.image}
                alt={movie.title}
                className="w-72 h-[450px] object-cover rounded-2xl shadow-2xl"
                onError={handleImageError}
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-white pt-4">
              <h1 className="text-4xl md:text-5xl font-black mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{movie.rating}</span>
                </div>
                <span className="text-white/60">|</span>
                <span className="text-white/80">{movie.genre}</span>
                <span className="text-white/60">|</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span>{movie.duration}</span>
                </div>
              </div>

              <p className="text-white/70 text-lg leading-relaxed mb-6">
                {movie.synopsis}
              </p>

              <div className="flex flex-wrap gap-6 text-white/60 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Released: {movie.releaseDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Language: {movie.language}</span>
                </div>
              </div>

              {/* Watch Trailer Button */}
              {movie.trailerId && (
                <button
                  onClick={() => setShowTrailer(!showTrailer)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors mb-8"
                >
                  <Play className="w-5 h-5" />
                  {showTrailer ? "Close Trailer" : "Watch Trailer"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailerId && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${movie.trailerId}?autoplay=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Showtime Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-yellow-400" />
            Select Theatre & Showtime
          </h2>

          {/* Theatre Selection */}
          <div className="mb-8">
            <h3 className="text-white/80 mb-4 font-medium">Choose Theatre</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {theatres.map((theatre) => (
                <button
                  key={theatre.id}
                  onClick={() => {
                    setSelectedTheatre(theatre);
                    setSelectedDate(null);
                    setSelectedShowtime(null);
                  }}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    selectedTheatre?.id === theatre.id
                      ? "bg-yellow-500/20 border-yellow-500 text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <div className="font-semibold">{theatre.name}</div>
                  <div className="text-sm opacity-70 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {theatre.location}
                  </div>
                  <div className="text-sm text-yellow-400 mt-2">
                    Rs. {Math.round(movie.price * theatre.priceMultiplier)} / ticket
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Showtime Selection */}
          {selectedTheatre && (
            <div className="mb-8">
              <h3 className="text-white/80 mb-4 font-medium">Choose Date & Time</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {showtimes.map((show) => (
                  <button
                    key={show.id}
                    onClick={() => {
                      setSelectedDate(show.date);
                      setSelectedShowtime(show);
                    }}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      selectedShowtime?.id === show.id
                        ? "bg-yellow-500/20 border-yellow-500 text-white"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-sm opacity-70">{show.date}</div>
                    <div className="font-semibold text-lg mt-1">{show.time}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Book Now Button */}
          <button
            onClick={handleBooking}
            disabled={!selectedTheatre || !selectedShowtime}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              selectedTheatre && selectedShowtime
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/50"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            {selectedTheatre && selectedShowtime
              ? `Book Tickets - Rs. ${Math.round(movie.price * selectedTheatre.priceMultiplier)}`
              : "Select Theatre & Showtime to Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoviesDetails;
