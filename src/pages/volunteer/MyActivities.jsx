import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { applicationService } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const STATUS_COLORS = { pending: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red', completed: 'badge-blue' };
const TABS = ['all', 'pending', 'approved', 'completed', 'rejected'];

export default function MyActivities() {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    applicationService.getMyApplications().then(({ data }) => setApplications(data.applications)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      await applicationService.cancel(id);
      setApplications(prev => prev.filter(a => a._id !== id));
      toast.success('Application cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
    setCancelling(null);
  };

  const filtered = tab === 'all' ? applications : applications.filter(a => a.status === tab);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">My Activities</h2>
        <p className="page-subtitle">Track all your volunteer activity applications</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="btn btn-sm"
            style={{ background: tab === t ? '#16a34a' : 'white', color: tab === t ? 'white' : '#475569', border: `1px solid ${tab === t ? '#16a34a' : '#e2e8f0'}`, textTransform: 'capitalize' }}>
            {t === 'all' ? `All (${applications.length})` : `${t.charAt(0).toUpperCase() + t.slice(1)} (${applications.filter(a => a.status === t).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <h3>No activities found</h3>
          <p>Browse activities and apply to get started</p>
          <Link to="/dashboard/browse" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Activities</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(app => (
            <div key={app._id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '0.75rem', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                {app.activity?.coverImage ? (
                  <img src={app.activity.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }} />
                ) : '🌱'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#0f172a' }}>{app.activity?.title || 'Activity'}</h3>
                  <span className={`badge ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Calendar size={13} color="#16a34a" />{app.activity?.date ? formatDate(app.activity.date) : 'N/A'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <MapPin size={13} color="#16a34a" />{app.activity?.location || 'N/A'}
                  </span>
                  <span style={{ background: '#f1f5f9', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>{app.activity?.category}</span>
                </div>
                {app.adminNote && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: '#64748b', background: '#f8fafc', borderRadius: '0.375rem', padding: '0.375rem 0.625rem' }}>
                    <strong>Note:</strong> {app.adminNote}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                {app.activity?._id && (
                  <Link to={`/activities/${app.activity._id}`} className="btn btn-ghost btn-sm"><ChevronRight size={16} /></Link>
                )}
                {app.status === 'pending' && (
                  <button onClick={() => handleCancel(app._id)} className="btn btn-danger btn-sm" disabled={cancelling === app._id}>
                    {cancelling === app._id ? '...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
