'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now, we'll just simulate an auth check
    const checkAuth = async () => {
      try {
        // Simulate auth check
        await new Promise(resolve => setTimeout(resolve, 500))
        setIsAuthenticated(false) // Always redirect to login for now
        setLoading(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : null
} 