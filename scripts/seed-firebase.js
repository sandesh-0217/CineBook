import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase configuration is incomplete. Please check your .env file.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Movie data
const MOVIES = [
  {
    id: "movie_1",
    title: "Avengers: Endgame",
    price: 300,
    image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    rating: 8.4,
    genre: ["Action", "Sci-Fi"],
    duration: 181,
    synopsis: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    releaseDate: "2019-04-26",
    language: "English",
    trailerId: "TcMBFSGVi1c",
    status: "now_showing"
  },
  {
    id: "movie_2",
    title: "John Wick 4",
    price: 250,
    image: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEEt2t2.jpg",
    rating: 7.7,
    genre: ["Action", "Thriller"],
    duration: 169,
    synopsis: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, he must face off against a new enemy.",
    releaseDate: "2023-03-22",
    language: "English",
    trailerId: "qEVUtrk8_B4",
    status: "now_showing"
  },
  {
    id: "movie_3",
    title: "Spider-Man: No Way Home",
    price: 280,
    image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    rating: 8.2,
    genre: ["Action", "Adventure"],
    duration: 148,
    synopsis: "With Spider-Man's identity revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
    releaseDate: "2021-12-17",
    language: "English",
    trailerId: "JfVOs4VSpmA",
    status: "now_showing"
  },
  {
    id: "movie_4",
    title: "The Batman",
    price: 270,
    image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    rating: 7.8,
    genre: ["Action", "Crime"],
    duration: 176,
    synopsis: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    releaseDate: "2022-03-04",
    language: "English",
    trailerId: "mqqft2x_Aa4",
    status: "now_showing"
  },
  {
    id: "movie_5",
    title: "Avatar: The Way of Water",
    price: 320,
    image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    rating: 7.5,
    genre: ["Action", "Adventure"],
    duration: 192,
    synopsis: "Set more than a decade after the events of the first film, learn the story of the Sully family and the trouble that follows them.",
    releaseDate: "2022-12-16",
    language: "English",
    trailerId: "a8Gx8wyN8VQ",
    status: "now_showing"
  },
  {
    id: "movie_6",
    title: "Doctor Strange in the Multiverse of Madness",
    price: 290,
    image: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    rating: 6.3,
    genre: ["Action", "Fantasy"],
    duration: 126,
    synopsis: "Doctor Strange teams up with a mysterious teenage girl who can travel across multiverses to fight others who also possess dangerous powers.",
    releaseDate: "2022-05-06",
    language: "English",
    trailerId: "aWzlQshN-M8",
    status: "now_showing"
  },
  {
    id: "movie_7",
    title: "Guardians of the Galaxy Vol. 3",
    price: 300,
    image: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    rating: 7.9,
    genre: ["Action", "Comedy"],
    duration: 150,
    synopsis: "The Guardians journey to discover the truth about Rocket's mysterious past and undertake a dangerous mission.",
    releaseDate: "2023-05-05",
    language: "English",
    trailerId: "u3g8D8a4T8E",
    status: "now_showing"
  },
  {
    id: "movie_8",
    title: "Oppenheimer",
    price: 300,
    image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    rating: 8.5,
    genre: ["Biography", "Drama"],
    duration: 180,
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    releaseDate: "2023-07-21",
    language: "English",
    trailerId: "uYPbbksJxIg",
    status: "now_showing"
  },
  {
    id: "movie_9",
    title: "Inception",
    price: 260,
    image: "https://image.tmdb.org/t/p/w500/9gk7admal4zlWH9t0bY0J8C7GYS.jpg",
    rating: 8.8,
    genre: ["Action", "Sci-Fi"],
    duration: 148,
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
    releaseDate: "2010-07-16",
    language: "English",
    trailerId: "YoHD9XEInc0",
    status: "now_showing"
  },
  {
    id: "movie_10",
    title: "Interstellar",
    price: 270,
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 8.6,
    genre: ["Adventure", "Drama"],
    duration: 169,
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseDate: "2014-11-07",
    language: "English",
    trailerId: "zSWdZVtXT7E",
    status: "now_showing"
  },
  {
    id: "movie_11",
    title: "The Dark Knight",
    price: 250,
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 9.0,
    genre: ["Action", "Crime"],
    duration: 152,
    synopsis: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests of his ability.",
    releaseDate: "2008-07-18",
    language: "English",
    trailerId: "EXeTwQWrcwY",
    status: "now_showing"
  },
  {
    id: "movie_12",
    title: "Tenet",
    price: 240,
    image: "https://image.tmdb.org/t/p/w500/k68nPLbISTUAPCcNgrO5y864E8r.jpg",
    rating: 7.3,
    genre: ["Action", "Sci-Fi"],
    duration: 150,
    synopsis: "Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world.",
    releaseDate: "2020-09-03",
    language: "English",
    trailerId: "kz7hK1ZWDe4",
    status: "now_showing"
  }
];

