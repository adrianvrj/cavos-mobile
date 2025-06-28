# Cavos Mobile App

<div align="center">
  <img src="assets/cavos-logo.png" alt="Cavos Logo" width="200" height="200">
</div>

A comprehensive mobile wallet application built with React Native and Expo, designed to provide users with secure cryptocurrency management, investment opportunities, and seamless financial services.

## 🚀 Features

### Core Wallet Functionality
- **Multi-Currency Support**: Manage USDC and Bitcoin accounts
- **Secure Transactions**: Send and receive cryptocurrencies with QR code scanning
- **Real-time Balance Tracking**: Monitor your portfolio with live updates
- **Transaction History**: Complete audit trail of all financial activities

### Investment & Yield Opportunities
- **Yield Dashboard**: Discover and compare different yield protocols
- **Vesu Integration**: Invest in Vesu protocol with real-time APY tracking
- **Risk Assessment**: Visual risk indicators for each investment option
- **Claim Rewards**: Automated reward claiming for yield farming

### Security & Authentication
- **Biometric Authentication**: Secure access with fingerprint/face recognition
- **PIN Protection**: Additional security layer with custom PIN
- **Encrypted Storage**: All sensitive data is encrypted using crypto-js
- **Secure Key Management**: Private keys are hashed and securely stored

### User Experience
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Dark Theme**: Eye-friendly dark mode design
- **Responsive Design**: Optimized for various screen sizes
- **Offline Support**: Core functionality works without internet connection

## 🛠 Tech Stack

### Frontend
- **React Native** (0.79.1) - Cross-platform mobile development
- **Expo** (^53.0.4) - Development platform and build tools
- **React Navigation** - Navigation and routing
- **React Native Reanimated** - Smooth animations and gestures

### State Management
- **Zustand** (^5.0.3) - Lightweight state management
- **Jotai** (^1.12.0) - Atomic state management

### Backend Integration
- **Axios** (^1.9.0) - HTTP client for API calls
- **Supabase** (^2.49.4) - Backend-as-a-Service for data storage
- **Chipi SDK** (^2.2.0) - Payment processing integration

### Security & Cryptography
- **Crypto-js** (^4.2.0) - Cryptographic functions
- **Bcryptjs** (^3.0.2) - Password hashing
- **React Native Simple Crypto** (^0.2.15) - Native crypto operations

### UI Components
- **React Native Vector Icons** (^10.2.0) - Icon library
- **React Native SVG** (15.11.2) - SVG support
- **Expo Font** - Custom font loading
- **React Native QR Code SVG** (^6.3.15) - QR code generation

## 📱 App Structure

```
cavos-mobile/
├── app/                    # Main application screens
│   ├── auth/              # Authentication screens
│   ├── btc/               # Bitcoin-related screens
│   ├── components/        # Reusable UI components
│   ├── contacts/          # Contact management
│   └── protocols/         # Protocol-specific screens
├── assets/                # Images, fonts, and static files
├── atoms/                 # State management stores
├── lib/                   # Utility functions and configurations
└── types/                 # TypeScript type definitions
```

### Key Screens
- **Dashboard**: Main overview with balance and quick actions
- **Investments**: Yield opportunities and investment management
- **Send/Receive**: Cryptocurrency transactions
- **Profile**: User settings and account management
- **QR Scanner**: Scan QR codes for transactions
- **Bitcoin Account**: BTC-specific functionality

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cavos-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   WALLET_PROVIDER_API=https://your-api-endpoint.com
   WALLET_PROVIDER_TOKEN=your-api-token
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🔧 Development

### Available Scripts
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser

### Code Style
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations
- Use TypeScript for type safety

### State Management
The app uses a combination of Zustand and Jotai for state management:
- **Zustand**: Global app state (wallet, user data)
- **Jotai**: Local component state and derived state

### API Integration
The app integrates with multiple APIs:
- **Wallet Provider API**: Core wallet functionality
- **Vesu API**: Yield farming and investment data
- **Supabase**: User data and transaction storage

## 🔒 Security Features

### Data Protection
- All sensitive data is encrypted before storage
- Private keys are hashed using bcrypt
- Biometric authentication for app access
- Secure PIN-based transaction signing

### Network Security
- HTTPS-only API communication
- Token-based authentication
- Request/response validation
- Rate limiting protection

## 📦 Building for Production

### iOS Build
```bash
eas build --platform ios
```

### Android Build
```bash
eas build --platform android
```

### Configuration
The app uses EAS Build for production builds. Configuration is in `eas.json`:
- Development builds for testing
- Production builds for app store distribution
- Custom build profiles for different environments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write clear commit messages
- Add proper error handling
- Include loading states
- Test on both iOS and Android
- Follow the existing code style

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.1** - Current stable release
  - Added yield investment dashboard
  - Integrated Vesu protocol
  - Enhanced security features
  - Improved UI/UX

---

Built with <3 by the Cavos Team 