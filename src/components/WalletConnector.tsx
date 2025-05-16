"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function WalletConnector() {
  const { login, logout, user } = useAppContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState<boolean>(!!user);
  const [address, setAddress] = useState<string | null>(user?.walletAddress || null);

  const generateRandomAddress = () => {
    const storedAddresses = JSON.parse(localStorage.getItem('storedWalletAddresses') || '[]');
    if (storedAddresses.length > 0) {
      const lastUsedAddress = storedAddresses[storedAddresses.length - 1];
      return lastUsedAddress;
    }
    const chars = '0123456789abcdef';
    let addr = '0x';
    for (let i = 0; i < 40; i++) {
      addr += chars[Math.floor(Math.random() * chars.length)];
    }
    const updatedAddresses = [...storedAddresses, addr];
    localStorage.setItem('storedWalletAddresses', JSON.stringify(updatedAddresses));
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
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 text-white'
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
              <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 dark:bg-gray-700 dark:text-white">
                {address.substring(0, 6)}...{address.substring(address.length - 4)}
              </p>
            </div>
        )}
      <div className="w-full text-left">
      {/* Saved Wallets List */}
      {localStorage.getItem('storedWalletAddresses') && (
        <div className="w-full mt-4 text-center">
          <h3 className="text-md font-semibold mb-2">Saved Wallets</h3>
          <div className="flex flex-col items-center space-y-2">
            {JSON.parse(localStorage.getItem('storedWalletAddresses') || '[]').map((savedAddr: string, index: number) => (
              <button
                key={index}
                onClick={() => {
                  setAddress(savedAddr);
                  setConnected(true);
                  login(savedAddr);
                }}
                className="text-xs font-mono bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-2 py-1 rounded"
              >
                {savedAddr.substring(0, 6)}...{savedAddr.substring(savedAddr.length - 4)}
              </button>
            ))}
          </div>
        </div>
      )}
      </div>
      </div>
  );
}