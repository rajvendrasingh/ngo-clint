import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Users, Activity, Clock, Award, TreePine, Package } from 'lucide-react';
import { reportService } from '../../services/api.js';

const COLORS = ['#16a34a', '#3b82f6', '#f97316', '#8b5cf6', '#ef4444', '#06b6d4'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getAdminDashboard().then(({ data }) => {
      if (data.success) setStats(data.stats);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const monthlyVolData = (stats?.monthlyVolunteers || []).map(item => ({
    month: monthNames[item._id.month - 1],
    year: item._id.year,
    count: item.count,
  }));

  const categoryData = (stats?.activityByCategory || []).map(item => ({ name: item._id, value: item.count }));

  const impactData = [
    { label: 'Volunteers', value: stats?.totalVolunteers || 0, icon: Users, color: '#16a34a' },
    { label: 'Activities', value: stats?.totalActivities || 0, icon: Activity, color: '#3b82f6' },
    { label: 'Service Hours', value: stats?.totalServiceHours || 0, icon: Clock, color: '#f97316' },
    { label: 'Certificates', value: stats?.totalCertificates || 0, icon: Award, color: '#8b5cf6' },
    { label: 'People Impacted', value: stats?.peopleImpacted || 0, icon: Users, color: '#06b6d4' },
    { label: 'Trees Planted', value: stats?.treesPlanted || 0, icon: TreePine, color: '#16a34a' },
    { label: 'Food Packets', value: stats?.foodPackets || 0, icon: Package, color: '#d97706' },
    { label: 'Applications', value: stats?.totalApplications || 0, icon: Activity, color: '#ef4444' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Impact Reports</h2>
        <p className="page-subtitle">Comprehensive overview of NGO Connect's impact</p>
      </div>

      {/* Impact metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {impactData.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
            </div>
            <div className="stat-value">{(value || 0).toLocaleString()}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Monthly volunteers */}
        <div className="card card-pad">
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Monthly Volunteer Registrations</h3>
          {monthlyVolData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyVolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} name="Volunteers" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data yet</div>}
        </div>

        {/* Category distribution */}
        <div className="card card-pad">
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Activities by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} cx="45%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data yet</div>}
        </div>
      </div>

      {/* Application status breakdown */}
      <div className="card card-pad">
        <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Application Status Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Total', value: stats?.totalApplications || 0, color: '#64748b' },
            { label: 'Pending', value: stats?.pendingApplications || 0, color: '#f97316' },
            { label: 'Completed', value: stats?.completedActivities || 0, color: '#16a34a' },
            { label: 'Upcoming', value: stats?.upcomingActivities || 0, color: '#3b82f6' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
              <div style={{ color: '#64748b', marginTop: '0.25rem' }}>{label} Applications</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
