type AdminTab = 'courses' | 'lessons' | 'create' | 'create-course'

interface AdminTabsProps {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
}

export default function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'courses', label: 'Kursy' },
    { id: 'create-course', label: 'Utworz kurs' },
    { id: 'lessons', label: 'Wszystkie lekcje' },
    { id: 'create', label: 'Utworz lekcje' },
  ]

  return (
    <div
      className="flex gap-2 mb-8 bg-white rounded-full p-1.5 shadow-lg border border-slate-200"
      style={{
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-3 px-4 rounded-full font-semibold transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
