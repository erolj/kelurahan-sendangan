"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Newspaper, Search } from "lucide-react"

interface Post {
  id: number
  type: string
  title: string
  body: string | null
  date: string | null
  featuredImage: string | null
  createdAt: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export default function BeritaPage() {
  const [activeTab, setActiveTab] = useState("semua")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
    hasMore: false,
  })

  const fetchPosts = async (page: number = 1, search: string = "") => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (activeTab !== "semua") {
        params.append("category", activeTab.toUpperCase())
      }

      if (search && search.length >= 3) {
        params.append("search", search)
      }

      const res = await fetch(`/api/public/posts?${params}`)
      if (!res.ok) throw new Error("Failed to fetch posts")

      const data = await res.json()
      setPosts(data.posts || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(1, searchQuery)
  }, [activeTab])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPosts(1, searchQuery)
  }

  const handlePageChange = (newPage: number) => {
    fetchPosts(newPage, searchQuery)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return ""
    const plainText = text.replace(/<[^>]*>/g, "")
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + "..."
  }

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070"
            alt="Berita & Pengumuman"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Berita & Pengumuman</h1>
          <p className="text-slate-300 mt-2">Informasi terkini dari Kelurahan Sendangan</p>
        </div>
      </section>

      {/* News Content */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="semua">Semua</TabsTrigger>
              <TabsTrigger value="berita">Berita</TabsTrigger>
              <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari berita atau pengumuman... (min. 3 karakter)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Newspaper className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                {searchQuery.length >= 3
                  ? "Tidak ada hasil pencarian"
                  : activeTab === "semua"
                  ? "Belum ada postingan"
                  : `Belum ada ${activeTab}`}
              </p>
              {searchQuery.length >= 3 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    fetchPosts(1, "")
                  }}
                  className="mt-4"
                >
                  Reset Pencarian
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/berita/${post.id}`}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48 w-full bg-slate-100">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Newspaper className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            post.type === "BERITA"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {post.type === "BERITA" ? "Berita" : "Pengumuman"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(post.date || post.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-lg mb-2">{post.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {truncateText(post.body, 150)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        Math.abs(pageNum - pagination.page) <= 1
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      } else if (
                        pageNum === pagination.page - 2 ||
                        pageNum === pagination.page + 2
                      ) {
                        return (
                          <span key={pageNum} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasMore}
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* Results info */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                Menampilkan {posts.length} dari {pagination.total} postingan
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
