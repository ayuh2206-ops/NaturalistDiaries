'use client'

import { Playfair_Display, Cinzel } from 'next/font/google'
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cinzel.variable}`}>
      <head>
        <title>Naturalist Diaries | Curated Expeditions</title>
        <meta name="description" content="Wildlife photography and expeditions around the world" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Satoshi:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-nat-forest selection:text-nat-biolum">
        {children}
      </body>
    </html>
  )
}
