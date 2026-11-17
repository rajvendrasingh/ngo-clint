import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, FileText, Award, Calendar, ChevronRight, Activity } from 'lucide-react';
import { reportService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const STATUS_COLORS = { pending: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red', completed: 'badge-blue' };

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getVolunteerDashboard().then(({ data }) => {
      if (data.success) setDashboard(data.dashboard);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const stats = [
    { icon: Clock, label: 'Service Hours', value: user?.totalServiceHours || 0, color: '#16a34a', bg: '#f0fdf4' },
    { icon: CheckCircle, label: 'Completed', value: dashboard?.totalCompleted || 0, color: '#3b82f6', bg: '#eff6ff' },
    { icon: FileText, label: 'Pending', value: dashboard?.pending || 0, color: '#f97316', bg: '#fff7ed' },
    { icon: Award, label: 'Certificates', value: dashboard?.certificates || 0, color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '1rem', padding: '1.75rem 2rem', marginBottom: '1.5rem', color: 'white' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem' }}>Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h2>
        <p style={{ opacity: 0.9, fontSize: '0.9375rem' }}>You've made a real difference. Keep up the great work!</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Applications */}
        <div className="card">
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700 }}>Recent Applications</h3>
            <Link to="/dashboard/my-activities" style={{ fontSize: '0.875rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>View all <ChevronRight size={14} /></Link>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {!dashboard?.recentApplications?.length ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No applications yet</div>
            ) : dashboard.recentApplications.map((app, i) => (
              <div key={i} style={{ padding: '0.875rem 1.5rem', borderBottom: i < dashboard.recentApplications.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{app.activity?.title || 'Activity'}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{app.activity?.category}</div>
                </div>
                <span className={`badge ${STATUS_COLORS[app.status]}`}>{app.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="card">
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700 }}>Upcoming Activities</h3>
            <Link to="/dashboard/browse" style={{ fontSize: '0.875rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Browse <ChevronRight size={14} /></Link>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {!dashboard?.upcomingActivities?.length ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                <Activity size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                <div style={{ marginBottom: '0.75rem' }}>No upcoming activities</div>
                <Link to="/dashboard/browse" className="btn btn-primary btn-sm">Browse Activities</Link>
              </div>
            ) : dashboard.upcomingActivities.map((app, i) => (
              <div key={i} style={{ padding: '0.875rem 1.5rem', borderBottom: i < dashboard.upcomingActivities.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{app.activity?.title}</div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                  <span>📅 {formatDate(app.activity?.date)}</span>
                  <span>📍 {app.activity?.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile completion */}
      {(!user?.skills?.length || !user?.areasOfInterest?.length) && (
        <div style={{ marginTop: '1.5rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '1rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Complete Your Profile</div>
            <div style={{ fontSize: '0.875rem', color: '#92400e', opacity: 0.8 }}>Add your skills and interests to get better activity recommendations.</div>
          </div>
          <Link to="/dashboard/profile" className="btn btn-sm" style={{ background: '#d97706', color: 'white', border: 'none' }}>Update Profile</Link>
        </div>
      )}
    </div>
  );
}
