import React, { useEffect, useState } from 'react';
import { Award, Download } from 'lucide-react';
import { certificateService } from '../../services/api.js';

export default function CertificatesAdmin() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateService.getAll().then(({ data }) => setCerts(data.certificates)).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Certificates</h2>
        <p className="page-subtitle">All certificates issued to volunteers</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Issued', value: certs.length, color: '#16a34a' },
          { label: 'This Month', value: certs.filter(c => new Date(c.issuedAt).getMonth() === new Date().getMonth()).length, color: '#3b82f6' },
          { label: 'Total Hours Certified', value: certs.reduce((s, c) => s + (c.serviceHours || 0), 0), color: '#8b5cf6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={22} color={color} />
            </div>
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : certs.length === 0 ? (
          <div className="empty-state"><Award size={48} /><h3>No certificates issued yet</h3><p>Certificates are auto-generated when attendance is marked</p></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Volunteer</th>
                  <th>Activity</th>
                  <th>Service Hours</th>
                  <th>Issued Date</th>
                </tr>
              </thead>
              <tbody>
                {certs.map(cert => (
                  <tr key={cert._id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.875rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>{cert.certificateId}</span></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{cert.volunteer?.fullName}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{cert.volunteer?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{cert.activity?.title || cert.activityName}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{cert.activity?.category}</div>
                    </td>
                    <td><span style={{ fontWeight: 700, color: '#16a34a' }}>{cert.serviceHours} hrs</span></td>
                    <td style={{ fontSize: '0.875rem' }}>{formatDate(cert.issuedAt)}</td>
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
