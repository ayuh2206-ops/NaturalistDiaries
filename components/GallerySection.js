'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'

export default function GallerySection({ active, data, openLightbox }) {
  const [view, setView] = useState('categories') // 'categories', 'images', 'tags'
  const [currentCategory, setCurrentCategory] = useState(null)
  const [currentTag, setCurrentTag] = useState(null)
  const sectionRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    if (!active) return
    
    // Reset to categories when tab becomes active
    setView('categories')
    setCurrentCategory(null)
    setCurrentTag(null)
    
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
    }
  }, [active])

  const openCategoryView = (category) => {
    setCurrentCategory(category)
    setView('images')
    document.body.classList.add('collection-view')
  }

  const filterByTag = (tag) => {
    setCurrentTag(tag)
    setView('tags')
  }

  const backToCategories = () => {
    setView('categories')
    setCurrentCategory(null)
    setCurrentTag(null)
    document.body.classList.remove('collection-view')
  }

  // Get all unique tags
  const allTags = [...new Set(data.gallery.flatMap(img => img.tags || []))].sort()

  // Filter images
  const filteredImages = view === 'images'
    ? data.gallery.filter(img => img.category === currentCategory)
    : view === 'tags'
    ? data.gallery.filter(img => img.tags?.includes(currentTag))
    : []

  const fibSpans = [
    { col: 5, row: 5 }, { col: 3, row: 3 }, { col: 4, row: 4 },
    { col: 3, row: 4 }, { col: 4, row: 3 }, { col: 3, row: 3 },
    { col: 5, row: 4 }, { col: 4, row: 5 }, { col: 3, row: 3 }, { col: 4, row: 4 },
  ]

  if (!active) return null

  return (
    <section ref={sectionRef} id="gallery" className="view-section active">
      <div className="section-content px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
          <div className="text-left">
            <h2 className="font-serif text-4xl md:text-5xl text-nat-paper reveal-text relative line-decoration">
              {view === 'categories' 
                ? data.gallerySettings.title
                : currentCategory
                ? currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)
                : currentTag
                ? `Tag: ${currentTag}`
                : data.gallerySettings.title
              }
            </h2>
            <p className="font-mono text-xs text-nat-sage mt-4 tracking-widest">
              {view === 'categories'
                ? data.gallerySettings.subtitle
                : view === 'images'
                ? `COLLECTION — ${filteredImages.length} IMAGES`
                : view === 'tags'
                ? `TAG: ${currentTag.toUpperCase()}`
                : data.gallerySettings.subtitle
              }
            </p>
          </div>

          {/* Tags/Back Button */}
          <div className="mt-4 md:mt-0">
            <div className="glass-panel px-4 py-2 rounded-full inline-block shadow-2xl">
              <div className="flex flex-wrap gap-2">
                {view === 'categories' ? (
                  allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => filterByTag(tag)}
                      className="tag-filter-btn font-mono text-[10px] px-3 py-1.5 text-nat-paper hover:text-white rounded-full transition-all magnetic-element border border-white/10 hover:border-nat-biolum/50 hover:bg-nat-biolum/10"
                    >
                      {tag.toUpperCase()}
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      onClick={backToCategories}
                      className="font-mono text-[10px] px-4 py-2 text-nat-biolum hover:text-white rounded-full transition-all magnetic-element border border-nat-biolum/30 hover:border-nat-biolum"
                    >
                      ← BACK TO CATEGORIES
                    </button>
                    <span className="font-mono text-[10px] text-nat-paper/50 px-4 py-2">
                      {currentCategory?.toUpperCase() || currentTag?.toUpperCase()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div 
          id="gallery-scroll-container" 
          className="pb-4"
          style={{
            overflowX: view === 'categories' ? 'scroll' : 'hidden',
            overflowY: view === 'categories' ? 'hidden' : 'visible',
            cursor: view === 'categories' ? 'grab' : 'default',
          }}
        >
          <div 
            ref={gridRef}
            id="gallery-grid"
            className={view === 'categories' ? 'flex gap-6 px-4' : 'grid gap-4 p-4'}
            style={{
              width: view === 'categories' ? 'max-content' : '100%',
              gridTemplateColumns: view !== 'categories' ? 'repeat(12, 1fr)' : undefined,
              gridAutoRows: view !== 'categories' ? '80px' : undefined,
            }}
          >
            {view === 'categories' ? (
              // Category Cards
              data.gallerySettings.categories.map((cat) => {
                const catImages = data.gallery.filter(img => img.category === cat)
                const coverImage = catImages[0]?.src || ''
                
                return (
                  <div
                    key={cat}
                    onClick={() => openCategoryView(cat)}
                    className="gallery-category-card relative group overflow-hidden rounded-2xl border border-white/10 shadow-lg cursor-pointer"
                    style={{
                      minWidth: '320px',
                      width: '320px',
                      height: '420px',
                      flexShrink: 0,
                      background: 'rgba(10, 12, 10, 0.5)',
                    }}
                  >
                    <Image
                      src={coverImage}
                      alt={cat}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                      <span className="font-mono text-[10px] text-nat-biolum tracking-widest mb-2 block">
                        {catImages.length} IMAGES
                      </span>
                      <span className="font-serif text-3xl text-white group-hover:italic transition-all">
                        {cat}
                      </span>
                    </div>
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-nat-black/50">
                      <ArrowRight className="w-4 h-4 text-nat-biolum" />
                    </div>
                  </div>
                )
              })
            ) : (
              // Image Grid (Fibonacci layout)
              filteredImages.map((item, index) => {
                const span = fibSpans[index % fibSpans.length]
                return (
                  <div
                    key={item.id}
                    onClick={() => openLightbox(filteredImages, index)}
                    className="gallery-tilt-card relative group overflow-hidden rounded-xl border border-white/10 shadow-lg cursor-pointer"
                    style={{
                      gridColumn: `span ${span.col}`,
                      gridRow: `span ${span.row}`,
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                      <span className="font-mono text-[10px] text-nat-biolum tracking-widest mb-1">
                        {item.category.toUpperCase()}
                      </span>
                      <span className="font-serif text-lg text-white mb-1">
                        {item.title}
                      </span>
                      <span className="font-sans text-xs text-nat-paper/70">
                        {item.location}
                      </span>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map(t => (
                            <span 
                              key={t}
                              className="text-[8px] px-2 py-0.5 bg-nat-biolum/20 text-nat-biolum rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Scroll Hint (only for categories) */}
        {view === 'categories' && (
          <div className="text-left mt-3">
            <p className="font-mono text-xs text-nat-sage/50">
              ← Drag to scroll or use mousepad →
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
