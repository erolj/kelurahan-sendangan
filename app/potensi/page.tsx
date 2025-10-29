export default function PotensiPage() {
  const potentials = [
    {
      emoji: "🥜",
      name: "Kacang Kawangkoan",
      desc: "Produk unggulan sebagai oleh-oleh khas. Kacang Kawangkoan terkenal dengan kualitas terbaik dan rasa yang autentik, menjadi pilihan utama wisatawan.",
    },
    {
      emoji: "🥟",
      name: "Biapong",
      desc: "Kuliner tradisional populer. Biapong adalah makanan khas yang telah menjadi bagian dari warisan budaya lokal dan terus diminati oleh masyarakat.",
    },
    {
      emoji: "🏛️",
      name: "Goa Jepang",
      desc: "Wisata sejarah & edukasi. Goa Jepang menyimpan nilai sejarah penting dan menawarkan pengalaman edukatif bagi pengunjung yang ingin mengenal lebih dalam.",
    },
  ]

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold">Potensi Unggulan Kelurahan</h1>
          <p className="text-slate-300 mt-2">Produk dan wisata unggulan Kelurahan Sendangan</p>
        </div>
      </section>

      {/* Potentials Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {potentials.map((potential) => (
              <div
                key={potential.name}
                className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-6xl mb-6 text-center">{potential.emoji}</div>
                <h3 className="font-bold text-slate-900 text-xl mb-3 text-center">{potential.name}</h3>
                <p className="text-slate-600 text-center leading-relaxed">{potential.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
