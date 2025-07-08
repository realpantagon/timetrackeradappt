import { useEffect, useState, useRef } from 'react'
import { postToAirtable } from './postData.jsx'
import { getUserTime } from './getusertime.jsx'

function Home({ username, setLoggedIn }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [task, setTask] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userRecords, setUserRecords] = useState([])
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [errorRecords, setErrorRecords] = useState(null)

  // Stopwatch state
  // const [isRunning, setIsRunning] = useState(false)
  // const [elapsed, setElapsed] = useState(0)
  // const intervalRef = useRef(null)

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
    return () => { ignore = true }
  }, [username])

  // Stopwatch effect
  // useEffect(() => {
  //   if (isRunning) {
  //     intervalRef.current = setInterval(() => {
  //       setElapsed(prev => prev + 1)
  //     }, 1000)
  //   } else if (intervalRef.current) {
  //     clearInterval(intervalRef.current)
  //   }
  //   return () => clearInterval(intervalRef.current)
  // }, [isRunning])

  // Format elapsed time as HH:MM:SS
  // const formatElapsed = (seconds) => {
  //   const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
  //   const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  //   const s = String(seconds % 60).padStart(2, '0')
  //   return `${h}:${m}:${s}`
  // }

  // Button handler for stopwatch
  // const handleToggle = () => setIsRunning(running => !running)

  // Submit handler (send username, date, task, description, time)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      Date: currentTime.toLocaleDateString('en-CA'), // "YYYY-MM-DD"
      Task: task,
      Description: description,
      "Task URL": url,
      // Duration: elapsed, // remove duration
      Username: username,
      StartTime: startTime,
      EndTime: endTime
    }

    try {
      const result = await postToAirtable([
        { fields: data }
      ])
      alert('Data sent to Airtable!')
      // Optionally reset form here
      setTask("");
      setDescription("");
      setUrl("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      alert('Failed to send data: ' + err.message)
    }
  }

  // Calculate sum of TimeDuration
  const totalTimeDuration = userRecords.reduce((sum, rec) => {
    const val = rec.fields.TimeDuration
    return sum + (typeof val === 'number' ? val : parseFloat(val) || 0)
  }, 0)

  // Function to format minutes into HH:MM
  const formatMinutesToHHMM = (totalMinutes) => {
    if (isNaN(totalMinutes) || totalMinutes < 0) {
      return '00:00';
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  };

  return (
    <div className="flex flex-col items-center pt-12 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
      <p className="mb-2 text-lg">
        Date: {currentTime.toLocaleDateString()}
      </p>
      <p className="mb-6 text-lg">
        Current time: {currentTime.toLocaleTimeString()}
      </p>
      <form
        className="bg-white p-6 rounded shadow-md mb-6 w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Task</label>
          <input
            type="text"
            value={task}
            onChange={e => setTask(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter task"
          />
        </div>
        {/* <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter description"
          />
        </div> */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Task URL</label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter Task URL"
          />
        </div>
        <div className="flex gap-2"><div className="mb-4">
          <label className="block mb-1 font-semibold">Start Time</label>
          <input
            type="text"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g. 17:00"
          />
        </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">End Time</label>
            <input
              type="text"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g. 19:00"
            />
          </div></div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold"
        >
          Submit
        </button>
      </form>
      <button
        onClick={() => setLoggedIn(false)}
        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        Logout
      </button>
      <div className="w-full max-w-4xl mt-10">
        <h2 className="text-xl font-bold mb-4">Your Time Records</h2>
        {loadingRecords && <div>Loading...</div>}
        {errorRecords && <div className="text-red-500">Error: {errorRecords}</div>}
        {!loadingRecords && !errorRecords && (
          <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-300 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left font-semibold">Date</th>
                  <th className="px-4 py-2 border text-left font-semibold">Task</th>
                  {/* <th className="px-3 py-2 border">Description</th> */}
                  <th className="px-4 py-2 border text-left font-semibold">Task URL</th>
                  <th className="px-4 py-2 border text-left font-semibold">Start Time</th>
                  <th className="px-4 py-2 border text-left font-semibold">End Time</th>
                  <th className="px-4 py-2 border text-left font-semibold">Time Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userRecords.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">No records found.</td></tr>
                ) : (
                  userRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-2 border">{rec.fields.Date || ''}</td>
                      <td className="px-4 py-2 border">{rec.fields.Task || ''}</td>
                      {/* <td className="px-3 py-2 border">{rec.fields.Description || ''}</td> */}
                      <td className="px-4 py-2 border">{rec.fields["Task URL"] || ''}</td>
                      <td className="px-4 py-2 border">{rec.fields.StartTime || ''}</td>
                      <td className="px-4 py-2 border">{rec.fields.EndTime || ''}</td>
                      <td className="px-4 py-2 border text-right">{rec.fields.TimeDuration || ''}</td>
                    </tr>
                  ))
                )}
                {/* Sum row */}
                {userRecords.length > 0 && (
                  <tr className="bg-blue-100 font-bold">
                    <td className="px-4 py-2 border text-right" colSpan={5}>Total</td>
                    <td className="px-4 py-2 border text-right">{formatMinutesToHHMM(totalTimeDuration)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home