import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { attendanceService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function MyAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService.getMyAttendance().then(({ data }) => setRecords(data.records)).finally(() => setLoading(false));
  }, []);

  const totalHours = records.filter(r => r.present).reduce((sum, r) => sum + (r.serviceHours || 0), 0);
  const totalPresent = records.filter(r => r.present).length;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Attendance History</h2>
        <p className="page-subtitle">Your verified attendance and service hours</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Service Hours', value: user?.totalServiceHours || 0, icon: Clock, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Activities Attended', value: totalPresent, icon: CheckCircle, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Attendance Records', value: records.length, icon: Calendar, color: '#8b5cf6', bg: '#f5f3ff' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
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

      {/* Records */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontWeight: 700 }}>Attendance Records</h3>
        </div>
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : records.length === 0 ? (
          <div className="empty-state"><Calendar size={48} /><h3>No attendance records yet</h3><p>Your attendance will appear here after activities</p></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Attendance</th>
                  <th>Service Hours</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{record.activity?.title || 'N/A'}</td>
                    <td>{record.activity?.date ? formatDate(record.activity.date) : 'N/A'}</td>
                    <td><span style={{ background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8125rem' }}>{record.activity?.category}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {record.present ? (
                          <><CheckCircle size={16} color="#16a34a" /><span style={{ color: '#16a34a', fontWeight: 600 }}>Present</span></>
                        ) : (
                          <><XCircle size={16} color="#ef4444" /><span style={{ color: '#ef4444', fontWeight: 600 }}>Absent</span></>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: record.present ? '#16a34a' : '#94a3b8' }}>
                        {record.present ? `${record.serviceHours} hrs` : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
