"use client";

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function PasskeyAuth() {
  const [authStatus, setAuthStatus] = useState<'idle' | 'authenticating' | 'authenticated' | 'failed'>('idle');
  const { user, isVerifiedWithPasskey, setIsVerifiedWithPasskey } = useAppContext();

  // Handles Passkey Registration
  const registerPasskey = async () => {
    if (!user) {
      alert("Please connect your wallet first");
      return;
    }

    setAuthStatus('authenticating');
    try {
      const publicKeyCredentialCreationOptions = {
        challenge: Uint8Array.from('random-challenge-string', c => c.charCodeAt(0)),
        rp: { name: "PrizeClaim DApp" },
        user: {
          id: Uint8Array.from(user.username, c => c.charCodeAt(0)),
          name: user.username,
          displayName: user.username,
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      };

      const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
      if (credential) {
        setAuthStatus('authenticated');
        setIsVerifiedWithPasskey(true);
        localStorage.setItem('passkeyAuthenticated', 'true');
        localStorage.setItem('passkeyCredentialId', (credential as PublicKeyCredential).id);
      }
    } catch (error) {
      console.error(error);
      setAuthStatus('failed');
      setIsVerifiedWithPasskey(false);
    }
  };

  // Handles Passkey Verification
  const verifyPasskey = async () => {
    if (!user) {
      alert("Please connect your wallet first");
      return;
    }

    setAuthStatus('authenticating');
    try {
      const credentialId = localStorage.getItem('passkeyCredentialId');
      if (!credentialId) {
        alert("No registered passkey found. Please register first.");
        return;
      }

      const publicKeyCredentialRequestOptions = {
        challenge: Uint8Array.from('random-challenge-string', c => c.charCodeAt(0)),
        allowCredentials: [{ id: Uint8Array.from(credentialId, c => c.charCodeAt(0)), type: "public-key" }],
      };

      const assertion = await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });
      if (assertion) {
        setAuthStatus('authenticated');
        setIsVerifiedWithPasskey(true);
      }
    } catch (error) {
      console.error(error);
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
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={registerPasskey}
              disabled={authStatus === 'authenticating'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Register Passkey
            </button>
            <button
              onClick={verifyPasskey}
              disabled={authStatus === 'authenticating'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Verify with Passkey
            </button>
          </div>
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