import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  QrCode,
  Download,
  Share2,
  Printer,
  ChevronRight
} from "lucide-react";

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (location.state?.booking) {
      setBooking(location.state.booking);
      
      // Save booking to localStorage
      const existingBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
      const newBooking = {
        ...location.state.booking,
        bookingDate: new Date().toISOString(),
        id: `BK${Date.now()}`
      };
      existingBookings.push(newBooking);
      localStorage.setItem("myBookings", JSON.stringify(existingBookings));
    } else {
      navigate("/movies");
    }
  }, [location.state, navigate]);

  if (!booking) return null;

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster";
  };

  const generateQRCode = () => {
    const qrData = JSON.stringify({
      ref: booking.id || `BK${Date.now().toString().slice(-8)}`,
      movie: booking.movie.title,
      seats: booking.seats,
      date: booking.showtime.date,
      time: booking.showtime.time,
      theatre: booking.theatre.name
    });
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  };

  const downloadTicket = () => {
    const ticketContent = `
=====================================
         CINEBOOK TICKET
=====================================

Booking Reference: ${booking.id || `BK${Date.now().toString().slice(-8)}`}

Movie: ${booking.movie.title}
Duration: ${booking.movie.duration}

Theatre: ${booking.theatre.name}
Location: ${booking.theatre.location}

Show Date: ${booking.showtime.date}
Show Time: ${booking.showtime.time}

Seats: ${booking.seats.join(", ")}

Total Paid: Rs. ${booking.total}
Payment Method: ${booking.paymentMethod || "Card"}

=====================================
Thank you for booking with CineBook!
=====================================
    `.trim();

    const blob = new Blob([ticketContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CineBook_Ticket_${booking.id || Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareTicket = async () => {
    const shareText = `🎬 CineBook Ticket\n\nMovie: ${booking.movie.title}\nDate: ${booking.showtime.date}\nTime: ${booking.showtime.time}\nSeats: ${booking.seats.join(", ")}\nRef: ${booking.id || `BK${Date.now().toString().slice(-8)}`}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "CineBook Ticket",
          text: shareText
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Ticket info copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Booking Confirmed!</h1>
          <p className="text-white/60 text-lg">Your movie experience awaits</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
          {/* Ticket Header */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-purple-500/20 to-pink-500/20" />
            <img
              src={booking.movie.poster}
              alt={booking.movie.title}
              className="absolute right-0 top-0 w-48 h-full object-cover opacity-50"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="text-3xl font-bold text-white mb-2">{booking.movie.title}</h2>
              <div className="flex flex-wrap gap-3 text-white/70 text-sm">
                <span className="px-3 py-1 bg-white/10 rounded-full">{booking.movie.duration}</span>
                <span className="px-3 py-1 bg-white/10 rounded-full">{booking.movie.genre || "Action"}</span>
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 md:p-8">
            {/* QR Code Section */}
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8 pb-8 border-b border-white/10">
              <div className="relative">
                <img
                  src={generateQRCode()}
                  alt="Booking QR Code"
                  className="w-40 h-40 border-2 border-yellow-500/50 rounded-2xl shadow-lg shadow-yellow-500/20"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  SCAN FOR ENTRY
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white/50 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">Theatre</span>
                    </div>
                    <div className="text-white font-semibold">{booking.theatre.name}</div>
                    <div className="text-white/60 text-sm">{booking.theatre.location}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white/50 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Date</span>
                    </div>
                    <div className="text-white font-semibold">{booking.showtime.date}</div>
                    <div className="text-white/60 text-sm">{booking.showtime.time}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seats Section */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Ticket className="w-5 h-5 text-yellow-400" />
                <h3 className="text-white font-semibold">Your Seats</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {booking.seats.map((seat, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 rounded-xl font-bold text-lg"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <div className="text-white/50 text-sm mb-1">Booking Reference</div>
                <div className="text-3xl font-mono font-bold text-yellow-400">
                  {booking.id || `BK${Date.now().toString().slice(-8)}`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/50 text-sm mb-1">Total Paid</div>
                <div className="text-3xl font-bold text-green-400">Rs. {booking.total}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={downloadTicket}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:scale-[1.02] transition-transform"
                >
                  <Download className="w-5 h-5" />
                  Download Ticket
                </button>
                <button
                  onClick={shareTicket}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="mt-8 bg-blue-500/10 backdrop-blur-md rounded-xl p-6 border border-blue-500/20">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Important Information
          </h4>
          <ul className="text-white/70 text-sm space-y-2">
            <li>• Please arrive at least 15 minutes before the show starts</li>
            <li>• Show this QR code at the entrance for quick entry</li>
            <li>• Outside food and drinks are not allowed</li>
            <li>• Children above 3 years require a separate ticket</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/bookings")}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
          >
            View My Bookings
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/movies")}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:scale-[1.02] transition-transform"
          >
            Book Another Movie
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
