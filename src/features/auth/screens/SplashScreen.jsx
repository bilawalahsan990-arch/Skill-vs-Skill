import BrandMark from '../components/BrandMark.jsx'

function SplashScreen() {
  return (
    <main className="splash-screen">
      <div className="splash-glow splash-glow-one" aria-hidden="true" />
      <div className="splash-glow splash-glow-two" aria-hidden="true" />
      <div className="splash-content">
        <BrandMark />
        <h1>Skill-vs-Skill</h1>
        <p>Learn anything. Teach anything.</p>
        <span className="loading-spinner" aria-hidden="true" />
        <span className="loading-message" role="status">Connecting trade partners...</span>
      </div>
    </main>
  )
}

export default SplashScreen
