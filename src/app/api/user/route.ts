import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.split(' ')[1]

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)
        if (!payload.id) {
            return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 })
        }

        // Assuming payload has user id
        const user = await prisma.user.findUnique({
            where: { id: Number(payload.id) }, // convert to number if needed
            select: {
                id: true,
                email: true,
                role: true,
                username: true, // ✅ Replace with a valid field name from your Prisma schema
            },
        })

        // return NextResponse.json(payload.id)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error: any) {
        console.error('Prisma error:', error.message || error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }

}
