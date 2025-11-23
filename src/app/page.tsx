'use client'

import { ConnectWallet } from '@/components/ConnectWallet'
import { AccountInfo } from '@/components/AccountInfo'
import { SwapCard } from '@/components/SwapCard'

export default function Home() {
  return (
    <main className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            Z
          </div>
          <span className="text-white font-bold text-xl tracking-tight">ZeroSwap</span>
        </div>
        <ConnectWallet />
      </header>

      {/* Main Content */}
      <div className="z-10 w-full flex flex-col items-center gap-6 mt-20">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            Gasless Swaps
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Swap tokens instantly without holding any ETH. 
            <br />
            <span className="text-blue-400">Powered by ZeroDev & Account Abstraction</span>
          </p>
        </div>

        <AccountInfo />
        <SwapCard />
      </div>
    </main>
  )
}
