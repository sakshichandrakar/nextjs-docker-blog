'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      setIsLoggedIn(true)

      // Call /api/user to get user data
      fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Invalid token')
          return res.json()
        })
        .then((data) => {
          setUserName(data.username || data.email || 'User') // Use name or email
        })
        .catch(() => {
          setIsLoggedIn(false)
          setUserName(null)
          localStorage.removeItem('token')
          router.push('/login')
        })
    } else {
      setIsLoggedIn(false)
      setUserName(null)
    }
  }, [pathname, router])



  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand fw-bold">
          📝 Blog App
        </Link>
        <div className="d-flex align-items-center gap-3">

          {isLoggedIn ? (
            <>
              <Link href="/admin" className="text-white fw-semibold text-decoration-none">
                {userName}
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="nav-link text-white">
                Home
              </Link>
              <Link href="/login" className="nav-link text-white">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}