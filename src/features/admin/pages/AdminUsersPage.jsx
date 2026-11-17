import { useMemo, useState } from 'react'

function AdminUsersPage({ users, isLoading, onViewProfile, onManage }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const filters = ['All', ...new Set(users.map((user) => user.status))]
  const filteredUsers = useMemo(() => users.filter((user) => (
    `${user.name} ${user.location}`.toLowerCase().includes(query.toLowerCase())
    && (filter === 'All' || user.status === filter)
  )), [filter, query, users])

  return (
    <div className="admin-page-stack">
      <section className="admin-page-heading">
        <div><span className="admin-eyebrow">COMMUNITY MANAGEMENT</span><h1>User Directory</h1><p>Review accounts, membership, and community activity.</p></div>
        <button type="button" className="admin-primary-button">♙ Audit mode</button>
      </section>

      <section className="admin-list-panel">
        <label className="admin-search-input admin-user-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search user by name, username, or city..." aria-label="Search users" /><span aria-hidden="true">☷</span></label>
        <div className="admin-filter-chips user-filter-chips">
          {filters.map((value) => (
            <button type="button" className={filter === value ? 'is-active' : ''} key={value} onClick={() => setFilter(value)}>
              {value === 'All' ? `All users (${users.length})` : `${value} (${users.filter((user) => user.status === value).length})`}
            </button>
          ))}
        </div>
        <div className="admin-user-list">
          {isLoading ? <div className="admin-empty-state">Loading users…</div> : filteredUsers.map((user) => (
            <article className="admin-user-row" key={user.id}>
              <span className={`admin-avatar user-avatar-${user.initials.toLowerCase()}`}>{user.initials}</span>
              <div className="admin-user-info">
                <strong>{user.name} {user.verified && <span className="admin-verified-dot">✓</span>}</strong>
                <small>⌖ {user.location} <span>·</span> ★ {user.rating} <span>·</span> {user.swaps} Swaps</small>
              </div>
              <span className={`admin-user-state ${user.status.toLowerCase()}`}><i />{user.status}</span>
              <button type="button" className="admin-secondary-button" onClick={() => onViewProfile(user)}>View profile</button>
              <button type="button" className="admin-secondary-button" onClick={() => onManage(user)}>Manage</button>
              <button type="button" className="catalog-menu-button" onClick={() => onManage(user)} aria-label={`More actions for ${user.name}`}>⋮</button>
            </article>
          ))}
          {!isLoading && !filteredUsers.length && <div className="admin-empty-state">No users match these filters.</div>}
        </div>
        <div className="admin-list-footer"><span>{filteredUsers.length} users</span></div>
      </section>
    </div>
  )
}

export default AdminUsersPage
