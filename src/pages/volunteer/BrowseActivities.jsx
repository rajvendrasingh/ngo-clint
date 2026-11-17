import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, Clock, ChevronRight, Filter } from 'lucide-react';
import { activityService, applicationService } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const CATEGORIES = ['All', 'Education', 'Environment', 'Food Distribution', 'Health Awareness', 'Social Welfare', 'Digital Literacy'];
const STATUS_COLORS = { upcoming: 'badge-green', ongoing: 'badge-blue', completed: 'badge-gray', cancelled: 'badge-red' };

export default function BrowseActivities() {
  const toast = useToast();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [myApplications, setMyApplications] = useState([]);
  const [applying, setApplying] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, status: 'upcoming' };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await activityService.getAll(params);
      setActivities(data.activities);
      setTotalPages(data.totalPages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [category, page]);
  useEffect(() => { const t = setTimeout(fetch, 400); return () => clearTimeout(t); }, [search]);

  useEffect(() => {
    applicationService.getMyApplications().then(({ data }) => setMyApplications(data.applications)).catch(() => {});
  }, []);

  const getApplication = (activityId) => myApplications.find(a => a.activity?._id === activityId || a.activity === activityId);

  const handleQuickApply = async (activityId) => {
    setApplying(activityId);
    try {
      const { data } = await applicationService.apply(activityId, {});
      setMyApplications(prev => [...prev, { ...data.application, activity: { _id: activityId } }]);
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
    setApplying(null);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Browse Activities</h2>
        <p className="page-subtitle">Find volunteer opportunities that match your skills and interests</p>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: '200px' }}>
            <Search size={18} color="#94a3b8" />
            <input placeholder="Search activities..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                className="btn btn-sm"
                style={{ background: category === cat ? '#16a34a' : 'white', color: category === cat ? 'white' : '#475569', border: `1px solid ${category === cat ? '#16a34a' : '#e2e8f0'}` }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : activities.length === 0 ? (
        <div className="empty-state"><Search size={48} /><h3>No activities found</h3><p>Try different search terms or categories</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {activities.map(activity => {
            const app = getApplication(activity._id);
            const isFull = activity.enrolledCount >= activity.maxVolunteers;
            return (
              <div key={activity._id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '140px', background: 'linear-gradient(135deg, #f0fdf4, #bbf7d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {activity.coverImage ? (
                    <img src={activity.coverImage} alt={activity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <div style={{ fontSize: '2.5rem' }}>🌱</div>}
                  <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
                    <span style={{ background: 'white', borderRadius: '9999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{activity.category}</span>
                  </div>
                  {isFull && (
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                      <span className="badge badge-red">Full</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.625rem', color: '#0f172a' }}>{activity.title}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                      <Calendar size={13} color="#16a34a" />{formatDate(activity.date)} · {activity.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                      <MapPin size={13} color="#16a34a" />{activity.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                      <Clock size={13} color="#16a34a" />{activity.serviceHours} hrs · {activity.enrolledCount || 0}/{activity.maxVolunteers} volunteers
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/activities/${activity._id}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Details</Link>
                    {app ? (
                      <span className={`badge ${STATUS_COLORS[app.status]}`} style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>{app.status}</span>
                    ) : (
                      <button onClick={() => handleQuickApply(activity._id)} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} disabled={isFull || applying === activity._id}>
                        {applying === activity._id ? '...' : 'Apply'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className="btn btn-sm"
              style={{ background: page === i + 1 ? '#16a34a' : 'white', color: page === i + 1 ? 'white' : '#475569', border: '1px solid #e2e8f0', minWidth: '2.5rem' }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
