import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AIRTABLE_API_KEY = 'patyOkldR8Ru7t7Vg.5bdd091e82a16b066ebe257d6d37163c9920bce6329c22c9c25d97fff959e762'
const AIRTABLE_BASE_ID = 'app27di9Mzgt9zhTa'
const AIRTABLE_TABLE_NAME = 'Employees'

function Login({ setUsername, username, setLoggedIn }) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const encodedUsername = encodeURIComponent(username)
    const filterFormula = `({Full Name} = '${encodedUsername}')`
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula=${filterFormula}`
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to fetch data from Airtable.')
      }
      const data = await response.json()
      if (data.records && data.records.length > 0) {
        setLoggedIn(true)
        setIsLoading(false)
        navigate('/home')
      } else {
        setError('Login failed: Invalid username.')
      }
    } catch (error) {
      setError(`An error occurred: ${error.message}`)
    } finally {
      setIsLoading(false)
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
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-center">{error}</div>
        )}
      </div>
    </div>
  )
}

export default Login