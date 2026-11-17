import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, ToggleLeft, ToggleRight, Users } from 'lucide-react';
import { volunteerService } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function ManageVolunteers() {
  const toast = useToast();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [toggling, setToggling] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filter === 'active') params.isActive = 'true';
      if (filter === 'inactive') params.isActive = 'false';
      const { data } = await volunteerService.getAll(params);
      setVolunteers(data.volunteers);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [filter]);
  useEffect(() => { const t = setTimeout(fetch, 400); return () => clearTimeout(t); }, [search]);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const { data } = await volunteerService.toggleStatus(id);
      setVolunteers(prev => prev.map(v => v._id === id ? { ...v, isActive: data.volunteer.isActive } : v));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle status');
    }
    setToggling(null);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Manage Volunteers</h2>
        <p className="page-subtitle">View and manage all registered volunteers</p>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: '200px' }}>
          <Search size={18} color="#94a3b8" />
          <input placeholder="Search by name, email, location..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'active', 'inactive'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn btn-sm"
              style={{ background: filter === f ? '#16a34a' : 'white', color: filter === f ? 'white' : '#475569', border: `1px solid ${filter === f ? '#16a34a' : '#e2e8f0'}`, textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : volunteers.length === 0 ? (
          <div className="empty-state"><Users size={48} /><h3>No volunteers found</h3></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Service Hours</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map(v => (
                  <tr key={v._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                          {v.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{v.fullName}</div>
                          <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Age: {v.age || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{v.email}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{v.phone}</div>
                    </td>
                    <td style={{ fontSize: '0.9375rem' }}>{v.location || 'N/A'}</td>
                    <td><span style={{ fontWeight: 700, color: '#16a34a' }}>{v.totalServiceHours || 0} hrs</span></td>
                    <td style={{ fontSize: '0.875rem' }}>{formatDate(v.createdAt)}</td>
                    <td>
                      <span className={`badge ${v.isActive ? 'badge-green' : 'badge-red'}`}>{v.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/admin/volunteers/${v._id}`} className="btn btn-ghost btn-sm"><Eye size={16} /></Link>
                        <button onClick={() => handleToggle(v._id)} className="btn btn-ghost btn-sm" disabled={toggling === v._id}
                          style={{ color: v.isActive ? '#ef4444' : '#16a34a' }} title={v.isActive ? 'Deactivate' : 'Activate'}>
                          {v.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                      </div>
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
