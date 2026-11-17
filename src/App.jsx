import { useEffect, useState } from 'react'
import { apiRequest, clearStoredToken, getStoredToken, storeToken } from './api/apiClient.js'
import AuthScreens from './features/auth/AuthScreens.jsx'
import WorkspaceApp from './features/workspace/WorkspaceApp.jsx'

function App() {
  const [session, setSession] = useState(null)
  const [isRestoringSession, setIsRestoringSession] = useState(() => Boolean(getStoredToken()))
  const [restoreError, setRestoreError] = useState('')

  useEffect(() => {
    const token = getStoredToken()
    if (!token) return undefined

    let isCurrent = true
    apiRequest('/api/auth/me', { token })
      .then((user) => {
        if (isCurrent) setSession({ token, user })
      })
      .catch((error) => {
        if (!isCurrent) return
        if (error.status === 401 || error.status === 403) clearStoredToken()
        else setRestoreError(error.message)
      })
      .finally(() => {
        if (isCurrent) setIsRestoringSession(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  async function signIn({ email, password }) {
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ Email: email, Password: password }),
    })
    const token = result?.Token || result?.token
    const user = result?.User || result?.user
    if (!token || !user) {
      throw new Error('The API login response did not include a token and user.')
    }
    storeToken(token)
    setSession({ token, user })
  }

  async function signUp({ fullName, username, email, password, city, address }) {
    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        UserName: username,
        FullName: fullName,
        Email: email,
        Password: password,
        Status: 'Active',
        City: city,
        Address: address,
      }),
    })
    await signIn({ email, password })
  }

  function signOut() {
    clearStoredToken()
    setSession(null)
  }

  if (isRestoringSession) return <div className="app-loading">Checking your session…</div>

  return session
    ? <WorkspaceApp session={session} onLogout={signOut} />
    : <AuthScreens onLogin={signIn} onRegister={signUp} initialError={restoreError} />
}

export default App
