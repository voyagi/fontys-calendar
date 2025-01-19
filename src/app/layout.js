import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/Navigation/Navbar'

export const metadata = {
  title: 'Fontys Calendar',
  description: 'Calendar application for Fontys students',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className="h-full">
        <AuthProvider>
          <div className="min-h-full">
            <Navbar />
            <main>
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}