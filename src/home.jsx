"use client"


import { useEffect, useState } from "react"
import { postToAirtable } from "./api/postData.jsx"
import { getUserTime } from "./api/getusertime.jsx"
import Header from "./Components/Header.jsx"
import TimeEntryForm from "./Components/TimeEntryForm.jsx"
import ResourceSection from "./Components/ResourceSection.jsx"
import MiroIcon from "./assets/Icon/Miro.png"
import FigmaIcon from "./assets/Icon/figma.png"
import ClickUpIcon from "./assets/Icon/ClickUp.png"
import GithubIcon from "./assets/Icon/github.png"
import AirtableIcon from "./assets/Icon/airtable.png"

export default function Home({ username = "John Doe", setLoggedIn }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [task, setTask] = useState("")
  const [description, setDescription] = useState("")
  const [mode, setMode] = useState("Manual")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [startDateTime, setStartDateTime] = useState("")
  const [endDateTime, setEndDateTime] = useState("")
  const [duration, setDuration] = useState("")
  const [userRecords, setUserRecords] = useState([])
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [errorRecords, setErrorRecords] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [darkMode, setDarkMode] = useState(true) // Default dark mode

  const recordsPerPage = 10

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let ignore = false
    async function fetchRecords() {
      setLoadingRecords(true)
      setErrorRecords(null)
      try {
        const records = await getUserTime(username)
        if (!ignore) setUserRecords(records)
      } catch (err) {
        if (!ignore) setErrorRecords(err.message)
      } finally {
        if (!ignore) setLoadingRecords(false)
      }
    }
    fetchRecords()
    return () => {
      ignore = true
    }
  }, [username])

  // Validation function
  const validateForm = () => {
    const errors = {}
    // Check if task is empty or null
    if (!task || task.trim() === "") {
      errors.task = "Task is required"
    }

    if (mode === "Manual") {
      // Check if start date time is selected
      if (!startDateTime || startDateTime.trim() === "") {
        errors.startDateTime = "Start date and time is required"
      }
      // Check if end date time is selected
      if (!endDateTime || endDateTime.trim() === "") {
        errors.endDateTime = "End date and time is required"
      }
      // Check if end time is after start time
      if (startDateTime && endDateTime && new Date(startDateTime) >= new Date(endDateTime)) {
        errors.endDateTime = "End date and time must be after start date and time"
      }
    } else if (mode === "Auto") {
      // Check if start time is empty or null
      if (!startTime || startTime.trim() === "") {
        errors.startTime = "Start time is required"
      }
      // Check if duration is empty or null
      if (!duration || duration.trim() === "") {
        errors.duration = "Duration is required"
      }
      // Check if duration is a valid number
      if (duration && isNaN(Number(duration))) {
        errors.duration = "Duration must be a valid number"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    const data = {
      Username: username,
      Task: task.trim(),
      Mode: mode,
    }

    if (mode === "Manual") {
      const startDate = new Date(startDateTime)
      const endDate = new Date(endDateTime)
      data.Start_Time = startDate.toISOString()
      data.End_Time = endDate.toISOString()
    } else if (mode === "Auto") {
      // Create start datetime from today's date + start time
      const today = currentTime.toLocaleDateString("en-CA")
      const startDateTime = new Date(`${today}T${startTime}:00`)
      const endDateTime = new Date(startDateTime.getTime() + Number(duration) * 60000)
      data.Start_Time = startDateTime.toISOString()
      data.End_Time = endDateTime.toISOString()
    }

    try {
      const result = await postToAirtable([{ fields: data }])
      alert("Data sent to Airtable!")
      // Reset form
      setTask("")
      setDescription("")
      setStartTime("")
      setEndTime("")
      setSelectedDate("")
      setStartDateTime("")
      setEndDateTime("")
      setDuration("")
      setValidationErrors({})
      await fetchRecords()
    } catch (err) {
      alert("Failed to send data: " + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const fetchRecords = async () => {
    setLoadingRecords(true)
    setErrorRecords(null)
    try {
      const records = await getUserTime(username)
      setUserRecords(records)
    } catch (err) {
      setErrorRecords(err.message)
    } finally {
      setLoadingRecords(false)
    }
  }

  const totalTimeDuration = userRecords.reduce((sum, rec) => {
    const val = rec.fields.Duration
    return sum + (typeof val === "number" ? val : Number.parseFloat(val) || 0)
  }, 0)

  // Sort records by newest first (based on Start_Time)
  const sortedRecords = [...userRecords].sort((a, b) => {
    const dateA = new Date(a.fields.Start_Time || 0)
    const dateB = new Date(b.fields.Start_Time || 0)
    return dateB - dateA // Descending order (newest first)
  })

  // Pagination calculations
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const currentRecords = sortedRecords.slice(startIndex, endIndex)

  // Reset to first page when records change
  useEffect(() => {
    setCurrentPage(1)
  }, [sortedRecords.length])

  const formatMinutesToHHMM = (totalMinutes) => {
    if (isNaN(totalMinutes) || totalMinutes < 0) {
      return "00:00"
    }
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round(totalMinutes % 60)
    const formattedHours = String(hours).padStart(2, "0")
    const formattedMinutes = String(minutes).padStart(2, "0")
    return `${formattedHours}:${formattedMinutes}`
  }

  // Helper function to get current start time for display
  const getCurrentStartTime = () => {
    if (mode === "Manual" && startDateTime) {
      return new Date(startDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (mode === "Auto" && startTime) {
      return startTime
    }
    return null
  }

  // Helper function to calculate current duration
  const getCurrentDuration = () => {
    if (mode === "Manual" && startDateTime && endDateTime) {
      const start = new Date(startDateTime)
      const end = new Date(endDateTime)
      const durationMs = end.getTime() - start.getTime()
      return Math.max(0, Math.round(durationMs / 60000)) // Convert to minutes
    } else if (mode === "Auto" && duration) {
      return Number(duration) || 0
    }
    return 0
  }

  // Clear validation error when user starts typing
  const handleInputChange = (field, value) => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
    switch (field) {
      case "task":
        setTask(value)
        break
      case "startTime":
        setStartTime(value)
        break
      case "endTime":
        setEndTime(value)
        break
      case "selectedDate":
        setSelectedDate(value)
        break
      case "startDateTime":
        setStartDateTime(value)
        break
      case "endDateTime":
        setEndDateTime(value)
        break
      case "duration":
        setDuration(value)
        break
      default:
        break
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${darkMode ? "bg-[#0D0C0F]" : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
        }`}
    >
      {/* Header Section */}
      <Header
        username={username}
        currentTime={currentTime}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setLoggedIn={setLoggedIn}
      />

      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-40 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <TimeEntryForm
              task={task}
              mode={mode}
              startTime={startTime}
              endTime={endTime}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              duration={duration}
              darkMode={darkMode}
              validationErrors={validationErrors}
              submitting={submitting}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              setMode={setMode}
              getCurrentStartTime={getCurrentStartTime}
              getCurrentDuration={getCurrentDuration}
              formatMinutesToHHMM={formatMinutesToHHMM}
            />
            {/* Resource Section */}
            <ResourceSection
              resources={[
                { title: "Idea Board", link: "https://miro.com/app/board/uXjVIsv75gw=/", icon: MiroIcon },
                { title: "Design", link: "https://www.figma.com/design/6TFkczv5qq6a1QHmM2lzYf/ShareWarp---UI-Design?t=FT2SgTSq8ALKdhns-0", icon: FigmaIcon },
                { title: "Task Management", link: "https://app.clickup.com/90181388683/v/l/6-901809124911-1?pr=90185269210", icon: ClickUpIcon },
                { title: "Github", link: "https://github.com/Adappt-Co", icon: GithubIcon },
                { title: "Airtable", link: "https://airtable.com/app27di9Mzgt9zhTa/tbl1oBXn1aYnv279m/viws3dB8KJtgLTO46?blocks=hide", icon: AirtableIcon }
              ]}
              darkMode={darkMode}
            />
          </div>

          {/* Records Section */}
          <div className="lg:col-span-2">
            <div
              className={`backdrop-blur-2xl shadow-xl rounded-2xl border transition-all duration-300 hover:shadow-2xl ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/50"
                }`}
            >
              <div
                className={`px-6 py-4 border-b transition-all duration-300 ${darkMode ? "border-white/10" : "border-gray-200/50"
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h2
                      className={`text-xl font-bold transition-all duration-300 ${darkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      Your Time Records
                    </h2>
                    {userRecords.length > 0 && (
                      <p
                        className={`text-sm transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                      >
                        {userRecords.length} total record{userRecords.length !== 1 ? "s" : ""} (sorted by newest first)
                        {userRecords.length > recordsPerPage && ` • Page ${currentPage} of ${totalPages}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {totalTimeDuration > 0 && (
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 backdrop-blur-sm ${darkMode ? "bg-white/10 text-gray-200" : "bg-gray-100/80 text-gray-800"
                          }`}
                      >
                        Total: {formatMinutesToHHMM(totalTimeDuration)}
                      </span>
                    )}
                    <button
                      onClick={fetchRecords}
                      disabled={loadingRecords}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DA3761] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 backdrop-blur-sm ${darkMode
                          ? "border-white/20 bg-white/10 text-gray-200 hover:bg-white/20"
                          : "border-gray-300 bg-white/50 text-gray-700 hover:bg-white/80"
                        }`}
                    >
                      <span className={`${loadingRecords ? "animate-spin" : ""}`}>🔄</span>
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {loadingRecords && (
                  <div className="flex items-center justify-center py-16">
                    <div
                      className={`flex items-center gap-4 transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                      <div className="w-6 h-6 border-2 border-[#DA3761] border-t-transparent rounded-full animate-spin"></div>
                      Loading records...
                    </div>
                  </div>
                )}

                {errorRecords && (
                  <div
                    className={`border rounded-2xl p-6 text-[#DA3761] transition-all duration-300 backdrop-blur-sm ${darkMode ? "bg-[#DA3761]/10 border-[#DA3761]/30" : "bg-[#DA3761]/5 border-[#DA3761]/20"
                      }`}
                  >
                    <strong>Error:</strong> {errorRecords}
                  </div>
                )}

                {!loadingRecords && !errorRecords && (
                  <>
                    {/* Desktop Table View - Hidden on mobile */}
                    <div
                      className={`hidden md:block overflow-hidden rounded-xl border transition-all duration-300 backdrop-blur-sm ${darkMode ? "border-white/10" : "border-gray-200/50"
                        }`}
                    >
                      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={`transition-all duration-300 ${darkMode ? "bg-white/5" : "bg-gray-50/80"}`}>
                          <tr>
                            <th
                              className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider transition-all duration-300 w-3/5 ${darkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                            >
                              Task
                            </th>
                            <th
                              className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                            >
                              Start Time
                            </th>
                            <th
                              className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                            >
                              End Time
                            </th>
                            <th
                              className={`px-4 py-3 text-right text-xs font-bold uppercase tracking-wider transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                            >
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y transition-all duration-300 ${darkMode ? "bg-white/5 divide-white/10" : "bg-white/50 divide-gray-200/50"
                            }`}
                        >
                          {currentRecords.length === 0 ? (
                            <tr>
                              <td
                                colSpan={4}
                                className={`px-4 py-12 text-center transition-all duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-4xl">⏱️</span>
                                  <span className="text-lg font-medium">No time records found</span>
                                  <span className="text-sm">Add your first time entry above</span>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            currentRecords.map((rec, index) => (
                              <tr
                                key={rec.id}
                                className={`transition-all duration-300 hover:scale-[1.01] ${darkMode
                                    ? "hover:bg-white/10" + (index % 2 === 0 ? " bg-white/5" : " bg-white/3")
                                    : "hover:bg-[#DA3761]/5" + (index % 2 === 0 ? " bg-white/50" : " bg-gray-50/50")
                                  }`}
                              >
                                <td
                                  className={`px-4 py-3 text-sm font-semibold transition-all duration-300 max-w-0 truncate ${darkMode ? "text-gray-100" : "text-gray-900"
                                    }`}
                                  title={rec.fields.Task || "-"}
                                >
                                  {rec.fields.Task || "-"}
                                </td>
                                <td
                                  className={`px-4 py-3 text-xs font-mono transition-all duration-300 ${darkMode ? "text-gray-100" : "text-gray-900"
                                    }`}
                                >
                                  {rec.fields.Start_Time
                                    ? new Date(rec.fields.Start_Time).toLocaleString("en-CA", {
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })
                                    : "-"}
                                </td>
                                <td
                                  className={`px-4 py-3 text-xs font-mono transition-all duration-300 ${darkMode ? "text-gray-100" : "text-gray-900"
                                    }`}
                                >
                                  {rec.fields.End_Time
                                    ? new Date(rec.fields.End_Time).toLocaleString("en-CA", {
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })
                                    : "-"}
                                </td>
                                <td
                                  className={`px-4 py-3 text-sm font-mono text-right font-semibold transition-all duration-300 ${darkMode ? "text-gray-100" : "text-gray-900"
                                    }`}
                                >
                                  {rec.fields.Duration ? formatMinutesToHHMM(rec.fields.Duration) : "-"}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        {userRecords.length > 0 && (
                          <tfoot
                            className={`transition-all duration-300 ${darkMode ? "bg-[#DA3761]/20" : "bg-[#DA3761]/10"
                              }`}
                          >
                            <tr>
                              <td
                                colSpan={3}
                                className={`px-4 py-3 text-sm font-bold text-right transition-all duration-300 ${darkMode ? "text-gray-100" : "text-gray-900"
                                  }`}
                              >
                                Total Time:
                              </td>
                              <td
                                className={`px-4 py-3 text-sm font-bold font-mono text-right transition-all duration-300 ${darkMode ? "text-[#DA3761]" : "text-[#DA3761]"
                                  }`}
                              >
                                {formatMinutesToHHMM(totalTimeDuration)}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>

                    {/* Mobile Card View - Visible on mobile only */}
                    <div className="md:hidden space-y-3">
                      {currentRecords.length === 0 ? (
                        <div
                          className={`text-center py-12 transition-all duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl">⏱️</span>
                            <span className="text-lg font-medium">No time records found</span>
                            <span className="text-sm">Add your first time entry above</span>
                          </div>
                        </div>
                      ) : (
                        currentRecords.map((rec, index) => (
                          <div
                            key={rec.id}
                            className={`rounded-xl border p-4 transition-all duration-300 backdrop-blur-sm ${darkMode
                                ? "bg-white/5 border-white/10 hover:bg-white/10"
                                : "bg-white/50 border-gray-200/50 hover:bg-white/80"
                              }`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <h3
                                  className={`font-semibold text-sm transition-all duration-300 ${darkMode ? "text-gray-100" : "text-gray-900"
                                    }`}
                                >
                                  {rec.fields.Task || "-"}
                                </h3>
                                <span
                                  className={`text-sm font-mono font-semibold transition-all duration-300 ${darkMode ? "text-[#DA3761]" : "text-[#DA3761]"
                                    }`}
                                >
                                  {rec.fields.Duration ? formatMinutesToHHMM(rec.fields.Duration) : "-"}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <div
                                  className={`text-xs transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-600"
                                    }`}
                                >
                                  <span className="font-medium">Start:</span>{" "}
                                  {rec.fields.Start_Time
                                    ? new Date(rec.fields.Start_Time).toLocaleString("en-CA", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })
                                    : "-"}
                                </div>
                                <div
                                  className={`text-xs transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-600"
                                    }`}
                                >
                                  <span className="font-medium">End:</span>{" "}
                                  {rec.fields.End_Time
                                    ? new Date(rec.fields.End_Time).toLocaleString("en-CA", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })
                                    : "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      {userRecords.length > 0 && (
                        <div
                          className={`rounded-xl border p-4 transition-all duration-300 backdrop-blur-sm ${darkMode ? "bg-[#DA3761]/20 border-[#DA3761]/30" : "bg-[#DA3761]/10 border-[#DA3761]/20"
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <span
                              className={`text-sm font-bold transition-all duration-300 ${darkMode ? "text-gray-100" : "text-gray-900"
                                }`}
                            >
                              Total Time:
                            </span>
                            <span
                              className={`text-sm font-bold font-mono transition-all duration-300 ${darkMode ? "text-[#DA3761]" : "text-[#DA3761]"
                                }`}
                            >
                              {formatMinutesToHHMM(totalTimeDuration)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pagination - shown on both desktop and mobile */}
                    {userRecords.length > recordsPerPage && (
                      <div
                        className={`px-4 py-3 flex items-center justify-between border-t transition-all duration-300 ${darkMode ? "bg-white/5 border-white/10" : "bg-white/50 border-gray-200/50"
                          }`}
                      >
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-3 py-2 border text-sm font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 backdrop-blur-sm ${darkMode
                                ? "border-white/20 text-gray-200 bg-white/10 hover:bg-white/20"
                                : "border-gray-300 text-gray-700 bg-white/50 hover:bg-white/80"
                              }`}
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`ml-3 relative inline-flex items-center px-3 py-2 border text-sm font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 backdrop-blur-sm ${darkMode
                                ? "border-white/20 text-gray-200 bg-white/10 hover:bg-white/20"
                                : "border-gray-300 text-gray-700 bg-white/50 hover:bg-white/80"
                              }`}
                          >
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p
                              className={`text-sm transition-all duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
                              <span className="font-semibold">{Math.min(endIndex, userRecords.length)}</span> of{" "}
                              <span className="font-semibold">{userRecords.length}</span> results
                            </p>
                          </div>
                          <div>
                            <nav
                              className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px"
                              aria-label="Pagination"
                            >
                              <button
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-xl border text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 backdrop-blur-sm ${darkMode
                                    ? "border-white/20 bg-white/10 text-gray-300 hover:bg-white/20"
                                    : "border-gray-300 bg-white/50 text-gray-500 hover:bg-white/80"
                                  }`}
                              >
                                <span className="sr-only">Previous</span>
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                              {/* Page numbers */}
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                                // Show first page, last page, current page, and pages around current page
                                const showPage =
                                  pageNumber === 1 ||
                                  pageNumber === totalPages ||
                                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                if (!showPage) {
                                  // Show ellipsis for gaps
                                  if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                                    return (
                                      <span
                                        key={pageNumber}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-semibold transition-all duration-300 backdrop-blur-sm ${darkMode
                                            ? "border-white/20 bg-white/10 text-gray-300"
                                            : "border-gray-300 bg-white/50 text-gray-700"
                                          }`}
                                      >
                                        ...
                                      </span>
                                    )
                                  }
                                  return null
                                }
                                return (<button
                                  key={pageNumber}
                                  onClick={() => setCurrentPage(pageNumber)}
                                  className={`relative inline-flex items-center px-3 py-2 border text-sm font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm ${currentPage === pageNumber
                                      ? darkMode
                                        ? "z-10 bg-[#DA3761] border-[#DA3761] text-white"
                                        : "z-10 bg-[#DA3761]/10 border-[#DA3761] text-[#DA3761]"
                                      : darkMode
                                        ? "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
                                        : "bg-white/50 border-gray-300 text-gray-500 hover:bg-white/80"
                                    }`}
                                >
                                  {pageNumber}
                                </button>
                                )
                              })}
                              <button
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-xl border text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 backdrop-blur-sm ${darkMode
                                    ? "border-white/20 bg-white/10 text-gray-300 hover:bg-white/20"
                                    : "border-gray-300 bg-white/50 text-gray-500 hover:bg-white/80"
                                  }`}
                              >
                                <span className="sr-only">Next</span>
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
