"use client";

import { useAppContext } from "@/context/AppContext";

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function GameCard({ title, description, icon, onClick, disabled = false }: GameCardProps) {
  const { user } = useAppContext();
  
  const isDisabled = disabled || !user;

  return (
    <div 
      className={`relative border rounded-xl p-6 h-full transition-all transform hover:shadow-lg ${
        isDisabled 
          ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70'
          : 'bg-white dark:bg-gray-900 cursor-pointer hover:-translate-y-1'
      }`}
      onClick={isDisabled ? undefined : onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      
      {isDisabled && !user && (
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center">
          <span className="text-white font-medium">Connect wallet to play</span>
        </div>
      )}
    </div>
  );
}