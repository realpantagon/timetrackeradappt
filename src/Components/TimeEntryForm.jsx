import React from "react"
import TaskSummary from "./TaskSummary.jsx"

export default function TimeEntryForm({
  task,
  mode,
  startTime,
  endTime,
  startDateTime,
  endDateTime,
  duration,
  darkMode,
  validationErrors,
  submitting,
  handleInputChange,
  handleSubmit,
  setMode,
  getCurrentStartTime,
  getCurrentDuration,
  formatMinutesToHHMM
}) {
  return (
    <div className={`backdrop-blur-2xl shadow-xl rounded-2xl border transition-all duration-300 hover:shadow-2xl ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/50"}`}>
      <div className={`px-6 py-4 border-b transition-all duration-300 ${darkMode ? "border-white/10" : "border-gray-200/50"}`}>
        <h2 className={`text-xl font-bold flex items-center gap-2 transition-all duration-300 ${darkMode ? "text-white" : "text-gray-900"}`}>
          <span className="text-[#DA3761] text-xl">➕</span>
          Add Time Entry
        </h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Task Field - Required */}
          <div className="space-y-2">
            <label htmlFor="task" className={`block text-sm font-semibold transition-all duration-300 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Task <span className="text-[#DA3761]">*</span></label>
            <input
              id="task"
              type="text"
              value={task}
              onChange={(e) => handleInputChange("task", e.target.value)}
              placeholder="Enter task name"
              className={`w-full px-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DA3761] focus:border-transparent transition-all duration-300 backdrop-blur-sm ${validationErrors.task ? "border-[#DA3761] focus:ring-[#DA3761]" : darkMode ? "border-white/20 bg-white/10 text-white placeholder-gray-400" : "border-gray-300 bg-white/50 text-gray-900"}`}
            />
            {validationErrors.task && (
              <div className="flex items-center gap-2 text-[#DA3761] text-sm font-medium">
                <span className="text-[#DA3761]">⚠️</span>
                {validationErrors.task}
              </div>
            )}
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <label className={`block text-sm font-semibold transition-all duration-300 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Mode <span className="text-[#DA3761]">*</span></label>
            <div className="grid grid-cols-2 gap-2">
              {["Manual", "Auto"].map((modeOption) => (
                <button
                  key={modeOption}
                  type="button"
                  onClick={() => setMode(modeOption)}
                  className={`px-3 py-3 text-sm font-semibold rounded-xl border transition-all duration-300 hover:scale-105 ${mode === modeOption ? "bg-[#DA3761] text-white border-[#DA3761] shadow-lg" : darkMode ? "bg-white/10 text-gray-200 border-white/20 hover:bg-white/20 backdrop-blur-sm" : "bg-white/50 text-gray-700 border-gray-300 hover:bg-white/80 backdrop-blur-sm"}`}
                >
                  {modeOption}
                </button>
              ))}
            </div>
          </div>

          {/* Task Summary - Shows for all modes when data is available */}
          <TaskSummary
            darkMode={darkMode}
            getCurrentStartTime={getCurrentStartTime}
            getCurrentDuration={getCurrentDuration}
            formatMinutesToHHMM={formatMinutesToHHMM}
          />

          {/* Time Fields - Dynamic based on mode */}
          {mode === "Manual" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDateTime" className={`block text-sm font-semibold transition-all duration-300 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Start Date and Time <span className="text-[#DA3761]">*</span></label>
                  <input
                    id="startDateTime"
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => handleInputChange("startDateTime", e.target.value)}
                    className={`w-full px-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DA3761] focus:border-transparent transition-all duration-300 backdrop-blur-sm ${validationErrors.startDateTime ? "border-[#DA3761] focus:ring-[#DA3761]" : darkMode ? "border-white/20 bg-white/10 text-white" : "border-gray-300 bg-white/50 text-gray-900"}`}
                  />
                  {validationErrors.startDateTime && (
                    <div className="flex items-center gap-2 text-[#DA3761] text-sm font-medium">
                      <span className="text-[#DA3761]">⚠️</span>
                      {validationErrors.startDateTime}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="endDateTime" className={`block text-sm font-semibold transition-all duration-300 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>End Date and Time <span className="text-[#DA3761]">*</span></label>
                  <input
                    id="endDateTime"
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => handleInputChange("endDateTime", e.target.value)}
                    className={`w-full px-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DA3761] focus:border-transparent transition-all duration-300 backdrop-blur-sm ${validationErrors.endDateTime ? "border-[#DA3761] focus:ring-[#DA3761]" : darkMode ? "border-white/20 bg-white/10 text-white" : "border-gray-300 bg-white/50 text-gray-900"}`}
                  />
                  {validationErrors.endDateTime && (
                    <div className="flex items-center gap-2 text-[#DA3761] text-sm font-medium">
                      <span className="text-[#DA3761]">⚠️</span>
                      {validationErrors.endDateTime}
                    </div>
                  )}
                </div>
              </div>
              {startDateTime && endDateTime && (
                <div className={`rounded-xl p-3 transition-all duration-300 backdrop-blur-sm ${darkMode ? "bg-[#DA3761]/20" : "bg-[#DA3761]/10"}`}>
                  <div className={`text-sm font-medium transition-all duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>
                    <strong>Duration Preview:</strong> {(() => {
                      const start = new Date(startDateTime)
                      const end = new Date(endDateTime)
                      const diffMs = end - start
                      if (diffMs <= 0) return "Invalid time range"
                      const diffMins = Math.round(diffMs / (1000 * 60))
                      const hours = Math.floor(diffMins / 60)
                      const minutes = diffMins % 60
                      return `${hours}h ${minutes}m`
                    })()}
                  </div>
                  {startDateTime && endDateTime && new Date(startDateTime).toDateString() !== new Date(endDateTime).toDateString() && (
                    <div className={`text-xs mt-2 transition-all duration-300 ${darkMode ? "text-[#DA3761]" : "text-[#DA3761]"}`}>
                      ⚠️ This task spans multiple days
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {mode === "Auto" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startTime" className={`block text-sm font-semibold transition-all duration-300 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Start Time <span className="text-[#DA3761]">*</span></label>
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => handleInputChange("startTime", e.target.value)}
                  className={`w-full px-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DA3761] focus:border-transparent transition-all duration-300 backdrop-blur-sm ${validationErrors.startTime ? "border-[#DA3761] focus:ring-[#DA3761]" : darkMode ? "border-white/20 bg-white/10 text-white" : "border-gray-300 bg-white/50 text-gray-900"}`}
                />
                {validationErrors.startTime && (
                  <div className="flex items-center gap-2 text-[#DA3761] text-sm font-medium">
                    <span className="text-[#DA3761]">⚠️</span>
                    {validationErrors.startTime}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="duration" className={`block text-sm font-semibold transition-all duration-300 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Duration (minutes) <span className="text-[#DA3761]">*</span></label>
                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  placeholder="e.g. 30"
                  className={`w-full px-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DA3761] focus:border-transparent transition-all duration-300 backdrop-blur-sm ${validationErrors.duration ? "border-[#DA3761] focus:ring-[#DA3761]" : darkMode ? "border-white/20 bg-white/10 text-white placeholder-gray-400" : "border-gray-300 bg-white/50 text-gray-900"}`}
                />
                {validationErrors.duration && (
                  <div className="flex items-center gap-2 text-[#DA3761] text-sm font-medium">
                    <span className="text-[#DA3761]">⚠️</span>
                    {validationErrors.duration}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Required fields note */}
          <div className={`text-sm flex items-center gap-2 transition-all duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <span className="text-[#DA3761]">*</span>
            Required fields
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#DA3761] hover:bg-[#c42d56] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DA3761] hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              "Add Time Entry"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
