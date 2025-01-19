import './globals.css'

export const metadata = {
  title: 'Fontys Calendar',
  description: 'A calendar application for Fontys',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}
