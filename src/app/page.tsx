"use client";

import { useState, useEffect } from 'react';
import WalletConnector from '@/components/WalletConnector';
import PasskeyAuth from '@/components/PasskeyAuth';
import PrizeWheel from '@/components/PrizeWheel';
import GameCard from '@/components/GameCard';
import { useAppContext } from '@/context/AppContext';
import { checkAndResetSpins } from '@/utils/localStorage';

export default function Home() {
  const { user, spinCount } = useAppContext();
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [showGameCards, setShowGameCards] = useState(true);

  // Check if spins should be reset (once per day)
  useEffect(() => {
    checkAndResetSpins();
  }, []);

  const games = [
    {
      id: 'prizewheel',
      title: 'Prize Wheel',
      description: 'Spin the wheel to win tokens and NFTs!',
      icon: '🎡',
      component: <PrizeWheel />,
      disabled: spinCount <= 0,
    },
    // Additional games can be added here
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            Prize Claim With Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Connect your wallet, verify with passkey, and win blockchain prizes!
          </p>
        </div>

        {/* Auth section */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Wallet Connection</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect your Aptos wallet to start playing and claiming prizes as you can
            </p>
            <WalletConnector />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Passkey Authentication</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add an extra layer of security with passkey verification
            </p>
            <PasskeyAuth />
          </div>
        </div>

        {/* User stats if logged in */}
        {user && (
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Username</p>
                <p className="text-lg font-semibold">{user.username}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Token Balance</p>
                <p className="text-lg font-semibold">{user.tokens}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">NFTs Claimed</p>
                <p className="text-lg font-semibold">{user.claimedPrizes.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Game section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Games & Prizes</h2>
          
          {showGameCards && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  title={game.title}
                  description={game.description}
                  icon={game.icon}
                  disabled={game.disabled}
                  onClick={() => {
                    setCurrentGame(game.id);
                    setShowGameCards(false);
                  }}
                />
              ))}
            </div>
          )}
          
          {currentGame && !showGameCards && (
            <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {games.find(g => g.id === currentGame)?.title}
                </h3>
                <button
                  onClick={() => {
                    setCurrentGame(null);
                    setShowGameCards(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ← Back to Games
                </button>
              </div>
              {games.find(g => g.id === currentGame)?.component}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-12">
          <p>Prize Claim DApp - Hackathon Project {new Date().getFullYear()}</p>
          <p className="mt-1">Built with Next.js, Tailwind CSS, and Aptos blockchain</p>
        </footer>
      </div>
    </main>
  );
}