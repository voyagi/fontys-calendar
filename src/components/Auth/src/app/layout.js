import '@/app/globals.css'

export const metadata = {
  title: 'Fontys Calendar',
  description: 'A calendar application for Fontys students',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 