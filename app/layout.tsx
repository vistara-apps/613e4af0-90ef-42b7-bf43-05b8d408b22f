import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'TipSplitter - Effortlessly split crypto tips',
  description: 'Automatically split crypto tips between 2-3 collaborating streamers',
  openGraph: {
    title: 'TipSplitter',
    description: 'Effortlessly split crypto tips between your collab streams',
    images: ['/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': '/og-image.png',
    'fc:frame:button:1': 'Start Splitting Tips',
    'fc:frame:post_url': '/api/frame',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
