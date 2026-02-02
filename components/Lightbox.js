'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import gsap from 'gsap'

export default function Lightbox({ open, images, currentIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (open) {
      gsap.to('#lightbox', { opacity: 1, duration: 0.3 })
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open || !images || images.length === 0) return null

  const currentImage = images[currentIndex]

  return (
    <div
      id="lightbox"
      className="fixed inset-0 z-[100] bg-nat-black/95 flex justify-center items-center backdrop-blur-xl"
      style={{ opacity: 0 }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-white hover:text-nat-biolum z-[101] p-2"
      >
        <X className="w-10 h-10" />
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-nat-biolum z-[101] p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-nat-biolum z-[101] p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Image */}
      <div className="relative max-h-[85vh] max-w-[90vw]">
        <Image
          src={currentImage.src}
          alt={currentImage.title}
          width={1200}
          height={800}
          className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl rounded-lg"
        />
      </div>

      {/* Caption */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-nat-paper font-mono text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
        {currentImage.title} — {currentImage.location}
      </div>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-8 left-8 text-nat-paper font-mono text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
