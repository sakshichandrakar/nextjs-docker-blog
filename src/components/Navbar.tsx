'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand fw-bold">
          📝 Blog App
        </Link>
        <div className="d-flex align-items-center gap-3">
          <Link href="/" className="nav-link text-white">
            Home
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/admin" className="nav-link text-white">
                Admin
              </Link>
              <Link href="/admin/create" className="nav-link text-white">
                Create
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="nav-link text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
