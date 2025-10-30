"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Loader2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StructureMember {
  id: number
  jabatan: string
  nama: string
  nip: string | null
  lingkungan: string | null
  parentId: number | null
  order: number
  children?: StructureMember[]
}

interface HierarchyItem extends StructureMember {
  level: number
}

export default function StrukturPage() {
  const [members, setMembers] = useState<StructureMember[]>([])
  const [hierarchyList, setHierarchyList] = useState<HierarchyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStructure()
  }, [])

  const fetchStructure = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/structure')
      const data = await res.json()
      setMembers(data)
      
      const tree = buildTree(data)
      const flat = flattenTree(tree)
      setHierarchyList(flat)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat struktur",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const buildTree = (items: StructureMember[]): StructureMember[] => {
    const map = new Map<number, StructureMember>()
    const roots: StructureMember[] = []

    items.forEach(item => {
      map.set(item.id, { ...item, children: [] })
    })

    items.forEach(item => {
      const node = map.get(item.id)!
      if (item.parentId === null) {
        roots.push(node)
      } else {
        const parent = map.get(item.parentId)
        if (parent) {
          parent.children!.push(node)
        }
      }
    })

    return roots
  }

  const flattenTree = (nodes: StructureMember[], level = 0): HierarchyItem[] => {
    const result: HierarchyItem[] = []
    
    nodes.forEach(node => {
      result.push({ ...node, level })
      if (node.children && node.children.length > 0) {
        result.push(...flattenTree(node.children, level + 1))
      }
    })

    return result
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const member = members.find(m => m.id === deleteId)
    const childrenCount = members.filter(m => m.parentId === deleteId).length

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/structure/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: childrenCount > 0 
            ? `Anggota dan ${childrenCount} bawahan berhasil dihapus`
            : "Anggota berhasil dihapus",
        })
        fetchStructure()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus anggota",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const getIndentation = (level: number) => {
    return level * 24
  }

  const getLevelColor = (level: number) => {
    const colors = [
      'border-l-4 border-l-blue-500 bg-blue-50',
      'border-l-4 border-l-green-500 bg-green-50',
      'border-l-4 border-l-purple-500 bg-purple-50',
      'border-l-4 border-l-orange-500 bg-orange-50',
    ]
    return colors[level % colors.length]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Struktur Management</h2>
          <p className="text-slate-600 mt-1">Kelola struktur organisasi pemerintahan</p>
        </div>
        <Link href="/admin/struktur/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Anggota
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Struktur Organisasi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : hierarchyList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-6 mb-4">
                <Users className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada anggota</h3>
              <p className="text-slate-600 mb-4">Tambahkan anggota struktur organisasi</p>
              <Link href="/admin/struktur/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Anggota
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {hierarchyList.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 rounded-lg transition-all ${getLevelColor(member.level)}`}
                  style={{ marginLeft: `${getIndentation(member.level)}px` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{member.jabatan}</h3>
                        {member.level > 0 && (
                          <span className="text-xs text-slate-500">
                            (Level {member.level + 1})
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700">{member.nama}</p>
                      <div className="flex gap-4 mt-1 text-sm text-slate-600">
                        {member.nip && <span>NIP: {member.nip}</span>}
                        {member.lingkungan && <span>Lingkungan: {member.lingkungan}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/admin/struktur/${member.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(member.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Anggota?</AlertDialogTitle>
            <AlertDialogDescription>
              {(() => {
                const member = members.find(m => m.id === deleteId)
                const childrenCount = members.filter(m => m.parentId === deleteId).length
                
                if (childrenCount > 0) {
                  return `Anggota ini memiliki ${childrenCount} bawahan. Semua bawahan juga akan dihapus. Aksi ini tidak dapat dibatalkan.`
                }
                return 'Anggota akan dihapus permanen. Aksi ini tidak dapat dibatalkan.'
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
