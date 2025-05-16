PrizeClaim DApp

A blockchain-based prize distribution platform featuring wallet connection, passkey (WebAuthn) verification, and interactive prize claiming with real-time blockchain transactions.

⸻

Technologies Used

Frontend Framework: Next.js (React, TypeScript)

Styling: Tailwind CSS

State Management: React Context API

Animation: Framer Motion

Notifications: React Hot Toast

Blockchain Integration: Stellar SDK (Stellar Network)

Authentication API: WebAuthn (W3C Standard)

Browser APIs: LocalStorage, Navigator.credentials

Package Manager: Yarn / npm

⸻

Features
	•	Connect Wallet (Simulated or Stellar Integration)
	•	Passkey (Fingerprint/FaceID) Registration & Verification using WebAuthn API
	•	Daily Spin Limits with Reset Logic
	•	Interactive Prize Wheel with Token and NFT Prizes
	•	Blockchain Transaction Execution on Prize Win
	•	Transaction History and Activity Logs
	•	User Profile with Username, Balance, and NFTs
	•	Fully Responsive and Accessible UI
	•	Persistent Session Storage using Local Storage

⸻

Installation Steps
	1.	Clone the Repository
git clone https://github.com/yourusername/prizeclaim-dapp.git
cd prizeclaim-dapp
	2.	Install Dependencies
npm install
or
yarn install
	3.	Run Locally
npm run dev
or
yarn dev
	4.	Open your browser and visit
http://localhost:3000

⸻

How Passkey (WebAuthn) Works

Registration:
Uses navigator.credentials.create() with platform authenticator and required user verification. This allows biometric authentication such as Touch ID or Face ID on supported devices.

Verification:
Uses navigator.credentials.get() to validate the user’s identity based on the previously registered passkey.

Persistent Wallet Linking:
Associates and stores wallet addresses with the verified passkey in local storage for retrieval in future sessions.

⸻

Planned Enhancements
	•	Full Stellar Smart Contract Integration
	•	Multi-User Wallet Management
	•	Mobile Responsiveness Improvements
	•	Cloud-Based Credential Storage
	•	Production Deployment

⸻

Contributors

Lead Developer: Your Name (GitHub: https://github.com/yourusername)

Hackathon Team: ZeroFriction Wallet

⸻

License

This project is licensed under the MIT License.

⸻
