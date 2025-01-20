'use client'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import Calendar from '@/components/Calendar/Calendar'

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen p-4">
        <Calendar />
      </main>
    </ProtectedRoute>
  )
} 