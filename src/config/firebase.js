// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY4NfyTa0qK3F4prs4WIgWcSio3hwgn_I",
  authDomain: "moviebookingsystem-b532e.firebaseapp.com",
  projectId: "moviebookingsystem-b532e",
  storageBucket: "moviebookingsystem-b532e.firebasestorage.app",
  messagingSenderId: "305778544722",
  appId: "1:305778544722:web:139acf156d1926b02f4f8b",
  measurementId: "G-WWT2KCFFC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
