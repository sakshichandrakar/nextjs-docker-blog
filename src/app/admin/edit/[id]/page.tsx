'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`/api/blogs`)
      const data = await res.json()
      const blog = data.find((b: any) => b.id === parseInt(id))
      setTitle(blog.title)
      setContent(blog.content)
    }
    fetchBlog()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    })
    router.push('/admin')
  }

  return (
    <main className="max-w-2xl mx-auto p-6 mt-12 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </main>
  )
}
