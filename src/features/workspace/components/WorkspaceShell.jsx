import BrandMark from '../../auth/components/BrandMark.jsx'

const navigation = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'marketplace', label: 'Marketplace', icon: '▧' },
  { id: 'matches', label: 'Matches', icon: '◈' },
  { id: 'messages', label: 'Messages', icon: '▤' },
  { id: 'profile', label: 'Profile', icon: '◉' },
  { id: 'admin', label: 'Admin', icon: '⚙' },
]

function WorkspaceShell({ user, unreadCount, activePage, onNavigate, onLogout, children }) {
  const date = new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <a className="workspace-brand" href="#home" onClick={(event) => {
          event.preventDefault()
          onNavigate('home')
        }}>
          <BrandMark />
          <span>
            <small>SKILL VS SKILL</small>
            <strong>SkillSwap</strong>
          </span>
        </a>

        <div className="sidebar-caption">WORKSPACE</div>
        <nav className="workspace-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = activePage === item.id
              || (item.id === 'marketplace' && activePage === 'skillDetail')
              || (item.id === 'profile' && activePage === 'availability')

            return (
              <button
                key={item.id}
                type="button"
                className={`workspace-nav-item${isActive ? ' is-active' : ''}`}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="workspace-nav-icon" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'messages' && unreadCount > 0 && <span className="nav-count">{unreadCount}</span>}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-tip">
          <span className="tip-icon" aria-hidden="true">✦</span>
          <strong>Skills grow when shared</strong>
          <p>Every exchange is a chance to learn something new.</p>
        </div>
        <button className="sidebar-user" type="button" onClick={() => onNavigate('profile')}>
          <span className="avatar avatar-user">{user.initials}</span>
          <span className="sidebar-user-info">
            <strong>{user.name}</strong>
            <small>Community member</small>
          </span>
          <span className="sidebar-user-menu" aria-hidden="true">···</span>
        </button>
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <label className="workspace-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Search people, skills, or sessions..." aria-label="Search people, skills, or sessions" />
            <kbd>⌘ K</kbd>
          </label>
          <div className="topbar-actions">
            <span className="topbar-date">{date}</span>
            <button className="notification-button" type="button" aria-label="Notifications">
              <span aria-hidden="true">♧</span>
              <i />
            </button>
            <button className="topbar-user" type="button" onClick={() => onNavigate('profile')} aria-label="Open profile">
              <span className="avatar avatar-user">{user.initials}</span>
              <span>{user.name.split(/\s+/)[0]}</span>
              <span aria-hidden="true">⌄</span>
            </button>
            <button className="logout-button" type="button" onClick={onLogout}>Log out</button>
          </div>
        </header>
        <main className="workspace-content">{children}</main>
      </div>
    </div>
  )
}

export default WorkspaceShell
