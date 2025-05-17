
// Function to clean up auth state - prevents auth limbo issues
export const cleanupAuthState = () => {
  // For localStorage implementation, remove the user and any potential auth-related keys
  localStorage.removeItem('pos_user');
  
  // A more thorough cleanup can remove any keys related to authentication
  // that might be causing conflicts or lingering state issues
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('pos_') || key.includes('auth')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear session storage as well, in case it's being used
  Object.keys(sessionStorage || {}).forEach(key => {
    if (key.startsWith('pos_') || key.includes('auth')) {
      sessionStorage.removeItem(key);
    }
  });
  
  console.log("Auth state cleaned up");
};
