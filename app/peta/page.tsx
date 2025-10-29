export default function PetaPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold">Peta Administrasi Wilayah</h1>
          <p className="text-slate-300 mt-2">Visualisasi wilayah Kelurahan Sendangan</p>
        </div>
      </section>

      {/* Map Container */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="border-2 border-slate-300 rounded-lg p-12 bg-slate-50 text-center">
            <p className="text-slate-600 text-lg mb-4">Area Peta Kelurahan Sendangan</p>
            <p className="text-slate-500 text-sm">(Embed ArcGIS/Google Maps di sini)</p>
            <div className="mt-8 h-96 bg-slate-200 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Placeholder untuk peta interaktif</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
