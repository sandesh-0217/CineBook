import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const signInWithGoogle = async (navigate) => {
  try {
    console.log('Attempting Google sign-in...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful:', result.user);
    // Redirect to home page after successful login
    navigate('/');
  } catch (error) {
    console.error('Google sign-in error:', error);
    // Show user-friendly error message based on error code
    let errorMessage = 'Sign in failed. Please try again.';
    if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign in was cancelled. Please try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Another sign in popup is already open. Please close it and try again.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.message) {
      errorMessage = `Sign in failed: ${error.message}`;
    }
    alert(errorMessage);
  }
};
