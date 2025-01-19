import ProtectedRoute from '../components/Auth/ProtectedRoute'

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Welcome to Fontys Calendar</h1>
      </main>
    </ProtectedRoute>
  )
} 