import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http, parseEther } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { TICKET_NFT_ABI, getContractAddress } from '../../contracts/config';

export async function POST(request: NextRequest) {
    try {
        const { quantity, recipient } = await request.json();

        if (!quantity || quantity < 1) {
            return NextResponse.json(
                { error: 'Invalid quantity' },
                { status: 400 }
            );
        }

        if (!recipient) {
            return NextResponse.json(
                { error: 'Recipient address required' },
                { status: 400 }
            );
        }

        // Get demo wallet private key from environment
        const privateKey = process.env.DEMO_WALLET_PRIVATE_KEY;
        if (!privateKey) {
            return NextResponse.json(
                { error: 'Demo wallet not configured' },
                { status: 500 }
            );
        }

        // Ensure private key has 0x prefix
        const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

        // Create wallet client
        const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`);
        const walletClient = createWalletClient({
            account,
            chain: sepolia,
            transport: http(),
        });

        // Calculate total cost
        const TICKET_PRICE_ETH = 0.001;
        const totalCost = parseEther((TICKET_PRICE_ETH * quantity).toString());

        // Mint tickets
        const contractAddress = getContractAddress(sepolia.id);
        const hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: TICKET_NFT_ABI,
            functionName: 'mint',
            args: [recipient as `0x${string}`, BigInt(quantity)], // Mint to the recipient (connected wallet)
            value: totalCost,
        });

        return NextResponse.json({
            success: true,
            txHash: hash,
            quantity,
            wallet: recipient, // Return the recipient address
        });
    } catch (error: any) {
        console.error('Demo mint error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to mint tickets' },
            { status: 500 }
        );
    }
}
