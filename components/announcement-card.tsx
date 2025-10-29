interface AnnouncementCardProps {
  title: string
  date: string
  body: string
}

export function AnnouncementCard({ title, date, body }: AnnouncementCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{date}</span>
      </div>
      <p className="text-slate-600 text-sm">{body}</p>
    </div>
  )
}
