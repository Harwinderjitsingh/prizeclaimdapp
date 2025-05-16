"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { generateMockTxData } from '@/utils/aptos';
import { toast } from 'react-hot-toast';
import { sendPrizeTransaction } from '@/lib/stellarService';

// Prize definitions
const prizes = [
  { id: 'token10', name: '10 Tokens', color: '#FF5733', probability: 0.3 },
  { id: 'token20', name: '20 Tokens', color: '#33FF57', probability: 0.2 },
  { id: 'token50', name: '50 Tokens', color: '#3357FF', probability: 0.1 },
  { id: 'nft1', name: 'Common NFT', color: '#F3FF33', probability: 0.2 },
  { id: 'nft2', name: 'Rare NFT', color: '#FF33F3', probability: 0.1 },
  { id: 'nft3', name: 'Epic NFT', color: '#33FFF3', probability: 0.05 },
  { id: 'jackpot', name: 'Jackpot!', color: '#FFD700', probability: 0.05 },
  { id: 'nothing', name: 'Try Again', color: '#CCCCCC', probability: 0 }, // Probability filled automatically
];

// Calculate the total probability and adjust the "nothing" prize to make total = 1
const totalProbability = prizes.slice(0, -1).reduce((sum, prize) => sum + prize.probability, 0);
prizes[prizes.length - 1].probability = Math.max(0, 1 - totalProbability);

