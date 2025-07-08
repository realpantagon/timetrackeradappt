"use client"

import { useEffect, useState } from "react"
import { postToAirtable } from "./postData.jsx"
import { getUserTime } from "./getusertime.jsx"

export default function Home({ username = "John Doe", setLoggedIn }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [task, setTask] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [userRecords, setUserRecords] = useState([])
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [errorRecords, setErrorRecords] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

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

    // Check if start time is empty or null
    if (!startTime || startTime.trim() === "") {
      errors.startTime = "Start time is required"
    }

    // Check if end time is empty or null
    if (!endTime || endTime.trim() === "") {
      errors.endTime = "End time is required"
    }

    // Check if end time is after start time
    if (startTime && endTime && startTime >= endTime) {
      errors.endTime = "End time must be after start time"
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
      Date: currentTime.toLocaleDateString("en-CA"),
      Task: task.trim(),
      Description: description.trim(),
      "Task URL": url.trim() || "", // URL can be blank
      Username: username,
      StartTime: startTime,
      EndTime: endTime,
    }

    try {
      const result = await postToAirtable([{ fields: data }])
      alert("Data sent to Airtable!")
      // Reset form
      setTask("")
      setDescription("")
      setUrl("")
      setStartTime("")
      setEndTime("")
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
    const val = rec.fields.TimeDuration
    return sum + (typeof val === "number" ? val : Number.parseFloat(val) || 0)
  }, 0)

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
      case "url":
        setUrl(value)
        break
      case "startTime":
        setStartTime(value)
        break
      case "endTime":
        setEndTime(value)
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                Welcome, {username}!
              </h1>
              <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  <span>{currentTime.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕐</span>
                  <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setLoggedIn?.(false)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-blue-600">➕</span>
                  Add Time Entry
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Task Field - Required */}
                  <div className="space-y-2">
                    <label htmlFor="task" className="block text-sm font-medium text-gray-700">
                      Task <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="task"
                      type="text"
                      value={task}
                      onChange={(e) => handleInputChange("task", e.target.value)}
                      placeholder="Enter task name"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        validationErrors.task ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.task && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <span className="text-red-500">⚠️</span>
                        {validationErrors.task}
                      </div>
                    )}
                  </div>

                  {/* URL Field - Optional */}
                  <div className="space-y-2">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                      Task URL <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => handleInputChange("url", e.target.value)}
                      placeholder="https://github.com/project"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Time Fields - Required */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          validationErrors.startTime ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                        }`}
                      />
                      {validationErrors.startTime && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <span className="text-red-500">⚠️</span>
                          {validationErrors.startTime}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          validationErrors.endTime ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                        }`}
                      />
                      {validationErrors.endTime && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <span className="text-red-500">⚠️</span>
                          {validationErrors.endTime}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Required fields note */}
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="text-red-500">*</span>
                    Required fields
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Add Time Entry"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Records Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">Your Time Records</h2>
                  <div className="flex items-center gap-3">
                    {totalTimeDuration > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        Total: {formatMinutesToHHMM(totalTimeDuration)}
                      </span>
                    )}
                    <button
                      onClick={fetchRecords}
                      disabled={loadingRecords}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className={`${loadingRecords ? "animate-spin" : ""}`}>🔄</span>
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {loadingRecords && (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading records...
                    </div>
                  </div>
                )}

                {errorRecords && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <strong>Error:</strong> {errorRecords}
                  </div>
                )}

                {!loadingRecords && !errorRecords && (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Task
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              URL
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Start
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              End
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {userRecords.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-4xl">⏱️</span>
                                  <span>No time records found</span>
                                  <span className="text-sm">Add your first time entry above</span>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            userRecords.map((rec, index) => (
                              <tr
                                key={rec.id}
                                className={`hover:bg-blue-50 transition-colors ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                }`}
                              >
                                <td className="px-4 py-3 text-sm text-gray-900">{rec.fields.Date || "-"}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                  {rec.fields.Task || "-"}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {rec.fields["Task URL"] ? (
                                    <a
                                      href={rec.fields["Task URL"]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-32"
                                    >
                                      {rec.fields["Task URL"]}
                                    </a>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm font-mono text-gray-900">
                                  {rec.fields.StartTime || "-"}
                                </td>
                                <td className="px-4 py-3 text-sm font-mono text-gray-900">
                                  {rec.fields.EndTime || "-"}
                                </td>
                                <td className="px-4 py-3 text-sm font-mono text-right text-gray-900">
                                  {rec.fields.TimeDuration ? formatMinutesToHHMM(rec.fields.TimeDuration) : "-"}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        {userRecords.length > 0 && (
                          <tfoot className="bg-blue-50">
                            <tr>
                              <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-right text-gray-900">
                                Total Time:
                              </td>
                              <td className="px-4 py-3 text-sm font-bold font-mono text-right text-blue-700">
                                {formatMinutesToHHMM(totalTimeDuration)}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
