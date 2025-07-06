import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './home' // <-- Import the Home component

function Login({ setUsername, username, setLoggedIn }) {
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (username.trim() !== '') {
      setLoggedIn(true)
      navigate('/home')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Adappt Co. Time Tracker</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [username, setUsername] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !loggedIn ? (
              <Login setUsername={setUsername} username={username} setLoggedIn={setLoggedIn} />
            ) : (
              <Home username={username} setLoggedIn={setLoggedIn} />
            )
          }
        />
        <Route
          path="/home"
          element={
            loggedIn ? (
              <Home username={username} setLoggedIn={setLoggedIn} />
            ) : (
              <Login setUsername={setUsername} username={username} setLoggedIn={setLoggedIn} />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
