# Naturalist Diaries - Next.js Complete Conversion

## 🚀 **COMPLETE PROJECT - READY TO DEPLOY**

This is a **full conversion** of your HTML website to Next.js with:
- ✅ ALL animations and effects (GSAP)
- ✅ Firebase integration
- ✅ Admin dashboard
- ✅ All modals (Tour, Blog, Lightbox, Password)
- ✅ Contact form
- ✅ Mobile responsive
- ✅ Image optimization
- ✅ Production-ready

---

## 📦 **Installation**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🗂️ **File Structure**

```
naturalist-diaries/
├── app/
│   ├── layout.js          # Root layout with fonts
│   ├── page.js            # Main page component
│   └── globals.css        # All custom CSS (COMPLETE)
├── components/
│   ├── Navigation.js      # Nav with pill animation
│   ├── Footer.js          # Social links footer
│   ├── Loader.js          # Loading animation
│   ├── HomeSection.js     # Hero section
│   ├── AboutSection.js    # About with image
│   ├── GallerySection.js  # Gallery with categories & grid
│   ├── ToursSection.js    # Tours with testimonials
│   ├── BlogsSection.js    # Blog list
│   ├── ContactSection.js  # Contact form
│   ├── Lightbox.js        # Image lightbox with nav
│   ├── TourModal.js       # Tour detail modal
│   ├── BlogModal.js       # Blog detail modal
│   ├── PasswordModal.js   # Admin password modal
│   └── AdminDashboard.js  # Full admin panel
├── lib/
│   ├── firebase.js        # Firebase config & functions
│   ├── adminData.js       # Default ADMIN data
│   └── utils.js           # Helper functions
├── hooks/
│   ├── useGsap.js         # GSAP animations hook
│   ├── useTilt.js         # 3D tilt effect hook
│   └── useMagnetic.js     # Magnetic hover hook
└── public/
    └── (your images)
```

---

## 🎨 **Features Included**

### **Effects & Animations**
- ✅ GSAP page transitions
- ✅ 3D tilt cards
- ✅ Magnetic hover effects
- ✅ Spotlight buttons
- ✅ Text reveal animations
- ✅ Shimmer text effect
- ✅ Glow pulse
- ✅ Float animations
- ✅ Border glow
- ✅ Nav pill slide animation

### **Sections**
- ✅ Home (with profile card)
- ✅ About (experience, specialties)
- ✅ Gallery (categories, tags, Fibonacci grid, lightbox)
- ✅ Tours (with testimonials)
- ✅ Blogs (with full modal view)
- ✅ Contact (full form with validation)

### **Admin Dashboard**
- ✅ Password protection
- ✅ Gallery management
- ✅ Tours management
- ✅ Blogs management
- ✅ Testimonials management
- ✅ Site settings
- ✅ Background images
- ✅ Form submissions view
- ✅ Export to CSV

### **Mobile Responsive**
- ✅ Category cards stack vertically
- ✅ Collection view 2-column grid
- ✅ Touch-friendly navigation
- ✅ Mobile-optimized images

---

## 🔑 **Admin Access**

Press **`Ctrl + Shift + A`** to open admin dashboard

First time: Set a password (min 4 characters)
Next times: Enter your password

---

## 🔥 **Firebase Setup**

Your Firebase config is already included. The app will:
1. Load data from Firestore on startup
2. Auto-save when you edit in admin
3. Store form submissions

---

## 🎯 **Key Components Breakdown**

### **1. Gallery System**
- Category carousel (horizontal scroll on desktop, vertical stack on mobile)
- Fibonacci grid layout for images
- Tag filtering
- Lightbox with keyboard navigation (← →)
- Collection view vs Category view

### **2. Tour System**
- Tour cards with hover effects
- Detail modal with itinerary & highlights
- Testimonials section
- Magnetic hover on CTA buttons

### **3. Blog System**
- Blog list with hover effects
- Full-screen modal with content
- Author card at bottom

### **4. Contact Form**
- Full validation
- Captcha (12 + 12 = 24)
- Firebase storage
- Success message

---

## 🚀 **Deploy to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo and auto-deploy
```

---

## 📝 **Customization**

### Change Content
Edit `lib/adminData.js` or use the admin dashboard (Ctrl+Shift+A)

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  'nat-black': '#050706',
  'nat-paper': '#E3D5CA',
  // ... etc
}
```

### Change Fonts
Edit `app/layout.js`:
```js
import { Playfair_Display, Cinzel } from 'next/font/google'
```

---

## ⚡ **Performance Optimizations**

- Next.js Image component (automatic WebP, lazy loading)
- Code splitting by route
- GSAP tree-shaking
- Font optimization
- CSS minification
- Static generation where possible

---

## 🐛 **Troubleshooting**

### Images not loading?
- Check `next.config.js` → `images.domains`
- Add your image CDN domains

### Admin not saving?
- Check Firebase credentials in `lib/firebase.js`
- Check browser console for errors

### Animations not working?
- Make sure GSAP is installed: `npm install gsap`
- Check browser console for errors

---

## 📊 **What's Different from HTML?**

1. **Faster Loading**: Next.js optimizes images automatically
2. **Better SEO**: Server-side rendering
3. **Code Splitting**: Only loads what's needed
4. **Hot Reload**: Changes appear instantly in dev mode
5. **Production Build**: Optimized bundle for deployment

---

## 🎉 **You're All Set!**

Run `npm run dev` and open http://localhost:3000

Everything from your HTML is here - same look, same feel, just faster! 🚀
