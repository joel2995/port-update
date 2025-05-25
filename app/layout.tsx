import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JR Port Updater',
  description: 'Mr JR Portfolio Updater',
  generator: 'JR',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
