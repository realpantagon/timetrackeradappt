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
    <div className="min-h-screen transition-all duration-500 bg-[#0D0C0F] flex items-center justify-center">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900"></div>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-2xl shadow-2xl rounded-2xl border transition-all duration-300 hover:shadow-3xl bg-white/5 border-white/10">
          {/* Header */}
          <div className="px-6 py-6 border-b border-white/10">
            <div className="text-center">
              <h1 className="text-3xl font-bold flex items-center justify-center gap-3 text-white">
                <span className="text-3xl">⏱️</span>
                Time Tracker
              </h1>
              <p className="text-gray-300 mt-2 text-sm">Adappt Co.</p>
            </div>
          </div>
          
          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-200"
                >
                  Username <span className="text-[#DA3761]">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DA3761] focus:border-transparent transition-all duration-300 backdrop-blur-sm border-white/20 bg-white/10 text-white placeholder-gray-400"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#DA3761] hover:bg-[#c42d56] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DA3761] hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>🚪</span>
                    Login
                  </div>
                )}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 border rounded-xl p-4 text-[#DA3761] transition-all duration-300 backdrop-blur-sm bg-[#DA3761]/10 border-[#DA3761]/30">
                <div className="flex items-center gap-2">
                  <span className="text-[#DA3761]">⚠️</span>
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}
            
            {/* Footer info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                <span className="text-[#DA3761]">*</span> Required field
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer branding */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Powered by Adappt Co. © 2025
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login