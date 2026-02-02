'use client'

import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import gsap from 'gsap'
import { saveSubmissionToFirebase } from '@/lib/firebase'

export default function ContactSection({ active, data, formOptions, tours, formSubmissions, setFormSubmissions }) {
  const sectionRef = useRef(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (!active || !sectionRef.current) return

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }, [active])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate captcha
    const captchaInput = e.target.querySelector('#captcha-input')
    if (parseInt(captchaInput.value) !== 24) {
      alert('Incorrect captcha. Please try again.')
      return
    }

    // Create submission object
    const formData = new FormData(e.target)
    const submission = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      status: 'new',
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      destination: formData.get('destination'),
      dateFrom: formData.get('dateFrom'),
      dateTo: formData.get('dateTo'),
      datesFlexible: formData.get('datesFlexible') === 'on',
      travellers: formData.get('travellers'),
      budgetIndia: formData.get('budgetIndia'),
      budgetAfrica: formData.get('budgetAfrica'),
      description: formData.get('description'),
      contactMethod: formData.get('contactMethod'),
      referral: formData.get('referral'),
      updates: formData.get('updates') === 'on'
    }

    // Add to state
    setFormSubmissions([...formSubmissions, submission])
    
    // Save to Firebase
    await saveSubmissionToFirebase(submission)

    // Show success message
    alert(data.successMessage)
    
    // Reset form
    e.target.reset()
  }

  if (!active) return null

  return (
    <section ref={sectionRef} id="contact" className="view-section active">
      <div className="section-content px-6 md:px-12">
        <div className="max-w-4xl mx-auto glass-panel p-6 md:p-8 rounded-2xl">
          <div className="text-center mb-6">
            <h2 
              className="font-serif text-4xl md:text-5xl text-nat-paper mb-4 reveal-text"
              dangerouslySetInnerHTML={{ 
                __html: data.title.replace('Experience', '<span class="italic text-nat-sage">Experience</span>') 
              }}
            />
            <p className="font-sans text-nat-paper/80 text-sm">
              {data.subtitle}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  required
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                  Your Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  required
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            {/* Email & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                  Email ID *
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                  Where are you from *
                </label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  required
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                Preferred Destination *
              </label>
              <select name="destination" className="form-input" required>
                <option value="" disabled>Select Destination</option>
                {formOptions.destinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            {/* Travel Dates */}
            <div className="glass-panel p-4 rounded-lg border border-white/5 bg-white/5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-4">
                Travel Dates
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-xs text-nat-paper/70 mb-1 block">From:</label>
                  <input type="date" name="dateFrom" className="form-input" />
                </div>
                <div>
                  <label className="text-xs text-nat-paper/70 mb-1 block">To:</label>
                  <input type="date" name="dateTo" className="form-input" />
                </div>
                <div className="flex items-center gap-2 h-full pb-3">
                  <input
                    type="checkbox"
                    id="no-dates"
                    name="datesFlexible"
                    className="custom-checkbox"
                  />
                  <label htmlFor="no-dates" className="text-xs text-nat-paper cursor-pointer">
                    Dates not decided
                  </label>
                </div>
              </div>
            </div>

            {/* Travellers */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                Total Travellers *
              </label>
              <input
                type="number"
                name="travellers"
                min="1"
                className="form-input"
                required
                placeholder="1"
              />
            </div>

            {/* Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                  Budget (India) *
                </label>
                <select name="budgetIndia" className="form-input" required>
                  <option value="" disabled>Select</option>
                  {formOptions.budgetIndia.map(budget => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                  Budget (Africa) *
                </label>
                <select name="budgetAfrica" className="form-input" required>
                  <option value="" disabled>Select</option>
                  {formOptions.budgetAfrica.map(budget => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                Describe your ideal trip *
              </label>
              <textarea
                name="description"
                className="form-input h-32 resize-none"
                placeholder="Tell us about your dream expedition..."
                required
              />
            </div>

            {/* Contact Method */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                Contact Method *
              </label>
              <select name="contactMethod" className="form-input" required>
                <option value="" disabled>Select</option>
                {formOptions.contactMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* Referral */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                How did you hear about us?
              </label>
              <select name="referral" className="form-input">
                <option value="" disabled>Select</option>
                {formOptions.referralSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            {/* Captcha & Checkboxes */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <label className="font-mono text-xs text-nat-sage">
                  Captcha: What is 12 + 12? *
                </label>
                <input
                  type="number"
                  id="captcha-input"
                  className="form-input w-24 text-center"
                  required
                  placeholder="?"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="updates"
                  name="updates"
                  className="custom-checkbox"
                />
                <label htmlFor="updates" className="text-xs text-nat-paper cursor-pointer">
                  Send me weekly updates
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  className="custom-checkbox"
                  required
                />
                <label htmlFor="privacy" className="text-xs text-nat-paper cursor-pointer">
                  I agree to the Privacy Policy *
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="relative w-full mt-8 rounded-lg p-[1px] spotlight-btn cursor-pointer magnetic-element">
              <button
                type="submit"
                className="spotlight-content w-full py-6 bg-nat-black rounded-lg text-nat-biolum font-mono text-sm tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                SUBMIT INQUIRY
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
