import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Trash2,
  Film
} from "lucide-react";
import { getUserBookings, cancelBooking, deleteBooking } from "../config/firestore";
import { auth } from "../config/firebase";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const bookingsData = await getUserBookings(userId);
          setBookings(bookingsData);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [isAuthenticated]);

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster";
  };

  const isUpcoming = (dateStr) => {
    return new Date(dateStr) >= new Date();
  };

  const getBookingRef = (booking) => {
    return booking.id ? booking.id.slice(-8).toUpperCase() : `BK${Date.now().toString().slice(-8)}`;
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(bookingId);
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        ));
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId);
        setBookings(bookings.filter(b => b.id !== bookingId));
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking. Please try again.");
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "upcoming") return isUpcoming(booking.showtime?.date) && booking.status !== "cancelled";
    if (filter === "past") return !isUpcoming(booking.showtime?.date) || booking.status === "cancelled";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Bookings...</h1>
        </div>
      </div>
    );
  }

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

        {filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            {!isAuthenticated ? (
              <>
                <Film className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
                <p className="text-white/60 mb-6">Please sign in to view your bookings.</p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <Film className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">No Bookings Found</h2>
                <p className="text-white/60 mb-6">You haven't made any bookings yet.</p>
                <button
                  onClick={() => navigate("/movies")}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
                >
                  Browse Movies
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const isUpcomingBooking = isUpcoming(booking.showtime?.date);
              const canCancel = isUpcomingBooking && booking.status !== "cancelled";
              
              return (
                <div
                  key={booking.id}
                  className={`bg-white/10 backdrop-blur-md rounded-2xl border transition-all duration-300 ${
                    booking.status === "cancelled"
                      ? "border-red-500/30 opacity-60"
                      : "border-white/20 hover:border-yellow-500/50"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Movie Poster */}
                      <div className="flex-shrink-0">
                        <img
                          src={booking.movie?.poster || "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster"}
                          alt={booking.movie?.title}
                          className="w-24 h-36 object-cover rounded-lg"
                          onError={handleImageError}
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{booking.movie?.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === "cancelled"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}>
                                {booking.status === "cancelled" ? "Cancelled" : "Confirmed"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-yellow-400 font-bold text-xl">Rs. {booking.total}</div>
                            <div className="text-white/50 text-sm">Booking Ref: {getBookingRef(booking)}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-white/70">
                            <MapPin className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{booking.theatre?.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/70">
                            <Calendar className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{booking.showtime?.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/70">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{booking.showtime?.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/70">
                            <Ticket className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{booking.seats?.join(", ")}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          {canCancel && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-4 py-2 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Cancel
                            </button>
                          )}
                          
                          {!isUpcomingBooking && (
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="px-4 py-2 bg-white/10 text-white/70 text-sm rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
