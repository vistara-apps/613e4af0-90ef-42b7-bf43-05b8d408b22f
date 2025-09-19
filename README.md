# TipSplitter - Base MiniApp

Effortlessly split crypto tips between your collab streams.

## Features

- **Automated Tip Splitting**: Set up percentage splits and let the app handle distribution automatically
- **Real-time Notifications**: Get instant notifications when tips are received and distributed  
- **Analytics Dashboard**: Track earnings and collaboration performance over time
- **Base Network Integration**: Secure, fast, and low-cost transactions on Base

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and add your API keys:
   ```bash
   cp .env.example .env.local
   ```

4. Add your API keys to `.env.local`:
   - `NEXT_PUBLIC_MINIKIT_API_KEY`: Your MiniKit API key
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

- **Next.js 15** with App Router
- **MiniKit** for Base MiniApp functionality
- **OnchainKit** for blockchain interactions
- **Tailwind CSS** for styling
- **TypeScript** for type safety

## Usage

1. **Create a Group**: Set up a collaboration group with 2-3 streamers and define percentage splits
2. **Send Tips**: Use the tip interface to send crypto tips that are automatically split
3. **View Analytics**: Track earnings and performance in the analytics dashboard

## Deployment

The app is optimized for deployment on Vercel or similar platforms that support Next.js.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
