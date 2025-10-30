"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles } from "lucide-react"
import { EmptyState } from "@/components/empty-state"

interface Potential {
  id: number
  name: string
  desc: string | null
  emoji: string | null
  imageUrl: string | null
  createdAt: string
}

export default function PotensiPage() {
  const [potentials, setPotentials] = useState<Potential[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPotentials = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/public/potentials")
        if (!res.ok) throw new Error("Failed to fetch potentials")

        const data = await res.json()
        setPotentials(data)
      } catch (error) {
        console.error("Error fetching potentials:", error)
        setPotentials([])
      } finally {
        setLoading(false)
      }
    }

    fetchPotentials()
  }, [])

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"
            alt="Potensi Unggulan"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Potensi Unggulan Kelurahan</h1>
          <p className="text-slate-300 mt-2">Produk dan wisata unggulan Kelurahan Sendangan</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : potentials.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Belum Ada Potensi Unggulan"
              description="Saat ini belum ada data potensi unggulan yang tersedia. Silakan kembali lagi nanti untuk melihat berbagai potensi menarik dari Kelurahan Sendangan."
              actionLabel="Kembali ke Beranda"
              actionHref="/"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {potentials.map((potential) => (
                <div
                  key={potential.id}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-56 w-full bg-slate-100">
                    {potential.imageUrl ? (
                      <Image
                        src={potential.imageUrl}
                        alt={potential.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-6xl">{potential.emoji || "📍"}</span>
                      </div>
                    )}
                    {potential.emoji && potential.imageUrl && (
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
                        <div className="text-6xl">{potential.emoji}</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 text-xl mb-3 text-center">
                      {potential.name}
                    </h3>
                    <p className="text-slate-600 text-center leading-relaxed">
                      {potential.desc || ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
