'use client'

import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'

export default function BlogsSection({ active, data, blogs, openBlogModal }) {
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
    <section ref={sectionRef} id="blogs" className="view-section active">
      <div className="section-content px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-6 md:p-8 rounded-2xl">
            <h2 className="font-serif text-4xl md:text-5xl text-nat-paper mb-4 text-center reveal-text relative line-decoration">
              {data.title}
            </h2>
            <p className="font-mono text-xs text-nat-sage text-center mt-4 mb-8 tracking-widest">
              {data.subtitle}
            </p>

            <div className="flex flex-col gap-4">
              {blogs.map(blog => (
                <article
                  key={blog.id}
                  onClick={() => openBlogModal(blog.id)}
                  className="glass-panel p-6 group cursor-pointer hover:bg-white/5 hover:border-nat-biolum/20 transition-all rounded-lg magnetic-element"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-mono text-[10px] text-nat-biolum tracking-widest">
                          {blog.date}
                        </span>
                        <span className="font-mono text-[10px] text-nat-sage/60">
                          {blog.readTime}
                        </span>
                      </div>
                      <h4 className="font-serif text-2xl md:text-3xl text-nat-paper group-hover:italic transition-all">
                        {blog.title}
                      </h4>
                      <p className="font-sans text-nat-paper/70 mt-2 text-sm max-w-xl">
                        {blog.description}
                      </p>
                    </div>
                    <div className="text-nat-paper opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
