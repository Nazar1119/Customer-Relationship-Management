import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const navItems = [
  { to: '/clients', label: 'Clients' },
  { to: '/requests', label: 'Requests' },
  { to: '/diagnostics', label: 'Diagnostics' },
  { to: '/reports', label: 'Reports' },
  { to: '/admin/users', label: 'Admin', requiresAdmin: true },
]

const AppLayout = () => {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">💸</div>
          <div>
            <div className="brand-title">DeviceCare</div>
            <div className="brand-subtitle">Field Ops</div>
          </div>
        </div>
        <nav className="nav">
          {navItems
            .filter((item) => (item.requiresAdmin ? isAdmin : true))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="crumbs">
            <span className="crumb">Home</span>
            {segments.map((segment, idx) => (
              <span key={segment} className="crumb">
                / {segment}
              </span>
            ))}
          </div>
          <div className="user-badge">
            <div className="user-meta">
              <div className="user-name">{user?.name || 'Signed in'}</div>
              <div className="user-role">{user?.role}</div>
            </div>
            <button className="ghost" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        <section className="page-surface">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default AppLayout
