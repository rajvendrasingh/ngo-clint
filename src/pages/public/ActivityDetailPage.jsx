import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Tag, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { activityService, applicationService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const STATUS_COLORS = { upcoming: 'badge-green', ongoing: 'badge-blue', completed: 'badge-gray', cancelled: 'badge-red' };

export default function ActivityDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [myApplication, setMyApplication] = useState(null);

  useEffect(() => {
    activityService.getById(id).then(({ data }) => {
      setActivity(data.activity);
    }).catch(() => toast.error('Activity not found')).finally(() => setLoading(false));
    if (user && user.role === 'volunteer') {
      applicationService.getMyApplications().then(({ data }) => {
        const app = data.applications.find(a => a.activity?._id === id || a.activity === id);
        setMyApplication(app);
      }).catch(() => {});
    }
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      const { data } = await applicationService.apply(id, { motivation });
      setMyApplication(data.application);
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
    setApplying(false);
  };

  const handleCancel = async () => {
    if (!myApplication) return;
    try {
      await applicationService.cancel(myApplication._id);
      setMyApplication(null);
      toast.success('Application cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  if (loading) return <PublicLayout><div className="loading-screen"><div className="spinner" /></div></PublicLayout>;
  if (!activity) return <PublicLayout><div className="empty-state"><h3>Activity not found</h3><Link to="/activities" className="btn btn-primary">Back to Activities</Link></div></PublicLayout>;

  const isFull = activity.enrolledCount >= activity.maxVolunteers;

  return (
    <PublicLayout>
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <Link to="/activities" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={18} /> Back to Activities
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
          {/* Main */}
          <div>
            <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ height: '280px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activity.coverImage ? (
                  <img src={activity.coverImage} alt={activity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <div style={{ fontSize: '5rem' }}>🌱</div>}
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span className={`badge ${STATUS_COLORS[activity.status]}`}>{activity.status}</span>
                  <span className="badge badge-blue">{activity.category}</span>
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>{activity.title}</h1>
                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.0625rem' }}>{activity.description}</p>

                {activity.skillsRequired?.length > 0 && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Skills Required</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {activity.skillsRequired.map((s, i) => (
                        <span key={i} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Activity Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: Calendar, label: 'Date & Time', value: `${formatDate(activity.date)} · ${activity.time}` },
                  { icon: MapPin, label: 'Location', value: activity.location },
                  { icon: Users, label: 'Volunteers', value: `${activity.enrolledCount || 0} enrolled / ${activity.maxVolunteers} max` },
                  { icon: Clock, label: 'Service Hours', value: `${activity.serviceHours || 0} hours` },
                  { icon: Tag, label: 'Category', value: activity.category },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: '0.875rem' }}>
                    <Icon size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                      <div style={{ fontSize: '0.9375rem', color: '#1e293b', fontWeight: 500 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spots left */}
            <div style={{ background: isFull ? '#fef2f2' : '#f0fdf4', border: `1px solid ${isFull ? '#fecaca' : '#bbf7d0'}`, borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isFull ? <AlertCircle size={20} color="#ef4444" /> : <CheckCircle size={20} color="#16a34a" />}
              <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: isFull ? '#991b1b' : '#15803d' }}>
                {isFull ? 'Activity is full' : `${activity.maxVolunteers - (activity.enrolledCount || 0)} spots remaining`}
              </span>
            </div>

            {/* Apply Button */}
            {user?.role === 'volunteer' ? (
              myApplication ? (
                <div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, color: '#15803d' }}>Application {myApplication.status}</div>
                  </div>
                  {myApplication.status === 'pending' && (
                    <button onClick={handleCancel} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>Cancel Application</button>
                  )}
                </div>
              ) : (
                <button onClick={() => setShowApplyModal(true)} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={isFull || activity.status === 'completed' || activity.status === 'cancelled'}>
                  Apply Now
                </button>
              )
            ) : !user ? (
              <div>
                <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>Login to Apply</Link>
                <Link to="/register" className="btn btn-outline btn-lg" style={{ width: '100%', justifyContent: 'center' }}>Register as Volunteer</Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 700 }}>Apply for Activity</h3>
              <button onClick={() => setShowApplyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#64748b', marginBottom: '1.25rem' }}>You're applying for: <strong>{activity.title}</strong></p>
              <div className="form-group">
                <label className="form-label">Why do you want to participate? (optional)</label>
                <textarea className="form-input" rows={4} placeholder="Share your motivation..." value={motivation} onChange={e => setMotivation(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowApplyModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleApply} className="btn btn-primary" disabled={applying}>
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
