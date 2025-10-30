"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Users } from "lucide-react"

interface StructureMember {
  id: string
  jabatan: string
  nama: string
  nip: string | null
  lingkungan: string | null
  parentId: string | null
  urutan: number | null
}

export default function StrukturPage() {
  const [members, setMembers] = useState<StructureMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStructure = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/public/structure")
        if (!res.ok) throw new Error("Failed to fetch structure")

        const data = await res.json()
        setMembers(data)
      } catch (error) {
        console.error("Error fetching structure:", error)
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchStructure()
  }, [])

  const getLurah = () => members.find((m) => m.jabatan === "LURAH")
  const getSekretaris = () => members.find((m) => m.jabatan === "SEKRETARIS_LURAH")
  const getKepalaLingkungan = () => members.filter((m) => m.jabatan === "KEPALA_LINGKUNGAN")

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070"
            alt="Struktur Organisasi"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Struktur Pemerintahan</h1>
          <p className="text-slate-300 mt-2">Bagan organisasi Kelurahan Sendangan</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          {loading ? (
            <div className="space-y-12">
              <div className="flex justify-center">
                <Skeleton className="h-20 w-64" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Belum ada data struktur organisasi</p>
            </div>
          ) : (
            <>
              {/* Lurah */}
              {getLurah() && (
                <>
                  <div className="flex justify-center mb-12">
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white px-8 py-6 rounded-lg shadow-lg text-center">
                      <p className="text-sm text-slate-300 mb-1">Lurah</p>
                      <p className="font-bold text-lg">{getLurah()!.nama}</p>
                      {getLurah()!.nip && (
                        <p className="text-xs text-slate-400 mt-1">NIP: {getLurah()!.nip}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center mb-8">
                    <div className="w-1 h-8 bg-slate-300"></div>
                  </div>
                </>
              )}

              {/* Sekretaris */}
              {getSekretaris() && (
                <>
                  <div className="flex justify-center mb-8">
                    <div className="bg-slate-50 border-2 border-slate-400 px-6 py-4 rounded-lg text-center shadow-md">
                      <p className="text-sm text-slate-600 mb-1">Sekretaris Lurah</p>
                      <p className="font-semibold text-slate-900">{getSekretaris()!.nama}</p>
                      {getSekretaris()!.nip && (
                        <p className="text-xs text-slate-500 mt-1">NIP: {getSekretaris()!.nip}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center mb-8">
                    <div className="w-1 h-8 bg-slate-300"></div>
                  </div>
                </>
              )}

              {/* Kepala Lingkungan */}
              {getKepalaLingkungan().length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-center mb-6 text-slate-900">
                    Kepala Lingkungan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getKepalaLingkungan().map((member) => (
                      <div key={member.id} className="flex flex-col items-center">
                        <div className="w-1 h-6 bg-slate-300 mb-2"></div>
                        <div className="bg-slate-50 border-2 border-slate-300 px-6 py-4 rounded-lg text-center w-full hover:shadow-md transition-shadow">
                          {member.lingkungan && (
                            <p className="text-xs text-slate-600 mb-1">{member.lingkungan}</p>
                          )}
                          <p className="font-semibold text-slate-900">{member.nama}</p>
                          {member.nip && (
                            <p className="text-xs text-slate-500 mt-1">NIP: {member.nip}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
