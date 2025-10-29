export default function StrukturPage() {
  const headKampungs = [
    "Kepala Lingkungan 1",
    "Kepala Lingkungan 2",
    "Kepala Lingkungan 3",
    "Kepala Lingkungan 4",
    "Kepala Lingkungan 5",
    "Kepala Lingkungan 6",
  ]

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold">Struktur Pemerintahan</h1>
          <p className="text-slate-300 mt-2">Bagan organisasi Kelurahan Sendangan</p>
        </div>
      </section>

      {/* Org Chart */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          {/* Top Level - Lurah */}
          <div className="flex justify-center mb-12">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white px-8 py-4 rounded-lg shadow-lg font-semibold text-lg">
              Lurah
            </div>
          </div>

          {/* Connector Line */}
          <div className="flex justify-center mb-8">
            <div className="w-1 h-8 bg-slate-300"></div>
          </div>

          {/* Bottom Level - Kepala Lingkungan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {headKampungs.map((head, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Connector from top */}
                <div className="w-1 h-6 bg-slate-300 mb-2"></div>
                {/* Card */}
                <div className="bg-slate-50 border-2 border-slate-300 px-6 py-4 rounded-lg text-center w-full hover:shadow-md transition-shadow">
                  <p className="font-semibold text-slate-900">{head}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
