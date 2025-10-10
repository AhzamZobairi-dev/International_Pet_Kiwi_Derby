import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'International Pet Kiwi Derby',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2d4f2d6f9b45c4d9b7f8c3e1a6b5d4e3',
    chains: [sepolia, hardhat],
    ssr: true,
});