'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

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

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="bg-dark text-white p-2 vh-100" style={{ width: '220px' }}>
                <h4>Admin Panel</h4>
                <ul className="nav flex-column mt-4">
                    <li className="nav-item mb-2">
                        <Link href="/admin" className="nav-link text-white">Dashboard</Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link href="/admin/create" className="nav-link text-white">Create Blog</Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link href="/" className="nav-link text-white">Home</Link>
                    </li>
                     <li className="nav-item mb-2">
                        <Link href="/" className="nav-link text-white" onClick={handleLogout}>Logout</Link>
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
