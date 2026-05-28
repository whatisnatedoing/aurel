import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aurel — Bespoke Fine Jewellery',
  description: 'Design your perfect engagement ring, wedding band, or promise ring with our 3D ring configurator.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
