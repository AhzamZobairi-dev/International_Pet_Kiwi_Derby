'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAccount, useWriteContract, useReadContract, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TICKET_NFT_ABI, getContractAddress } from '../contracts/config';
import Navbar from '../components/Navbar';

// Force dynamic rendering (don't try to statically generate this page)
export const dynamic = 'force-dynamic';

function MintPageContent() {
    const [quantity, setQuantity] = useState(1);
    const [ethToUsd, setEthToUsd] = useState<number | null>(null);
    const [demoMinting, setDemoMinting] = useState(false);
    const [demoMessage, setDemoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { writeContract, isPending, error } = useWriteContract();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isDemo = searchParams.get('demo') === 'true';

    // Fixed ticket price from contract constant (0.001 ETH)
    // Note: Contract uses TICKET_PRICE constant, not a getter function
    const TICKET_PRICE_ETH = 0.001;

    // Read contract data
    const { data: totalSupply } = useReadContract({
        address: getContractAddress(chainId) as `0x${string}`,
        abi: TICKET_NFT_ABI,
        functionName: 'totalMinted',
    });

    const { data: userBalance } = useReadContract({
        address: getContractAddress(chainId) as `0x${string}`,
        abi: TICKET_NFT_ABI,
        functionName: 'balanceOf',
        args: [address!, BigInt(1)],
        query: {
            enabled: !!address,
        },
    });

    // Fetch ETH to USD conversion
    useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
                if (!response.ok) {
                    throw new Error('Failed to fetch price');
                }
                const data = await response.json();
                if (data?.ethereum?.usd) {
                    setEthToUsd(data.ethereum.usd);
                } else {
                    setEthToUsd(2500); // Fallback price
                }
            } catch (error) {
                console.error('Failed to fetch ETH price:', error);
                setEthToUsd(2500); // Fallback price
            }
        };

        fetchEthPrice();

        // Refresh price every 5 minutes
        const interval = setInterval(fetchEthPrice, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Calculate total cost safely
    const calculateTotalCost = () => {
        try {
            const priceInEth = TICKET_PRICE_ETH;
            const totalCostInEth = priceInEth * quantity;
            return parseEther(totalCostInEth.toString());
        } catch (error) {
            console.error('Error calculating total cost:', error);
            return BigInt(0);
        }
    };

    // Calculate USD equivalent safely
    const calculateUsdEquivalent = () => {
        if (!ethToUsd) return null;
        try {
            return (TICKET_PRICE_ETH * quantity * ethToUsd).toFixed(4);
        } catch (error) {
            console.error('Error calculating USD equivalent:', error);
            return null;
        }
    };

    // Now calculate the values after functions are defined
    const totalCost = calculateTotalCost();
    const usdEquivalent = calculateUsdEquivalent();

    const handleMint = async () => {
        if (!isConnected) return;

        try {
            const totalCostInEth = TICKET_PRICE_ETH * quantity;
            const totalCost = parseEther(totalCostInEth.toString());

            await writeContract({
                address: getContractAddress(chainId) as `0x${string}`,
                abi: TICKET_NFT_ABI,
                functionName: 'mint',
                args: [address!, BigInt(quantity)],
                value: totalCost,
            });
        } catch (err) {
            console.error('Minting failed:', err);
        }
    };

    const handleDemoMint = async () => {
        setDemoMinting(true);
        setDemoMessage(null);

        try {
            const response = await fetch('/api/demo-mint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to mint');
            }

            setDemoMessage({
                type: 'success',
                text: `✅ Successfully minted ${quantity} demo ticket${quantity > 1 ? 's' : ''}! Demo wallet: ${data.wallet.slice(0, 6)}...${data.wallet.slice(-4)}. Check Analytics or Scanner to verify the tickets!`,
            });

            // Don't redirect - show success message with demo wallet info
            // User can check analytics or scanner to verify
        } catch (err: any) {
            console.error('Demo minting failed:', err);
            setDemoMessage({
                type: 'error',
                text: err.message || 'Failed to mint demo tickets',
            });
            setDemoMessage({
                type: 'error',
                text: err.message || 'Failed to mint tickets',
            });
        } finally {
            setDemoMinting(false);
        }
    };

    // Auto-trigger demo mint if demo parameter is present
    useEffect(() => {
        if (isDemo && !demoMinting && !demoMessage) {
            handleDemoMint();
        }
    }, [isDemo]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Navigation */}
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    {/* Kiwi Header Image */}
                    <div className="mb-6 flex justify-center">
                        <img
                            src="/images/cartoon Kiwi 2025-10-09 140241.png"
                            alt="Kiwi Derby Mascot"
                            className="w-20 h-20 object-cover rounded-full border-4 border-white/30 shadow-lg"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        � International Pet Kiwi Derby �
                    </h1>
                    <p className="text-xl text-gray-300">
                        Mint your exclusive NFT tickets for the most adorable race of the year!
                    </p>

                    {/* Pricing Display */}
                    <div className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">Ticket Price</h3>
                        <div className="flex items-center justify-center space-x-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{TICKET_PRICE_ETH} ETH</p>
                                <p className="text-sm opacity-80">
                                    {ethToUsd ? `≈ $${(TICKET_PRICE_ETH * ethToUsd).toFixed(4)} USD` : 'Loading USD...'}
                                </p>
                            </div>
                        </div>
                        <p className="text-center text-sm mt-2 opacity-90">
                            🎫 Each ticket grants exclusive access to the derby event
                        </p>
                    </div>
                </div>

                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mint Tickets</h2>
                        <p className="text-gray-600">
                            Each ticket grants access to the exclusive derby event
                        </p>
                    </div>

                    {/* Contract Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Ticket Price:</span>
                                <p className="font-semibold">
                                    {TICKET_PRICE_ETH} ETH
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600">Total Supply:</span>
                                <p className="font-semibold">{'...'} tickets</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Your Tickets:</span>
                                <p className="font-semibold">{'0'}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Network:</span>
                                <p className="font-semibold">
                                    {chainId === 1337 ? 'Local' : chainId === 11155111 ? 'Sepolia' : 'Unknown'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Demo Wallet Info */}
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start space-x-3">
                            <div className="text-2xl">🎯</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-green-800 mb-1">Demo Mode</h3>
                                <p className="text-sm text-green-700 mb-2">
                                    Try minting without connecting a wallet! Demo tickets go to:
                                </p>
                                <p className="text-xs font-mono bg-white/70 p-2 rounded border border-green-300 break-all mb-2">
                                    0xc952b1071e063a3Bb601F670f6f1f04e2A4631Ae
                                </p>
                                <p className="text-xs text-green-600">
                                    📊 View demo tickets in <a href="/analytics" className="underline font-semibold">Analytics</a> or use the <a href="/scanner" className="underline font-semibold">Scanner</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {!isConnected ? (
                        <div className="text-center">
                            <ConnectButton />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Quantity Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Total Cost */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700">Total Cost:</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {formatEther(totalCost)} ETH
                                    </span>
                                </div>
                                {usdEquivalent && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">USD Equivalent:</span>
                                        <span className="text-lg font-semibold text-green-600">
                                            ≈ ${usdEquivalent}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Mint Button */}
                            <button
                                onClick={handleMint}
                                disabled={isPending}
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isPending ? 'Minting...' : `Mint ${quantity} Ticket${quantity > 1 ? 's' : ''}`}
                            </button>

                            {/* Demo Mint Button */}
                            <button
                                onClick={handleDemoMint}
                                disabled={demoMinting}
                                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {demoMinting ? '🔄 Demo Minting...' : `🎯 Demo: Mint ${quantity} Ticket${quantity > 1 ? 's' : ''}`}
                            </button>

                            {/* Demo Message Display */}
                            {demoMessage && (
                                <div className={`rounded-lg p-3 ${demoMessage.type === 'success'
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-red-50 border border-red-200'
                                    }`}>
                                    <p className={`text-sm ${demoMessage.type === 'success'
                                        ? 'text-green-700'
                                        : 'text-red-700'
                                        }`}>
                                        {demoMessage.text}
                                    </p>
                                </div>
                            )}

                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-700 text-sm">
                                        Error: {error.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Event Details */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-2">Event Details</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>🗓️ Date: TBA (Coming Soon!)</li>
                            <li>📍 Location: Virtual & IRL Events</li>
                            <li>🎟️ Limited to 500 tickets</li>
                            <li>💎 NFT with exclusive utilities</li>
                            <li>🏆 Special prizes for ticket holders</li>
                        </ul>
                    </div>
                </div>

                {/* Navigation */}
                <div className="text-center mt-8">
                    <a
                        href="/"
                        className="text-blue-300 hover:text-blue-100 underline"
                    >
                        ← Back to Home
                    </a>
                </div>

                {/* Footer */}
                <footer className="text-center mt-8 pt-6 border-t border-white/20">
                    <p className="text-gray-400 text-sm">
                        © 2025 International Pet Kiwi Derby. Built by <span className="font-bold text-white">SFitz911</span>
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default function MintPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <MintPageContent />
        </Suspense>
    );
}