import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Ticket, 
  CreditCard,
  CheckCircle,
  User,
  Mail,
  Phone
} from "lucide-react";
import SeatMap from "../components/SeatMap";
import moviesData from "../data/movies";

const theatres = [
  { id: 1, name: "Grand Cinema", location: "Downtown", priceMultiplier: 1.0 },
  { id: 2, name: "City Plex", location: "Mall Road", priceMultiplier: 1.2 },
  { id: 3, name: "IMAX Arena", location: "Tech Park", priceMultiplier: 1.5 }
];

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  let bookingData = location.state;
  
  // If no booking data, try to get from state
  useEffect(() => {
    if (!bookingData) {
      navigate("/movies");
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  const { movie, theatre, showtime } = bookingData;
  
  const basePrice = movie.price * theatre.priceMultiplier;
  const seatPrice = 250;
  const premiumSeatPrice = 350;
  
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId.charAt(0);
      return total + (row <= 'D' ? premiumSeatPrice : seatPrice);
    }, 0);
  };

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster";
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return;
    setStep(2);
  };

  const handleConfirmPayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Please fill in all customer information");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const booking = {
      id: `BK${Date.now()}`,
      movie: {
        title: movie.title,
        poster: movie.image || movie.poster,
        duration: movie.duration
      },
      theatre: {
        name: theatre.name,
        location: theatre.location
      },
      showtime: {
        date: showtime.date,
        time: showtime.time
      },
      seats: selectedSeats,
      total: calculateTotal(),
      customer: customerInfo,
      paymentMethod,
      bookingDate: new Date().toISOString()
    };
    
    // Store booking in localStorage
    const existingBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
    existingBookings.push(booking);
    localStorage.setItem("myBookings", JSON.stringify(existingBookings));
    
    setIsProcessing(false);
    setStep(3);
  };

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  const goBack = () => {
    if (step === 2) setStep(1);
    else navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-yellow-400" : "text-white/40"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-yellow-500 text-black" : "bg-white/10"}`}>
                  1
                </div>
                <span className="hidden sm:inline">Select Seats</span>
              </div>
              <div className="w-12 h-px bg-white/20" />
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-yellow-400" : "text-white/40"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-yellow-500 text-black" : "bg-white/10"}`}>
                  2
                </div>
                <span className="hidden sm:inline">Payment</span>
              </div>
              <div className="w-12 h-px bg-white/20" />
              <div className={`flex items-center gap-2 ${step >= 3 ? "text-yellow-400" : "text-white/40"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-yellow-500 text-black" : "bg-white/10"}`}>
                  3
                </div>
                <span className="hidden sm:inline">Confirm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Seat Selection */}
      {step === 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-28">
                <div className="flex gap-4 mb-6">
                  <img
                    src={movie.image || movie.poster}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg"
                    onError={handleImageError}
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">{movie.title}</h2>
                    <div className="text-white/60 text-sm mb-1">{movie.genre}</div>
                    <div className="text-white/60 text-sm">{movie.duration}</div>
                  </div>
                </div>
                
                <div className="space-y-4 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3 text-white/80">
                    <MapPin className="w-5 h-5 text-yellow-400" />
                    <span>{theatre.name}, {theatre.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    <span>{showtime.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span>{showtime.time}</span>
                  </div>
                </div>

                {/* Selected Seats Summary */}
                {selectedSeats.length > 0 && (
                  <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                    <div className="text-white/80 text-sm mb-2">Selected Seats:</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedSeats.map(seat => (
                        <span key={seat} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm font-medium">
                          {seat}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Total:</span>
                      <span className="text-xl font-bold text-yellow-400">Rs. {calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0}
                  className={`w-full mt-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    selectedSeats.length > 0
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-[1.02]"
                      : "bg-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>

            {/* Seat Map */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Ticket className="w-6 h-6 text-yellow-400" />
                  Select Your Seats
                </h3>
                <SeatMap 
                  onSeatSelect={handleSeatSelect}
                  selectedSeats={selectedSeats}
                  prebookedSeats={["A3", "A4", "B7", "C10", "D5", "D6", "E8", "F2", "F3"]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-yellow-400" />
                Customer Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Full Name</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-yellow-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-yellow-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-yellow-500"
                    placeholder="+977 98XXXXXXXX"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <h3 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-yellow-400" />
                Payment Method
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "card", label: "Credit/Debit Card", icon: "💳" },
                  { id: "esewa", label: "eSewa", icon: "📱" },
                  { id: "khalti", label: "Khalti", icon: "🅿️" },
                  { id: "cash", label: "Cash at Counter", icon: "💵" }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      paymentMethod === method.id
                        ? "bg-yellow-500/20 border-yellow-500 text-white"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="font-medium">{method.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-fit sticky top-28">
              <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-white/10">
                <img
                  src={movie.image || movie.poster}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-lg"
                  onError={handleImageError}
                />
                <div>
                  <h4 className="text-white font-semibold">{movie.title}</h4>
                  <div className="text-white/60 text-sm mt-1">{movie.duration}</div>
                  <div className="text-white/60 text-sm">{movie.genre}</div>
                </div>
              </div>

              <div className="space-y-3 text-white/80">
                <div className="flex justify-between">
                  <span>Theatre</span>
                  <span className="text-white">{theatre.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Show</span>
                  <span>{showtime.date} at {showtime.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seats</span>
                  <span>{selectedSeats.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tickets</span>
                  <span>x{selectedSeats.length}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-yellow-400">Rs. {calculateTotal()}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isProcessing
                    ? "bg-white/10 text-white/30 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-[1.02]"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-white/60 mb-8">Your tickets have been booked successfully</p>

            <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-xl p-6 mb-6">
              <div className="text-yellow-400 font-bold text-xl mb-4">{movie.title}</div>
              <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
                <div>
                  <div className="text-white/50">Theatre</div>
                  <div>{theatre.name}</div>
                </div>
                <div>
                  <div className="text-white/50">Date & Time</div>
                  <div>{showtime.date} at {showtime.time}</div>
                </div>
                <div>
                  <div className="text-white/50">Seats</div>
                  <div>{selectedSeats.join(", ")}</div>
                </div>
                <div>
                  <div className="text-white/50">Total Paid</div>
                  <div className="text-yellow-400 font-semibold">Rs. {calculateTotal()}</div>
                </div>
              </div>
            </div>

            <p className="text-white/60 text-sm mb-8">
              A confirmation email has been sent to <span className="text-white">{customerInfo.email}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/bookings")}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:scale-[1.02] transition-transform"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate("/movies")}
                className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
              >
                Book More Tickets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;
