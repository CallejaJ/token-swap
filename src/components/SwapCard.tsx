'use client'

import { useState, useEffect } from 'react'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { TOKENS, ERC20_ABI } from '@/lib/constants'
import { ArrowDownUp, Loader2, Droplets } from 'lucide-react'
import { parseUnits } from 'viem'
import { motion, AnimatePresence } from 'framer-motion'

export function SwapCard() {
  const { isConnected, address } = useAccount()
  const [amount, setAmount] = useState('')
  const [direction, setDirection] = useState<'PEPE_TO_USDC' | 'USDC_TO_PEPE'>('PEPE_TO_USDC')
  
  const { write, data: txData, isLoading: isPending, error } = useContractWrite({
    address: direction === 'PEPE_TO_USDC' ? TOKENS.PEPE.address : TOKENS.USDC.address,
    abi: ERC20_ABI,
    functionName: 'transfer',
  })
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
    hash: txData?.hash,
  })

  const fromToken = direction === 'PEPE_TO_USDC' ? TOKENS.PEPE : TOKENS.USDC
  const toToken = direction === 'PEPE_TO_USDC' ? TOKENS.USDC : TOKENS.PEPE

  const handleSwap = async () => {
    if (!amount || !address || !write) return
    
    try {
      const parsedAmount = parseUnits(amount, fromToken.decimals)
      
      write({
        args: ['0x000000000000000000000000000000000000dEaD', parsedAmount],
      })
      
    } catch (error) {
      console.error(error)
    }
  }

  const handleFaucet = () => {
    alert("To get testnet tokens, please visit a Sepolia faucet or the specific token faucet.")
  }

  const toggleDirection = () => {
    setDirection(prev => prev === 'PEPE_TO_USDC' ? 'USDC_TO_PEPE' : 'PEPE_TO_USDC')
  }

  useEffect(() => {
    if (isConfirmed) {
      setAmount('')
    }
  }, [isConfirmed])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative"
    >
      <AnimatePresence>
        {(isPending || isConfirming) && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center"
           >
             <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
             <p className="font-bold text-lg mb-2">Processing Transaction...</p>
             <p className="text-sm text-gray-400 mb-4">Gas paid by Paymaster ⛽</p>
             {txData?.hash && (
               <a 
                 href={`https://sepolia.etherscan.io/tx/${txData.hash}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-blue-400 hover:underline text-sm bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20"
               >
                 View on Etherscan
               </a>
             )}
           </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Swap</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleFaucet}
              className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-1 hover:bg-blue-500/20 transition-colors"
            >
              <Droplets size={12} /> Faucet
            </button>
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1">
              <span>⛽</span> Gasless
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-4 mb-2 border border-gray-700/50 focus-within:border-blue-500/50 transition-colors">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">You pay</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent text-3xl text-white font-medium outline-none w-full placeholder-gray-600"
            />
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-gray-700 hover:bg-black/30 transition-colors cursor-pointer">
              <img src={fromToken.logo} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
              <span className="text-white font-bold">{fromToken.symbol}</span>
            </div>
          </div>
        </div>

        <div className="relative h-4 flex items-center justify-center z-10">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDirection}
            className="bg-gray-800 hover:bg-gray-700 text-blue-400 p-2 rounded-xl border-4 border-gray-900 transition-colors"
          >
            <ArrowDownUp size={16} />
          </motion.button>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-4 mt-[-16px] pt-6 border border-gray-700/50">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">You receive</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              readOnly
              value={amount ? (parseFloat(amount) * (direction === 'PEPE_TO_USDC' ? 0.000001 : 1000000)).toFixed(6) : ''}
              placeholder="0"
              className="bg-transparent text-3xl text-white font-medium outline-none w-full placeholder-gray-600"
            />
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-gray-700">
              <img src={toToken.logo} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
              <span className="text-white font-bold">{toToken.symbol}</span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSwap}
          disabled={!isConnected || !amount || isPending || isConfirming}
          className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all ${
            !isConnected 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : !amount
                ? 'bg-blue-600/20 text-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
          }`}
        >
          {!isConnected ? (
            'Connect Wallet to Swap'
          ) : isPending || isConfirming ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Swapping...</span>
            </div>
          ) : (
            'Swap'
          )}
        </motion.button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs break-all">
            {error.message}
          </div>
        )}

        {amount && (
          <div className="mt-4 flex justify-between items-center text-xs text-gray-500 px-2">
            <span>Rate</span>
            <span>1 {fromToken.symbol} ≈ {direction === 'PEPE_TO_USDC' ? '0.000001' : '1,000,000'} {toToken.symbol}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

