import { Playfair_Display, Cinzel } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata = {
  title: 'Naturalist Diaries | Curated Expeditions',
  description: 'Wildlife photography and expeditions around the world',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cinzel.variable}`}>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-nat-forest selection:text-nat-biolum">
        {children}
      </body>
    </html>
  )
}
