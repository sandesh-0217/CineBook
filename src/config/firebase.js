
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const sanitize = (value) => {
  if (!value) return undefined;
  // Remove quotes, newlines, and extra whitespace
  return value.replace(/['"\r\n]/g, '').trim();
};

const firebaseConfig = {
  apiKey: sanitize(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: sanitize(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: sanitize(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: sanitize(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: sanitize(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: sanitize(import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: sanitize(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID)
};

// Debug log (remove in production)
console.log("Firebase Config:", {
  apiKey: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + "..." : "undefined",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase configuration is incomplete. Please check your .env file.");
  throw new Error("Firebase configuration is incomplete. Please check your .env file.");
}

let app;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
  throw error;
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
