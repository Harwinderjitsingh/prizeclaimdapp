"use client";

import { 
  AptosWalletAdapterProvider,
  Network 
} from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
//import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { ReactNode, useEffect, useState } from 'react';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [plugins, setPlugins] = useState<any[]>([]);

  useEffect(() => {
    // setPlugins([new PetraWallet(), new MartianWallet()]);
    setPlugins([new PetraWallet()]);
  }, []);

  return (
    <AptosWalletAdapterProvider 
      optInWallets={plugins}
      autoConnect={true}
      onError={(error) => {
        console.log("Wallet error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}