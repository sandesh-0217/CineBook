import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    console.log('Attempting Google sign-in...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful:', result.user);
    return result;
  } catch (error) {
    console.error('Google sign-in error:', error);
    let errorMessage = 'Sign in failed. Please try again.';
    if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign in was cancelled. Please try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Another sign in popup is already open. Please close it and try again.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for OAuth operations. Please contact support.';
    } else if (error.message) {
      errorMessage = `Sign in failed: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};

// Email/Password Sign-In
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

// Email/Password Registration
export const signUpWithEmail = async (email, password, name) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return result;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
