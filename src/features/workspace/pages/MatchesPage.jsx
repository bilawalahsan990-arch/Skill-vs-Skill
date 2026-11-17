import { getWeekdayNames } from '../../../api/workspaceApi.js'

function formatSessionDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatMatchingDays(days = []) {
  const weekdayNames = getWeekdayNames()
  return days.map((day) => weekdayNames[Number(day) - 1])
    .join(', ')
}

function MatchesPage({
  activeTab,
  onTabChange,
  matches,
  sessions,
  isLoading,
  onRequestSession,
  onSessionAction,
  onReviewSession,
  onManageAvailability,
}) {
  const intent = activeTab === 'teaching' ? 'Offer' : 'Learn'
  const visibleMatches = matches.filter((match) => match.intent === intent)
  const visibleSessions = sessions.filter((session) => session.currentUserIntent === intent)

  return (
    <div className="page-stack">
      <section className="page-heading-row">
        <div>
          <span className="page-eyebrow">YOUR SKILL EXCHANGES</span>
          <h1>Matches</h1>
          <p>Find members whose skills and availability match yours.</p>
        </div>
        <button className="button button-primary" type="button" onClick={onManageAvailability}>Manage availability</button>
      </section>

      <div className="match-tabs" role="tablist" aria-label="Match type">
        <button type="button" role="tab" aria-selected={activeTab === 'teaching'} className={activeTab === 'teaching' ? 'is-active' : ''} onClick={() => onTabChange('teaching')}>
          Teaching <b>{matches.filter((match) => match.intent === 'Offer').length}</b>
        </button>
        <button type="button" role="tab" aria-selected={activeTab === 'learning'} className={activeTab === 'learning' ? 'is-active' : ''} onClick={() => onTabChange('learning')}>
          Learning <b>{matches.filter((match) => match.intent === 'Learn').length}</b>
        </button>
      </div>

      <section className="content-card schedule-card">
        <div className="section-heading schedule-heading">
          <div><h2>Potential matches</h2><p>Matches are calculated from your active listings and availability.</p></div>
          <button type="button" className="button button-secondary" onClick={onManageAvailability}>Update availability</button>
        </div>
        {isLoading ? <div className="empty-schedule"><strong>Loading matches…</strong></div> : visibleMatches.length ? (
          <div className="match-list">
            {visibleMatches.map((match) => (
              <article className="tutor-card" key={`${match.userId}-${match.skillId}`}>
                <span className="avatar avatar-user">{match.initials}</span>
                <div className="tutor-main">
                  <div className="tutor-name-row"><strong>{match.name}</strong><span className="tutor-title">{match.matchType} match</span></div>
                  <div className="tutor-metadata"><span>{match.skillName}</span><span>{formatMatchingDays(match.matchingDays)}</span></div>
                  <div className="tutor-tags">
                    {match.matchingSlots.map((slot, index) => (
                      <span key={`${slot.DayOfWeek}-${index}`}>
                        {slot.TeacherStartTime}–{slot.TeacherEndTime}
                      </span>
                    ))}
                  </div>
                </div>
                <button type="button" className="button button-primary tutor-book" onClick={() => onRequestSession(match)}>Request session</button>
              </article>
            ))}
          </div>
        ) : <div className="empty-schedule"><strong>No matches available.</strong><p>Add a skill listing and matching availability to discover members.</p></div>}
      </section>

      <section className="content-card schedule-card">
        <div className="section-heading"><div><h2>Your sessions</h2><p>Session requests and scheduled exchanges from the API.</p></div></div>
        {visibleSessions.length ? (
          <div className="match-list">
            {visibleSessions.map((session) => (
              <article className="tutor-card" key={session.id}>
                <span className="avatar avatar-user">{session.otherUserName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
                <div className="tutor-main">
                  <div className="tutor-name-row"><strong>{session.otherUserName}</strong><span className="tutor-title">{session.status}</span></div>
                  <div className="tutor-metadata"><span>{session.skillName}</span>{session.scheduledStart && <span>{formatSessionDate(session.scheduledStart)}</span>}</div>
                </div>
                {session.status === 'Requested' && session.canRespond && (
                  <>
                    <button type="button" className="button button-soft" onClick={() => onSessionAction(session.id, 'reject')}>Decline</button>
                    <button type="button" className="button button-primary" onClick={() => onSessionAction(session.id, 'accept')}>Accept</button>
                  </>
                )}
                {session.status === 'Scheduled' && <button type="button" className="button button-primary" onClick={() => onReviewSession(session)}>Complete &amp; review</button>}
              </article>
            ))}
          </div>
        ) : <div className="empty-schedule"><strong>No sessions yet.</strong></div>}
      </section>
    </div>
  )
}

export default MatchesPage

