import { useEffect, useState } from 'react'
import './auth.css'
import LoginScreen from './screens/LoginScreen.jsx'
import SignUpScreen from './screens/SignUpScreen.jsx'
import SplashScreen from './screens/SplashScreen.jsx'

function AuthScreens({ onLogin, onRegister, initialError = '' }) {
  const [screen, setScreen] = useState('splash')
  const [error, setError] = useState(initialError)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setScreen('login'), 1600)
    return () => window.clearTimeout(timer)
  }, [])

  async function submit(action, values) {
    setError('')
    setIsSubmitting(true)
    try {
      await action(values)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (screen === 'splash') {
    return <SplashScreen />
  }

  if (screen === 'signup') {
    return (
      <SignUpScreen
        onLogin={() => {
          setError('')
          setScreen('login')
        }}
        onRegister={(values) => submit(onRegister, values)}
        error={error}
        isSubmitting={isSubmitting}
      />
    )
  }

  return (
    <LoginScreen
      onSignUp={() => {
        setError('')
        setScreen('signup')
      }}
      onLogin={(values) => submit(onLogin, values)}
      error={error}
      isSubmitting={isSubmitting}
    />
  )
}

export default AuthScreens
