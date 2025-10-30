import Image from "next/image"

export default function PotensiPage() {
  const potentials = [
    {
      emoji: "🥜",
      name: "Kacang Kawangkoan",
      desc: "Produk unggulan sebagai oleh-oleh khas. Kacang Kawangkoan terkenal dengan kualitas terbaik dan rasa yang autentik, menjadi pilihan utama wisatawan.",
      image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop",
    },
    {
      emoji: "🥟",
      name: "Biapong",
      desc: "Kuliner tradisional populer. Biapong adalah makanan khas yang telah menjadi bagian dari warisan budaya lokal dan terus diminati oleh masyarakat.",
      image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
    },
    {
      emoji: "🏛️",
      name: "Goa Jepang",
      desc: "Wisata sejarah & edukasi. Goa Jepang menyimpan nilai sejarah penting dan menawarkan pengalaman edukatif bagi pengunjung yang ingin mengenal lebih dalam.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
  ]

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {potentials.map((potential) => (
              <div
                key={potential.name}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={potential.image}
                    alt={potential.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
                    <div className="text-6xl">{potential.emoji}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-xl mb-3 text-center">{potential.name}</h3>
                  <p className="text-slate-600 text-center leading-relaxed">{potential.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
