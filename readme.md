# Cavos Mobile

A React Native mobile application that enables users to invest stablecoins (USDC/USDT) and Bitcoin on StarkNet, offering competitive returns through a secure and user-friendly platform.

## Description

Cavos Mobile is a decentralized finance (DeFi) application that combines traditional investment features with blockchain technology. The app provides:

- Secure wallet management
- Bitcoin trading and investments
- Stablecoin investments (USDC/USDT)
- Real-time balance tracking
- Multi-network support
- Referral program
- Phone number authentication
- PIN-based security
- Transaction history

## Mission

To democratize DeFi investments by providing a secure, accessible, and user-friendly mobile platform that enables users to earn competitive returns on their digital assets.

## Vision

To become the leading mobile-first DeFi platform, making cryptocurrency investments simple and accessible to everyone while leveraging the speed and cost-effectiveness of the StarkNet blockchain.

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator
- Supabase account
- Wallet Provider API credentials

### Environment Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd cavos-mobile

2. Install dependencies:
```sh
npm install
```

3. Create environment variables:
```sh
cp .env.example .env
```
Fill in your environment variables:
- WALLET_PROVIDER_TOKEN
- SUPABASE_URL
- SUPABASE_ANON_KEY

4. Start the development server:
```sh
npm start
```

5. Run on platform:
```sh
# For iOS
npm run ios

# For Android
npm run android
```

## Tech Stack

- React Native
- Expo
- Supabase (Authentication & Database)
- StarkNet (Blockchain)
- Bitcoin APIs
- React Navigation
- Expo Google Fonts
- Axios

## Features

**Authentication**
- Phone number verification
- PIN-based security
- Invitation code system

**Wallet Management**
- Secure wallet creation
- Balance tracking
- Transaction history
- Multi-currency support

**Investment Features**
- Bitcoin trading (Buy/Sell)
- Bitcoin investments with APY
- Stablecoin investments
- Investment positions tracking
- Rewards claiming

**User Experience**
- Dark theme
- Responsive design
- Pull-to-refresh
- Loading indicators
- Transaction confirmations

## Security
- PIN encryption
- Secure key storage
- Transaction verification
- Phone number verification

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create a new branch:
```sh
git checkout -b feature/your-feature-name
```
3. Make your changes and commit:
```sh
git commit -m "Add your feature description"
```
4. Push to your branch:
```sh
git push origin feature/your-feature-name
```
5. Create a pull request
6. Ensure your code adheres to the project's coding standards and passes all tests.

## License
This project is licensed under the MIT License. 
