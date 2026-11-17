function formatSessionDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(value))
}

function ListingSection({ title, intent, listings, isLoading, onNavigateToSkill }) {
  const items = listings.filter((listing) => listing.intent === intent)

  return (
    <section className="content-card profile-section">
      <div className="section-heading">
        <div><h2>{title} <span className="subtle-count">{items.length}</span></h2></div>
      </div>
      {isLoading ? <p>Loading listings…</p> : items.length ? items.map((listing) => (
        <button type="button" className="profile-featured-skill" key={listing.listingId} onClick={() => onNavigateToSkill(listing)}>
          <span className="skill-mark">{listing.skillName?.[0]?.toUpperCase()}</span>
          <span>
            <strong>{listing.skillName}</strong>
            <small>{[listing.proficiency, listing.duration, listing.topics].filter(Boolean).join(' · ')}</small>
          </span>
          <span className="skill-action">{listing.tokenRate ? `${listing.tokenRate} tokens/hr` : 'View skill'}</span>
        </button>
      )) : <p>No listings yet.</p>}
    </section>
  )
}

function MemberProfilePage({ user, listings, sessions, isLoading, onMessage, onManageAvailability, onNavigateToSkill }) {
  const completedSessions = sessions.filter((session) => session.status === 'Completed').length
  const activeSessions = sessions.filter((session) => ['Requested', 'Accepted', 'Scheduled', 'InProgress'].includes(session.status)).length

  return (
    <div className="page-stack profile-page">
      <section className="page-heading-row">
        <div>
          <span className="page-eyebrow">YOUR COMMUNITY PROFILE</span>
          <h1>Profile</h1>
          <p>{user.bio || 'Manage your skills, availability, and exchange history.'}</p>
        </div>
        <button type="button" className="button button-primary" onClick={onManageAvailability}>Set timetable</button>
      </section>

      <div className="my-profile-layout">
        <div className="profile-main-column">
          <section className="content-card member-profile-summary">
            <div className="member-profile-cover" />
            <div className="member-profile-identity">
              <span className="avatar avatar-profile">{user.initials}</span>
              <div className="member-profile-name">
                <h2>{user.name}</h2>
                <p>⌖ {user.city || 'Location not provided'}</p>
              </div>
              <button type="button" className="button button-secondary" onClick={onMessage}>Messages</button>
            </div>
            <div className="member-profile-stats">
              <article><span>▧</span><strong>{listings.length}</strong><small>Active listings</small></article>
              <article><span>↔</span><strong>{completedSessions}</strong><small>Completed sessions</small></article>
              <article><span>◷</span><strong>{activeSessions}</strong><small>Open sessions</small></article>
            </div>
          </section>

          <div className="profile-skill-panels">
            <ListingSection title="Skills offered" intent="Offer" listings={listings} isLoading={isLoading} onNavigateToSkill={onNavigateToSkill} />
            <ListingSection title="Skills wanted" intent="Learn" listings={listings} isLoading={isLoading} onNavigateToSkill={onNavigateToSkill} />
          </div>

          <section className="content-card profile-section profile-history-section">
            <div className="section-heading">
              <div><h2>Session history</h2><p>Sessions linked to your account.</p></div>
              <strong className="review-score">{sessions.length} sessions</strong>
            </div>
            {sessions.length ? sessions.map((session) => (
              <article className="history-item" key={session.id}>
                <span className="avatar avatar-user">{session.otherUserName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
                <div>
                  <strong>{session.otherUserName}<span className="history-topic">{session.currentUserIntent === 'Offer' ? 'Teaching' : 'Learning'}</span></strong>
                  <small>{session.skillName} · {session.status}</small>
                </div>
                <time>{formatSessionDate(session.scheduledStart || session.createdAt)}</time>
              </article>
            )) : <p>{isLoading ? 'Loading sessions…' : 'No sessions yet.'}</p>}
          </section>
        </div>

        <aside className="profile-aside">
          <section className="content-card profile-address-card">
            <span className="profile-card-icon">⌖</span>
            <h2>Address</h2>
            <p>{user.address || user.city || 'Address not provided'}</p>
            <div className="map-placeholder"><span>⌖</span><small>{user.city || 'Location not provided'}</small></div>
          </section>
          <section className="content-card profile-exchange-card">
            <span className="profile-card-icon">▦</span>
            <h2>Your availability</h2>
            <p>Manage your teaching and learning timetable.</p>
            <button type="button" className="button button-primary full-button" onClick={onManageAvailability}>View schedules</button>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default MemberProfilePage
