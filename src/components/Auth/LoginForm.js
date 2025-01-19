'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('login') // 'login' or 'register'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className="text-gray-400 text-sm">
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-100/10 p-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <div className="relative">
              <input
                type="email"
                required
                className="w-full bg-gray-900 text-white border border-gray-800 rounded px-3 py-2 focus:outline-none focus:border-gray-600 text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative">
              <input
                type="password"
                required
                className="w-full bg-gray-900 text-white border border-gray-800 rounded px-3 py-2 focus:outline-none focus:border-gray-600 text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black rounded py-2 font-medium text-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Mode Switch */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign Up" 
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}