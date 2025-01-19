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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left side - SignUp */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-8 md:p-12 text-white flex flex-col justify-center items-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center">SignUp</h2>
          <p className="text-base md:text-lg mb-6 md:mb-8 text-center">SignUp Now To Connect With Us!</p>
          <button
            onClick={() => setMode('register')}
            className="px-6 md:px-8 py-2 md:py-3 border-2 border-white rounded-full text-white hover:bg-white hover:text-blue-600 transition-colors text-sm md:text-base"
          >
            SignUp
          </button>
        </div>

        {/* Right side - Sign In */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center md:text-left">Sign In</h2>
            
            {/* Social Login Buttons */}
            <div className="flex justify-center space-x-4 mb-6 md:mb-8">
              <button className="p-2 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
              </button>
              <button className="p-2 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="p-2 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </button>
            </div>

            <div className="text-center text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
              or use email to sign in:
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors pl-10 text-sm md:text-base"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors pl-10 text-sm md:text-base"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 md:py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 text-sm md:text-base"
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>
            </form>

            {/* Mobile Sign Up Link */}
            <div className="mt-6 text-center md:hidden">
              <button
                onClick={() => setMode('register')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}