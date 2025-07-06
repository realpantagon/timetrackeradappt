import { useEffect, useState, useRef } from 'react'

function Home({ username, setLoggedIn }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [task, setTask] = useState('')
  const [description, setDescription] = useState('')

  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Stopwatch effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => prev + 1)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  // Format elapsed time as HH:MM:SS
  const formatElapsed = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  // Button handler for stopwatch
  const handleToggle = () => setIsRunning(running => !running)

  // Submit handler (send username, date, task, description, time)
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      username,
      date: currentTime.toLocaleDateString(),
      task,
      description,
      time: formatElapsed(elapsed)
    }
    alert(
      `Username: ${data.username}\nDate: ${data.date}\nTask: ${data.task}\nDescription: ${data.description}\nTime: ${data.time}`
    )
    // You can send 'data' to your backend here if needed
  }

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
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter description"
          />
        </div>
        {/* Stopwatch and button */}
        <div className="flex items-center justify-between mt-4">
          <div className="font-semibold">Stopwatch:</div>
          <div className="text-lg font-mono">{formatElapsed(elapsed)}</div>
          <button
            type="button"
            onClick={handleToggle}
            className={`ml-4 px-4 py-2 rounded-full flex items-center justify-center transition-colors duration-300 text-white text-xl ${
              isRunning ? 'bg-green-500' : 'bg-red-500'
            }`}
            aria-label="Toggle stopwatch"
          >
            {isRunning ? (
              // Pause icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/>
                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>
              </svg>
            ) : (
              // Play icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <polygon points="8,5 19,12 8,19" fill="currentColor"/>
              </svg>
            )}
          </button>
        </div>
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
    </div>
  )
}

export default Home