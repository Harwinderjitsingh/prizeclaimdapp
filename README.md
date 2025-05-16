# PrizeClaim DApp

A fully functional decentralized prize claiming application built for the Stellar Hackathon.
The platform allows users to connect their wallets, verify their identity using Passkeys (fingerprint/FaceID), and participate in blockchain-backed prize claims through a gamified prize wheel.

---

## 💻 Tech Stack

**Programming Languages:**
- TypeScript
- JavaScript (ES6+)

**Frontend Frameworks & Libraries:**
- Next.js (React 18 with App Router)
- Tailwind CSS for styling
- Framer Motion for animations
- React Hot Toast for notifications

**Web Authentication:**
- WebAuthn API for Passkey (Fingerprint/FaceID) support

**Blockchain Integration:**
- Stellar SDK for wallet interactions and prize transactions

---

## 📦 Dependencies

**dependencies**:
- next: 13.x
- react: 18.x
- react-dom: 18.x
- tailwindcss: ^3.x
- framer-motion: ^10.x
- react-hot-toast: ^2.x
- @stellar-sdk: ^10.x

---

## ⚙️ Setup Instructions

1. Clone the Repository
```bash
git clone https://github.com/your-org/prize-claim-dapp.git
cd prize-claim-dapp
```

2. Install Dependencies
```bash
npm install
```

3. Run the Development Server
```bash
npm run dev
```

4. Visit [http://localhost:3000](http://localhost:3000)

5. Optional:  
If using Passkey (WebAuthn) on Chrome or Safari, ensure you’re using localhost with HTTPS or a trusted domain.

---

## 🚀 Features

- **Wallet Connection**: Simulated wallet connection with local wallet storage. Future-ready for real Stellar wallet integration.
- **Passkey Authentication**: Register and verify users via fingerprint or FaceID. Stores verified wallet addresses for future sessions.
- **Prize Wheel Game**: Interactive, animated prize wheel with blockchain-backed prizes. Token and NFT rewards sent via Stellar blockchain.
- **Transaction Logging**: Recent prize transactions displayed to the user. Activity log for transparency.
- **User Dashboard**: Displays wallet address, token balance, and claimed NFTs.

---

## 🎮 Usage

1. Connect your simulated wallet by pressing “Connect Wallet”.
2. Register your identity using “Passkey Authentication” (Fingerprint/FaceID).
3. Spin the “Prize Wheel” to win tokens or NFTs.
4. View your claimed prizes and recent transactions in your profile.

---

## 🗂️ Project Structure

```
/components
  ├── WalletConnector.tsx
  ├── PasskeyAuth.tsx
  ├── PrizeWheel.tsx
  └── GameCard.tsx

/context
  └── AppContext.tsx

/pages
  └── index.tsx

/utils
  ├── localStorage.ts
  ├── stellarService.ts
  └── aptos.ts

/public
  ├── images
  └── styles
```

---

## 🤝 Contributing

We welcome contributions to improve the PrizeClaim DApp.  
Please fork the repository, make your changes, and submit a pull request.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 📝 Contact

For any questions or feedback, please contact the development team via GitHub Issues or Discussions.
@harwinderjitsingh @mankirat14
