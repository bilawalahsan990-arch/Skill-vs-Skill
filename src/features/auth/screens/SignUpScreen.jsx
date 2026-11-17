import AuthLayout from '../components/AuthLayout.jsx'

function SignUpScreen({ onLogin, onRegister, error, isSubmitting }) {
  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const password = formData.get('password')
    const confirmation = formData.get('confirmPassword')
    const confirmationInput = form.elements.namedItem('confirmPassword')

    if (password !== confirmation) {
      confirmationInput.setCustomValidity('Passwords do not match.')
      form.reportValidity()
      return
    }

    onRegister({
      fullName: formData.get('name'),
      username: formData.get('username'),
      email: formData.get('email'),
      password,
      city: formData.get('city'),
      address: formData.get('address'),
    })
  }

  return (
    <AuthLayout
      navigationPrompt="Already have an account?"
      navigationLabel="Sign in"
      onNavigate={onLogin}
    >
      <div className="auth-card-heading signup-heading">
        <span className="auth-eyebrow">JOIN THE COMMUNITY</span>
        <h2>Create your account</h2>
        <p>Start trading skills with real people today.</p>
      </div>

      {error && <p className="auth-error" role="alert">{error}</p>}

      <form className="auth-form signup-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="full-name">Full name</label>
          <input id="full-name" name="name" type="text" autoComplete="name" required />
        </div>

        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" autoComplete="username" required />
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="signup-email">Email address</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" required />
        </div>

        <div className="form-field">
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" minLength="8" required />
        </div>

        <div className="form-field">
          <label htmlFor="confirm-password">Confirm password</label>
          <input id="confirm-password" name="confirmPassword" type="password" placeholder="Enter your password again" autoComplete="new-password" minLength="8" onChange={(event) => event.currentTarget.setCustomValidity('')} required />
        </div>

        <div className="form-field">
          <label htmlFor="city">City</label>
          <input id="city" name="city" type="text" autoComplete="address-level2" required />
        </div>

        <div className="form-field">
          <label htmlFor="address">Address</label>
          <input id="address" name="address" type="text" placeholder="Street, neighborhood, city" autoComplete="street-address" required />
        </div>

        <button type="submit" className="form-field-wide create-account-button" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" className="text-button" onClick={onLogin}>Sign in instead</button>
      </p>
    </AuthLayout>
  )
}

export default SignUpScreen
