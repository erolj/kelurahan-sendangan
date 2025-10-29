"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold">Profil Kelurahan Sendangan</h1>
          <p className="text-slate-300 mt-2">Informasi lengkap tentang kelurahan kami</p>
        </div>
      </section>

      {/* Tabs Content */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="visi-misi" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visi-misi">Visi & Misi</TabsTrigger>
              <TabsTrigger value="sejarah">Sejarah & Wilayah</TabsTrigger>
            </TabsList>

            {/* Tab 1: Visi & Misi */}
            <TabsContent value="visi-misi" className="space-y-8 mt-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Visi</h2>
                <p className="text-slate-700 leading-relaxed">
                  Mewujudkan pelayanan publik yang prima, transparan, dan berkeadilan; masyarakat berdaya, ekonomi lokal
                  bertumbuh; lingkungan bersih dan aman.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Misi</h2>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-slate-700">Pelayanan administrasi cepat, tepat, dan ramah.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-slate-700">Pemberdayaan UMKM: kacang, biapong, dan ekonomi kreatif.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-slate-700">Penguatan kesehatan, pendidikan, dan sosial kemasyarakatan.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-slate-700">Digitalisasi layanan dan keterbukaan informasi publik.</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            {/* Tab 2: Sejarah & Wilayah */}
            <TabsContent value="sejarah" className="space-y-8 mt-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Sejarah Singkat</h2>
                <p className="text-slate-700 leading-relaxed">
                  Sendangan adalah salah satu kelurahan di Kec. Kawangkoan yang dikenal dengan komoditas kacang
                  Kawangkoan dan kuliner biapong, serta jejak sejarah Goa Jepang.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Profil Wilayah</h2>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Luas Wilayah:</span>
                    <span className="font-semibold text-slate-900">— km²</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Jumlah Lingkungan:</span>
                    <span className="font-semibold text-slate-900">6</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Ketinggian:</span>
                    <span className="font-semibold text-slate-900">— mdpl</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Batas Utara:</span>
                    <span className="font-semibold text-slate-900">—</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Batas Timur:</span>
                    <span className="font-semibold text-slate-900">—</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Batas Selatan:</span>
                    <span className="font-semibold text-slate-900">—</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Batas Barat:</span>
                    <span className="font-semibold text-slate-900">—</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
