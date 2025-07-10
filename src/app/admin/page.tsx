'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Blog = {
  id: number
  title: string
  content: string
  createdAt: string
}

export default function AdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch('/api/blogs')
      const data = await res.json()
      setBlogs(data)
    }

    fetchBlogs()
  }, [])

  return (
    <main className="max-w-3xl mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">Admin Blog Dashboard</h1>
      <ul className="space-y-4">
        {blogs.map((blog) => (
          <li key={blog.id} className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-bold">{blog.title}</h2>
            <p className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
            <p>{blog.content.substring(0, 100)}...</p>
            {/* Later: Add Edit & Delete buttons here */}
            <div className="flex gap-2 mt-2">
                <Link
                    href={`/admin/edit/${blog.id}`}
                    className="text-blue-600 underline text-sm"
                >
                    Edit
                </Link>
                <button
                    onClick={async () => {
                    if (!confirm('Delete this blog?')) return
                    const token = localStorage.getItem('token')
                    await fetch(`/api/blogs/${blog.id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    location.reload()
                    }}
                    className="text-red-600 underline text-sm"
                >
                    Delete
                </button>
                </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
