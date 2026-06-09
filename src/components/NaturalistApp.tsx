'use client';

import { useEffect, useRef, useState, useCallback, FormEvent } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { DEFAULT_ADMIN, AdminData, GalleryImage, Submission } from '@/lib/adminData';
import gsap from 'gsap';
import {
  X, ChevronLeft, ChevronRight, ArrowRight, Star,
  MapPin, Send, LayoutDashboard, Settings, Home as HomeIcon, User,
  Image as ImageIcon, Map, FileText, MessageSquare, Mail, ImagePlus, Inbox,
  Plus, Eye, Save, Download, Trash2, EyeOff
} from 'lucide-react';

// Custom brand icons (lucide-react removed brand icons)
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// OPTIMIZED IMAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function OptImage({ src, alt, fill, width, height, className, style, priority, onError, sizes }: {
  src: string; alt: string; fill?: boolean; width?: number; height?: number;
  className?: string; style?: React.CSSProperties; priority?: boolean;
  onError?: () => void; sizes?: string;
}) {
  const [error, setError] = useState(false);
  const fallback = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000';

  if (!src || error) {
    if (fill) {
      return <img src={fallback} alt={alt} className={className} style={{ ...style, objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }} />;
    }
    return <img src={fallback} alt={alt} className={className} style={style} width={width} height={height} />;
  }

  if (fill) {
    return (
      <Image
        src={src} alt={alt} fill className={className} style={style}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        priority={priority} onError={() => { setError(true); onError?.(); }}
        quality={80}
      />
    );
  }

  return (
    <Image
      src={src} alt={alt} width={width || 800} height={height || 600}
      className={className} style={style} priority={priority}
      onError={() => { setError(true); onError?.(); }} quality={80}
      sizes={sizes}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function NaturalistApp() {
  // --- STATE ---
  const [admin, setAdmin] = useState<AdminData>(DEFAULT_ADMIN);
  const [currentTab, setCurrentTabState] = useState('home');
  const [galleryView, setGalleryView] = useState<'categories' | 'images' | 'tags'>('categories');
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentTag, setCurrentTag] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<GalleryImage[]>([]);
  const [tourModalId, setTourModalId] = useState<number | null>(null);
  const [blogModalId, setBlogModalId] = useState<number | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPage, setAdminPage] = useState('overview');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordHash, setPasswordHash] = useState<string | null>(null);
  const [passwordMode, setPasswordMode] = useState<'set' | 'login'>('set');
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // --- REFS ---
  const navIndicatorRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const galleryGridRef = useRef<HTMLDivElement>(null);
  const prevTabRef = useRef('home');

  // --- COUNTERS ---
  const nextGalleryId = useRef(7);
  const nextTourId = useRef(3);
  const nextBlogId = useRef(3);
  const nextTestimonialId = useRef(4);

  // --- GALLERY DRAG STATE ---
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  // ═══════════════════════════════════════════════════════════════════════
  // FIREBASE
  // ═══════════════════════════════════════════════════════════════════════

  const loadFromFirebase = useCallback(async () => {
    try {
      const adminDoc = await getDoc(doc(db, 'config', 'admin'));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        if (data.ADMIN) setAdmin(prev => ({ ...prev, ...data.ADMIN }));
        if (data.passwordHash) setPasswordHash(data.passwordHash);
      }
      const submissionsSnap = await getDocs(collection(db, 'submissions'));
      const subs: Submission[] = [];
      submissionsSnap.forEach(d => subs.push({ id: d.id, ...d.data() } as Submission));
      setSubmissions(subs);
      setFirebaseReady(true);
    } catch (e) {
      console.error('Firebase load error:', e);
      setFirebaseReady(true);
    }
  }, []);

  const saveToFirebase = useCallback(async (data: AdminData, pwHash: string | null) => {
    if (!firebaseReady) return;
    try {
      await setDoc(doc(db, 'config', 'admin'), {
        ADMIN: data, passwordHash: pwHash, lastUpdated: new Date().toISOString()
      });
    } catch (e) { console.error('Firebase save error:', e); }
  }, [firebaseReady]);

  const saveSubmissionToFirebase = useCallback(async (submission: Submission) => {
    try {
      await setDoc(doc(db, 'submissions', submission.id.toString()), submission as any);
    } catch (e) { console.error('Submission save error:', e); }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // EFFECTS & ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════

  const initTilt = useCallback(() => {
    document.querySelectorAll('.tilt-card').forEach((card: any) => {
      card.onmousemove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
        gsap.to(card, { rotateX, rotateY, duration: 0.4, ease: 'power2.out' });
      };
      card.onmouseleave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  }, []);

  const initSpotlight = useCallback(() => {
    document.querySelectorAll('.spotlight-btn').forEach((btn: any) => {
      btn.onmousemove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty('--x', `${e.clientX - rect.left}px`);
        btn.style.setProperty('--y', `${e.clientY - rect.top}px`);
      };
    });
  }, []);

  const initMagnetic = useCallback(() => {
    document.querySelectorAll('.magnetic-element').forEach((el: any) => {
      el.onmousemove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - rect.left - rect.width / 2) * 0.2,
          y: (e.clientY - rect.top - rect.height / 2) * 0.2,
          duration: 0.3
        });
      };
      el.onmouseleave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  }, []);

  const reinitEffects = useCallback(() => {
    initTilt(); initSpotlight(); initMagnetic();
  }, [initTilt, initSpotlight, initMagnetic]);

  const triggerRevealAnimations = useCallback((container: Element) => {
    container.querySelectorAll('.reveal-text').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 150);
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // NAV PILL
  // ═══════════════════════════════════════════════════════════════════════

  const moveNavPill = useCallback((tabId: string) => {
    const pill = navIndicatorRef.current;
    const navContainer = navContainerRef.current;
    if (!pill || !navContainer) return;
    const targetBtn = navContainer.querySelector(`[data-tab="${tabId}"]`);
    if (!targetBtn) return;
    const containerRect = navContainer.getBoundingClientRect();
    const btnRect = targetBtn.getBoundingClientRect();
    gsap.to(pill, {
      top: btnRect.top - containerRect.top,
      left: btnRect.left - containerRect.left,
      width: btnRect.width, height: btnRect.height,
      duration: 0.5, ease: 'elastic.out(1, 0.7)'
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // TAB SWITCHING
  // ═══════════════════════════════════════════════════════════════════════

  const switchTab = useCallback((tabId: string) => {
    if (prevTabRef.current === tabId && tabId !== 'home') return;

    moveNavPill(tabId);

    // Animate background layers
    document.querySelectorAll('.bg-layer').forEach(bg => bg.classList.remove('active'));
    document.getElementById(`bg-${tabId}`)?.classList.add('active');

    const currentView = document.querySelector('.view-section.active');
    const nextView = document.getElementById(tabId);

    if (currentView && currentView !== nextView && nextView) {
      window.scrollTo(0, 0);
      gsap.to(currentView, {
        opacity: 0, y: -20, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          currentView.classList.remove('active');
          const currentContent = currentView.querySelector('.section-content');
          if (currentContent) (currentContent as HTMLElement).scrollTop = 0;
          currentView.querySelectorAll('.reveal-text').forEach(el => el.classList.remove('revealed'));
          nextView.classList.add('active');
          const nextContent = nextView.querySelector('.section-content');
          if (nextContent) (nextContent as HTMLElement).scrollTop = 0;
          gsap.fromTo(nextView, { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
            onComplete: () => {
              triggerRevealAnimations(nextView);
            }
          });
        }
      });
    }
    prevTabRef.current = tabId;
    setCurrentTabState(tabId);

    // Reset gallery when entering
    if (tabId === 'gallery') {
      document.body.classList.remove('collection-view');
      setGalleryView('categories');
      setCurrentCategory('All');
      setCurrentTag('');
    }
  }, [moveNavPill, triggerRevealAnimations]);

  // ═══════════════════════════════════════════════════════════════════════
  // GALLERY SCROLL SETUP
  // ═══════════════════════════════════════════════════════════════════════

  const setupGalleryScroll = useCallback(() => {
    const container = galleryScrollRef.current;
    if (!container) return;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.gallery-category-card, .gallery-tilt-card')) return;
      dragState.current = { isDown: true, startX: e.pageX, scrollLeft: container.scrollLeft };
      container.style.cursor = 'grabbing';
    };
    const onMouseLeave = () => { dragState.current.isDown = false; container.style.cursor = 'grab'; };
    const onMouseUp = () => { dragState.current.isDown = false; container.style.cursor = 'grab'; };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current.isDown) return;
      const walk = (e.pageX - dragState.current.startX) * 1.5;
      container.scrollLeft = dragState.current.scrollLeft - walk;
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);

    // Wheel → horizontal
    const gallerySection = document.getElementById('gallery');
    const onWheel = (e: WheelEvent) => {
      if (container.scrollWidth <= container.clientWidth) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };
    gallerySection?.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      gallerySection?.removeEventListener('wheel', onWheel);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // GALLERY CATEGORY VIEW
  // ═══════════════════════════════════════════════════════════════════════

  const openCategoryView = useCallback((category: string) => {
    document.body.classList.add('collection-view');
    setGalleryView('images');
    setCurrentCategory(category);
  }, []);

  const backToCategories = useCallback(() => {
    document.body.classList.remove('collection-view');
    setGalleryView('categories');
    setCurrentCategory('All');
    setCurrentTag('');
  }, []);

  const filterByTag = useCallback((tag: string) => {
    document.body.classList.add('collection-view');
    setGalleryView('tags');
    setCurrentTag(tag);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // LIGHTBOX
  // ═══════════════════════════════════════════════════════════════════════

  const openLightboxWithNav = useCallback((images: GalleryImage[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length);
  }, [lightboxImages.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex(i => (i + 1) % lightboxImages.length);
  }, [lightboxImages.length]);

  // ═══════════════════════════════════════════════════════════════════════
  // FORM HANDLING
  // ═══════════════════════════════════════════════════════════════════════

  const handleFormSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const captcha = formData.get('captcha') as string;
    if (parseInt(captcha) !== 24) { alert('Incorrect captcha. Please try again.'); return; }

    const submission: Submission = {
      id: Date.now(), date: new Date().toLocaleDateString(), status: 'new',
      name: formData.get('name') as string || '',
      email: formData.get('email') as string || '',
      phone: formData.get('phone') as string || '',
      location: formData.get('location') as string || '',
      destination: formData.get('destination') as string || '',
      dateFrom: formData.get('dateFrom') as string || '',
      dateTo: formData.get('dateTo') as string || '',
      datesFlexible: formData.get('datesFlexible') === 'on',
      travellers: formData.get('travellers') as string || '',
      budgetIndia: formData.get('budgetIndia') as string || '',
      budgetAfrica: formData.get('budgetAfrica') as string || '',
      description: formData.get('description') as string || '',
      contactMethod: formData.get('contactMethod') as string || '',
      referral: formData.get('referral') as string || '',
      updates: formData.get('updates') === 'on'
    };

    setSubmissions(prev => [...prev, submission]);
    saveSubmissionToFirebase(submission);
    alert(admin.contact.successMessage);
    form.reset();
  }, [admin.contact.successMessage, saveSubmissionToFirebase]);

  // ═══════════════════════════════════════════════════════════════════════
  // PASSWORD / ADMIN
  // ═══════════════════════════════════════════════════════════════════════

  const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  };

  const tryOpenAdmin = useCallback(() => {
    setPasswordMode(passwordHash ? 'login' : 'set');
    setPasswordModalOpen(true);
  }, [passwordHash]);

  // ═══════════════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════════════

  useEffect(() => {
    loadFromFirebase();
  }, [loadFromFirebase]);

  useEffect(() => {
    // Keyboard shortcuts
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (adminOpen) setAdminOpen(false);
        else tryOpenAdmin();
      }
      if (e.key === 'Escape') {
        if (adminOpen) setAdminOpen(false);
        if (lightboxOpen) setLightboxOpen(false);
        if (tourModalId !== null) setTourModalId(null);
        if (blogModalId !== null) setBlogModalId(null);
        if (passwordModalOpen) setPasswordModalOpen(false);
      }
      if (lightboxOpen) {
        if (e.key === 'ArrowLeft') lightboxPrev();
        if (e.key === 'ArrowRight') lightboxNext();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [adminOpen, lightboxOpen, tourModalId, blogModalId, passwordModalOpen, tryOpenAdmin, lightboxPrev, lightboxNext]);

  // Loading animation
  useEffect(() => {
    gsap.set('#home', { opacity: 0 });
    gsap.set('#main-nav', { opacity: 0, y: -20 });

    const tl = gsap.timeline();
    tl.to('#loader-text', { opacity: 1, y: -10, duration: 0.8 })
      .to('#loader-sub', { opacity: 1, duration: 0.5 }, '-=0.3')
      .to('#loader-bar', { opacity: 1, duration: 0.3 }, '-=0.2')
      .to('#loader-progress', { scaleX: 1, duration: 1.5, ease: 'power1.inOut' })
      .to('#loader-text, #loader-sub, #loader-bar', { opacity: 0, y: -20, duration: 0.4, stagger: 0.1 })
      .to('.loader', {
        yPercent: -100, duration: 1, ease: 'expo.inOut',
        onComplete: () => {
          setLoaded(true);
          gsap.to('#home', {
            opacity: 1, duration: 0.8,
            onComplete: () => {
              const home = document.getElementById('home');
              if (home) triggerRevealAnimations(home);
            }
          });
          gsap.to('#main-nav', { opacity: 1, y: 0, duration: 0.6, delay: 0.3 });
        }
      });

    setTimeout(() => moveNavPill('home'), 500);
  }, [moveNavPill, triggerRevealAnimations]);

  // Re-init effects when tab changes or data changes
  useEffect(() => {
    const timer = setTimeout(() => reinitEffects(), 200);
    return () => clearTimeout(timer);
  }, [currentTab, galleryView, admin, reinitEffects]);

  // Gallery scroll setup
  useEffect(() => {
    if (galleryView === 'categories') {
      const cleanup = setupGalleryScroll();
      return cleanup;
    }
  }, [galleryView, setupGalleryScroll, admin.gallery]);

  // Background images based on mobile/desktop
  const getBackgroundSrc = useCallback((key: string) => {
    const bg = admin.backgrounds[key];
    if (!bg) return '';
    if (typeof bg === 'string') return bg;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    return (isMobile && bg.mobile) ? bg.mobile : bg.desktop;
  }, [admin.backgrounds]);

  // ═══════════════════════════════════════════════════════════════════════
  // COMPUTED DATA
  // ═══════════════════════════════════════════════════════════════════════

  const allTags = Array.from(new Set(admin.gallery.flatMap(img => img.tags?.map(t => t.toLowerCase()) || []))).sort();

  const filteredGalleryImages = galleryView === 'images'
    ? admin.gallery.filter(img => img.category === currentCategory)
    : galleryView === 'tags'
      ? admin.gallery.filter(img => img.tags?.some(t => t.toLowerCase() === currentTag.toLowerCase()))
      : admin.gallery;

  const fibSpans = [
    { col: 5, row: 5 }, { col: 3, row: 3 }, { col: 4, row: 4 },
    { col: 3, row: 4 }, { col: 4, row: 3 }, { col: 3, row: 3 },
    { col: 5, row: 4 }, { col: 4, row: 5 }, { col: 3, row: 3 }, { col: 4, row: 4 },
  ];

  const currentTour = tourModalId !== null ? admin.tours.find(t => t.id === tourModalId) : null;
  const currentBlog = blogModalId !== null ? admin.blogs.find(b => b.id === blogModalId) : null;

  // ═══════════════════════════════════════════════════════════════════════
  // ADMIN SAVE HELPERS
  // ═══════════════════════════════════════════════════════════════════════

  const updateAdmin = useCallback((updater: (prev: AdminData) => AdminData) => {
    setAdmin(prev => {
      const next = updater(prev);
      saveToFirebase(next, passwordHash);
      return next;
    });
  }, [saveToFirebase, passwordHash]);

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <>
      {/* Loading Screen */}
      <div className={`loader ${loaded ? 'loaded' : ''}`} id="loader">
        <div className="font-serif text-4xl md:text-6xl text-nat-paper tracking-widest italic opacity-0" id="loader-text">
          Naturalist Diaries
        </div>
        <div className="mt-6 font-mono text-xs text-nat-sage tracking-[0.4em] uppercase opacity-0" id="loader-sub">
          Welcome to the Wild
        </div>
        <div className="mt-8 w-48 h-[1px] bg-nat-sage/20 relative overflow-hidden opacity-0" id="loader-bar">
          <div className="absolute inset-0 bg-nat-biolum origin-left" id="loader-progress" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>

      {/* Backgrounds */}
      <div id="global-bg-container">
        {['home', 'about', 'gallery', 'tours', 'blogs', 'contact'].map(key => (
          <img
            key={key}
            src={getBackgroundSrc(key)}
            className={`bg-layer ${key === 'home' ? 'active' : ''}`}
            id={`bg-${key}`}
            alt=""
            style={{ objectPosition: admin.backgrounds[key]?.position || 'center center' }}
          />
        ))}
      </div>

      <div id="vignette-overlay" />
      <div className="noise-overlay" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex flex-col md:flex-row justify-between items-center pointer-events-none" id="main-nav">
        <div className="z-50 pointer-events-auto drop-shadow-2xl magnetic-element glow-pulse cursor-pointer" onClick={() => switchTab('home')}>
          {admin.site.logoImage ? (
            <img src={admin.site.logoImage} alt={admin.site.name} className="h-10 w-auto object-contain" />
          ) : (
            <span className="font-serif italic text-2xl text-nat-paper">{admin.site.logoText}</span>
          )}
        </div>

        <div className="relative flex flex-wrap justify-center gap-1 mt-4 md:mt-0 glass-panel px-2 py-2 rounded-full pointer-events-auto" ref={navContainerRef}>
          <div id="nav-indicator" ref={navIndicatorRef} />
          {['home', 'about', 'gallery', 'tours', 'blogs', 'contact'].map(tab => (
            <button key={tab} onClick={() => switchTab(tab)}
              className={`nav-link px-5 py-2 rounded-full font-mono text-xs font-semibold tracking-widest ${currentTab === tab ? 'text-white' : 'text-nat-paper'} hover:text-white`}
              data-tab={tab}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      <main className="relative w-full z-20" style={{ height: '100vh', overflow: 'hidden' }}>

        {/* ═══ HOME ═══ */}
        <section id="home" className="view-section active">
          <div className="relative z-10 w-full hero-content px-4">
            <h1 className="font-serif text-6xl md:text-9xl text-nat-paper leading-[0.9] opacity-90 reveal-text mb-10">
              <span>{admin.home.heroTitle}</span><br />
              <span className="italic font-light opacity-90">{admin.home.heroSubtitle}</span>
            </h1>

            <div className="glass-panel p-6 md:p-8 rounded-2xl flex items-center gap-6 md:gap-8 max-w-xl magnetic-element cursor-pointer tilt-card border-glow float-animation ml-auto"
              onClick={() => switchTab('about')}>
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-nat-biolum/40 tilt-content flex-shrink-0 shadow-lg relative">
                <OptImage src={admin.profile.image} alt="Profile" fill className="object-cover" priority sizes="112px" />
              </div>
              <div className="text-left tilt-content">
                <h3 className="text-nat-paper">
                  <span className="text-nat-biolum font-mono text-xs tracking-widest block mb-1">HI, I&apos;M</span>
                  <span className="font-sans text-3xl md:text-4xl font-medium tracking-wide">{admin.profile.name}</span>
                </h3>
                <p className="font-sans text-sm md:text-base text-nat-sage/80 mt-3">{admin.profile.bio}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ABOUT ═══ */}
        <section id="about" className="view-section">
          <div className="section-content px-6 md:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4 relative group cursor-pointer flex justify-center mt-6">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 glass-panel px-4 py-2 rounded-full z-10">
                  <span className="font-mono text-[10px] text-nat-biolum tracking-widest">{admin.about.years}</span>
                </div>
                <div className="aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl border border-white/10 shadow-2xl glass-panel p-2">
                  <img src={admin.about.image} alt="The Naturalist" className="w-full h-full object-cover rounded-lg transition-all duration-700" />
                </div>
              </div>

              <div className="md:col-span-8 flex flex-col gap-4">
                <div className="glass-panel p-6 md:p-8 rounded-2xl">
                  <h2 className="font-serif text-4xl md:text-5xl text-nat-paper mb-4 reveal-text relative line-decoration">{admin.about.title}</h2>
                  <div className="mt-4 space-y-3">
                    <p className="font-sans text-nat-paper/90 text-base leading-relaxed">{admin.about.description}</p>
                    <p className="font-sans text-nat-paper/70 text-sm leading-relaxed">{admin.about.philosophy}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-panel p-5 rounded-xl">
                    <h3 className="font-mono text-nat-biolum text-xs tracking-widest mb-3">EXPERIENCE</h3>
                    <ul className="font-sans text-nat-paper/80 space-y-2 text-sm">
                      {admin.about.experience.map((item, i) => (
                        <li key={i} className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-nat-biolum rounded-full" />{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-panel p-5 rounded-xl">
                    <h3 className="font-mono text-nat-biolum text-xs tracking-widest mb-3">SPECIALTIES</h3>
                    <ul className="font-sans text-nat-paper/80 space-y-2 text-sm">
                      {admin.about.specialties.map((item, i) => (
                        <li key={i} className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-nat-biolum rounded-full" />{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="glass-panel p-5 rounded-xl">
                  <h3 className="font-mono text-nat-biolum text-xs tracking-widest mb-3">FEATURED IN</h3>
                  <p className="font-sans text-nat-paper/70 text-sm">{admin.about.featuredIn}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ GALLERY ═══ */}
        <section id="gallery" className="view-section">
          <div className="section-content px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
              <div className="text-left">
                <h2 className="font-serif text-4xl md:text-5xl text-nat-paper reveal-text relative line-decoration">
                  {galleryView === 'categories' ? admin.gallerySettings.title : galleryView === 'images' ? currentCategory : admin.gallerySettings.title}
                </h2>
                <p className="font-mono text-xs text-nat-sage mt-4 tracking-widest">
                  {galleryView === 'categories' ? admin.gallerySettings.subtitle
                    : galleryView === 'images' ? `COLLECTION — ${filteredGalleryImages.length} IMAGES`
                    : `TAG: ${currentTag.toUpperCase()} — ${filteredGalleryImages.length} IMAGES`}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="glass-panel px-4 py-2 rounded-full inline-block shadow-2xl">
                  <div className="flex flex-wrap gap-2">
                    {galleryView === 'categories' ? (
                      allTags.map(tag => (
                        <button key={tag} onClick={() => filterByTag(tag)}
                          className="tag-filter-btn font-mono text-[10px] px-3 py-1.5 text-nat-paper hover:text-white rounded-full transition-all magnetic-element border border-white/10 hover:border-nat-biolum/50 hover:bg-nat-biolum/10">
                          {tag.toUpperCase()}
                        </button>
                      ))
                    ) : (
                      <>
                        <button onClick={backToCategories}
                          className="font-mono text-[10px] px-4 py-2 text-nat-biolum hover:text-white rounded-full transition-all magnetic-element border border-nat-biolum/30 hover:border-nat-biolum">
                          ← BACK TO CATEGORIES
                        </button>
                        <span className="font-mono text-[10px] text-nat-paper/50 px-4 flex items-center">
                          {galleryView === 'images' ? currentCategory.toUpperCase() : `TAG: ${currentTag.toUpperCase()}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Container */}
            <div ref={galleryScrollRef} id="gallery-scroll-container" className="pb-4"
              style={galleryView === 'categories' ? { overflowX: 'scroll', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', cursor: 'grab', position: 'relative', zIndex: 10 }
                : { overflowX: 'hidden', overflowY: 'visible', cursor: 'default', paddingBottom: 16 }}>

              {galleryView === 'categories' ? (
                /* Category Carousel */
                <div ref={galleryGridRef} id="gallery-grid" className="flex gap-6 px-4" style={{ width: 'max-content', position: 'relative', zIndex: 20 }}>
                  {admin.gallerySettings.categories.map((cat, index) => {
                    const catImages = admin.gallery.filter(img => img.category === cat);
                    const coverImage = catImages.length > 0 ? catImages[0].src : 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000';
                    return (
                      <div key={cat} className="gallery-category-card relative group overflow-hidden rounded-2xl border border-white/10 shadow-lg"
                        onClick={() => openCategoryView(cat)}
                        style={{ minWidth: 320, width: 320, height: 420, flexShrink: 0, cursor: 'pointer', background: 'rgba(10,12,10,0.5)', position: 'relative' }}>
                        <OptImage src={coverImage} alt={cat} fill className="object-cover transition-transform duration-700 group-hover:scale-110" style={{ pointerEvents: 'none' }} sizes="320px" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" style={{ pointerEvents: 'none' }} />
                        <div className="absolute bottom-0 left-0 right-0 p-6" style={{ pointerEvents: 'none' }}>
                          <span className="font-mono text-[10px] text-nat-biolum tracking-widest mb-2 block">{catImages.length} IMAGES</span>
                          <span className="font-serif text-3xl text-white group-hover:italic transition-all">{cat}</span>
                        </div>
                        <div className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          style={{ background: 'rgba(10,12,10,0.5)', pointerEvents: 'none' }}>
                          <ArrowRight className="w-4 h-4 text-nat-biolum" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Fibonacci Grid */
                <div ref={galleryGridRef} id="gallery-grid" className="grid gap-4 p-4"
                  style={{
                    gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(12, 1fr)',
                    gridAutoRows: typeof window !== 'undefined' && window.innerWidth <= 768 ? '180px' : '80px',
                    width: '100%', position: 'relative', zIndex: 20
                  }}>
                  {filteredGalleryImages.length === 0 ? (
                    <div className="col-span-12 text-center py-20">
                      <p className="font-mono text-nat-sage text-sm">No images found</p>
                    </div>
                  ) : (
                    filteredGalleryImages.map((item, index) => {
                      const span = fibSpans[index % fibSpans.length];
                      return (
                        <div key={item.id} className="gallery-tilt-card relative group overflow-hidden rounded-xl border border-white/10 shadow-lg cursor-pointer"
                          style={{ gridColumn: `span ${span.col}`, gridRow: `span ${span.row}` }}
                          onClick={() => openLightboxWithNav(filteredGalleryImages, index)}>
                          <OptImage src={item.src} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" style={{ pointerEvents: 'none' }} sizes="(max-width: 768px) 50vw, 400px" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4" style={{ pointerEvents: 'none' }}>
                            <span className="font-mono text-[10px] text-nat-biolum tracking-widest mb-1">{item.category.toUpperCase()}</span>
                            <span className="font-serif text-lg text-white mb-1">{item.title}</span>
                            <span className="font-sans text-xs text-nat-paper/70">{item.location}</span>
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map(t => <span key={t} className="text-[8px] px-2 py-0.5 bg-nat-biolum/20 text-nat-biolum rounded-full">{t}</span>)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {galleryView === 'categories' && (
              <div className="text-left mt-3">
                <p className="font-mono text-xs text-nat-sage/50">← Drag to scroll or use mousepad →</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══ TOURS ═══ */}
        <section id="tours" className="view-section">
          <div className="section-content px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h2 className="font-serif text-4xl md:text-5xl text-nat-paper reveal-text relative line-decoration">{admin.toursSettings.title}</h2>
                  <p className="font-mono text-xs text-nat-sage mt-4 tracking-widest">{admin.toursSettings.subtitle}</p>
                </div>
                <div><p className="font-sans text-nat-paper/70 text-sm max-w-md">{admin.toursSettings.description}</p></div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {admin.tours.map(tour => (
                  <div key={tour.id} className="glass-panel p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center group cursor-pointer hover:border-nat-biolum/20 transition-all tilt-card"
                    onClick={() => setTourModalId(tour.id)}>
                    <div className="aspect-video overflow-hidden rounded-lg tilt-content relative">
                      <OptImage src={tour.image} alt={tour.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                      <div className="absolute top-4 right-4 glass-panel px-3 py-1 rounded-full">
                        <span className="font-mono text-[10px] text-nat-biolum">{tour.price}</span>
                      </div>
                    </div>
                    <div className="tilt-content">
                      <div className="font-mono text-[10px] text-nat-biolum mb-2 tracking-widest">{tour.date} | {tour.location}</div>
                      <h3 className="font-serif text-3xl text-nat-paper mb-4 group-hover:italic transition-all">{tour.title}</h3>
                      <p className="font-sans text-nat-paper/80 text-sm leading-relaxed mb-6">{tour.description}</p>
                      <div className="inline-block rounded-full p-[1px] spotlight-btn magnetic-element">
                        <span className="spotlight-content px-5 py-2.5 bg-nat-black rounded-full text-xs font-mono uppercase tracking-widest text-nat-sage hover:text-nat-biolum transition-colors flex items-center gap-2">
                          View Details <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Testimonials */}
                {admin.testimonials && admin.testimonials.length > 0 && (
                  <div className="mt-16">
                    <div className="text-center mb-12">
                      <h3 className="font-serif text-3xl md:text-4xl text-nat-paper mb-4">What Travelers Say</h3>
                      <p className="font-mono text-xs text-nat-sage">TESTIMONIALS FROM OUR EXPEDITIONS</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {admin.testimonials.map(t => (
                        <div key={t.id} className="glass-panel p-6 rounded-xl tilt-card">
                          <div className="tilt-content">
                            <div className="flex gap-1 mb-4">
                              {Array(t.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 text-nat-amber fill-nat-amber" />)}
                            </div>
                            <p className="font-sans text-nat-paper/90 text-sm italic leading-relaxed mb-6">&quot;{t.quote}&quot;</p>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-nat-forest flex items-center justify-center">
                                <span className="font-serif text-nat-biolum">{t.name.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-sans text-nat-paper text-sm">{t.name}</div>
                                <div className="font-mono text-[10px] text-nat-sage">{t.location}</div>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <span className="font-mono text-[9px] text-nat-biolum/70">{t.tour}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BLOGS ═══ */}
        <section id="blogs" className="view-section">
          <div className="section-content px-6 md:px-20">
            <div className="max-w-4xl mx-auto">
              <div className="glass-panel p-6 md:p-8 rounded-2xl">
                <h2 className="font-serif text-4xl md:text-5xl text-nat-paper mb-4 text-center reveal-text relative line-decoration">{admin.blogsSettings.title}</h2>
                <p className="font-mono text-xs text-nat-sage text-center mt-4 mb-8 tracking-widest">{admin.blogsSettings.subtitle}</p>
                <div className="flex flex-col gap-4">
                  {admin.blogs.map(blog => (
                    <article key={blog.id} className="glass-panel p-6 group cursor-pointer hover:bg-white/5 hover:border-nat-biolum/20 transition-all rounded-lg magnetic-element"
                      onClick={() => setBlogModalId(blog.id)}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <span className="font-mono text-[10px] text-nat-biolum tracking-widest">{blog.date}</span>
                            <span className="font-mono text-[10px] text-nat-sage/60">{blog.readTime}</span>
                          </div>
                          <h4 className="font-serif text-2xl md:text-3xl text-nat-paper group-hover:italic transition-all">{blog.title}</h4>
                          <p className="font-sans text-nat-paper/70 mt-2 text-sm max-w-xl">{blog.description}</p>
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

        {/* ═══ CONTACT ═══ */}
        <section id="contact" className="view-section">
          <div className="section-content px-6 md:px-12">
            <div className="max-w-4xl mx-auto glass-panel p-6 md:p-8 rounded-2xl">
              <div className="text-center mb-6">
                <h2 className="font-serif text-4xl md:text-5xl text-nat-paper mb-4 reveal-text"
                  dangerouslySetInnerHTML={{ __html: admin.contact.title.replace('Experience', '<span class="italic text-nat-sage">Experience</span>') }} />
                <p className="font-sans text-nat-paper/80 text-sm">{admin.contact.subtitle}</p>
              </div>

              <form className="space-y-4" id="contact-form" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">Your Name *</label>
                    <input type="text" name="name" className="form-input" required placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">Your Number *</label>
                    <input type="tel" name="phone" className="form-input" required placeholder="+1 234 567 8900" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">Email ID *</label>
                    <input type="email" name="email" className="form-input" required placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">Where are you from *</label>
                    <input type="text" name="location" className="form-input" required placeholder="City, Country" />
                  </div>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">Preferred Destination *</label>
                  <select name="destination" className="form-input" required>
                    <option value="" disabled>Select Destination</option>
                    {admin.formOptions.destinations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="glass-panel p-4 rounded-lg border border-white/5 bg-white/5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-4">Travel Dates</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div><label className="text-xs text-nat-paper/70 mb-1 block">From:</label><input type="date" name="dateFrom" className="form-input" /></div>
                    <div><label className="text-xs text-nat-paper/70 mb-1 block">To:</label><input type="date" name="dateTo" className="form-input" /></div>
                    <div className="flex items-center gap-2 h-full pb-3">
                      <input type="checkbox" name="datesFlexible" className="custom-checkbox" id="no-dates" />
                      <label htmlFor="no-dates" className="text-xs text-nat-paper cursor-pointer">Dates not decided</label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">Total Travellers *</label>
                  <input type="number" name="travellers" min="1" className="form-input" required placeholder="1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">Budget (India) *</label>
                    <select name="budgetIndia" className="form-input" required>
                      <option value="" disabled>Select</option>
                      {admin.formOptions.budgetIndia.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">Budget (Africa) *</label>
                    <select name="budgetAfrica" className="form-input" required>
                      <option value="" disabled>Select</option>
                      {admin.formOptions.budgetAfrica.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">Describe your ideal trip *</label>
                  <textarea name="description" className="form-input h-32 resize-none" placeholder="Tell us about your dream expedition..." required />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">Contact Method *</label>
                  <select name="contactMethod" className="form-input" required>
                    <option value="" disabled>Select</option>
                    {admin.formOptions.contactMethods.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">How did you hear about us?</label>
                  <select name="referral" className="form-input">
                    <option value="" disabled>Select</option>
                    {admin.formOptions.referralSources.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <label className="font-mono text-xs text-nat-sage">Captcha: What is 12 + 12? *</label>
                    <input type="number" name="captcha" className="form-input w-24 text-center" required placeholder="?" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="updates" className="custom-checkbox" id="updates" />
                    <label htmlFor="updates" className="text-xs text-nat-paper cursor-pointer">Send me weekly updates</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="privacy" className="custom-checkbox" id="privacy" required />
                    <label htmlFor="privacy" className="text-xs text-nat-paper cursor-pointer">I agree to the Privacy Policy *</label>
                  </div>
                </div>
                <div className="relative w-full mt-8 rounded-lg p-[1px] spotlight-btn cursor-pointer magnetic-element">
                  <button type="submit" className="spotlight-content w-full py-6 bg-nat-black rounded-lg text-nat-biolum font-mono text-sm tracking-widest hover:text-white transition-colors">
                    SUBMIT INQUIRY
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex justify-center pb-6">
          <div className="glass-panel px-6 py-3 rounded-full pointer-events-auto flex items-center gap-6">
            {admin.social.instagram && (
              <a href={admin.social.instagram} target="_blank" rel="noopener noreferrer" className="text-nat-sage hover:text-nat-biolum transition-colors magnetic-element">
                <InstagramIcon className="w-6 h-6" />
              </a>
            )}
            {admin.social.youtube && (
              <a href={admin.social.youtube} target="_blank" rel="noopener noreferrer" className="text-nat-sage hover:text-nat-biolum transition-colors magnetic-element">
                <YoutubeIcon className="w-6 h-6" />
              </a>
            )}
            <span className="font-mono text-xs text-nat-sage/50">© 2026 N.D.</span>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {lightboxOpen && lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-nat-black/95 flex justify-center items-center backdrop-blur-xl">
          <button className="absolute top-8 right-8 text-white hover:text-nat-biolum z-[101]" onClick={() => setLightboxOpen(false)}>
            <X className="w-10 h-10" />
          </button>
          {lightboxImages.length > 1 && (
            <>
              <button className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-nat-biolum z-[101] p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all" onClick={lightboxPrev}>
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-nat-biolum z-[101] p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all" onClick={lightboxNext}>
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          <img src={lightboxImages[lightboxIndex]?.src} alt={lightboxImages[lightboxIndex]?.title} className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl rounded-lg" />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-nat-paper font-mono text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            {lightboxImages[lightboxIndex]?.title} — {lightboxImages[lightboxIndex]?.location}
          </div>
          <div className="absolute top-8 left-8 text-nat-paper font-mono text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            {lightboxIndex + 1} / {lightboxImages.length}
          </div>
        </div>
      )}

      {/* Tour Modal */}
      {currentTour && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto">
          <button onClick={() => setTourModalId(null)} className="fixed top-6 right-6 z-[101] text-white hover:text-nat-biolum glass-panel w-12 h-12 rounded-full flex items-center justify-center">
            <X className="w-6 h-6" />
          </button>
          <div className="min-h-screen py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="relative h-[50vh] rounded-2xl overflow-hidden mb-8">
                <OptImage src={currentTour.image} alt={currentTour.title} fill className="object-cover" sizes="100vw" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="glass-panel px-4 py-2 rounded-full font-mono text-xs text-nat-biolum">{currentTour.location}</span>
                    <span className="glass-panel px-4 py-2 rounded-full font-mono text-xs text-nat-paper">{currentTour.date}</span>
                    <span className="glass-panel px-4 py-2 rounded-full font-mono text-xs text-nat-amber">{currentTour.price}</span>
                  </div>
                  <h1 className="font-serif text-4xl md:text-6xl text-white">{currentTour.title}</h1>
                </div>
              </div>
              <div className="glass-panel p-8 rounded-2xl mb-8">
                <p className="font-sans text-nat-paper/90 text-lg leading-relaxed">{currentTour.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="glass-panel p-8 rounded-2xl">
                  <h3 className="font-mono text-nat-biolum text-xs tracking-widest mb-6 flex items-center gap-2"><MapPin className="w-4 h-4" />ITINERARY</h3>
                  <ul className="space-y-4">
                    {(currentTour.itinerary || []).map((item, i) => (
                      <li key={i} className="flex gap-4 text-nat-paper/80">
                        <span className="font-mono text-nat-biolum text-xs mt-1">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-sans text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-panel p-8 rounded-2xl">
                  <h3 className="font-mono text-nat-biolum text-xs tracking-widest mb-6 flex items-center gap-2"><Star className="w-4 h-4" />HIGHLIGHTS</h3>
                  <ul className="space-y-3">
                    {(currentTour.highlights || []).map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-nat-paper/80">
                        <span className="w-2 h-2 bg-nat-biolum rounded-full flex-shrink-0" />
                        <span className="font-sans text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="text-center">
                <button onClick={() => { setTourModalId(null); switchTab('contact'); }}
                  className="inline-block rounded-full p-[1px] spotlight-btn magnetic-element">
                  <span className="spotlight-content px-8 py-4 bg-nat-black rounded-full text-sm font-mono uppercase tracking-widest text-nat-biolum hover:text-white transition-colors flex items-center gap-3">
                    <Send className="w-4 h-4" /> Inquire About This Tour
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {currentBlog && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto">
          <button onClick={() => setBlogModalId(null)} className="fixed top-6 right-6 z-[101] text-white hover:text-nat-biolum glass-panel w-12 h-12 rounded-full flex items-center justify-center">
            <X className="w-6 h-6" />
          </button>
          <div className="min-h-screen py-20 px-6">
            <article className="max-w-3xl mx-auto">
              <header className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="glass-panel px-4 py-2 rounded-full font-mono text-xs text-nat-biolum">{currentBlog.date}</span>
                  <span className="glass-panel px-4 py-2 rounded-full font-mono text-xs text-nat-sage">{currentBlog.readTime}</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl text-nat-paper leading-tight mb-6">{currentBlog.title}</h1>
                <p className="font-sans text-nat-paper/70 text-lg italic">{currentBlog.description}</p>
              </header>
              <div className="glass-panel p-8 md:p-12 rounded-2xl">
                <div className="prose prose-invert max-w-none">
                  {(currentBlog.content || '').split('\n\n').filter(p => p.trim()).map((p, i) => (
                    <p key={i} className="font-sans text-nat-paper/85 text-base leading-relaxed mb-6">{p}</p>
                  ))}
                </div>
              </div>
              <footer className="mt-12 text-center">
                <div className="glass-panel inline-flex items-center gap-4 px-6 py-4 rounded-full">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-nat-biolum/30 relative">
                    <OptImage src={admin.profile.image} alt={admin.profile.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="text-left">
                    <div className="font-serif text-nat-paper">{admin.profile.name}</div>
                    <div className="font-mono text-xs text-nat-sage">{admin.profile.bio}</div>
                  </div>
                </div>
              </footer>
            </article>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-[100003] bg-black/90 backdrop-blur-xl flex items-center justify-center">
          <div className="glass-panel p-8 rounded-2xl max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="font-serif italic text-2xl text-nat-paper mb-2">N.D. Admin</div>
              <p className="font-mono text-xs text-nat-sage">
                {passwordMode === 'set' ? 'Set up your admin password' : 'Enter your password to access admin'}
              </p>
            </div>
            {passwordMode === 'set' ? (
              <div>
                <div className="mb-4">
                  <label className="admin-label">Set Admin Password</label>
                  <input type="password" id="new-password" className="admin-input" placeholder="Enter password (min 4 chars)" />
                </div>
                <div className="mb-6">
                  <label className="admin-label">Confirm Password</label>
                  <input type="password" id="confirm-password" className="admin-input" placeholder="Confirm password" />
                </div>
                <button onClick={() => {
                  const newPass = (document.getElementById('new-password') as HTMLInputElement).value;
                  const confirmPass = (document.getElementById('confirm-password') as HTMLInputElement).value;
                  if (newPass.length < 4) { alert('Password must be at least 4 characters'); return; }
                  if (newPass !== confirmPass) { alert('Passwords do not match'); return; }
                  const hash = simpleHash(newPass);
                  setPasswordHash(hash);
                  saveToFirebase(admin, hash);
                  setPasswordModalOpen(false);
                  setAdminOpen(true);
                }} className="admin-btn w-full justify-center">Set Password</button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <label className="admin-label">Enter Password</label>
                  <input type="password" id="login-password" className="admin-input" placeholder="Enter admin password"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const password = (document.getElementById('login-password') as HTMLInputElement).value;
                        if (simpleHash(password) === passwordHash) { setPasswordModalOpen(false); setAdminOpen(true); }
                        else alert('Incorrect password');
                      }
                    }} />
                </div>
                <button onClick={() => {
                  const password = (document.getElementById('login-password') as HTMLInputElement).value;
                  if (simpleHash(password) === passwordHash) { setPasswordModalOpen(false); setAdminOpen(true); }
                  else alert('Incorrect password');
                }} className="admin-btn w-full justify-center">Login</button>
              </div>
            )}
            <button onClick={() => setPasswordModalOpen(false)} className="mt-4 text-nat-sage hover:text-nat-paper text-xs font-mono w-full text-center">Cancel</button>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {adminOpen && (
        <div className="admin-dashboard open">
          <div className="admin-sidebar">
            <div className="px-6 pb-6 mb-4 border-b border-white/5">
              <div className="font-serif italic text-xl text-nat-paper">N.D. Admin</div>
              <div className="font-mono text-[10px] text-nat-sage mt-1">CTRL + SHIFT + A to close</div>
            </div>
            {[
              { id: 'overview', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
              { id: 'site', icon: <Settings className="w-4 h-4" />, label: 'Site Settings' },
              { id: 'home', icon: <HomeIcon className="w-4 h-4" />, label: 'Home Page' },
              { id: 'about', icon: <User className="w-4 h-4" />, label: 'About Page' },
              { id: 'gallery', icon: <ImageIcon className="w-4 h-4" />, label: 'Gallery' },
              { id: 'tours', icon: <Map className="w-4 h-4" />, label: 'Tours' },
              { id: 'blogs', icon: <FileText className="w-4 h-4" />, label: 'Blogs' },
              { id: 'testimonials', icon: <MessageSquare className="w-4 h-4" />, label: 'Testimonials' },
              { id: 'contact', icon: <Mail className="w-4 h-4" />, label: 'Contact Settings' },
              { id: 'submissions', icon: <Inbox className="w-4 h-4" />, label: 'Form Submissions' },
            ].map(item => (
              <div key={item.id} className={`admin-sidebar-item ${adminPage === item.id ? 'active' : ''}`}
                onClick={() => setAdminPage(item.id)}>
                {item.icon} {item.label}
                {item.id === 'submissions' && (
                  <span className="ml-auto bg-nat-biolum/20 text-nat-biolum text-[10px] px-2 py-0.5 rounded-full">{submissions.length}</span>
                )}
              </div>
            ))}
            <div className="mt-auto px-4 pt-4 border-t border-white/5">
              <button onClick={() => setAdminOpen(false)} className="admin-btn w-full justify-center">
                <X className="w-4 h-4" /> Close Dashboard
              </button>
            </div>
          </div>
          <div className="admin-main">
            {/* Admin Overview */}
            {adminPage === 'overview' && (
              <div>
                <h1 className="font-serif text-3xl text-nat-paper mb-6">Dashboard Overview</h1>
                <div className="admin-grid">
                  {[
                    { icon: <ImageIcon className="w-6 h-6 text-nat-biolum" />, stat: admin.gallery.length, label: 'Gallery Images' },
                    { icon: <Map className="w-6 h-6 text-nat-biolum" />, stat: admin.tours.length, label: 'Active Tours' },
                    { icon: <MessageSquare className="w-6 h-6 text-nat-biolum" />, stat: admin.testimonials.length, label: 'Testimonials' },
                    { icon: <Inbox className="w-6 h-6 text-nat-biolum" />, stat: submissions.length, label: 'Form Submissions' },
                  ].map((card, i) => (
                    <div key={i} className="admin-card">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-nat-biolum/10 flex items-center justify-center">{card.icon}</div>
                        <div>
                          <div className="font-serif text-2xl text-nat-paper">{card.stat}</div>
                          <div className="font-mono text-[10px] text-nat-sage">{card.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Submissions */}
            {adminPage === 'submissions' && (
              <div>
                <h1 className="font-serif text-3xl text-nat-paper mb-6">Form Submissions</h1>
                <div className="admin-card">
                  <div className="admin-card-title">All Submissions ({submissions.length})</div>
                  {submissions.length === 0 ? (
                    <div className="text-center py-12 text-nat-sage"><Inbox className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No submissions yet</p></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="admin-table">
                        <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Destination</th><th>Status</th></tr></thead>
                        <tbody>
                          {submissions.map(sub => (
                            <tr key={sub.id}>
                              <td>{sub.date}</td><td><strong>{sub.name}</strong></td><td>{sub.email}</td>
                              <td>{sub.destination}</td><td><span className={`status-badge status-${sub.status}`}>{sub.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Placeholder for other admin pages - same structure as original */}
            {!['overview', 'submissions'].includes(adminPage) && (
              <div>
                <h1 className="font-serif text-3xl text-nat-paper mb-6">{adminPage.charAt(0).toUpperCase() + adminPage.slice(1)} Settings</h1>
                <div className="admin-card">
                  <div className="admin-card-title">Edit {adminPage}</div>
                  <p className="text-nat-sage text-sm">Admin editing panel for {adminPage}. Use Ctrl+Shift+A to toggle.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
