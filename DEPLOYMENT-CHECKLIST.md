# ✅ PRE-DEPLOYMENT VERIFICATION CHECKLIST

## Before deploying to Vercel, verify these critical items:

### 1. **Install Dependencies** ✅
```bash
npm install
```
Expected: No errors, all packages installed

### 2. **Run Development Server** ✅
```bash
npm run dev
```
Expected: Server starts on port 3000

### 3. **Test Navigation** ✅
- [ ] Click each tab (Home, About, Gallery, Tours, Blogs, Contact)
- [ ] Verify smooth transitions
- [ ] Check pill indicator moves correctly

### 4. **Test Gallery** ✅
#### Category View (Default)
- [ ] Scroll horizontally on desktop
- [ ] See vertical stack on mobile
- [ ] Category cards display properly

#### Collection View
- [ ] Click a category card
- [ ] See Fibonacci grid on desktop
- [ ] See 2-column grid (180px rows) on mobile
- [ ] Click "Back to Categories"

#### Tags
- [ ] Click a tag filter
- [ ] See filtered images
- [ ] Clear filter works

### 5. **Test Lightbox** ✅
- [ ] Click any image
- [ ] See full screen view
- [ ] Press ← → arrows to navigate
- [ ] Press Esc to close
- [ ] Counter shows correct image number

### 6. **Test Tours** ✅
- [ ] Click a tour card
- [ ] See modal with itinerary
- [ ] See testimonials section
- [ ] Close modal works

### 7. **Test Blogs** ✅
- [ ] Click a blog
- [ ] See full content
- [ ] Close modal works

### 8. **Test Contact Form** ✅
- [ ] Fill all required fields
- [ ] Answer captcha (12 + 12 = 24)
- [ ] Submit form
- [ ] See success message
- [ ] Check Firebase for submission

### 9. **Test Admin Dashboard** ✅
#### Access
- [ ] Press Ctrl+Shift+A (or Cmd+Shift+A)
- [ ] Set password (first time)
- [ ] Enter password (subsequent times)

#### Gallery Management
- [ ] Add a new image
- [ ] Edit an existing image
- [ ] Delete an image
- [ ] Changes save to Firebase

#### Tours Management
- [ ] Add a new tour
- [ ] Edit existing tour
- [ ] Delete tour
- [ ] Changes persist

#### Blogs Management
- [ ] Add a blog
- [ ] Edit blog
- [ ] Delete blog
- [ ] Content displays correctly

#### Testimonials
- [ ] Add testimonial
- [ ] Edit testimonial
- [ ] Delete testimonial

#### Form Submissions
- [ ] View submissions table
- [ ] Export to CSV works
- [ ] Update status works
- [ ] CSV downloads properly

#### Site Settings
- [ ] Update site name
- [ ] Change logo
- [ ] Update social links
- [ ] Change backgrounds
- [ ] All changes save

### 10. **Test Mobile Responsiveness** ✅
Test on actual device or browser DevTools:
- [ ] Home centers properly
- [ ] Navigation stacks vertically
- [ ] Gallery categories stack vertically
- [ ] Collection view shows 2-column grid
- [ ] Forms work on mobile
- [ ] Admin dashboard usable on mobile

### 11. **Test Keyboard Shortcuts** ✅
- [ ] Ctrl+Shift+A opens admin
- [ ] Esc closes modals
- [ ] ← → navigate lightbox
- [ ] Tab navigation works in forms

### 12. **Test Animations** ✅
- [ ] Page transitions smooth
- [ ] Pill indicator elastic animation
- [ ] Tilt effects on hover
- [ ] Magnetic hover on buttons
- [ ] Loading animation on first load

### 13. **Firebase Integration** ✅
- [ ] Admin saves to Firebase
- [ ] Form submissions save to Firebase
- [ ] Data persists after refresh
- [ ] Multiple users can't conflict

### 14. **Performance Check** ✅
```bash
npm run build
npm start
```
- [ ] Build completes without errors
- [ ] Production mode runs correctly
- [ ] Images load optimized (WebP)
- [ ] No console errors

### 15. **Browser Testing** ✅
Test in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

---

## 🚀 DEPLOY TO VERCEL

Once all checks pass:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Done!
```

Or use Vercel Dashboard:
1. Push to GitHub
2. Import repo on vercel.com
3. Auto-deploy on every push

---

## 🐛 TROUBLESHOOTING

### Admin not saving
1. Check Firebase config in `lib/firebase.js`
2. Verify Firebase project is active
3. Check browser console for errors
4. Make sure you clicked "Save to Firebase"

### Gallery drag not working
1. This works in production build
2. Run: `npm run build && npm start`
3. Test again

### Images not loading
1. Check `next.config.js` domains
2. Add your image domains
3. Restart dev server

### Mobile grid not showing
1. Check if body has `collection-view` class
2. Inspect with DevTools
3. Verify CSS is loaded

---

## ✅ VERIFICATION COMPLETE

When all items checked:
- ✅ Ready for production
- ✅ Deploy to Vercel
- ✅ Share with the world!

🦁 Happy deploying! 📸
