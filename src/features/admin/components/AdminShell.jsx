import BrandMark from '../../auth/components/BrandMark.jsx'
import { mapCurrentUser } from '../../../api/workspaceApi.js'

const adminNavigation = [
  { id: 'requests', label: 'Requests', icon: '◉' },
  { id: 'skills', label: 'Skills', icon: '▧' },
  { id: 'categories', label: 'Categories', icon: '▦' },
  { id: 'users', label: 'Users', icon: '♙' },
]

function AdminShell({ user, pendingRequestCount, activePage, pageTitle, onNavigate, onExit, children }) {
  const currentUser = mapCurrentUser(user)

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="#admin" onClick={(event) => {
          event.preventDefault()
          onNavigate('requests')
        }}>
          <BrandMark />
          <span><strong>Skill vs Skill</strong><small>ADMIN WORKSPACE</small></span>
        </a>
        <div className="admin-live-state"><span className="admin-live-dot" /> Live <span>Admin workspace</span></div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {adminNavigation.map((item) => {
            const isActive = activePage === item.id || (item.id === 'requests' && activePage === 'review')
            return (
              <button
                type="button"
                key={item.id}
                className={`admin-nav-item${isActive ? ' is-active' : ''}`}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'requests' && pendingRequestCount > 0 && <span className="admin-nav-count">{pendingRequestCount}</span>}
              </button>
            )
          })}
        </nav>
        <div className="admin-sidebar-spacer" />
        <button className="admin-return-button" type="button" onClick={onExit}>
          <span aria-hidden="true">←</span> Return to app
        </button>
        <div className="admin-user">
          <span className="admin-avatar">{currentUser.initials}</span>
          <span><strong>{currentUser.name}</strong><small>Administrator</small></span>
          <span className="admin-user-badge">Admin</span>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>Admin workspace</span><span>/</span><strong>{pageTitle}</strong></div>
          <div className="admin-topbar-actions">
            <label className="admin-global-search"><span aria-hidden="true">⌕</span><input aria-label="Search admin workspace" placeholder="Search..." /><kbd>⌘ K</kbd></label>
            <span className="admin-status"><i /> Live</span>
            <button type="button" className="admin-top-user" onClick={onExit} aria-label="Exit admin workspace">
              <span className="admin-avatar">{currentUser.initials}</span>
            </button>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}

export default AdminShell
