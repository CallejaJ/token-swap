'use client'

import { useAccount, useContractReads } from 'wagmi'
import { TOKENS, ERC20_ABI } from '@/lib/constants'
import { formatUnits } from 'viem'

export function AccountInfo() {
  const { address, isConnected } = useAccount()

  const { data: balances } = useContractReads({
    contracts: [
      {
        address: TOKENS.PEPE.address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address!],
      },
      {
        address: TOKENS.USDC.address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address!],
      },
    ],
    enabled: !!address,
    watch: true,
  })

  if (!isConnected || !address) return null

  const pepeBalance = balances?.[0].result 
    ? formatUnits(balances[0].result as bigint, TOKENS.PEPE.decimals)
    : '0'
    
  const usdcBalance = balances?.[1].result
    ? formatUnits(balances[1].result as bigint, TOKENS.USDC.decimals)
    : '0'

  return (
    <div className="w-full max-w-md p-4 mb-6 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-xl">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Smart Account</span>
          <span className="text-blue-400 font-mono text-sm bg-blue-900/20 px-2 py-1 rounded">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        
        <div className="h-px bg-gray-800 my-2" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col p-3 bg-gray-800/50 rounded-xl">
            <span className="text-gray-400 text-xs mb-1">PEPE Balance</span>
            <span className="text-white font-bold text-lg truncate">
              {parseFloat(pepeBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col p-3 bg-gray-800/50 rounded-xl">
            <span className="text-gray-400 text-xs mb-1">USDC Balance</span>
            <span className="text-white font-bold text-lg truncate">
              {parseFloat(usdcBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
