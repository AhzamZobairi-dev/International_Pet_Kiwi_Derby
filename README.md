
# � International Pet Kiwi Derby - NFT Ticket System

Welcome to the International Pet Kiwi Derby! This project is a Web3-powered NFT ticketing system for the world's cutest racing event. You can experience the demo without a wallet, or connect your own wallet to mint real NFT tickets on the blockchain.

---

## 🚦 Quick Start: Demo Mode (No Wallet Needed)

1. **Go to [http://160.238.36.194/mint](http://160.238.36.194/mint)**
2. Click the green **Demo: Mint Ticket** button
3. Your demo ticket will be minted to the pre-funded demo wallet
4. Go to **My Tickets** to see the demo ticket and its QR code
5. Use **Analytics** or **Scanner** to verify the ticket on-chain

**Demo Wallet Address:**
```
0xc952b1071e063a3Bb601F670f6f1f04e2A4631Ae
```

You do NOT need a wallet or test ETH for the demo. This is perfect for showing how the system works to anyone!

**Access the full project at:**
```
http://160.238.36.194
```

---

## 🦄 Minting Real Tickets (Connect Your Wallet)

1. Go to **Mint** page and connect your wallet (MetaMask, Coinbase, etc.)
2. Get test ETH for Sepolia:
	 - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
	 - [Paradigm Sepolia Faucet](https://faucet.paradigm.xyz/)
3. Mint tickets by clicking the **Mint** button
4. Your tickets will appear in **My Tickets** with QR codes
5. You can verify tickets in **Analytics** and **Scanner**

---

## 🔗 How the Blockchain Works in This Project

- **Smart Contract:** ERC-1155 NFT contract deployed on Sepolia testnet
- **Ticket Supply:** 500 tickets, each 0.001 ETH
- **Royalty & Accounting:**
	- **10% fee** is automatically split on every transaction:
		- **7%** to Dev Team
		- **3%** to Profits City
	- **Royalties are enforced by the contract** (EIP-2981)
	- **Every sale, including secondary markets, triggers royalty payments**
	- **No manual accounting needed**—all splits and transfers are automatic

**How it works:**
- When you mint or transfer a ticket, the contract automatically splits the ETH and sends the correct amounts to each party.
- On secondary sales (OpenSea, etc.), royalties are enforced and paid out instantly.

---

## 📝 Step-by-Step Instructions

### Demo (No Wallet)
1. Go to `/mint` and click the green Demo button
2. View your ticket in `/my-tickets` (shows demo wallet tickets)
3. Scan the QR code or check `/analytics` to see the ticket on-chain

### Real Mint (With Wallet)
1. Connect your wallet on `/mint`
2. Get Sepolia test ETH from a faucet
3. Mint tickets and view them in `/my-tickets`
4. Use QR code for entry or scan/validate in `/scanner`

### Royalty System
- Every transaction splits ETH automatically (10% total)
- Royalties are paid even on secondary sales
- No manual payout needed

---

## 🏟️ Event Venue

## 🏟️ Event Venue

**Basin Reserve, Wellington, New Zealand**
- Home to the world's largest traffic roundabout 🌍
- Historic cricket ground since 1868
- "If you miss it, just keep driving around!" 🚗💨
- The only cricket ground that's also a roundabout!

## ⚠️ Security Notice

**IMPORTANT**: This project uses publicly known development private keys for local testing. These are safe to see in terminal output as they're never used with real funds. For testnet/mainnet deployments:

- ✅ Use environment variables (see `.env.example`)
- ✅ Only use testnet wallets with test ETH
- ✅ Never commit actual private keys to git
- ✅ Always verify you're on testnet before deploying
- ✅ Consider hardware wallets for production

## 🚀 Project Features

- **ERC-1155 NFT Tickets**: 500 limited edition tickets at 0.001 ETH each
- **Smart Royalty System**: 10% automatic fee distribution (7% Dev Team, 3% Profits City)
- **QR Code Verification**: Time-limited QR codes for secure entry
- **Multi-Wallet Support**: MetaMask, Phantom, Coinbase Wallet, and more
- **Responsive UI**: Beautiful gradient design with Web3 integration
- **IPFS Metadata**: Decentralized ticket metadata storage

## 🛠️ Technical Stack

- **Blockchain**: Ethereum (Sepolia testnet)
- **Smart Contracts**: Solidity 0.8.28, Hardhat, OpenZeppelin
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Web3**: Wagmi, RainbowKit, Viem
- **Standards**: ERC-1155, EIP-2981 (royalties)

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
