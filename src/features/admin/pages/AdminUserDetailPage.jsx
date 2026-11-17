function AdminUserDetailPage({ user, onBack, onToggleStatus }) {
  if (!user) return null

  return (
    <div className="admin-page-stack admin-user-detail-page">
      <section className="admin-user-detail-heading">
        <button type="button" className="admin-back-link" onClick={onBack}><span>‹</span> User directory</button>
        <button type="button" className="admin-filter-button" onClick={() => onToggleStatus(user)}>
          {user.status === 'Active' ? 'Suspend user' : 'Activate user'}
        </button>
      </section>

      <section className="admin-user-profile-card">
        <div className="admin-user-cover" />
        <div className="admin-user-profile-body">
          <span className={`admin-avatar admin-large-avatar user-avatar-${user.initials.toLowerCase()}`}>{user.initials}</span>
          <div className="admin-user-profile-info">
            <h1>{user.name} {user.verified && <span className="admin-verified-dot">✓</span>}</h1>
            <p>{user.handle} <span>·</span> {user.location}</p>
            <span className={`admin-user-state ${user.status.toLowerCase()}`}><i /> {user.status}</span>
          </div>
          <span className="admin-joined-date">Joined {user.joined}</span>
        </div>
        <div className="admin-user-stats">
          <article><strong>{user.swaps}</strong><small>Swaps</small></article>
          <article><strong>{user.rating}</strong><small>Reviews</small></article>
          <article><strong>{user.verified ? 'Yes' : 'No'}</strong><small>Verified</small></article>
        </div>
      </section>

      <section className="admin-token-grid">
        <article className="admin-token-card earned"><span>✦ TOKEN CREDITS</span><strong>{user.tokens}</strong><small>Available tokens</small></article>
        <article className="admin-token-card spent"><span>◉ SPENT TOKENS</span><strong>{user.spent}</strong><small>Spent tokens</small></article>
      </section>

      <div className="admin-user-detail-grid">
        <section className="admin-list-panel admin-user-skills-panel">
          <div className="admin-section-title"><h2>Skills offered <span>{user.offeredSkills.length}</span></h2></div>
          {user.offeredSkills.map((skill) => <article className="admin-user-skill-card" key={skill}><span className="catalog-skill-icon">▧</span><div><strong>{skill}</strong></div></article>)}
          {!user.offeredSkills.length && <p>No offered skills.</p>}
        </section>
        <section className="admin-list-panel admin-user-skills-panel">
          <div className="admin-section-title"><h2>Skills learning <span>{user.learningSkills.length}</span></h2></div>
          {user.learningSkills.map((skill) => <article className="admin-user-skill-card wanted-skill-card" key={skill}><span className="catalog-skill-icon">▧</span><div><strong>{skill}</strong></div></article>)}
          {!user.learningSkills.length && <p>No learning skills.</p>}
        </section>
      </div>
    </div>
  )
}

export default AdminUserDetailPage
