import { Blog } from '@prisma/client'
import Link from 'next/link'

// Fetch blogs from the API
async function getBlogs(): Promise<Blog[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blogs')
  }

  return res.json()
}

// Blog Listing Page
export default async function HomePage() {
  const blogs = await getBlogs()

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">📚 Explore Latest Blogs</h1>
        <p className="text-gray-500 mt-2">Read articles from our community and learn something new every day.</p>
      </header>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
<ul className="list-unstyled grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
{blogs.map((blog) => (
            <li
              key={blog.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-3 border border-gray-200"
            >
              <Link href={`/blog/${blog.id}`}>
                <h2 className="text-xl font-semibold text-blue-700 hover:underline">
                  {blog.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                Published on {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {blog.content.length > 150
                  ? blog.content.substring(0, 150) + '...'
                  : blog.content}
              </p>
              <Link
                href={`/blog/${blog.id}`}
                className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium"
              >
                Read more →
              </Link>
            </li>
          ))}
        </ul>

      )}
    </main>
  )
}
