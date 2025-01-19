'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-800 via-blue-800 to-blue-900">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl mx-4 flex">
        {/* Left Side - SignUp */}
        <div className="w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-12 text-white flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold mb-4">SignUp</h2>
          <p className="text-xl mb-8 text-center">SignUp Now To Connect With Us!</p>
          <button className="px-12 py-3 border-2 border-white rounded-full text-white hover:bg-white hover:text-blue-600 transition-colors text-lg">
            SignUp
          </button>
        </div>

        {/* Right Side - Sign In */}
        <div className="w-1/2 bg-white p-12">
          <div className="max-w-sm mx-auto">
            <h2 className="text-4xl font-bold text-teal-600 mb-8 text-center">Sign In</h2>
            
            {/* Social Login */}
            <div className="flex justify-center space-x-4 mb-8">
              <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                <span className="text-xl">G</span>
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                <span className="text-xl">f</span>
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                <span className="text-xl">in</span>
              </button>
            </div>

            <div className="text-center text-gray-500 mb-8">
              or use email to sign in:
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}
              
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 text-white rounded-full py-3 font-medium hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}