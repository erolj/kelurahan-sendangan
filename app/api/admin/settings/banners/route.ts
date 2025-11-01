import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const key = formData.get('key') as string

    if (!file || !key) {
      return NextResponse.json({ error: 'File and key are required' }, { status: 400 })
    }

    const validKeys = [
      'heroImage',
      'beritaBanner',
      'galeriBanner',
      'potensiBanner',
      'profilBanner',
      'strukturBanner',
      'petaBanner'
    ]

    if (!validKeys.includes(key)) {
      return NextResponse.json({ error: 'Invalid banner key' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const filename = `${key}-${timestamp}.${file.name.split('.').pop()}`
    const filepath = join(process.cwd(), 'public', 'uploads', 'banners', filename)

    await writeFile(filepath, buffer)

    const url = `/uploads/banners/${filename}`

    const existingSetting = await prisma.setting.findUnique({
      where: { key }
    })

    if (existingSetting && existingSetting.value && existingSetting.value.startsWith('/uploads/banners/')) {
      try {
        const oldFilepath = join(process.cwd(), 'public', existingSetting.value)
        await unlink(oldFilepath)
      } catch (err) {
        console.error('Failed to delete old banner:', err)
      }
    }

    await prisma.setting.upsert({
      where: { key },
      create: { key, value: url },
      update: { value: url }
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Banner upload error:', error)
    return NextResponse.json({ error: 'Failed to upload banner' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    const setting = await prisma.setting.findUnique({
      where: { key }
    })

    if (setting && setting.value && setting.value.startsWith('/uploads/banners/')) {
      try {
        const filepath = join(process.cwd(), 'public', setting.value)
        await unlink(filepath)
      } catch (err) {
        console.error('Failed to delete banner file:', err)
      }
    }

    await prisma.setting.delete({
      where: { key }
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Banner delete error:', error)
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}
