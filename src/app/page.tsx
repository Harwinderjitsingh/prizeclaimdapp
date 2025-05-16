"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import WalletConnector from '@/components/WalletConnector';
import PasskeyAuth from '@/components/PasskeyAuth';
import PrizeWheel from '@/components/PrizeWheel';
import GameCard from '@/components/GameCard';
import { useAppContext } from '@/context/AppContext';
import { checkAndResetSpins } from '@/utils/localStorage';
import { sendPrizeTransaction } from '@/lib/stellarService';
import { Input } from '@/components/ui/Input';

export default function Home() {
  const { user, spinCount, isVerifiedWithPasskey } = useAppContext();
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [showGameCards, setShowGameCards] = useState(true);
  const [transactionHistory, setTransactionHistory] = useState<{ amount: string; hash: string; timestamp: string }[]>([]);
  const [recipientAddress, setRecipientAddress] = useState("");

  useEffect(() => {
    checkAndResetSpins();
  }, []);

  const handleSendPrize = async () => {
    if (!recipientAddress.trim()) {
      alert("Wallet address is required.");
      return;
    }
    try {
      const txHash = await sendPrizeTransaction(recipientAddress.trim(), "10");
      const newTransaction = { amount: "10", hash: txHash, timestamp: new Date().toLocaleString() };
      setTransactionHistory((prev) => [...prev, newTransaction]);
      alert("Prize sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send prize");
    }
  };

  const games = [
    {
      id: 'prizewheel',
      title: 'Prize Wheel',
      description: 'Spin the wheel to win tokens and NFTs!',
      icon: '🎡',
      component: <PrizeWheel />,
      disabled: spinCount <= 0,
    },
  ];

  return (
    <>
      <Head>
        <title>Prize Claim DApp - Claim Your Rewards</title>
        <meta name="description" content="Connect your wallet, verify with passkey, and claim blockchain prizes on the Stellar network." />
      </Head>
      <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              Welcome to Prize Claim DApp
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Claim rewards securely by connecting your wallet and verifying your identity with passkey authentication.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white dark:text-white">Wallet Connection</h2>
              <p className="text-sm text-gray-300 dark:text-gray-400">
                Connect your Stellar wallet to start playing and claiming prizes.
              </p>
              <WalletConnector />
              {user && isVerifiedWithPasskey && (
                <div className="mt-4 text-center">
                  <Input
                    type="text"
                    placeholder="Enter the Stellar wallet address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="mb-4"
                  />
                  <button
                    onClick={handleSendPrize}
                    className="bg-green-600 px-4 py-2 text-white rounded"
                  >
                    Send Test Prize
                  </button>
                </div>
              )}
              <div className="mb-8 text-center">
                <PasskeyAuth />
              </div>
              <div className="text-sm mt-2">
                <p>Status:</p>
                <p>Wallet: {user ? '✅ Connected' : '❌ Not Connected'}</p>
                <p>Passkey: {isVerifiedWithPasskey ? '✅ Verified' : '❌ Not Verified'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white dark:text-white">Passkey Authentication</h2>
              <p className="text-sm text-gray-300 dark:text-gray-400">
                Add an extra layer of security with passkey verification.
              </p>
            </div>
          </div>

          {user && (
              <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-white dark:text-white mb-4">Your Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-300 dark:text-gray-400">Username</p>
                    <p className="text-lg font-semibold">{user.username}</p>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-300 dark:text-gray-400">Token Balance</p>
                    <p className="text-lg font-semibold">{user.tokens}</p>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-300 dark:text-gray-400">NFTs Claimed</p>
                    <p className="text-lg font-semibold">{user.claimedPrizes.length}</p>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg col-span-3">
                    <p className="text-sm text-gray-300 dark:text-gray-400">Wallet Address</p>
                    <p className="text-lg font-semibold break-all">{user.walletAddress}</p>
                  </div>
                </div>
              </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white dark:text-white mb-4">Games & Prizes</h2>
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
                    <h3 className="text-xl font-semibold text-white dark:text-white">
                      {games.find((g) => g.id === currentGame)?.title}
                    </h3>
                    <button
                        onClick={() => {
                          setCurrentGame(null);
                          setShowGameCards(true);
                        }}
                        className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
                    >
                      ← Back to Games
                    </button>
                  </div>
                  {games.find((g) => g.id === currentGame)?.component}
                </div>
            )}
          </div>

          {!isVerifiedWithPasskey && user && (
            <div className="mt-8 text-center text-red-500">
              <p>Please verify with Passkey before claiming prizes.</p>
            </div>
          )}

          {transactionHistory.length > 0 && (
            <div className="mt-8 text-center">
              <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
              {transactionHistory.map((tx, index) => (
                <div key={index} className="mb-4">
                  <p>Amount: {tx.amount} XLM</p>
                  <p>Transaction Hash: {tx.hash}</p>
                  <p>Timestamp: {tx.timestamp}</p>
                  <hr className="my-2" />
                </div>
              ))}
            </div>
          )}

          <footer className="text-center text-sm mt-12 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-gray-500 dark:text-gray-400">
              Prize Claim DApp - Stellar Hackathon {new Date().getFullYear()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Built with Next.js, Tailwind CSS, and Stellar Blockchain.
            </p>
          </footer>
        </div>
      </main>
    </>
  );

}