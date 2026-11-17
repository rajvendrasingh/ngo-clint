import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Clock, ChevronRight } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { activityService } from '../../services/api.js';

const CATEGORIES = ['All', 'Education', 'Environment', 'Food Distribution', 'Health Awareness', 'Social Welfare', 'Digital Literacy'];
const STATUS_COLORS = { upcoming: 'badge-green', ongoing: 'badge-blue', completed: 'badge-gray', cancelled: 'badge-red' };

export default function ActivitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await activityService.getAll(params);
      setActivities(data.activities);
      setTotalPages(data.totalPages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchActivities(); }, [category, page]);
  useEffect(() => { const t = setTimeout(fetchActivities, 400); return () => clearTimeout(t); }, [search]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <PublicLayout>
      <section style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', padding: '3rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Volunteer Activities</h1>
          <p style={{ color: '#475569' }}>Discover opportunities to make a difference in your community</p>
        </div>
      </section>

      <section style={{ padding: '2rem 0 4rem', background: '#f8fafc' }}>
        <div className="container">
          {/* Filters */}
          <div style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: '200px' }}>
              <Search size={18} color="#94a3b8" />
              <input placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} />
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

          {/* Grid */}
          {loading ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : activities.length === 0 ? (
            <div className="empty-state"><Search size={48} /><h3>No activities found</h3><p>Try adjusting your filters</p></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {activities.map(activity => (
                <div key={activity._id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '160px', background: 'linear-gradient(135deg, #16a34a20, #16a34a40)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {activity.coverImage ? (
                      <img src={activity.coverImage} alt={activity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: '3rem' }}>🌱</div>
                    )}
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                      <span className={`badge ${STATUS_COLORS[activity.status] || 'badge-gray'}`}>{activity.status}</span>
                    </div>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                      <span style={{ background: 'white', borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{activity.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.75rem', color: '#0f172a' }}>{activity.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{activity.description}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                        <Calendar size={14} color="#16a34a" />{formatDate(activity.date)} · {activity.time}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                        <MapPin size={14} color="#16a34a" />{activity.location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                        <Users size={14} color="#16a34a" />{activity.enrolledCount || 0}/{activity.maxVolunteers} volunteers
                      </div>
                      {activity.serviceHours > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                          <Clock size={14} color="#16a34a" />{activity.serviceHours} service hours
                        </div>
                      )}
                    </div>
                    <Link to={`/activities/${activity._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      View Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className="btn btn-sm"
                  style={{ background: page === i + 1 ? '#16a34a' : 'white', color: page === i + 1 ? 'white' : '#475569', border: '1px solid #e2e8f0', minWidth: '2.5rem' }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
