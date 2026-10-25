import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MindArena: Ludo, Logic & Quant Arena',
  description: 'Real-time multiplayer competitive arena featuring Classic Ludo King, Pattern Logic Matrix, Quant Duel, and Squad Voice Banter.',
  openGraph: {
    title: 'MindArena: Ludo, Logic & Quant Arena',
    description: 'Real-time multiplayer competitive arena featuring Classic Ludo King, Pattern Logic Matrix, Quant Duel, and Squad Voice Banter.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MindArena: Ludo, Logic & Quant Arena',
    description: 'Real-time multiplayer competitive arena featuring Classic Ludo King, Pattern Logic Matrix, Quant Duel, and Squad Voice Banter.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-[#0b0e17] text-[#dfe2f1] antialiased">
        {children}
      </body>
    </html>
  );
}
