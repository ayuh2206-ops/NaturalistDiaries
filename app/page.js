'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { defaultADMIN } from '@/lib/adminData'
import { loadFromFirebase, saveToFirebase } from '@/lib/firebase'
import { getBackgroundImage, getBackgroundPosition } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import HomeSection from '@/components/HomeSection'
import AboutSection from '@/components/AboutSection'
import GallerySection from '@/components/GallerySection'
import ToursSection from '@/components/ToursSection'
import BlogsSection from '@/components/BlogsSection'
import ContactSection from '@/components/ContactSection'
import Lightbox from '@/components/Lightbox'
import TourModal from '@/components/TourModal'
import BlogModal from '@/components/BlogModal'
import PasswordModal from '@/components/PasswordModal'
import AdminDashboard from '@/components/AdminDashboard'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('home')
  const [ADMIN, setADMIN] = useState(defaultADMIN)
  const [formSubmissions, setFormSubmissions] = useState([])
  const [adminPasswordHash, setAdminPasswordHash] = useState(null)
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  
  // Modal states
  const [tourModalOpen, setTourModalOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)
  const [blogModalOpen, setBlogModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  // Load data from Firebase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const { adminData, passwordHash, submissions } = await loadFromFirebase()
        if (adminData) {
          setADMIN(adminData)
        }
        if (passwordHash) {
          setAdminPasswordHash(passwordHash)
        }
        setFormSubmissions(submissions || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setTimeout(() => {
          setLoading(false)
          setMounted(true)
        }, 2000)
      }
    }
    loadData()
  }, [])

  // Save to Firebase function
  const handleSaveToFirebase = useCallback(async () => {
    try {
      await saveToFirebase(ADMIN, adminPasswordHash)
      return true
    } catch (error) {
      console.error('Error saving:', error)
      return false
    }
  }, [ADMIN, adminPasswordHash])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+A for admin
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        if (adminOpen) {
          setAdminOpen(false)
        } else {
          setPasswordModalOpen(true)
        }
      }
      
      // Escape key closes modals
      if (e.key === 'Escape') {
        setAdminOpen(false)
        setLightboxOpen(false)
        setTourModalOpen(false)
        setBlogModalOpen(false)
        setPasswordModalOpen(false)
      }
      
      // Arrow keys for lightbox
      if (lightboxOpen) {
        if (e.key === 'ArrowLeft') {
          setLightboxIndex(prev => 
            prev === 0 ? lightboxImages.length - 1 : prev - 1
          )
        } else if (e.key === 'ArrowRight') {
          setLightboxIndex(prev => 
            prev === lightboxImages.length - 1 ? 0 : prev + 1
          )
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [adminOpen, lightboxOpen, lightboxImages])

  // Open lightbox
  const openLightbox = useCallback((images, index = 0) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  // Open tour modal
  const openTourModal = useCallback((tourId) => {
    const tour = ADMIN.tours.find(t => t.id === tourId)
    if (tour) {
      setSelectedTour(tour)
      setTourModalOpen(true)
    }
  }, [ADMIN.tours])

  // Open blog modal
  const openBlogModal = useCallback((blogId) => {
    const blog = ADMIN.blogs.find(b => b.id === blogId)
    if (blog) {
      setSelectedBlog(blog)
      setBlogModalOpen(true)
    }
  }, [ADMIN.blogs])

  // Update ADMIN data
  const updateADMIN = useCallback((newData) => {
    setADMIN(newData)
  }, [])

  if (!mounted) {
    return <Loader loading={loading} />
  }

  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  const currentBg = ADMIN.backgrounds[currentTab]

  return (
    <>
      <Loader loading={loading} />
      
      <main className="relative w-full h-screen overflow-hidden">
        {/* Background System */}
        <div className="fixed inset-0 z-[-2]">
          <Image
            src={getBackgroundImage(currentBg, isMobile)}
            alt="Background"
            fill
            className="bg-layer active object-cover"
            style={{ objectPosition: getBackgroundPosition(currentBg) }}
            priority
            quality={85}
          />
        </div>

        {/* Vignette Overlay */}
        <div className="vignette-overlay" />
        
        {/* Noise Overlay */}
        <div className="noise-overlay" />

        {/* Navigation */}
        <Navigation 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab}
          logoText={ADMIN.site.logoText}
          logoImage={ADMIN.site.logoImage}
        />

        {/* Sections */}
        <div className="relative w-full h-full">
          <HomeSection 
            active={currentTab === 'home'}
            data={ADMIN}
            setCurrentTab={setCurrentTab}
          />
          
          <AboutSection 
            active={currentTab === 'about'}
            data={ADMIN.about}
          />
          
          <GallerySection 
            active={currentTab === 'gallery'}
            data={ADMIN}
            openLightbox={openLightbox}
          />
          
          <ToursSection 
            active={currentTab === 'tours'}
            data={ADMIN}
            openTourModal={openTourModal}
          />
          
          <BlogsSection 
            active={currentTab === 'blogs'}
            data={ADMIN.blogsSettings}
            blogs={ADMIN.blogs}
            openBlogModal={openBlogModal}
          />
          
          <ContactSection 
            active={currentTab === 'contact'}
            data={ADMIN.contact}
            formOptions={ADMIN.formOptions}
            tours={ADMIN.tours}
            formSubmissions={formSubmissions}
            setFormSubmissions={setFormSubmissions}
          />
        </div>

        {/* Footer */}
        <Footer social={ADMIN.social} />
      </main>

      {/* Modals */}
      <Lightbox 
        open={lightboxOpen}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex(prev => 
          prev === 0 ? lightboxImages.length - 1 : prev - 1
        )}
        onNext={() => setLightboxIndex(prev => 
          prev === lightboxImages.length - 1 ? 0 : prev + 1
        )}
      />

      <TourModal 
        open={tourModalOpen}
        tour={selectedTour}
        onClose={() => setTourModalOpen(false)}
        onInquire={() => {
          setTourModalOpen(false)
          setCurrentTab('contact')
        }}
      />

      <BlogModal 
        open={blogModalOpen}
        blog={selectedBlog}
        profile={ADMIN.profile}
        onClose={() => setBlogModalOpen(false)}
      />

      <PasswordModal 
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        passwordHash={adminPasswordHash}
        setPasswordHash={setAdminPasswordHash}
        onSuccess={() => {
          setPasswordModalOpen(false)
          setAdminOpen(true)
        }}
        saveToFirebase={handleSaveToFirebase}
      />

      <AdminDashboard 
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        ADMIN={ADMIN}
        updateADMIN={updateADMIN}
        formSubmissions={formSubmissions}
        setFormSubmissions={setFormSubmissions}
        saveToFirebase={handleSaveToFirebase}
      />
    </>
  )
}
