import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import path if needed

// ✅ PUT method
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { title, content } = await req.json();

  try {
    const updated = await prisma.blog.update({
      where: { id: parseInt(params.id) },
      data: { title, content },
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error('Update error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}

// ✅ DELETE method
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deleted = await prisma.blog.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(deleted);
  } catch (err: unknown) {
    console.error('Delete error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 400 });
  }
}
