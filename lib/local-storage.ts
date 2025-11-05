import { promises as fs } from 'fs'
import path from 'path'

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

export async function uploadFile(
  buffer: Buffer,
  folder: string,
  filename: string,
  contentType: string
): Promise<string> {
  const folderPath = path.join(uploadsDir, folder)
  await ensureDirectoryExists(folderPath)

  const filePath = path.join(folderPath, filename)
  await fs.writeFile(filePath, buffer)

  return `/uploads/${folder}/${filename}`
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath)
    await fs.unlink(fullPath)
    return true
  } catch (error) {
    if ((error as any)?.code !== 'ENOENT') {
      console.error('Delete file error:', error)
    }
    return false
  }
}

export function getFileUrl(folder: string, filename: string): string {
  return `/uploads/${folder}/${filename}`
}

export function extractFilenameFromUrl(url: string): string | null {
  if (!url) return null
  
  const match = url.match(/\/uploads\/(.+)$/)
  if (match) {
    return match[1]
  }
  
  return null
}
