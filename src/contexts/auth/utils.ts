
// Function to clean up auth state - prevents auth limbo issues
export const cleanupAuthState = () => {
  // For localStorage implementation, just remove the user
  localStorage.removeItem('pos_user');
};
