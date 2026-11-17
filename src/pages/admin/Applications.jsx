import React, { useEffect, useState } from 'react';
import { FileText, Search, Check, X, Eye } from 'lucide-react';
import { applicationService } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const STATUS_COLORS = { pending: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red', completed: 'badge-blue' };
const TABS = ['all', 'pending', 'approved', 'rejected', 'completed'];

export default function Applications() {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [updating, setUpdating] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const fetch = async (status) => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (status !== 'all') params.status = status;
      const { data } = await applicationService.getAll(params);
      setApplications(data.applications);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(tab); }, [tab]);

  const handleUpdate = async (id, status, note = '') => {
    setUpdating(id);
    try {
      const { data } = await applicationService.updateStatus(id, { status, adminNote: note });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status: data.application.status, adminNote: data.application.adminNote } : a));
      toast.success(`Application ${status}`);
      setNoteModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
    setUpdating(null);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Applications</h2>
        <p className="page-subtitle">Review and manage volunteer applications</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="btn btn-sm"
            style={{ background: tab === t ? '#16a34a' : 'white', color: tab === t ? 'white' : '#475569', border: `1px solid ${tab === t ? '#16a34a' : '#e2e8f0'}`, textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : applications.length === 0 ? (
          <div className="empty-state"><FileText size={48} /><h3>No {tab !== 'all' ? tab : ''} applications</h3></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Activity</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.volunteer?.fullName}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{app.volunteer?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.activity?.title}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{app.activity?.category} · {app.activity?.date ? formatDate(app.activity.date) : ''}</div>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{formatDate(app.appliedAt || app.createdAt)}</td>
                    <td><span className={`badge ${STATUS_COLORS[app.status]}`}>{app.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {app.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdate(app._id, 'approved')} className="btn btn-sm" style={{ background: '#16a34a', color: 'white', border: 'none' }} disabled={updating === app._id}><Check size={14} /> Approve</button>
                            <button onClick={() => { setNoteModal(app._id); setAdminNote(''); }} className="btn btn-danger btn-sm" disabled={updating === app._id}><X size={14} /> Reject</button>
                          </>
                        )}
                        {app.status === 'approved' && (
                          <button onClick={() => handleUpdate(app._id, 'completed')} className="btn btn-sm" style={{ background: '#3b82f6', color: 'white', border: 'none' }} disabled={updating === app._id}>Mark Complete</button>
                        )}
                        {app.adminNote && (
                          <span style={{ fontSize: '0.8125rem', color: '#64748b', fontStyle: 'italic' }} title={app.adminNote}>Note</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject modal */}
      {noteModal && (
        <div className="modal-overlay" onClick={() => setNoteModal(null)}>
          <div className="modal" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 700 }}>Reject Application</h3>
              <button onClick={() => setNoteModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Reason for rejection (optional)</label>
                <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} className="form-input" rows={3} placeholder="Provide a reason..." />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setNoteModal(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={() => handleUpdate(noteModal, 'rejected', adminNote)} className="btn btn-danger" disabled={updating === noteModal}>
                {updating === noteModal ? 'Rejecting...' : 'Reject Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
