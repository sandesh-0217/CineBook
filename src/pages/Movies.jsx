import movies from "../data/movies";
import { useNavigate } from "react-router-dom";

function Movies() {
  const navigate = useNavigate();

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/500x750/1a1a1a/ffffff?text=Movie+Poster";
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Movies Available</h1>
          <p className="text-gray-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Now Showing</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="w-full h-64 object-cover"
              onError={handleImageError}
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="font-bold text-xl text-gray-800">{movie.title}</h2>
              <p className="text-gray-600 mt-2">Price: Rs. {movie.price}</p>
              <button
                onClick={() => navigate("/booking", { state: movie })}
                className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors duration-200 font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movies;