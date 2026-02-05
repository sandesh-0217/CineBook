import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

// Collection references
export const moviesRef = collection(db, "movies");
export const theatresRef = collection(db, "theatres");
export const showtimesRef = collection(db, "showtimes");
export const seatsRef = collection(db, "seats");
export const bookingsRef = collection(db, "bookings");

// Helper functions
export const getMovies = async () => {
  try {
    const snapshot = await getDocs(moviesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const getTheatres = async () => {
  try {
    const snapshot = await getDocs(theatresRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching theatres:", error);
    return [];
  }
};

export const getShowtimesByMovie = async (movieId) => {
  try {
    const q = query(showtimesRef, where("movieId", "==", movieId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    return [];
  }
};

export const getSeatsByShowtime = async (showtimeId) => {
  try {
    const q = query(seatsRef, where("showTimeId", "==", showtimeId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching seats:", error);
    return [];
  }
};

export const updateSeatStatus = async (seatId, status) => {
  try {
    const seatDoc = doc(seatsRef, seatId);
    await updateDoc(seatDoc, { status });
  } catch (error) {
    console.error("Error updating seat:", error);
  }
};

export const createBooking = async (bookingData) => {
  try {
    const booking = {
      ...bookingData,
      createdAt: serverTimestamp(),
      status: "confirmed"
    };
    const docRef = await addDoc(bookingsRef, booking);
    return { id: docRef.id, ...booking };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const q = query(bookingsRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
};

export const subscribeToSeats = (showtimeId, callback) => {
  const q = query(seatsRef, where("showTimeId", "==", showtimeId));
  return onSnapshot(q, (snapshot) => {
    const seats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(seats);
  });
};

export const deleteBooking = async (bookingId) => {
  try {
    await deleteDoc(doc(bookingsRef, bookingId));
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const bookingDoc = doc(bookingsRef, bookingId);
    await updateDoc(bookingDoc, { status: "cancelled" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

export default {
  moviesRef,
  theatresRef,
  showtimesRef,
  seatsRef,
  bookingsRef,
  getMovies,
  getTheatres,
  getShowtimesByMovie,
  getSeatsByShowtime,
  updateSeatStatus,
  createBooking,
  getUserBookings,
  subscribeToSeats,
  deleteBooking,
  cancelBooking
};
