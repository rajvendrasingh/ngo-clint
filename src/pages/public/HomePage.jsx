import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Activity, Clock, Award, ArrowRight, CheckCircle, Leaf, BookOpen, Utensils, HeartPulse, Globe, Laptop, Star, ChevronRight } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { reportService } from '../../services/api.js';

const categories = [
  { icon: BookOpen, label: 'Education', color: '#3b82f6', bg: '#eff6ff' },
  { icon: Leaf, label: 'Environment', color: '#16a34a', bg: '#f0fdf4' },
  { icon: Utensils, label: 'Food Distribution', color: '#f97316', bg: '#fff7ed' },
  { icon: HeartPulse, label: 'Health Awareness', color: '#ef4444', bg: '#fef2f2' },
  { icon: Globe, label: 'Social Welfare', color: '#8b5cf6', bg: '#f5f3ff' },
  { icon: Laptop, label: 'Digital Literacy', color: '#06b6d4', bg: '#ecfeff' },
];

const testimonials = [
  { name: 'Sarah Johnson', role: 'Education Volunteer', text: 'Volunteering through NGO Connect has been life-changing. I\'ve taught over 50 children and earned 120 service hours. The platform makes everything seamless.' },
  { name: 'Michael Chen', role: 'Environment Volunteer', text: 'I planted 200 trees, made amazing friends, and contributed to a greener tomorrow. The certificate system is a great recognition of our efforts.' },
  { name: 'Priya Sharma', role: 'Health Awareness Volunteer', text: 'From applying to activities to tracking my hours, everything is so organized. I\'m proud to be part of a community that makes real difference.' },
];

const steps = [
  { step: '01', title: 'Register as Volunteer', desc: 'Create your profile with skills and interests.' },
  { step: '02', title: 'Browse Activities', desc: 'Explore upcoming activities that match your passion.' },
  { step: '03', title: 'Apply & Participate', desc: 'Apply for activities and get approved by admin.' },
  { step: '04', title: 'Earn Certificates', desc: 'Get certified for your verified service hours.' },
];

export default function HomePage() {
  const [stats, setStats] = useState({ totalVolunteers: 0, completedActivities: 0, totalServiceHours: 0, totalActivities: 0 });

  useEffect(() => {
    reportService.getAdminDashboard().then(({ data }) => {
      if (data.success) setStats(data.stats);
    }).catch(() => {
      setStats({ totalVolunteers: 1240, completedActivities: 85, totalServiceHours: 15600, totalActivities: 120 });
    });
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)', padding: '5rem 0 4rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #bbf7d0', borderRadius: '9999px', padding: '0.375rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#16a34a', marginBottom: '1.5rem' }}>
              <Heart size={14} fill="#16a34a" color="#16a34a" /> Connecting Hearts, Building Communities
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Make a Difference with <span style={{ color: '#16a34a' }}>NGO Connect</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>
              Join thousands of volunteers making real impact in communities. Find activities that match your skills, track your hours, and earn recognized certificates.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Join as Volunteer <ArrowRight size={18} />
              </Link>
              <Link to="/activities" className="btn btn-outline btn-lg">
                Browse Activities
              </Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { value: stats.totalVolunteers || 1240, label: 'Active Volunteers', icon: Users, color: '#16a34a' },
              { value: stats.totalActivities || 120, label: 'Total Activities', icon: Activity, color: '#3b82f6' },
              { value: stats.totalServiceHours || 15600, label: 'Service Hours', icon: Clock, color: '#f97316' },
              { value: stats.completedActivities || 85, label: 'Completed Programs', icon: Award, color: '#8b5cf6' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: item.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <item.icon size={20} color={item.color} />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{item.value.toLocaleString()}+</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Mission */}
      <section className="section-pad" style={{ background: 'white' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.8 }}>
            NGO Connect bridges the gap between eager volunteers and communities in need. We believe every person has the power to create positive change, and our platform makes it easy to channel that energy effectively.
          </p>
        </div>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '3rem' }}>
          {[
            { icon: Heart, title: 'Community Impact', desc: 'Create lasting change in local communities through organized volunteer programs.' },
            { icon: Users, title: 'Skill Development', desc: 'Grow personally and professionally while helping others through meaningful activities.' },
            { icon: Award, title: 'Recognition', desc: 'Receive verified certificates and recognition for your valuable contributions.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', background: '#f0fdf4', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <item.icon size={24} color="#16a34a" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section-pad" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Our Activities</h2>
            <p style={{ color: '#64748b', fontSize: '1.0625rem' }}>Explore diverse programs across six key areas of community service</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem' }}>
            {categories.map((cat, i) => (
              <Link key={i} to={`/activities?category=${cat.label}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: '1rem', padding: '1.75rem 1.25rem', textAlign: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ width: '3.5rem', height: '3.5rem', background: cat.bg, borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <cat.icon size={24} color={cat.color} />
                  </div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>{cat.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-pad" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>How It Works</h2>
            <p style={{ color: '#64748b', fontSize: '1.0625rem' }}>Simple steps to start your volunteering journey</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '2rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ width: '3rem', height: '3rem', background: '#16a34a', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                  {step.step}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                  <p style={{ color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>What Volunteers Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '1rem', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Ready to Make a Difference?</h2>
          <p style={{ color: '#bbf7d0', fontSize: '1.125rem', marginBottom: '2rem' }}>Join our community of volunteers and start creating positive change today.</p>
          <Link to="/register" className="btn" style={{ background: 'white', color: '#16a34a', fontSize: '1rem', padding: '0.875rem 2rem', fontWeight: 700 }}>
            Start Volunteering <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
