import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Heart, LayoutDashboard, Users, Activity, FileText, Calendar, Award, MessageSquare, BarChart2, Settings, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/volunteers', icon: Users, label: 'Manage Volunteers' },
  { to: '/admin/activities', icon: Activity, label: 'Manage Activities' },
  { to: '/admin/applications', icon: FileText, label: 'Applications' },
  { to: '/admin/attendance', icon: Calendar, label: 'Attendance' },
  { to: '/admin/certificates', icon: Award, label: 'Certificates' },
  { to: '/admin/reports', icon: BarChart2, label: 'Reports' },
  { to: '/admin/contact', icon: MessageSquare, label: 'Contact Messages' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ background: '#16a34a', borderRadius: '0.5rem', padding: '0.375rem', display: 'flex' }}>
            <Heart size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>NGOConnect</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Admin Panel</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Management</div>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem', flexShrink: 0 }}>
              <Shield size={16} />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-nav-link" style={{ color: '#ef4444', width: '100%' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} className="mobile-toggle">
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>Admin Dashboard</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', background: '#fef3c7', color: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontWeight: 600 }}>Administrator</span>
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
