import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface BlogPageProps {
  params: {
    id: string
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const blog = await prisma.blog.findUnique({
    where: {
      id: parseInt(params.id),
    },
  })

  if (!blog) return notFound()

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          {blog.title}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Published on {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </div>

      <article className="prose prose-lg max-w-none text-justify text-gray-800 leading-relaxed">
        {blog.content}
      </article>
    </main>
  )
}
