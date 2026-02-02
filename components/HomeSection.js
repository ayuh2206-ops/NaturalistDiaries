'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

export default function HomeSection({ active, data, setCurrentTab }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!active || !sectionRef.current) return

    // Trigger reveal animations
    const revealElements = sectionRef.current.querySelectorAll('.reveal-text')
    revealElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('revealed')
      }, i * 150)
    })

    // Fade in animation
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }, [active])

  if (!active) return null

  return (
    <section 
      ref={sectionRef}
      id="home" 
      className="view-section active flex items-center justify-center"
    >
      <div className="relative z-10 w-full hero-content px-4">
        <p className="font-mono text-nat-biolum text-xs tracking-[0.4em] uppercase opacity-80 drop-shadow-lg reveal-text mb-6">
          {data.site.tagline}
        </p>
        
        <h1 className="font-serif text-6xl md:text-9xl text-nat-paper leading-[0.9] opacity-90 reveal-text mb-8">
          {data.home.heroTitle}
          <br />
          <span className="italic font-light opacity-90">{data.home.heroSubtitle}</span>
        </h1>

        <div 
          className="glass-panel p-5 rounded-2xl flex items-center gap-5 max-w-lg magnetic-element cursor-pointer tilt-card mx-auto border-glow float-animation"
          onClick={() => setCurrentTab('about')}
        >
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-nat-biolum/40 tilt-content flex-shrink-0 shadow-lg relative">
            <Image
              src={data.profile.image}
              alt={data.profile.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left tilt-content">
            <h3 className="text-nat-paper">
              <span className="text-nat-biolum font-mono text-xs tracking-widest block mb-1">
                HI, I'M
              </span>
              <span className="font-sans text-2xl font-medium tracking-wide">
                {data.profile.name}
              </span>
            </h3>
            <p className="font-sans text-sm text-nat-sage/80 mt-2">
              {data.profile.bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