export default function PrizeWheel({ onPrizeWin }: { onPrizeWin?: (walletAddress: string) => void }) {
  const { user, spinCount, decrementSpinCount, addTokens, claimPrize } = useAppContext();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Spin the wheel
  const spinWheel = () => {
    if (!user || spinning || spinCount <= 0) return;

    setSpinning(true);
    decrementSpinCount();

    // Calculate the winning prize based on probabilities
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    let winningPrize = prizes[prizes.length - 1]; // Default to "Try Again"

    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (randomValue <= cumulativeProbability) {
        winningPrize = prize;
        break;
      }
    }

    // Calculate target rotation to land on the winning prize
    // Each prize takes up 360/prizes.length degrees of the wheel
    const prizeIndex = prizes.findIndex(p => p.id === winningPrize.id);
    const prizeAngle = (360 / prizes.length);
    const targetRotation = 1800 + (prizeIndex * prizeAngle);

    // Set the final rotation (adding a random offset within the prize's slice)
    const randomOffset = Math.random() * (prizeAngle * 0.8);
    const finalRotation = rotation + targetRotation + randomOffset;

    setRotation(finalRotation);

    // After animation completes
    setTimeout(() => {
      setSpinning(false);
      setWonPrize(winningPrize);
      setShowResult(true);

      // Process prize
      if (winningPrize.id !== 'nothing') {
        processPrize(winningPrize);
      }
    }, 5000);
  };

  // Process the prize won by the user
  const processPrize = (prize: any) => {
    // Handle token prizes
    if (prize.id.startsWith('token')) {
      const amount = parseInt(prize.id.replace('token', ''), 10);
      addTokens(amount);
      toast.success(`You won ${amount} tokens!`);
      if (onPrizeWin && user) {
        sendPrizeTransaction(user.walletAddress, amount.toString())
          .then(() => {
            alert(`🎉 You won ${amount} tokens and they have been sent to your wallet!`);
          })
          .catch((error) => {
            console.error(error);
            alert("Failed to send tokens.");
          });
        onPrizeWin(user.walletAddress);
      }
    }
    // Handle NFT prizes
    else if (prize.id.startsWith('nft')) {
      claimPrize(prize.id);

      if (user) {
        const txData = generateMockTxData(prize.id, user.walletAddress);
        setTransactions(prev => [txData, ...prev]);
        toast.success(`You won a ${prize.name}!`);
        if (onPrizeWin) {
          sendPrizeTransaction(user.walletAddress, "1")
            .then(() => {
              alert(`🎉 You won a ${prize.name} and it has been sent to your wallet!`);
            })
            .catch((error) => {
              console.error(error);
              alert("Failed to send NFT.");
            });
          onPrizeWin(user.walletAddress);
        }
      }
    }
    // Handle jackpot
    else if (prize.id === 'jackpot') {
      addTokens(100);
      claimPrize('jackpot');

      if (user) {
        const txData = generateMockTxData('jackpot', user.walletAddress);
        setTransactions(prev => [txData, ...prev]);
        toast.success('🎉 JACKPOT! You won 100 tokens!');
        if (onPrizeWin) {
          sendPrizeTransaction(user.walletAddress, "100")
            .then(() => {
              alert("🎉 JACKPOT! 100 tokens have been sent to your wallet!");
            })
            .catch((error) => {
              console.error(error);
              alert("Failed to send jackpot tokens.");
            });
          onPrizeWin(user.walletAddress);
        }
      }
    }
    // No prize won
    else if (onPrizeWin && user) {
      onPrizeWin(user.walletAddress);
    }
  };
  
  // Close the result modal
  const closeResult = () => {
    setShowResult(false);
    setWonPrize(null);
  };
  
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Spin counter */}
      <div className="text-center">
        <p className="text-gray-700 dark:text-gray-300">Spins Remaining Today</p>
        <div className="text-2xl font-bold">{spinCount}</div>
      </div>
      
      {/* Prize wheel */}
      <div className="relative w-64 h-64">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[24px] border-l-transparent border-r-transparent border-b-red-600 z-10" />
        
        {/* Wheel */}
        <motion.div
          ref={wheelRef}
          className="w-full h-full rounded-full border-4 border-gray-800 overflow-hidden relative"
          style={{ transformOrigin: 'center center' }}
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.2, 0.6, 0.4, 1] }}
        >
          {prizes.map((prize, index) => {
            const angle = (360 / prizes.length) * index;
            return (
              <div
                key={prize.id}
                className="absolute top-0 left-0 w-full h-full flex justify-center"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((angle + 360 / prizes.length) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle + 360 / prizes.length) * Math.PI / 180)}%, ${50 + 50 * Math.cos(angle * Math.PI / 180)}% ${50 + 50 * Math.sin(angle * Math.PI / 180)}%)`,
                  backgroundColor: prize.color,
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <span 
                  className="mt-4 text-xs font-semibold text-center transform rotate-180"
                  style={{ transform: `rotate(${180 - angle}deg)` }}
                >
                  {prize.name}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Spin button */}
      <button
        onClick={spinWheel}
        disabled={spinning || spinCount <= 0 || !user}
        className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
          spinning || spinCount <= 0 || !user
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {spinning ? 'Spinning...' : 'SPIN!'}
      </button>
      
      {/* Result modal */}
      {showResult && wonPrize && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-sm w-full">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">
                {wonPrize.id === 'nothing' ? 'Better luck next time!' : 'You Won!'}
              </h3>
              
              <div 
                className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
                style={{ backgroundColor: wonPrize.color }}
              >
                <span className="text-xl font-bold">{wonPrize.name}</span>
              </div>
              
              {wonPrize.id !== 'nothing' && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {wonPrize.id.startsWith('token') ? (
                    <p>Tokens have been added to your balance</p>
                  ) : (
                    <p>NFT has been added to your collection!</p>
                  )}
                </div>
              )}
              
              <button
                onClick={closeResult}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Transaction history */}
      {transactions.length > 0 && (
        <div className="w-full mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-h-40 overflow-y-auto">
            {transactions.map((tx, index) => (
              <div key={index} className="text-xs border-b border-gray-200 dark:border-gray-700 py-2">
                <div className="flex justify-between">
                  <span className="font-medium">Prize:</span>
                  <span>{prizes.find(p => p.id === tx.prizeId)?.name || tx.prizeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">TX Hash:</span>
                  <span className="font-mono">{tx.txHash.substring(0, 10)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}