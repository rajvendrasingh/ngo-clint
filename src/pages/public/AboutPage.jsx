import React from 'react';
import { Heart, Target, Eye, Users, Award, Globe } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';

const team = [
  { name: 'Dr. Amanda Foster', role: 'Executive Director', bio: 'Leading NGO Connect with 15+ years in community development.' },
  { name: 'James Williams', role: 'Program Manager', bio: 'Coordinating 100+ volunteer programs annually across all categories.' },
  { name: 'Priya Kapoor', role: 'Volunteer Relations', bio: 'Ensuring every volunteer has a meaningful and rewarding experience.' },
  { name: 'Carlos Martinez', role: 'Technology Lead', bio: 'Building and maintaining the NGO Connect platform for seamless operations.' },
];

const values = [
  { icon: Heart, title: 'Compassion', desc: 'We act with empathy and genuine care for every community member.' },
  { icon: Target, title: 'Impact', desc: 'Every activity is designed to create measurable, lasting positive change.' },
  { icon: Users, title: 'Inclusivity', desc: 'We welcome volunteers from all backgrounds and walks of life.' },
  { icon: Award, title: 'Excellence', desc: 'We maintain the highest standards in everything we do.' },
  { icon: Globe, title: 'Sustainability', desc: 'Our programs are designed to create long-term community benefits.' },
  { icon: Eye, title: 'Transparency', desc: 'We operate with full honesty and accountability in all matters.' },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', padding: '5rem 0 4rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>About NGO Connect</h1>
          <p style={{ fontSize: '1.125rem', color: '#475569', lineHeight: 1.8 }}>
            We're a passionate organization dedicated to connecting volunteers with meaningful community service opportunities, creating a network of change-makers across the globe.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad" style={{ background: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1.25rem' }}>Our Story</h2>
            <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: '1rem' }}>
              NGO Connect was founded in 2020 with a simple yet powerful vision: make it easy for anyone to contribute to their community. What started as a small local initiative has grown into a platform connecting thousands of volunteers with hundreds of impactful programs.
            </p>
            <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Today, we operate across multiple cities, managing a diverse range of activities from education and environment to food distribution and health awareness. Our technology-driven approach ensures transparency, efficiency, and recognition for every volunteer's contribution.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[['2020', 'Founded'], ['1200+', 'Volunteers'], ['100+', 'Programs'], ['15K+', 'Service Hours']].map(([val, label]) => (
                <div key={label} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>{val}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '1.5rem', padding: '3rem', color: 'white' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Our Vision</div>
              <p style={{ opacity: 0.9, lineHeight: 1.7 }}>A world where every person actively contributes to their community's growth and well-being, creating a ripple effect of positive change.</p>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Our Mission</div>
              <p style={{ opacity: 0.9, lineHeight: 1.7 }}>To create an accessible, transparent, and rewarding volunteer ecosystem that maximizes social impact through technology and community collaboration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad" style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>Our Core Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {values.map((v, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '1rem', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '3rem', height: '3rem', background: '#f0fdf4', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <v.icon size={22} color="#16a34a" />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{v.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.9375rem' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad" style={{ background: 'white' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>Our Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
            {team.map((member, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '2rem 1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem', fontWeight: 700 }}>
                  {member.name.charAt(0)}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{member.name}</h3>
                <div style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem' }}>{member.role}</div>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
