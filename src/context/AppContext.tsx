"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the types for our state
interface User {
  username: string;
  walletAddress: string;
  isAuthenticated: boolean;
  tokens: number;
  claimedPrizes: string[];
}

interface AppContextType {
  user: User | null;
  login: (address: string) => void;
  logout: () => void;
  addTokens: (amount: number) => void;
  claimPrize: (prize: string) => void;
  spinCount: number;
  decrementSpinCount: () => void;
  resetSpinCount: () => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  addTokens: () => {},
  claimPrize: () => {},
  spinCount: 3, // Default daily spins
  decrementSpinCount: () => {},
  resetSpinCount: () => {},
});

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);

// Provider component to wrap our app
export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [spinCount, setSpinCount] = useState<number>(3);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('prizeDappUser');
    const storedSpinCount = localStorage.getItem('prizeDappSpinCount');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedSpinCount) {
      setSpinCount(parseInt(storedSpinCount, 10));
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('prizeDappUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('prizeDappUser');
    }
  }, [user]);

  // Save spin count to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('prizeDappSpinCount', spinCount.toString());
  }, [spinCount]);

  // Login function
  const login = (address: string) => {
    const newUser = {
      username: `User_${address.substring(0, 6)}`,
      walletAddress: address,
      isAuthenticated: true,
      tokens: 100, // Starting tokens
      claimedPrizes: [],
    };
    setUser(newUser);
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Add tokens function
  const addTokens = (amount: number) => {
    if (user) {
      setUser({ ...user, tokens: user.tokens + amount });
    }
  };

  // Claim prize function
  const claimPrize = (prize: string) => {
    if (user && !user.claimedPrizes.includes(prize)) {
      setUser({
        ...user,
        claimedPrizes: [...user.claimedPrizes, prize],
      });
    }
  };

  // Decrement spin count
  const decrementSpinCount = () => {
    if (spinCount > 0) {
      setSpinCount(spinCount - 1);
    }
  };

  // Reset spin count (e.g., daily)
  const resetSpinCount = () => {
    setSpinCount(3);
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      addTokens,
      claimPrize,
      spinCount,
      decrementSpinCount,
      resetSpinCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}