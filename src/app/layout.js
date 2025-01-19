import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/Navigation/Navbar'

export const metadata = {
  title: 'Fontys Calendar',
  description: 'Calendar application for Fontys students',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="h-full antialiased">
        <AuthProvider>
          <div className="min-h-full flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <div className="flex-1 w-full max-w-[2000px] mx-auto">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}