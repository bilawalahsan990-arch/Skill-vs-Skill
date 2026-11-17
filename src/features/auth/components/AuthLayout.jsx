import BrandMark from './BrandMark.jsx'

function AuthLayout({ children, onNavigate, navigationLabel, navigationPrompt }) {
  return (
    <div className="auth-app">
      <header className="site-header">
        <a className="site-brand" href="/" aria-label="Skill-vs-Skill home">
          <BrandMark />
          <span>Skill<span className="brand-divider">-vs-</span>Skill</span>
        </a>
        <nav className="site-navigation" aria-label="Account navigation">
          <span>{navigationPrompt}</span>
          <button type="button" className="header-link" onClick={onNavigate}>
            {navigationLabel}
          </button>
        </nav>
      </header>

      <main className="auth-stage">
        <section className="brand-panel">
          <div className="brand-panel-content">
            <span className="brand-kicker">LEARN TOGETHER</span>
            <h1>
              Trade what you know.
              <span>Learn what you don&apos;t.</span>
            </h1>
            <p>
              Connect with people in your community, share your skills, and
              discover something new in return.
            </p>
            <div className="benefit-list" aria-label="How it works">
              <span><span className="benefit-icon" aria-hidden="true">↗</span> Share what you know</span>
              <span><span className="benefit-icon" aria-hidden="true">✳</span> Learn from each other</span>
            </div>
          </div>
          <div className="brand-panel-orbit orbit-one" aria-hidden="true" />
          <div className="brand-panel-orbit orbit-two" aria-hidden="true" />
          <div className="brand-panel-watermark" aria-hidden="true" />
          <span className="brand-panel-note">A community built on shared skills</span>
        </section>

        <section className="auth-panel" aria-label="Account access">
          <div className="auth-card">
            {children}
            <p className="card-footer">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
          </div>
        </section>
      </main>
      <footer className="site-footer">© 2026 Skill-vs-Skill <span>•</span> Learn anything. Teach anything.</footer>
    </div>
  )
}

export default AuthLayout
