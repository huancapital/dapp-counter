# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Content
📝 Introduction: What is a DApp?
A Decentralized Application (DApp) runs on blockchain instead of centralized servers.

🦊 Connect MetaMask Wallet

Install MetaMask extension

Create/import wallet

Switch to desired network

💠 Use Binance Smart Chain (BSC)

Add BSC to MetaMask manually

Set up RPC, Chain ID, Symbol

🛠️ Deploy a Simple Smart Contract (optional)

Use Remix IDE or Hardhat

Interact with contract via Web3.js or Ethers.js

📡 Test on 23H Google Meet

Live interaction demo

Q&A session

# CounterContract - Hardhat Deployment Setup

A decentralized counter application on BNB Smart Chain testnet with fee-based increment/decrement operations.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16.0.0 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MetaMask](https://metamask.io/) or another Web3 wallet
- BSC Testnet BNB for deployment and transactions

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

1. Copy the environment example file:
```bash
cp env.example .env
```

2. Edit `.env` file with your credentials:
```env
PRIVATE_KEY=your_private_key_without_0x_prefix
BSCSCAN_API_KEY=your_bscscan_api_key
```

**Getting your credentials:**
- **Private Key**: Export from MetaMask (Account Details → Export Private Key)
- **BSCScan API Key**: Get from [BSCScan API Keys](https://bscscan.com/apis)

### 3. Get Testnet BNB

Visit the [BNB Smart Chain Testnet Faucet](https://testnet.bnbchain.org/faucet-smart) to get test BNB for deployment.

## 🛠️ Development Commands

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm test
```

### Deploy to BSC Testnet
```bash
npm run deploy
```

### Verify Contract on BSCScan
```bash
npm run verify <CONTRACT_ADDRESS>
```

Or using the verification script:
```bash
npx hardhat run scripts/verify.js --network bscTestnet <CONTRACT_ADDRESS>
```

## 📋 Manual Deployment Steps

### 1. Compile the Contract
```bash
npx hardhat compile
```

### 2. Deploy to BSC Testnet
```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

### 3. Verify on BSCScan
```bash
npx hardhat verify --network bscTestnet <DEPLOYED_CONTRACT_ADDRESS>
```

## 🏗️ Project Structure

```
├── contracts/
│   └── CounterContract.sol      # Main contract
├── scripts/
│   ├── deploy.js               # Deployment script
│   └── verify.js               # Verification script
├── test/
│   └── CounterContract.test.js # Contract tests
├── hardhat.config.js           # Hardhat configuration
├── package.json               # Dependencies and scripts
├── env.example               # Environment variables template
└── README.md                 # This file
```

## 📋 Contract Details

### CounterContract Functions

- **`get()`**: Returns current counter value (free)
- **`inc()`**: Increments counter by 1 (requires 0.001 tBNB fee)
- **`dec()`**: Decrements counter by 1 (requires 0.001 tBNB fee)

### Contract Parameters

- **Fee Amount**: 0.001 tBNB (~$0.60)
- **Fee Recipient**: `0xd0044e990a292162a70ee14dF9C0DB4c1CB37B36`
- **Initial Count**: 0

### Events

- **`FeeCollected(address indexed user, uint256 amount)`**: Emitted when fees are collected

## 🌐 Network Configuration

### BSC Testnet
- **RPC URL**: `https://data-seed-prebsc-1-s1.binance.org:8545/`
- **Chain ID**: 97
- **Currency**: tBNB
- **Explorer**: https://testnet.bscscan.com/

### BSC Mainnet (Optional)
- **RPC URL**: `https://bsc-dataseed.binance.org/`
- **Chain ID**: 56
- **Currency**: BNB
- **Explorer**: https://bscscan.com/

## 🧪 Testing

Run the comprehensive test suite:
```bash
npx hardhat test
```

Test coverage includes:
- Deployment validation
- Function operations (get, inc, dec)
- Fee payment requirements
- Event emissions
- Error conditions
- Gas usage optimization

## 🔧 Troubleshooting

### Common Issues

1. **"Insufficient funds for gas"**
   - Ensure your wallet has enough tBNB for gas fees
   - Get testnet BNB from the faucet

2. **"BSCSCAN_API_KEY not found"**
   - Make sure you have a `.env` file with your API key
   - Verify the API key is correct

3. **"Contract already verified"**
   - The contract is already verified on BSCScan
   - Check the contract page to confirm

4. **"Nonce too high"**
   - Reset your MetaMask account (Settings → Advanced → Reset Account)

### Gas Optimization

The contract is optimized for minimal gas usage:
- Simple state variables
- Efficient modifiers
- Optimized compiler settings

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review BSCScan transaction details
3. Verify network configuration
4. Ensure sufficient balance for gas fees

## 🔗 Useful Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [BSC Testnet Faucet](https://testnet.bnbchain.org/faucet-smart)
- [BSCScan Testnet](https://testnet.bscscan.com/)
- [MetaMask Setup Guide](https://docs.binance.org/smart-chain/wallet/metamask.html)

