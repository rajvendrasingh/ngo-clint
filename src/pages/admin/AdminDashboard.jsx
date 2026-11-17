import React, { useEffect, useState } from 'react';
import { Users, Activity, FileText, Award, Clock, CheckCircle, TrendingUp, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { reportService } from '../../services/api.js';

const COLORS = ['#16a34a', '#3b82f6', '#f97316', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getAdminDashboard().then(({ data }) => {
      if (data.success) setStats(data.stats);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const statCards = [
    { icon: Users, label: 'Total Volunteers', value: stats?.totalVolunteers || 0, sub: `${stats?.activeVolunteers || 0} active`, color: '#16a34a', bg: '#f0fdf4' },
    { icon: Activity, label: 'Total Activities', value: stats?.totalActivities || 0, sub: `${stats?.upcomingActivities || 0} upcoming`, color: '#3b82f6', bg: '#eff6ff' },
    { icon: FileText, label: 'Pending Applications', value: stats?.pendingApplications || 0, sub: `${stats?.totalApplications || 0} total`, color: '#f97316', bg: '#fff7ed' },
    { icon: CheckCircle, label: 'Completed Activities', value: stats?.completedActivities || 0, sub: 'Successfully done', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: Clock, label: 'Total Service Hours', value: stats?.totalServiceHours || 0, sub: 'Verified hours', color: '#06b6d4', bg: '#ecfeff' },
    { icon: Award, label: 'Certificates Issued', value: stats?.totalCertificates || 0, sub: 'To volunteers', color: '#d97706', bg: '#fffbeb' },
    { icon: TrendingUp, label: 'People Impacted', value: (stats?.peopleImpacted || 0).toLocaleString(), sub: 'Estimated', color: '#16a34a', bg: '#f0fdf4' },
    { icon: MessageSquare, label: 'Unread Messages', value: stats?.unreadMessages || 0, sub: 'Contact inquiries', color: '#ef4444', bg: '#fef2f2' },
  ];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = (stats?.monthlyVolunteers || []).map(item => ({
    month: monthNames[(item._id.month - 1)],
    volunteers: item.count,
  }));
  const categoryData = (stats?.activityByCategory || []).map(item => ({ name: item._id, value: item.count }));

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Admin Dashboard</h2>
        <p className="page-subtitle">Overview of NGO Connect operations</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {statCards.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card card-pad">
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Volunteer Registrations (Monthly)</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="volunteers" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data yet</div>
          )}
        </div>

        <div className="card card-pad">
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Activities by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data yet</div>
          )}
        </div>
      </div>

      {/* Impact metrics */}
      <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '1rem', padding: '1.5rem 2rem', color: 'white' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.125rem' }}>Community Impact</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { label: 'People Impacted', value: (stats?.peopleImpacted || 0).toLocaleString() },
            { label: 'Trees Planted', value: (stats?.treesPlanted || 0).toLocaleString() },
            { label: 'Food Packets', value: (stats?.foodPackets || 0).toLocaleString() },
            { label: 'Service Hours', value: (stats?.totalServiceHours || 0).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{value}</div>
              <div style={{ opacity: 0.85, fontSize: '0.875rem', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
