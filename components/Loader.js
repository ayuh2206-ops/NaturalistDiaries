'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Loader({ loading }) {
  const loaderRef = useRef(null)
  const textRef = useRef(null)
  const subRef = useRef(null)
  const barRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    if (!loading) return

    const tl = gsap.timeline()
    tl.to(textRef.current, { opacity: 1, y: -10, duration: 0.8 })
      .to(subRef.current, { opacity: 1, duration: 0.5 }, '-=0.3')
      .to(barRef.current, { opacity: 1, duration: 0.3 }, '-=0.2')
      .to(progressRef.current, { scaleX: 1, duration: 1.5, ease: 'power1.inOut' })
      .to([textRef.current, subRef.current, barRef.current], { 
        opacity: 0, 
        y: -20, 
        duration: 0.4, 
        stagger: 0.1 
      })
      .to(loaderRef.current, {
        yPercent: -100,
        duration: 1,
        ease: 'expo.inOut',
        onComplete: () => {
          if (loaderRef.current) {
            loaderRef.current.style.display = 'none'
          }
        }
      })
  }, [loading])

  return (
    <div 
      ref={loaderRef}
      className={`loader ${!loading ? 'loaded' : ''}`}
    >
      <div 
        ref={textRef}
        className="font-serif text-4xl md:text-6xl text-nat-paper tracking-widest italic opacity-0"
      >
        Naturalist Diaries
      </div>
      <div 
        ref={subRef}
        className="mt-6 font-mono text-xs text-nat-sage tracking-[0.4em] uppercase opacity-0"
      >
        Welcome to the Wild
      </div>
      <div 
        ref={barRef}
        className="mt-8 w-48 h-[1px] bg-nat-sage/20 relative overflow-hidden opacity-0"
      >
        <div 
          ref={progressRef}
          className="absolute inset-0 bg-nat-biolum origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  )
}
