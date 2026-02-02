'use client'

import { useState, useEffect } from 'react'
import { X, Lock } from 'lucide-react'
import { simpleHash } from '@/lib/utils'

export default function PasswordModal({ open, onClose, passwordHash, setPasswordHash, onSuccess, saveToFirebase }) {
  const [password, setPassword] = useState('')
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setIsSettingPassword(!passwordHash)
      setPassword('')
      setConfirmPassword('')
      setError('')
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open, passwordHash])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isSettingPassword) {
      // Setting new password
      if (password.length < 4) {
        setError('Password must be at least 4 characters')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }

      const hash = simpleHash(password)
      setPasswordHash(hash)
      
      // Save to Firebase
      await saveToFirebase()
      
      setPassword('')
      setConfirmPassword('')
      onSuccess()
    } else {
      // Verifying password
      const hash = simpleHash(password)
      if (hash.toString() === passwordHash.toString()) {
        setPassword('')
        onSuccess()
      } else {
        setError('Incorrect password')
        setPassword('')
      }
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-xl flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-nat-biolum glass-panel w-12 h-12 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="glass-panel p-8 rounded-2xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-nat-biolum/10 border border-nat-biolum/30 mb-4">
            <Lock className="w-8 h-8 text-nat-biolum" />
          </div>
          <h2 className="font-serif text-3xl text-nat-paper mb-2">
            {isSettingPassword ? 'Set Admin Password' : 'Admin Access'}
          </h2>
          <p className="font-mono text-xs text-nat-sage tracking-widest">
            {isSettingPassword 
              ? 'CREATE A PASSWORD TO PROTECT YOUR DASHBOARD' 
              : 'ENTER PASSWORD TO CONTINUE'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
              {isSettingPassword ? 'New Password (min 4 characters)' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter password"
              autoFocus
              required
              minLength={isSettingPassword ? 4 : 1}
            />
          </div>

          {isSettingPassword && (
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-nat-sage block mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Confirm password"
                required
                minLength={4}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg p-[1px] spotlight-btn"
          >
            <span className="spotlight-content w-full py-3 bg-nat-black rounded-lg text-nat-biolum font-mono text-sm tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              {isSettingPassword ? 'SET PASSWORD' : 'UNLOCK'}
            </span>
          </button>
        </form>

        {isSettingPassword && (
          <div className="mt-6 p-4 bg-nat-biolum/5 rounded-lg border border-nat-biolum/20">
            <p className="text-xs text-nat-paper/70 text-center leading-relaxed">
              This password will be encrypted and stored securely. Make sure to remember it - 
              there's no recovery option.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
