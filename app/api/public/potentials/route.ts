import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const potentials = await prisma.potential.findMany({
      select: {
        id: true,
        name: true,
        desc: true,
        emoji: true,
        imageUrl: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json(potentials)
  } catch (error) {
    console.error('Public potentials fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch potentials' }, { status: 500 })
  }
}
