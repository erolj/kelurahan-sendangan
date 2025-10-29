interface FeatureCardProps {
  emoji: string
  name: string
  desc: string
}

export function FeatureCard({ emoji, name, desc }: FeatureCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="font-semibold text-slate-900 mb-2">{name}</h3>
      <p className="text-slate-600 text-sm">{desc}</p>
    </div>
  )
}
