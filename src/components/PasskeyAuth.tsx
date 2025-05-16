"use client";

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function PasskeyAuth() {
  const [authStatus, setAuthStatus] = useState<'idle' | 'authenticating' | 'authenticated' | 'failed'>('idle');
  const { user, isVerifiedWithPasskey, setIsVerifiedWithPasskey } = useAppContext();

  // Simulate passkey registration and authentication
  const simulateAuthentication = async () => {
    if (!user) {
      alert("Please connect your wallet first");
      return;
    }

    setAuthStatus('authenticating');

    // Simulate passkey authentication
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate 90% success rate
    const success = Math.random() < 0.9;

    if (success) {
      setAuthStatus('authenticated');
      setIsVerifiedWithPasskey(true);
      localStorage.setItem('passkeyAuthenticated', 'true');
    } else {
      setAuthStatus('failed');
      setIsVerifiedWithPasskey(false);
    }
  };

  // Load authentication status from localStorage
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('passkeyAuthenticated') === 'true';
    if (user) {
      setAuthStatus(isAuthenticated ? 'authenticated' : 'idle');
      setIsVerifiedWithPasskey(isAuthenticated);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {user && (
        <>
          <button
            onClick={simulateAuthentication}
            disabled={authStatus === 'authenticating' || authStatus === 'authenticated'}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              authStatus === 'authenticated'
                ? 'bg-green-500 text-white cursor-default'
                : authStatus === 'authenticating'
                ? 'bg-yellow-500 text-white cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {authStatus === 'authenticated'
              ? '✓ Passkey Verified'
              : authStatus === 'authenticating'
              ? 'Verifying...'
              : 'Verify with Passkey'}
          </button>
          
          {authStatus === 'authenticated' && (
            <div className="text-center text-green-600 text-sm">
              Your identity is verified with passkey
            </div>
          )}
          
          {authStatus === 'failed' && (
            <div className="text-center text-red-600 text-sm">
              Verification failed. Please try again.
            </div>
          )}
        </>
      )}
      
      {!user && (
        <div className="text-center text-gray-500 text-sm">
          Connect your wallet to use passkey authentication
        </div>
      )}
    </div>
  );
}