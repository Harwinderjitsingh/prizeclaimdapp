"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function WalletConnector() {
  const { login, logout, user } = useAppContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const generateRandomAddress = () => {
    const chars = '0123456789abcdef';
    let addr = '0x';
    for (let i = 0; i < 40; i++) {
      addr += chars[Math.floor(Math.random() * chars.length)];
    }
    return addr;
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      if (!connected) {
        // Simulate wallet connection
        await new Promise(resolve => setTimeout(resolve, 1000));
        const randomAddress = generateRandomAddress();
        setAddress(randomAddress);
        setConnected(true);
        login(randomAddress);
      } else {
        logout();
        setConnected(false);
        setAddress(null);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          connected 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        } ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isConnecting 
          ? 'Connecting...' 
          : connected 
            ? 'Disconnect Wallet' 
            : 'Connect Wallet'
        }
      </button>
      
      {connected && address && (
        <div className="text-center">
          <p className="text-sm font-medium">Connected as:</p>
          <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 dark:bg-gray-800">
            {address.substring(0, 6)}...
            {address.substring(address.length - 4)}
          </p>
        </div>
      )}
    </div>
  );
}