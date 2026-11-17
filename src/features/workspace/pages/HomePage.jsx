function formatRelativeTime(value) {
  if (!value) return ''
  const timestamp = new Date(value).getTime()
  if (Number.isNaN(timestamp)) return ''
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function formatSessionDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

function formatSessionTime(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

function HomePage({ user, sessions, isLoading, onSessionAction, onNavigate }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now).toUpperCase()
  const pendingSessions = sessions.filter((session) => session.status === 'Requested')
  const teachingRequests = pendingSessions.filter((session) => session.currentUserIntent === 'Offer').length
  const learningRequests = pendingSessions.filter((session) => session.currentUserIntent === 'Learn').length
  const nextSession = sessions
    .filter((session) => session.status === 'Scheduled' && session.scheduledStart && new Date(session.scheduledStart) >= now)
    .sort((left, right) => new Date(left.scheduledStart) - new Date(right.scheduledStart))[0]

  return (
    <div className="page-stack">
      <section className="welcome-row">
        <div>
          <span className="page-eyebrow">{date}</span>
          <h1>{greeting}, {user.name} <span aria-hidden="true">✦</span></h1>
          <p>Your teaching and learning requests, all in one place.</p>
        </div>
        <button className="button button-primary" type="button" onClick={() => onNavigate('matches')}>
          <span aria-hidden="true">＋</span> Find a match
        </button>
      </section>

      <section className="stats-grid" aria-label="Request summary">
        <article className="stat-card">
          <div className="stat-heading"><span>Teaching requests</span><span className="stat-icon mint">↗</span></div>
          <strong>{teachingRequests} <small>pending</small></strong>
          <p>Requests for skills you offer</p>
        </article>
        <article className="stat-card">
          <div className="stat-heading"><span>Learning requests</span><span className="stat-icon lilac">⌁</span></div>
          <strong>{learningRequests} <small>pending</small></strong>
          <p>Requests for skills you want</p>
        </article>
        <article className="stat-card next-session-stat">
          <div className="stat-heading"><span>Next session</span><span className="stat-icon mint">◷</span></div>
          <strong>{nextSession ? formatSessionTime(nextSession.scheduledStart) : '—'}</strong>
          <p>{nextSession ? `${formatSessionDate(nextSession.scheduledStart)} · ${nextSession.skillName} with ${nextSession.otherUserName}` : 'No upcoming sessions'}</p>
        </article>
      </section>

      <div className="dashboard-grid">
        <section className="content-card requests-card">
          <div className="section-heading">
            <div>
              <h2>Session requests</h2>
              <p>Review invitations from your community.</p>
            </div>
            <button type="button" className="inline-link" onClick={() => onNavigate('matches')}>View matches <span aria-hidden="true">→</span></button>
          </div>
          <div className="request-list">
            {isLoading ? <p className="admin-empty-state">Loading sessions…</p> : pendingSessions.map((session) => {
              const canReview = session.requestedByUserId !== Number(user.id)
              return (
                <article className="request-card" key={session.id}>
                  <header className="request-person">
                    <span className="avatar avatar-user">{session.otherUserName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
                    <span className="person-summary">
                      <strong>{session.otherUserName}<span className="learner-tag">{session.currentUserIntent === 'Offer' ? 'Learner' : 'Teacher'}</span></strong>
                      <small>{session.skillName}</small>
                    </span>
                    <time>{formatRelativeTime(session.createdAt)}</time>
                  </header>
                  <div className="request-message">
                    <span className="request-type">SESSION REQUEST</span>
                    <p>{session.otherUserName} wants to exchange <strong>{session.skillName}</strong> with you.</p>
                  </div>
                  {canReview ? (
                    <footer className="request-actions">
                      <button type="button" className="button button-soft" onClick={() => onSessionAction(session.id, 'reject')}>Decline</button>
                      <button type="button" className="button button-primary" onClick={() => onSessionAction(session.id, 'accept')}>Accept request</button>
                    </footer>
                  ) : <div className="request-status">Waiting for the other member to respond</div>}
                </article>
              )
            })}
            {!isLoading && !pendingSessions.length && <div className="empty-schedule"><strong>No pending session requests.</strong></div>}
          </div>
        </section>

        <aside className="dashboard-side">
          <section className="content-card today-card">
            <div className="section-heading">
              <div><h2>Upcoming session</h2><p>Your next scheduled exchange</p></div>
            </div>
            {nextSession ? (
              <div className="today-session">
                <div className="session-time"><strong>{formatSessionTime(nextSession.scheduledStart)}</strong></div>
                <div className="session-details">
                  <span className="session-type">{nextSession.currentUserIntent === 'Offer' ? 'TEACHING' : 'LEARNING'} · {nextSession.skillName}</span>
                  <strong>{nextSession.otherUserName}</strong>
                  <small>{formatSessionDate(nextSession.scheduledStart)}</small>
                </div>
              </div>
            ) : <div className="empty-schedule"><p>No scheduled sessions yet.</p></div>}
            <button className="button button-primary full-button" type="button" onClick={() => onNavigate('matches')}>View sessions</button>
          </section>

          <section className="content-card skill-prompt-card">
            <span className="prompt-sparkle" aria-hidden="true">✦</span>
            <span className="page-eyebrow">YOUR NEXT EXCHANGE</span>
            <h2>What would you love to learn?</h2>
            <p>Find someone nearby who can help you grow your skills.</p>
            <button className="inline-link" type="button" onClick={() => onNavigate('marketplace')}>Explore skills <span aria-hidden="true">→</span></button>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default HomePage
