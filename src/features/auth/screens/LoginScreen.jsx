import AuthLayout from '../components/AuthLayout.jsx'

function LoginScreen({ onSignUp, onLogin, error, isSubmitting }) {
  return (
    <AuthLayout
      navigationPrompt="New to Skill-vs-Skill?"
      navigationLabel="Create an account"
      onNavigate={onSignUp}
    >
      <div className="auth-card-heading">
        <span className="auth-eyebrow">WELCOME BACK</span>
        <h2>Sign in to your account</h2>
        <p>Pick up where you left off and keep learning.</p>
      </div>

      {error && <p className="auth-error" role="alert">{error}</p>}

      <form className="auth-form login-form" onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        onLogin({
          email: formData.get('email'),
          password: formData.get('password'),
        })
      }}>
        <label htmlFor="login-email">Email address</label>
        <input id="login-email" name="email" type="email" autoComplete="email" required />

        <div className="form-label-row">
          <label htmlFor="login-password">Password</label>
          <a href="#forgot-password">Forgot password?</a>
        </div>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required />

        <label className="remember-option" htmlFor="remember">
          <input id="remember" name="remember" type="checkbox" defaultChecked />
          <span>Remember me</span>
        </label>

        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account?{' '}
        <button type="button" className="text-button" onClick={onSignUp}>Sign up</button>
      </p>
    </AuthLayout>
  )
}

export default LoginScreen
