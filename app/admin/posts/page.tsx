"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: number
  title: string
  type: string
  status: string
  body: string | null
  featuredImage: string | null
  date: string | null
  createdAt: string
  updatedAt: string
}

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [activeTab, statusFilter, searchQuery])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeTab !== 'all') params.append('type', activeTab)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)

      const res = await fetch(`/api/admin/posts?${params}`)
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus post ini?')) return

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "Post berhasil dihapus",
        })
        fetchPosts()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus post",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Posts Management</h2>
          <p className="text-slate-600 mt-1">Kelola berita dan pengumuman</p>
        </div>
        <Link href="/admin/posts/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Post Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="berita">Berita</TabsTrigger>
                  <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">Semua Status</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Cari posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-6 mb-4">
                <Plus className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada posts</h3>
              <p className="text-slate-600 mb-4">
                Mulai dengan membuat post pertama Anda
              </p>
              <Link href="/admin/posts/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Post Baru
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 rounded-lg border p-4 hover:bg-slate-50 transition-colors"
                >
                  {post.featuredImage && (
                    <div className="relative w-24 h-24 rounded overflow-hidden shrink-0">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{post.title}</h3>
                      <Badge variant={post.type === "BERITA" ? "default" : "secondary"}>
                        {post.type}
                      </Badge>
                      <Badge variant={post.status === "PUBLISHED" ? "default" : "outline"}>
                        {post.status}
                      </Badge>
                    </div>
                    {post.body && (
                      <p className="text-sm text-slate-600 line-clamp-2">{post.body}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
