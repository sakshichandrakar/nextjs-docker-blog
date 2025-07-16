'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

    const navItems = [
        { label: 'Dashboard', href: '/admin' },
        { label: 'Create Blog', href: '/admin/create' },
        { label: 'Home', href: '/' },
    ]

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="bg-dark text-white p-2 vh-100" style={{ width: '220px' }}>
                <h4>Admin Panel</h4>
                <ul className="nav flex-column mt-4">
                    {navItems.map(({ label, href }) => (
                        <li className="nav-item mb-2" key={href}>
                            <Link
                                href={href}
                                className={`nav-link ${pathname === href ? 'active text-warning' : 'text-white'}`}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                    <li className="nav-item mb-2 mx-2">
                        <button onClick={handleLogout} className="nav-link btn btn-link text-white p-0">Logout</button>
                    </li>
                </ul>
            </div>

            {/* Main content */}
            <div className="p-4 w-100">
                {children}
            </div>
        </div>
    )
}
