'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

export default function Navigation({ currentTab, setCurrentTab, logoText, logoImage }) {
  const indicatorRef = useRef(null)
  const navContainerRef = useRef(null)
  const navLinksRef = useRef({})

  const tabs = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'tours', label: 'TOURS' },
    { id: 'blogs', label: 'BLOGS' },
    { id: 'contact', label: 'CONTACT' },
  ]

  // Animate pill indicator
  useEffect(() => {
    const indicator = indicatorRef.current
    const container = navContainerRef.current
    const activeLink = navLinksRef.current[currentTab]

    if (!indicator || !container || !activeLink) return

    const containerRect = container.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()

    gsap.to(indicator, {
      top: linkRect.top - containerRect.top,
      left: linkRect.left - containerRect.left,
      width: linkRect.width,
      height: linkRect.height,
      duration: 0.5,
      ease: 'elastic.out(1, 0.7)',
    })
  }, [currentTab])

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6 flex flex-col md:flex-row justify-between items-center pointer-events-none">
      {/* Logo */}
      <div 
        className="z-50 pointer-events-auto drop-shadow-2xl glow-pulse cursor-pointer magnetic-element"
        onClick={() => setCurrentTab('home')}
      >
        {logoImage ? (
          <Image 
            src={logoImage} 
            alt={logoText} 
            width={80} 
            height={40}
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
        ) : null}
        <span className={`font-serif italic text-2xl text-nat-paper ${logoImage ? 'hidden' : ''}`}>
          {logoText}
        </span>
      </div>

      {/* Nav Links */}
      <div 
        ref={navContainerRef}
        className="relative flex flex-wrap justify-center gap-1 mt-4 md:mt-0 glass-panel px-2 py-2 rounded-full pointer-events-auto"
      >
        <div ref={indicatorRef} id="nav-indicator" />
        {tabs.map(tab => (
          <button
            key={tab.id}
            ref={el => navLinksRef.current[tab.id] = el}
            onClick={() => setCurrentTab(tab.id)}
            className={`nav-link px-5 py-2 rounded-full font-mono text-xs font-semibold tracking-widest transition-colors ${
              currentTab === tab.id ? 'text-white' : 'text-nat-paper hover:text-white'
            }`}
            data-tab={tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
