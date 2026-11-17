import { useMemo, useState } from 'react'

function AdminRequestsPage({ requests, dashboard, isLoading, onReview }) {
  const [query, setQuery] = useState('')
  const pendingCount = requests.filter((request) => request.status === 'pending').length
  const pendingRequests = useMemo(() => requests.filter((request) => (
    request.status === 'pending'
    && `${request.skill} ${request.requester} ${request.category}`.toLowerCase().includes(query.toLowerCase())
  )), [query, requests])

  return (
    <div className="admin-page-stack">
      <section className="admin-page-heading">
        <div><span className="admin-eyebrow">ADMIN WORKSPACE</span><h1>Requests</h1><p>Review and approve community skill submissions.</p></div>
        <button type="button" className="admin-filter-button">☷ Filter</button>
      </section>

      <section className="admin-metrics-grid">
        <article className="admin-metric-card"><span className="admin-metric-icon mint">◉</span><span><strong>{pendingCount}</strong><small>Pending requests</small></span></article>
        <article className="admin-metric-card"><span className="admin-metric-icon lilac">▧</span><span><strong>{dashboard.LiveSkills ?? 0}</strong><small>Live skills</small></span></article>
        <article className="admin-metric-card"><span className="admin-metric-icon peach">♙</span><span><strong>{dashboard.Users ?? 0}</strong><small>Users</small></span></article>
      </section>

      <section className="admin-list-panel">
        <div className="admin-list-toolbar">
          <label className="admin-search-input"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pending requests..." aria-label="Search pending requests" /></label>
          <button type="button" className="admin-filter-button">☷ Filter</button>
        </div>
        <div className="admin-section-title"><h2>Pending requests <span>{pendingCount}</span></h2><small>Newest submissions first</small></div>
        <div className="admin-request-list">
          {isLoading ? <div className="admin-empty-state">Loading requests…</div> : pendingRequests.map((request) => (
            <article className="admin-request-card" key={request.id}>
              <div className="admin-request-skill-icon">✦</div>
              <div className="admin-request-info">
                <div className="admin-request-title"><strong>{request.skill}</strong><time>{request.age}</time></div>
                <p>Requested by <b>{request.requester}</b></p>
                <small>⌖ {request.location} <span>·</span> {request.category}</small>
                <span className="admin-category-tag">{request.category}</span>
              </div>
              <button type="button" className="admin-primary-button admin-review-button" onClick={() => onReview(request.id)}>Review <span>→</span></button>
            </article>
          ))}
          {!isLoading && !pendingRequests.length && <div className="admin-empty-state">{pendingCount ? 'No pending requests match this search.' : 'All caught up. There are no pending skill requests.'}</div>}
        </div>
      </section>
    </div>
  )
}

export default AdminRequestsPage
