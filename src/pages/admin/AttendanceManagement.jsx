import React, { useEffect, useState } from 'react';
import { Calendar, Search, CheckCircle, Save } from 'lucide-react';
import { activityService, attendanceService } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function AttendanceManagement() {
  const toast = useToast();
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState({});
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    activityService.getAll({ limit: 100 }).then(({ data }) => setActivities(data.activities)).catch(() => {});
  }, []);

  const loadVolunteers = async (activityId) => {
    setSelectedActivity(activityId);
    if (!activityId) { setVolunteers([]); return; }
    setLoading(true);
    try {
      const { data } = await attendanceService.getActivityAttendance(activityId);
      setVolunteers(data.volunteers);
      const att = {};
      data.volunteers.forEach(v => {
        att[v.volunteer._id] = {
          present: v.attendance?.present ?? false,
          serviceHours: v.attendance?.serviceHours ?? 0,
          notes: v.attendance?.notes ?? '',
        };
      });
      setAttendance(att);
    } catch (err) {
      toast.error('Failed to load volunteers');
    }
    setLoading(false);
  };

  const handleAttendanceChange = (volId, field, value) => {
    setAttendance(prev => ({ ...prev, [volId]: { ...prev[volId], [field]: value } }));
  };

  const handleSave = async (volEntry) => {
    const volId = volEntry.volunteer._id;
    setSaving(prev => ({ ...prev, [volId]: true }));
    try {
      await attendanceService.markAttendance({
        volunteerId: volId,
        activityId: selectedActivity,
        applicationId: volEntry.application,
        present: attendance[volId]?.present || false,
        serviceHours: attendance[volId]?.serviceHours || 0,
        notes: attendance[volId]?.notes || '',
      });
      toast.success(`Attendance saved for ${volEntry.volunteer.fullName}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    }
    setSaving(prev => ({ ...prev, [volId]: false }));
  };

  const activity = activities.find(a => a._id === selectedActivity);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Attendance Management</h2>
        <p className="page-subtitle">Mark attendance and service hours for volunteers</p>
      </div>

      {/* Activity selector */}
      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Select Activity</label>
          <select value={selectedActivity} onChange={e => loadVolunteers(e.target.value)} className="form-input" style={{ maxWidth: '480px' }}>
            <option value="">-- Select an activity --</option>
            {activities.map(a => (
              <option key={a._id} value={a._id}>{a.title} - {new Date(a.date).toLocaleDateString()}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedActivity && activity && (
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontWeight: 700, color: '#0f172a' }}>{activity.title}</h3>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{activity.category} · {new Date(activity.date).toLocaleDateString()} · {activity.location}</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '1.25rem' }}>{volunteers.length}</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Approved Volunteers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '1.25rem' }}>{activity.serviceHours || 0}</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Planned Hours</div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : !selectedActivity ? (
        <div className="empty-state"><Calendar size={48} /><h3>Select an activity to manage attendance</h3></div>
      ) : volunteers.length === 0 ? (
        <div className="empty-state"><h3>No approved volunteers for this activity</h3><p>Approve applications first</p></div>
      ) : (
        <div className="card">
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontWeight: 700 }}>Volunteer Attendance ({volunteers.length})</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Present</th>
                  <th>Service Hours</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map(entry => {
                  const volId = entry.volunteer._id;
                  const att = attendance[volId] || { present: false, serviceHours: 0, notes: '' };
                  return (
                    <tr key={volId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                            {entry.volunteer.fullName?.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{entry.volunteer.fullName}</div>
                            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{entry.volunteer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={att.present} onChange={e => handleAttendanceChange(volId, 'present', e.target.checked)} style={{ width: '1.125rem', height: '1.125rem', accentColor: '#16a34a' }} />
                          <span style={{ fontSize: '0.875rem', color: att.present ? '#16a34a' : '#94a3b8' }}>{att.present ? 'Present' : 'Absent'}</span>
                        </label>
                      </td>
                      <td>
                        <input type="number" min="0" max="24" value={att.serviceHours} onChange={e => handleAttendanceChange(volId, 'serviceHours', Number(e.target.value))}
                          className="form-input" style={{ width: '80px' }} disabled={!att.present} />
                      </td>
                      <td>
                        <input value={att.notes} onChange={e => handleAttendanceChange(volId, 'notes', e.target.value)}
                          className="form-input" style={{ width: '160px' }} placeholder="Optional note..." />
                      </td>
                      <td>
                        <button onClick={() => handleSave(entry)} className="btn btn-primary btn-sm" disabled={saving[volId]}>
                          <Save size={14} /> {saving[volId] ? '...' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
