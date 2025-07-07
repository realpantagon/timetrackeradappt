import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './home'
import Login from './Login'

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
