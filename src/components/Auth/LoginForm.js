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
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-4 flex items-center">
        <button className="text-2xl">☰</button>
        <h1 className="text-lg ml-4">Fontys Calendar</h1>
        <a href="/calendar-settings" className="text-sm text-gray-400 ml-auto">Calendar Settings</a>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xs">
          <h2 className="text-xl mb-8">Sign in to your account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            
            <div>
              <input
                type="email"
                required
                className="w-full bg-black text-white border-b border-gray-800 py-2 text-sm focus:outline-none focus:border-gray-600"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                type="password"
                required
                className="w-full bg-black text-white border-b border-gray-800 py-2 text-sm focus:outline-none focus:border-gray-600"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white border border-gray-800 rounded py-2 text-sm hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/register" className="text-sm text-gray-400 hover:text-white">
              I don't have an account? Register
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}