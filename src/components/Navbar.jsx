import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/activities', label: 'Activities' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 200 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ background: '#16a34a', borderRadius: '0.5rem', padding: '0.375rem', display: 'flex' }}>
            <Heart size={20} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#0f172a' }}>NGO<span style={{ color: '#16a34a' }}>Connect</span></span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} style={({ isActive }) => ({
              padding: '0.5rem 0.875rem',
              borderRadius: '0.375rem',
              fontWeight: 500,
              fontSize: '0.9375rem',
              color: isActive ? '#16a34a' : '#475569',
              background: isActive ? '#f0fdf4' : 'transparent',
              textDecoration: 'none',
            })}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join as Volunteer</Link>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem' }}
              >
                <div className="avatar" style={{ width: '2rem', height: '2rem', fontSize: '0.875rem', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 600 }}>
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{user.fullName?.split(' ')[0]}</span>
                <ChevronDown size={16} color="#64748b" />
              </button>
              {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', minWidth: '180px', zIndex: 300 }}>
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#475569', textDecoration: 'none', fontSize: '0.9375rem' }}
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <div style={{ borderTop: '1px solid #e2e8f0' }} />
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: '0.9375rem' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }} className="mobile-menu-btn">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid #e2e8f0', background: 'white', padding: '1rem' }}>
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({ display: 'block', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: 500, color: isActive ? '#16a34a' : '#475569', background: isActive ? '#f0fdf4' : 'transparent', marginBottom: '0.25rem' })}>
              {l.label}
            </NavLink>
          ))}
          {!user ? (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Join as Volunteer</Link>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-outline" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-danger" style={{ marginTop: '0.5rem', width: '100%' }}>Logout</button>
            </div>
          )}
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
