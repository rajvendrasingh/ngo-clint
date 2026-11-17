import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '4rem 0 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', paddingBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ background: '#16a34a', borderRadius: '0.5rem', padding: '0.375rem', display: 'flex' }}>
                <Heart size={20} color="white" fill="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'white' }}>NGO<span style={{ color: '#22c55e' }}>Connect</span></span>
            </div>
            <p style={{ lineHeight: 1.7, fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
              Connecting passionate volunteers with meaningful community service opportunities since 2020.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" style={{ width: '2.25rem', height: '2.25rem', background: '#1e293b', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.target.style.background = '#16a34a'; e.target.style.color = 'white'; }}
                  onMouseLeave={e => { e.target.style.background = '#1e293b'; e.target.style.color = '#64748b'; }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '1.25rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[['/', 'Home'], ['/about', 'About Us'], ['/activities', 'Activities'], ['/contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9375rem', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#22c55e'}
                  onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '1.25rem' }}>Programs</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {['Education', 'Environment', 'Food Distribution', 'Health Awareness', 'Social Welfare', 'Digital Literacy'].map(p => (
                <Link key={p} to="/activities" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9375rem', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#22c55e'}
                  onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '1.25rem' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9375rem' }}>
                <MapPin size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                <span>123 Community Drive, New York, NY 10001</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9375rem' }}>
                <Phone size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                <a href="tel:+12345678900" style={{ color: '#94a3b8', textDecoration: 'none' }}>+1 234 567 8900</a>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9375rem' }}>
                <Mail size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                <a href="mailto:info@ngoconnect.org" style={{ color: '#94a3b8', textDecoration: 'none' }}>info@ngoconnect.org</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', padding: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem' }}>© {new Date().getFullYear()} NGO Connect. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
