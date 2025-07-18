import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, content } = await req.json()

    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
      },
    })

    return NextResponse.json(newBlog, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('POST error:', err.message)
    }
    return NextResponse.json({ error: 'Invalid Token' }, { status: 401 })
  }
}

export async function GET() {
    try {
      const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(blogs)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('GET error:', err.message)
      }
      return NextResponse.json({ error: 'Error fetching blogs' }, { status: 500 })
    }
  }
