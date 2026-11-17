import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Calendar } from 'lucide-react';
import { volunteerService } from '../../services/api.js';

const STATUS_COLORS = { pending: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red', completed: 'badge-blue' };

export default function VolunteerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    volunteerService.getById(id).then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!data) return <div>Volunteer not found</div>;

  const { volunteer, applications, attendance } = data;
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <Link to="/admin/volunteers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        <ArrowLeft size={18} /> Back to Volunteers
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Profile card */}
        <div>
          <div className="card card-pad" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem', fontWeight: 700 }}>
              {volunteer.fullName?.charAt(0)}
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>{volunteer.fullName}</h2>
            <span className={`badge ${volunteer.isActive ? 'badge-green' : 'badge-red'}`} style={{ marginBottom: '1rem' }}>{volunteer.isActive ? 'Active' : 'Inactive'}</span>
            <div style={{ background: '#f0fdf4', borderRadius: '0.75rem', padding: '1rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a' }}>{volunteer.totalServiceHours || 0}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Service Hours</div>
            </div>
          </div>
          <div className="card card-pad">
            <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Contact Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: Mail, val: volunteer.email },
                { icon: Phone, val: volunteer.phone || 'N/A' },
                { icon: MapPin, val: volunteer.location || 'N/A' },
              ].map(({ icon: Icon, val }) => (
                <div key={val} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#475569', alignItems: 'center' }}>
                  <Icon size={15} color="#16a34a" />{val}
                </div>
              ))}
            </div>
            {volunteer.skills?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {volunteer.skills.map(s => <span key={s} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '9999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity history */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: 700 }}>Activity Applications ({applications?.length || 0})</h3>
            </div>
            {!applications?.length ? (
              <div className="empty-state" style={{ padding: '2rem' }}>No applications yet</div>
            ) : (
              <div className="table-container">
                <table>
                  <thead><tr><th>Activity</th><th>Category</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {applications.map((app, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{app.activity?.title || 'N/A'}</td>
                        <td>{app.activity?.category}</td>
                        <td>{app.activity?.date ? formatDate(app.activity.date) : 'N/A'}</td>
                        <td><span className={`badge ${STATUS_COLORS[app.status]}`}>{app.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: 700 }}>Attendance Records ({attendance?.length || 0})</h3>
            </div>
            {!attendance?.length ? (
              <div className="empty-state" style={{ padding: '2rem' }}>No attendance records yet</div>
            ) : (
              <div className="table-container">
                <table>
                  <thead><tr><th>Activity</th><th>Date</th><th>Present</th><th>Hours</th></tr></thead>
                  <tbody>
                    {attendance.map((rec, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{rec.activity?.title || 'N/A'}</td>
                        <td>{rec.activity?.date ? formatDate(rec.activity.date) : 'N/A'}</td>
                        <td><span className={`badge ${rec.present ? 'badge-green' : 'badge-red'}`}>{rec.present ? 'Yes' : 'No'}</span></td>
                        <td style={{ fontWeight: 600, color: '#16a34a' }}>{rec.serviceHours} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
