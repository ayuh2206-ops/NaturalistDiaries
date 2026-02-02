'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

export default function BlogModal({ open, blog, profile, onClose }) {
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

  if (!open || !blog) return null

  const paragraphs = (blog.content || '').split('\n\n').filter(p => p.trim())

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
        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="glass-panel px-4 py-2 rounded-full font-mono text-xs text-nat-biolum">
                {blog.date}
              </span>
              <span className="glass-panel px-4 py-2 rounded-full font-mono text-xs text-nat-sage">
                {blog.readTime}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-nat-paper leading-tight mb-6">
              {blog.title}
            </h1>
            <p className="font-sans text-nat-paper/70 text-lg italic">
              {blog.description}
            </p>
          </header>

          {/* Content */}
          <div className="glass-panel p-8 md:p-12 rounded-2xl">
            <div className="prose prose-invert max-w-none">
              {paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-nat-paper/85 text-base leading-relaxed mb-6">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center">
            <div className="glass-panel inline-flex items-center gap-4 px-6 py-4 rounded-full">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-nat-biolum/30 relative">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-serif text-nat-paper">{profile.name}</div>
                <div className="font-mono text-xs text-nat-sage">{profile.bio}</div>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}
