interface AdminHeaderProps {
  onBack: () => void
}

export default function AdminHeader({ onBack }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-5xl font-bold text-slate-900 mb-2 tracking-tight">
          Panel Admina
        </h1>
        <p className="text-slate-600 text-lg">
          Zarządzaj kursami i lekcjami
        </p>
      </div>
      <button
        onClick={onBack}
        className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-full 
                       transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        Powrot
      </button>
    </div>
  )
}
