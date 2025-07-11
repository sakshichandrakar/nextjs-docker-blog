'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'

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

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        toast.success('Your blog has been deleted.')
        setBlogs(blogs.filter((b) => b.id !== id))
      } else {
        toast.error('Failed to delete blog.')
      }
    }
  }

  return (
    <div className="container my-1">
      <h1 className="mb-2 fw-bold">Admin Blog Dashboard</h1>
      <div className="row">
        {blogs.map((blog) => (
          <div key={blog.id} className="col-md-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {new Date(blog.createdAt).toLocaleString()}
                </h6>
                <div
                  className="card-text text-truncate overflow-hidden"
                  style={{ maxHeight: '100px' }}
                  dangerouslySetInnerHTML={{
                    __html: blog.content.length > 1000
                      ? blog.content.slice(0, 1000) + '...'
                      : blog.content,
                  }}
                />
                <div className="d-flex gap-3">
                  <Link href={`/admin/edit/${blog.id}`} className="btn btn-sm btn-outline-primary">
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
