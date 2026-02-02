'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

export default function AboutSection({ active, data }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!active || !sectionRef.current) return

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )

    const revealElements = sectionRef.current.querySelectorAll('.reveal-text')
    revealElements.forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 150)
    })
  }, [active])

  if (!active) return null

  return (
    <section ref={sectionRef} id="about" className="view-section active">
      <div className="section-content px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Image Column */}
          <div className="md:col-span-4 relative group cursor-pointer flex justify-center mt-6">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 glass-panel px-4 py-2 rounded-full z-10">
              <span className="font-mono text-[10px] text-nat-biolum tracking-widest">
                {data.years}
              </span>
            </div>
            <div className="aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl border border-white/10 shadow-2xl glass-panel p-2 relative">
              <Image
                src={data.image}
                alt="The Naturalist"
                fill
                className="object-cover rounded-lg transition-all duration-700"
              />
            </div>
          </div>

          {/* Content Column */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <div className="glass-panel p-6 md:p-8 rounded-2xl">
              <h2 className="font-serif text-4xl md:text-5xl text-nat-paper mb-4 reveal-text relative line-decoration">
                {data.title}
              </h2>
              <div className="mt-4 space-y-3">
                <p className="font-sans text-nat-paper/90 text-base leading-relaxed">
                  {data.description}
                </p>
                <p className="font-sans text-nat-paper/70 text-sm leading-relaxed">
                  {data.philosophy}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-xl">
                <h3 className="font-mono text-nat-biolum text-xs tracking-widest mb-3">
                  EXPERIENCE
                </h3>
                <ul className="font-sans text-nat-paper/80 space-y-2 text-sm">
                  {data.experience.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-nat-biolum rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel p-5 rounded-xl">
                <h3 className="font-mono text-nat-biolum text-xs tracking-widest mb-3">
                  SPECIALTIES
                </h3>
                <ul className="font-sans text-nat-paper/80 space-y-2 text-sm">
                  {data.specialties.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-nat-biolum rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl">
              <h3 className="font-mono text-nat-biolum text-xs tracking-widest mb-3">
                FEATURED IN
              </h3>
              <p className="font-sans text-nat-paper/70 text-sm">
                {data.featuredIn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
