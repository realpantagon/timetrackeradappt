

export default function ResourceSection({ resources = [], darkMode }) {
  if (!resources.length) return null

  return (
    <div
      className={`mt-6 backdrop-blur-2xl shadow-xl rounded-2xl border transition-all duration-300 hover:shadow-2xl ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/50"}`}
    >
      <div className={`px-6 py-4 border-b transition-all duration-300 ${darkMode ? "border-white/10" : "border-gray-200/50"}`}>
        <h2 className={`text-xl font-bold flex items-center gap-2 transition-all duration-300 ${darkMode ? "text-white" : "text-gray-900"}`}>
          <span className="text-[#2563eb] text-xl">🔗</span>
          Resource
        </h2>
      </div>
      <div className="p-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {resources.map((res, idx) => (
            <li key={idx} className="flex items-center gap-3 bg-white/0 rounded-xl p-2">
              {res.icon && (
                <img src={res.icon} alt={res.title + " icon"} className="w-7 h-7 rounded shadow border border-white/20 bg-white/40 object-contain" />
              )}
              <a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 underline text-[#2563eb] hover:text-[#1d4ed8] break-all font-mono text-sm transition-all duration-300 ${darkMode ? "hover:text-blue-300" : "hover:text-blue-700"}`}
              >
                {res.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
