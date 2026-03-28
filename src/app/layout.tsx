import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Naturalist Diaries | Curated Expeditions',
  description: 'Wildlife photography and curated nature expeditions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,900;1,400&family=Satoshi:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-nat-forest selection:text-nat-biolum">
        {children}
      </body>
    </html>
  );
}
