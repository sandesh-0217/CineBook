// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import MoviesDetails from "./pages/MoviesDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Confirmation from "./pages/Confirmation";
import AdminSeed from "./pages/AdminSeed";
import DebugFirestore from "./pages/DebugFirestore";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar /> {/* Navbar contains Links */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MoviesDetails />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/admin/seed" element={<AdminSeed />} />
          <Route path="/debug/firestore" element={<DebugFirestore />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
