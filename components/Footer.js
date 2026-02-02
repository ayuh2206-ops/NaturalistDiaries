'use client'

import { Instagram, Youtube } from 'lucide-react'

export default function Footer({ social }) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex justify-center pb-6">
        <div className="glass-panel px-6 py-3 rounded-full pointer-events-auto flex items-center gap-6">
          {social?.instagram && (
            <a 
              href={social.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-nat-sage hover:text-nat-biolum transition-colors magnetic-element"
            >
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {social?.youtube && (
            <a 
              href={social.youtube} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-nat-sage hover:text-nat-biolum transition-colors magnetic-element"
            >
              <Youtube className="w-6 h-6" />
            </a>
          )}
          <span className="font-mono text-xs text-nat-sage/50">© 2026 N.D.</span>
        </div>
      </div>
    </footer>
  )
}
