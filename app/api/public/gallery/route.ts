import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const galleryItems = await prisma.galleryItem.findMany({
      select: {
        id: true,
        url: true,
        caption: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json(galleryItems)
  } catch (error) {
    console.error('Public gallery fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}
