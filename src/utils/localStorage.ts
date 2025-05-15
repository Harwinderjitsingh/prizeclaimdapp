// Local storage keys
const USER_KEY = 'prizeDappUser';
const SPIN_COUNT_KEY = 'prizeDappSpinCount';
const LAST_RESET_KEY = 'prizeDappLastReset';

// Save user data to localStorage
export const saveUser = (userData: any) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

// Get user data from localStorage
export const getUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Remove user data from localStorage
export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
    return true;
  } catch (error) {
    console.error('Error removing user data:', error);
    return false;
  }
};

// Save spin count to localStorage
export const saveSpinCount = (count: number) => {
  try {
    localStorage.setItem(SPIN_COUNT_KEY, count.toString());
    return true;
  } catch (error) {
    console.error('Error saving spin count:', error);
    return false;
  }
};

// Get spin count from localStorage
export const getSpinCount = (): number => {
  try {
    const count = localStorage.getItem(SPIN_COUNT_KEY);
    return count ? parseInt(count, 10) : 3; // Default to 3 spins
  } catch (error) {
    console.error('Error getting spin count:', error);
    return 3; // Default to 3 spins
  }
};

// Check if spins should be reset (once per day)
export const checkAndResetSpins = () => {
  try {
    const now = new Date();
    const today = now.toDateString();
    const lastReset = localStorage.getItem(LAST_RESET_KEY);
    
    if (lastReset !== today) {
      // It's a new day, reset spins
      localStorage.setItem(SPIN_COUNT_KEY, '3');
      localStorage.setItem(LAST_RESET_KEY, today);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking/resetting spins:', error);
    return false;
  }
};