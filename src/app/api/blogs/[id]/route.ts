import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const token = auth.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET!)

    const { title, content } = await req.json()

    const updated = await prisma.blog.update({
      where: { id: parseInt(params.id) },
      data: { title, content },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('Update error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const token = auth.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET!)

    await prisma.blog.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    console.error('Update error:', err)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 400 })
  }
}
