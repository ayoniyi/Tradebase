# TradeBase

TradeBase is a modern Web3 escrow platform built with Next.js, enabling secure and decentralized trading with smart contract integration.

## Features

- 🔒 Secure Escrow System
- 🛍️ Decentralized Marketplace
- 💱 Trading Interface
- 🌈 RainbowKit Integration for Wallet Connection
- 🎨 Modern UI with Material-UI and Framer Motion
- 📱 Responsive Design
- 🔄 Real-time Updates with React Query
- 🎵 Interactive Sound Effects with React Howler
- 📤 File Upload Support with React Dropzone

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**:
  - Material-UI
  - SASS
  - Emotion
  - Framer Motion
  - GSAP
- **Web3**:
  - wagmi
  - viem
  - ethers.js
- **State Management**: React Query
- **Authentication**: RainbowKit
- **Backend**: Firebase
- **Development Tools**:
  - TypeScript
  - ESLint
  - @wagmi/cli

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MetaMask or any Web3 wallet

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tradebase.git
cd tradebase
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tradebase/
├── app/
│   ├── components/     # Reusable UI components
│   ├── contracts/      # Smart contract interactions
│   ├── context/        # React context providers
│   ├── fonts/         # Custom fonts
│   ├── landing/       # Landing page components
│   ├── marketplace/   # Marketplace features
│   ├── styles/        # Global styles
│   ├── trade/         # Trading interface
│   └── utils/         # Utility functions
├── public/            # Static assets
└── ...config files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
