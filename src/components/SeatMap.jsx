import React, { useState, useEffect } from 'react';
import { Monitor, User, Armchair } from 'lucide-react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 12;

const generateSeats = (prebookedSeats = []) => {
  const seats = [];
  ROWS.forEach(row => {
    for (let i = 1; i <= SEATS_PER_ROW; i++) {
      const seatId = `${row}${i}`;
      const isAisle = i === 6;
      const status = prebookedSeats.includes(seatId) ? 'booked' : 'available';
      seats.push({
        id: seatId,
        row,
        number: i,
        isAisle,
        status,
        priceType: row <= 'D' ? 'premium' : 'standard'
      });
    }
  });
  return seats;
};

export const SeatMap = ({ 
  onSeatSelect, 
  selectedSeats = [],
  prebookedSeats = [],
  standardPrice = 250,
  premiumPrice = 350
}) => {
  const [seats, setSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  useEffect(() => {
    setSeats(generateSeats(prebookedSeats));
  }, [prebookedSeats]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    
    const isSelected = selectedSeats.includes(seat.id);
    let newSelected;
    
    if (isSelected) {
      newSelected = selectedSeats.filter(id => id !== seat.id);
    } else {
      newSelected = [...selectedSeats, seat.id];
    }
    
    onSeatSelect(newSelected);
  };

  const getSeatClass = (seat) => {
    const baseClass = "w-10 h-10 rounded-t-lg rounded-b-sm flex items-center justify-center text-xs font-medium transition-all duration-200 cursor-pointer";
    
    if (seat.status === 'booked') {
      return `${baseClass} bg-gray-600 text-gray-400 cursor-not-allowed`;
    }
    
    if (selectedSeats.includes(seat.id)) {
      return `${baseClass} bg-yellow-500 text-black shadow-lg shadow-yellow-500/50 scale-110`;
    }
    
    if (seat.priceType === 'premium') {
      return `${baseClass} bg-purple-600 hover:bg-purple-500 text-white`;
    }
    
    return `${baseClass} bg-blue-600 hover:bg-blue-500 text-white`;
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-8">
      {/* Screen */}
      <div className="mb-12 relative">
        <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full shadow-lg shadow-purple-500/50" />
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white/40 text-sm flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          SCREEN
        </div>
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-t-lg rounded-b-sm flex items-center justify-center" />
          <span className="text-white/70">Standard - Rs. {standardPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-t-lg rounded-b-sm flex items-center justify-center" />
          <span className="text-white/70">Premium - Rs. {premiumPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-t-lg rounded-b-sm flex items-center justify-center" />
          <span className="text-white/70">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-600 rounded-t-lg rounded-b-sm flex items-center justify-center" />
          <span className="text-white/70">Booked</span>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="flex flex-col items-center gap-2">
        {ROWS.map(row => (
          <div key={row} className="flex items-center gap-2">
            <div className="w-8 text-white/50 text-sm font-medium text-center">{row}</div>
            <div className="flex gap-1">
              {seats.filter(s => s.row === row).map(seat => (
                <div
                  key={seat.id}
                  className={getSeatClass(seat)}
                  onClick={() => handleSeatClick(seat)}
                  onMouseEnter={() => setHoveredSeat(seat)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  title={`${seat.id} - ${seat.priceType === 'premium' ? 'Premium' : 'Standard'}`}
                >
                  {seat.status === 'booked' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Armchair className="w-4 h-4" />
                  )}
                </div>
              ))}
            </div>
            <div className="w-8 text-white/50 text-sm font-medium text-center">{row}</div>
          </div>
        ))}
      </div>

      {/* Hover Info */}
      {hoveredSeat && (
        <div className="mt-6 text-center text-white/70 text-sm">
          Seat <span className="font-semibold text-white">{hoveredSeat.id}</span> - 
          {hoveredSeat.priceType === 'premium' ? (
            <span className="text-purple-400 ml-1">Premium - Rs. {premiumPrice}</span>
          ) : (
            <span className="text-blue-400 ml-1">Standard - Rs. {standardPrice}</span>
          )}
        </div>
      )}

      {/* Aisle Markers */}
      <div className="mt-4 text-center text-white/30 text-xs">
        <span className="mx-16">A I S L E</span>
        <span className="mx-16">A I S L E</span>
      </div>
    </div>
  );
};

export default SeatMap;
