import React from "react"
import Profile from "./Profile"

export default function Header({ username, currentTime, darkMode, setDarkMode, setLoggedIn }) {
  return (
    <div
      className={`backdrop-blur-xl border-b transition-all duration-300 ${darkMode ? "bg-black/20 border-white/10" : "bg-white/70 border-gray-200/50"}`}
    >
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-40 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <Profile username={username} big={true} darkMode={darkMode} />
            </div>
            <div>
              <div
                className={`flex items-center gap-4 sm:gap-6 mt-2 text-sm transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  <span className="font-medium">{currentTime.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕐</span>
                  <span className="font-mono font-medium">{currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-xl shadow-md text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DA3761] hover:scale-105 ${darkMode
                  ? "border-white/20 bg-white/10 text-gray-200 hover:bg-white/20 backdrop-blur-xl"
                  : "border-gray-300 bg-white/80 text-gray-700 hover:bg-white backdrop-blur-xl"
                }`}
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
              {darkMode ? "Light" : "Dark"}
            </button>
            <button
              onClick={() => setLoggedIn?.(false)}
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-xl shadow-md text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DA3761] hover:scale-105 ${darkMode
                  ? "border-white/20 bg-white/10 text-gray-200 hover:bg-white/20 backdrop-blur-xl"
                  : "border-gray-300 bg-white/80 text-gray-700 hover:bg-white backdrop-blur-xl"
                }`}
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
