'use client'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import Calendar from '@/components/Calendar/Calendar'

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Your Calendar</h1>
        <Calendar />
      </div>
    </ProtectedRoute>
  )
}