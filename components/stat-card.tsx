interface StatCardProps {
  label: string
  value: string
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      <p className="text-slate-600 text-sm font-medium mb-2">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
