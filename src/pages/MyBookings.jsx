import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  QrCode, 
  Trash2,
  ChevronRight,
  Download,
  Share2,
  Film
} from "lucide-react";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
    setBookings(storedBookings.reverse());
  }, []);

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster";
  };

  const isUpcoming = (dateStr) => {
    return new Date(dateStr) >= new Date();
  };

  const getBookingRef = (booking) => {
    return `BK${booking.bookingDate ? new Date(booking.bookingDate).getTime().toString().slice(-8) : Date.now().toString().slice(-8)}`;
  };

  const cancelBooking = (index) => {
    const originalIndex = bookings.length - 1 - index;
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const updatedBookings = bookings.filter((_, i) => i !== originalIndex);
      setBookings(updatedBookings);
      localStorage.setItem("myBookings", JSON.stringify(updatedBookings.reverse()));
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "upcoming") return isUpcoming(booking.showtime.date);
    if (filter === "past") return !isUpcoming(booking.showtime.date);
    return true;
  });

  const generateQRCode = (booking) => {
    const qrData = JSON.stringify({
      ref: getBookingRef(booking),
      movie: booking.movie.title,
      seats: booking.seats,
      date: booking.showtime.date,
      time: booking.showtime.time,
      theatre: booking.theatre.name
    });
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Ticket className="w-8 h-8 text-yellow-400" />
            My Bookings
          </h1>
          <p className="text-white/60 mt-2">View and manage your movie tickets</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-8">
          {[
            { id: "all", label: "All Bookings" },
            { id: "upcoming", label: "Upcoming" },
            { id: "past", label: "Past" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === f.id
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center border border-white/20">
            <Film className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Bookings Found</h2>
            <p className="text-white/60 mb-6">
              {filter === "all" 
                ? "You haven't booked any tickets yet" 
                : filter === "upcoming"
                  ? "No upcoming bookings"
                  : "No past bookings"}
            </p>
            <button
              onClick={() => navigate("/movies")}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              Book a Movie
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Movie Poster */}
                  <div className="md:w-48 flex-shrink-0">
                    <img
                      src={booking.movie.poster}
                      alt={booking.movie.title}
                      className="w-full h-48 md:h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{booking.movie.title}</h3>
                        <div className="text-white/60 text-sm mt-1">{booking.movie.duration}</div>
                      </div>
                      <div className="bg-yellow-500/20 px-4 py-2 rounded-xl border border-yellow-500/30">
                        <div className="text-yellow-400 font-mono font-bold text-lg">
                          {getBookingRef(booking)}
                        </div>
                        <div className="text-white/50 text-xs text-center">Ref</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-white/70">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">{booking.theatre.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">{booking.showtime.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">{booking.showtime.time}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-white/60 text-sm">Seats:</span>
                      {booking.seats.map((seat, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm font-medium"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                      <div className="text-white/60 text-sm">
                        Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setExpandedBooking(expandedBooking === index ? null : index)}
                          className="flex items-center gap-1 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                          <span className="hidden sm:inline">QR Code</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${expandedBooking === index ? "rotate-90" : ""}`} />
                        </button>
                        <button
                          onClick={() => cancelBooking(index)}
                          disabled={!isUpcoming(booking.showtime.date)}
                          className={`p-2 rounded-lg transition-colors ${
                            isUpcoming(booking.showtime.date)
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              : "bg-white/5 text-white/30 cursor-not-allowed"
                          }`}
                          title="Cancel Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded QR Code */}
                    {expandedBooking === index && (
                      <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <img
                            src={generateQRCode(booking)}
                            alt="Booking QR Code"
                            className="w-32 h-32 border-2 border-white/20 rounded-lg"
                          />
                          <div className="flex-1 text-center sm:text-left">
                            <h4 className="text-white font-semibold mb-2">Scan at Theatre Entrance</h4>
                            <p className="text-white/60 text-sm mb-4">
                              Show this QR code at the theatre entrance for quick entry
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                              <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors">
                                <Download className="w-4 h-4" />
                                Download Ticket
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors">
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      {bookings.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-yellow-400">{bookings.length}</div>
              <div className="text-white/60 text-sm mt-1">Total Bookings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-green-400">
                {bookings.filter(b => isUpcoming(b.showtime.date)).length}
              </div>
              <div className="text-white/60 text-sm mt-1">Upcoming</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white/40">
                {bookings.reduce((sum, b) => sum + b.seats.length, 0)}
              </div>
              <div className="text-white/60 text-sm mt-1">Tickets Booked</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
