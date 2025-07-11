import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Next Blog App - CRUD Admin Panel',
  description: 'A blog system built with Next.js, Prisma, MySQL, and JWT.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </body>
    </html>
  )
}