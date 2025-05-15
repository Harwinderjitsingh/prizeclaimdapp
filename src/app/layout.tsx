import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AppContextProvider } from '@/context/AppContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prize Claim DApp',
  description: 'Win prizes and claim them with Aptos blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContextProvider>
          {children}
          <Toaster position="bottom-right" />
        </AppContextProvider>
      </body>
    </html>
  )
}