'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, MapPin, Star, Send } from 'lucide-react'

export default function TourModal({ open, tour, onClose, onInquire }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open || !tour) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[101] text-white hover:text-nat-biolum glass-panel w-12 h-12 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Image */}
          <div className="relative h-[50vh] rounded-2xl overflow-hidden mb-8">
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="glass-panel px-4 py-2 rounded-full font-mono text-xs text-nat-biolum">
                  {tour.location}
                </span>
                <span className="glass-panel px-4 py-2 rounded-full font-mono text-xs text-nat-paper">
                  {tour.date}
                </span>
                <span className="glass-panel px-4 py-2 rounded-full font-mono text-xs text-nat-amber">
                  {tour.price}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl text-white">
                {tour.title}
              </h1>
            </div>
          </div>

          {/* Description */}
          <div className="glass-panel p-8 rounded-2xl mb-8">
            <p className="font-sans text-nat-paper/90 text-lg leading-relaxed">
              {tour.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Itinerary */}
            <div className="glass-panel p-8 rounded-2xl">
              <h3 className="font-mono text-nat-biolum text-xs tracking-widest mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                ITINERARY
              </h3>
              <ul className="space-y-4">
                {tour.itinerary?.map((item, i) => (
                  <li key={i} className="flex gap-4 text-nat-paper/80">
                    <span className="font-mono text-nat-biolum text-xs mt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Highlights */}
            <div className="glass-panel p-8 rounded-2xl">
              <h3 className="font-mono text-nat-biolum text-xs tracking-widest mb-6 flex items-center gap-2">
                <Star className="w-4 h-4" />
                HIGHLIGHTS
              </h3>
              <ul className="space-y-3">
                {tour.highlights?.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-nat-paper/80">
                    <span className="w-2 h-2 bg-nat-biolum rounded-full flex-shrink-0" />
                    <span className="font-sans text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={onInquire}
              className="inline-block rounded-full p-[1px] spotlight-btn magnetic-element"
            >
              <span className="spotlight-content px-8 py-4 bg-nat-black rounded-full text-sm font-mono uppercase tracking-widest text-nat-biolum hover:text-white transition-colors flex items-center gap-3">
                <Send className="w-4 h-4" />
                Inquire About This Tour
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
