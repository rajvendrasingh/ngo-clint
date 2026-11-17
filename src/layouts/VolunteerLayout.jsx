import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Heart, LayoutDashboard, Search, ClipboardList, Calendar, Award, User, LogOut, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/browse', icon: Search, label: 'Browse Activities' },
  { to: '/dashboard/my-activities', icon: ClipboardList, label: 'My Activities' },
  { to: '/dashboard/attendance', icon: Calendar, label: 'Attendance' },
  { to: '/dashboard/certificates', icon: Award, label: 'My Certificates' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

export default function VolunteerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ background: '#16a34a', borderRadius: '0.5rem', padding: '0.375rem', display: 'flex' }}>
            <Heart size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>NGOConnect</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Volunteer Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main Menu</div>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem', flexShrink: 0 }}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Volunteer</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-nav-link" style={{ color: '#ef4444', width: '100%' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="dashboard-main">
        <header className="topbar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} className="mobile-toggle">
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9375rem', color: '#64748b' }}>Welcome back, </span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{user?.fullName?.split(' ')[0]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8125rem', background: '#dcfce7', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontWeight: 600 }}>
              {user?.totalServiceHours || 0} hrs
            </span>
          </div>
        </header>
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 90 }} />
      )}

      <style>{`@media (max-width: 1024px) { .mobile-toggle { display: flex !important; } }`}</style>
    </div>
  );
}
