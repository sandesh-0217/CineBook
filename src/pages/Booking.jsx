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
  Phone,
  AlertCircle
} from "lucide-react";
import SeatMap from "../components/SeatMap";
import { createBooking } from "../config/firestore";
import { auth } from "../config/firebase";

// Reusable theatre data (shared with MoviesDetails)
export const theatres = [
  { id: 1, name: "Grand Cinema", location: "Downtown", priceMultiplier: 1.0 },
  { id: 2, name: "City Plex", location: "Mall Road", priceMultiplier: 1.2 },
  { id: 3, name: "IMAX Arena", location: "Tech Park", priceMultiplier: 1.5 }
];

// Standard pricing
const STANDARD_PRICE = 250;
const PREMIUM_PRICE = 350;

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
  const [errors, setErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  let bookingData = location.state;
  
  useEffect(() => {
    // Check authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!bookingData) {
      navigate("/movies");
    }
  }, [bookingData, navigate]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (bookingData && !isAuthenticated && !auth.currentUser) {
      // Allow guest booking but save userId as null
    }
  }, [bookingData, isAuthenticated]);

  if (!bookingData) return null;

  const { movie, theatre, showtime } = bookingData;
  
  // Get theatre pricing
  const theatreData = theatres.find(t => t.id === theatre.id) || theatres[0];
  const priceMultiplier = theatreData.priceMultiplier;
  
  const calculateSeatPrice = (seatId) => {
    const row = seatId.charAt(0);
    const basePrice = row <= 'D' ? PREMIUM_PRICE : STANDARD_PRICE;
    return Math.round(basePrice * priceMultiplier);
  };
  
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      return total + calculateSeatPrice(seatId);
    }, 0);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = "Name is required";
    } else if (customerInfo.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(customerInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    const phoneRegex = /^[+]?[0-9\-\s]{7,15}$/;
    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster";
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmPayment = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Get current user ID
      const userId = auth.currentUser?.uid;
      
      // Create booking in Firebase
      const bookingDataToSave = {
        movieId: movie.id,
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
        userId: userId || null, // Save null for guest bookings
        status: "confirmed"
      };

      const savedBooking = await createBooking(bookingDataToSave);
      
      setIsProcessing(false);
      setStep(3);
    } catch (error) {
      console.error("Error creating booking:", error);
      setIsProcessing(false);
      alert("Failed to create booking. Please try again.");
    }
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
                    src={movie.image || movie.poster || "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster"}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg"
                    onError={handleImageError}
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">{movie.title}</h2>
                    <div className="text-white/60 text-sm mb-1">{Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}</div>
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
                    <span>{formatDate(showtime.date)}</span>
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
                  prebookedSeats={[]}
                  standardPrice={Math.round(STANDARD_PRICE * priceMultiplier)}
                  premiumPrice={Math.round(PREMIUM_PRICE * priceMultiplier)}
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
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-yellow-400" />
                Customer Information
              </h3>
              
              {/* Login Prompt for unauthenticated users */}
              {!auth.currentUser && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <p className="text-white/80 text-sm mb-3">
                    Sign in to save your bookings to your account and manage them later.
                  </p>
                  <button
                    onClick={() => navigate("/login", { state: { from: location } })}
                    className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
              
              {auth.currentUser && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <p className="text-green-400 text-sm">
                    ✓ Logged in as {auth.currentUser.email}
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => {
                        setCustomerInfo({...customerInfo, name: e.target.value});
                        if (errors.name) setErrors({...errors, name: null});
                      }}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-yellow-500'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => {
                        setCustomerInfo({...customerInfo, email: e.target.value});
                        if (errors.email) setErrors({...errors, email: null});
                      }}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-yellow-500'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-white/70 mb-2 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => {
                        setCustomerInfo({...customerInfo, phone: e.target.value});
                        if (errors.phone) setErrors({...errors, phone: null});
                      }}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-yellow-500'
                      }`}
                      placeholder="+977 98XXXXXXXX"
                    />
                    {errors.phone && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
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
                  src={movie.image || movie.poster || "https://placehold.co/500x750/1a1a1a/ffffff?text=Movie+Poster"}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-lg"
                  onError={handleImageError}
                />
                <div>
                  <h4 className="text-white font-semibold">{movie.title}</h4>
                  <div className="text-white/60 text-sm mt-1">{movie.duration}</div>
                  <div className="text-white/60 text-sm">{Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}</div>
                </div>
              </div>

              <div className="space-y-3 text-white/80">
                <div className="flex justify-between">
                  <span>Theatre</span>
                  <span className="text-white">{theatre.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Show</span>
                  <span>{formatDate(showtime.date)} at {showtime.time}</span>
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
                  <div>{formatDate(showtime.date)} at {showtime.time}</div>
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