const THEATRES = [
  { id: "theatre_1", name: "Grand Cinema", location: "Downtown", priceMultiplier: 1.0 },
  { id: "theatre_2", name: "City Plex", location: "Mall Road", priceMultiplier: 1.2 },
  { id: "theatre_3", name: "IMAX Arena", location: "Tech Park", priceMultiplier: 1.5 }
];

const SHOWTIMES = [
  { id: "show_1", movieId: "movie_1", theatreId: "theatre_1", time: "10:30 AM" },
  { id: "show_2", movieId: "movie_1", theatreId: "theatre_1", time: "6:00 PM" },
  { id: "show_3", movieId: "movie_1", theatreId: "theatre_2", time: "2:00 PM" },
  { id: "show_4", movieId: "movie_2", theatreId: "theatre_1", time: "9:30 PM" },
  { id: "show_5", movieId: "movie_3", theatreId: "theatre_3", time: "6:00 PM" },
  { id: "show_6", movieId: "movie_4", theatreId: "theatre_2", time: "2:00 PM" },
  { id: "show_7", movieId: "movie_5", theatreId: "theatre_1", time: "10:30 AM" },
  { id: "show_8", movieId: "movie_6", theatreId: "theatre_2", time: "9:30 PM" },
  { id: "show_9", movieId: "movie_9", theatreId: "theatre_3", time: "6:00 PM" },
  { id: "show_10", movieId: "movie_10", theatreId: "theatre_1", time: "2:00 PM" },
  { id: "show_11", movieId: "movie_11", theatreId: "theatre_2", time: "6:00 PM" },
  { id: "show_12", movieId: "movie_12", theatreId: "theatre_3", time: "9:30 PM" }
];

function generateSeats(showTimeId) {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  rows.forEach(row => {
    for (let col = 1; col <= 10; col++) {
      seats.push({
        id: `${showTimeId}_${row}${col}`,
        showTimeId: showTimeId,
        seatId: `${row}${col}`,
        status: 'available'
      });
    }
  });
  return seats;
}

async function seedFirestore() {
  try {
    console.log("Starting the seeding process...");

    // Seed movies
    for (const movie of MOVIES) {
      const movieDoc = await getDoc(doc(db, "movies", movie.id));
      if (!movieDoc.exists()) {
        await setDoc(doc(db, "movies", movie.id), movie);
        console.log(`✓ Seeded movie: ${movie.title}`);
      } else {
        console.log(`  Movie already exists: ${movie.title}`);
      }
    }

    // Seed theatres
    for (const theatre of THEATRES) {
      const theatreDoc = await getDoc(doc(db, "theatres", theatre.id));
      if (!theatreDoc.exists()) {
        await setDoc(doc(db, "theatres", theatre.id), theatre);
        console.log(`✓ Seeded theatre: ${theatre.name}`);
      }
    }

    // Seed showtimes and seats
    for (const showtime of SHOWTIMES) {
      const showtimeDoc = await getDoc(doc(db, "showtimes", showtime.id));
      if (!showtimeDoc.exists()) {
        await setDoc(doc(db, "showtimes", showtime.id), showtime);
        console.log(`✓ Seeded showtime: ${showtime.id}`);
        
        // Generate seats for each showtime
        const seats = generateSeats(showtime.id);
        for (const seat of seats) {
          await setDoc(doc(db, "seats", seat.id), seat);
        }
        console.log(`  - Generated ${seats.length} seats for ${showtime.id}`);
      }
    }

    console.log("\n✅ Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

async function clearFirestore() {
  try {
    console.log("Clearing existing data...");

    const collections = ["seats", "showtimes", "theatres", "bookings", "movies"];
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      for (const docSnapshot of snapshot.docs) {
        await deleteDoc(doc(db, collectionName, docSnapshot.id));
      }
      console.log(`✓ Cleared ${snapshot.size} documents from ${collectionName}`);
    }

    console.log("✅ Clearing completed successfully!");
  } catch (error) {
    console.error("Error clearing data:", error);
    process.exit(1);
  }
}

const command = process.argv[2];

if (command === "clear") {
  clearFirestore();
} else if (command === "seed") {
  seedFirestore();
} else if (command === "reset") {
  clearFirestore().then(() => seedFirestore());
} else {
  console.log("Usage: node seed-firebase.js [seed|clear|reset]");
  console.log("  seed  - Seed data to Firestore (skip existing)");
  console.log("  clear - Clear all data from Firestore");
  console.log("  reset - Clear all data and re-seed");
  process.exit(1);
}
