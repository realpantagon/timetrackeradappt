import React from "react"

export default function TaskSummary({ darkMode, getCurrentStartTime, getCurrentDuration, formatMinutesToHHMM }) {
  return (
    (getCurrentStartTime() || getCurrentDuration() > 0) && (
      <div
        className={`rounded-xl p-4 border transition-all duration-300 backdrop-blur-sm ${darkMode
          ? "bg-gradient-to-r from-[#DA3761]/20 to-pink-900/20 border-[#DA3761]/30"
          : "bg-gradient-to-r from-[#DA3761]/10 to-pink-50 border-[#DA3761]/20"
          }`}
      >
        <h3
          className={`text-sm font-bold mb-3 flex items-center gap-2 transition-all duration-300 ${darkMode ? "text-[#DA3761]" : "text-[#DA3761]"}`}
        >
          <span>📊</span>
          Task Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {getCurrentStartTime() && (
            <div className="text-center">
              <div
                className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 ${darkMode ? "text-[#DA3761]" : "text-[#DA3761]"}`}
              >
                Start Time
              </div>
              <div
                className={`text-xl font-bold font-mono mt-2 transition-all duration-300 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {getCurrentStartTime()}
              </div>
            </div>
          )}
          {getCurrentDuration() > 0 && (
            <div className="text-center">
              <div
                className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 ${darkMode ? "text-[#DA3761]" : "text-[#DA3761]"}`}
              >
                Duration
              </div>
              <div
                className={`text-xl font-bold font-mono mt-2 transition-all duration-300 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {formatMinutesToHHMM(getCurrentDuration())}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  )
}
