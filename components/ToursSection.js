'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'
import gsap from 'gsap'

export default function ToursSection({ active, data, openTourModal }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!active || !sectionRef.current) return

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }, [active])

  if (!active) return null

  return (
    <section ref={sectionRef} id="tours" className="view-section active">
      <div className="section-content px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-nat-paper reveal-text relative line-decoration">
                {data.toursSettings.title}
              </h2>
              <p className="font-mono text-xs text-nat-sage mt-4 tracking-widest">
                {data.toursSettings.subtitle}
              </p>
            </div>
            <div>
              <p className="font-sans text-nat-paper/70 text-sm max-w-md">
                {data.toursSettings.description}
              </p>
            </div>
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 gap-6 mb-16">
            {data.tours.map(tour => (
              <div
                key={tour.id}
                onClick={() => openTourModal(tour.id)}
                className="glass-panel p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center group cursor-pointer hover:border-nat-biolum/20 transition-all tilt-card"
              >
                <div className="aspect-video overflow-hidden rounded-lg tilt-content relative">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 glass-panel px-3 py-1 rounded-full">
                    <span className="font-mono text-[10px] text-nat-biolum">
                      {tour.price}
                    </span>
                  </div>
                </div>

                <div className="tilt-content">
                  <div className="font-mono text-[10px] text-nat-biolum mb-2 tracking-widest">
                    {tour.date} | {tour.location}
                  </div>
                  <h3 className="font-serif text-3xl text-nat-paper mb-4 group-hover:italic transition-all">
                    {tour.title}
                  </h3>
                  <p className="font-sans text-nat-paper/80 text-sm leading-relaxed mb-6">
                    {tour.description}
                  </p>
                  <div className="inline-block rounded-full p-[1px] spotlight-btn magnetic-element">
                    <span className="spotlight-content px-5 py-2.5 bg-nat-black rounded-full text-xs font-mono uppercase tracking-widest text-nat-sage hover:text-nat-biolum transition-colors flex items-center gap-2">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          {data.testimonials && data.testimonials.length > 0 && (
            <div className="mt-16">
              <div className="text-center mb-12">
                <h3 className="font-serif text-3xl md:text-4xl text-nat-paper mb-4">
                  What Travelers Say
                </h3>
                <p className="font-mono text-xs text-nat-sage">
                  TESTIMONIALS FROM OUR EXPEDITIONS
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.testimonials.map(t => (
                  <div key={t.id} className="glass-panel p-6 rounded-xl tilt-card">
                    <div className="tilt-content">
                      <div className="flex gap-1 mb-4">
                        {Array(t.rating).fill(0).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-nat-amber fill-nat-amber" />
                        ))}
                      </div>
                      <p className="font-sans text-nat-paper/90 text-sm italic leading-relaxed mb-6">
                        "{t.quote}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-nat-forest flex items-center justify-center">
                          <span className="font-serif text-nat-biolum">
                            {t.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-sans text-nat-paper text-sm">
                            {t.name}
                          </div>
                          <div className="font-mono text-[10px] text-nat-sage">
                            {t.location}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <span className="font-mono text-[9px] text-nat-biolum/70">
                          {t.tour}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
