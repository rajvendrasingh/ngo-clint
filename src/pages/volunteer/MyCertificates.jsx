import React, { useEffect, useState } from 'react';
import { Award, Download, Calendar, Clock, CheckCircle } from 'lucide-react';
import { certificateService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function MyCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    certificateService.getMyCertificates().then(({ data }) => setCertificates(data.certificates)).finally(() => setLoading(false));
  }, []);

  const handleDownload = (cert) => {
    setDownloading(cert._id);
    // Generate certificate HTML and trigger print/download
    const certHTML = generateCertificateHTML(cert, user);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(certHTML);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      setDownloading(null);
    }, 500);
  };

  const generateCertificateHTML = (cert, volunteer) => {
    const date = new Date(cert.completionDate || cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate - ${cert.volunteerName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:wght@300;400;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f8f9fa; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Lato', sans-serif; }
    .cert { width: 850px; min-height: 600px; background: white; border: 2px solid #16a34a; padding: 60px; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
    .cert::before { content: ''; position: absolute; inset: 12px; border: 1px solid #16a34a40; pointer-events: none; }
    .header { text-align: center; margin-bottom: 40px; }
    .ngo-logo { font-size: 1.5rem; font-weight: 800; color: #16a34a; margin-bottom: 8px; }
    .cert-title { font-family: 'Cinzel', serif; font-size: 2.5rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; letter-spacing: 2px; }
    .cert-sub { font-size: 1rem; color: #64748b; letter-spacing: 4px; text-transform: uppercase; }
    .divider { width: 120px; height: 3px; background: linear-gradient(90deg, #16a34a, #22c55e); margin: 24px auto; border-radius: 9999px; }
    .presented-to { text-align: center; font-size: 1.0625rem; color: #64748b; margin-bottom: 16px; }
    .recipient-name { text-align: center; font-family: 'Cinzel', serif; font-size: 2.75rem; color: #16a34a; margin-bottom: 24px; border-bottom: 2px solid #16a34a30; padding-bottom: 16px; }
    .description { text-align: center; font-size: 1.0625rem; color: #475569; line-height: 1.8; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; }
    .details { display: flex; justify-content: space-between; margin: 32px 0; padding: 24px; background: #f0fdf4; border-radius: 12px; }
    .detail-item { text-align: center; }
    .detail-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 6px; }
    .detail-value { font-size: 1.125rem; font-weight: 700; color: #0f172a; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
    .signature-line { width: 180px; border-top: 2px solid #0f172a; padding-top: 8px; text-align: center; font-size: 0.875rem; color: #475569; }
    .cert-id { font-size: 0.8125rem; color: #94a3b8; font-family: monospace; }
    @media print { body { background: white; } }
  </style>
</head>
<body>
  <div class="cert">
    <div class="header">
      <div class="ngo-logo">💚 NGO Connect</div>
      <div class="cert-title">Certificate of Completion</div>
      <div class="cert-sub">Volunteer Service Recognition</div>
    </div>
    <div class="divider"></div>
    <div class="presented-to">This certificate is proudly presented to</div>
    <div class="recipient-name">${cert.volunteerName}</div>
    <div class="description">
      For successfully completing the volunteer activity <strong>"${cert.activityName || cert.activity?.title || 'Community Service'}"</strong> and demonstrating outstanding commitment to community service and social impact.
    </div>
    <div class="details">
      <div class="detail-item">
        <div class="detail-label">Service Hours</div>
        <div class="detail-value">${cert.serviceHours} Hours</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Completion Date</div>
        <div class="detail-value">${date}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Category</div>
        <div class="detail-value">${cert.activity?.category || 'Community Service'}</div>
      </div>
    </div>
    <div class="footer">
      <div>
        <div class="signature-line">Executive Director<br>NGO Connect</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 4px;">Certificate ID</div>
        <div class="cert-id">${cert.certificateId}</div>
      </div>
      <div>
        <div class="signature-line">Program Manager<br>NGO Connect</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">My Certificates</h2>
        <p className="page-subtitle">Download certificates for your completed activities</p>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : certificates.length === 0 ? (
        <div className="empty-state">
          <Award size={48} />
          <h3>No certificates yet</h3>
          <p>Complete volunteer activities to earn certificates</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {certificates.map(cert => (
            <div key={cert._id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {/* Certificate preview header */}
              <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', padding: '1.5rem', textAlign: 'center', color: 'white' }}>
                <Award size={40} style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Certificate of Completion</div>
                <div style={{ opacity: 0.85, fontSize: '0.875rem', marginTop: '0.25rem' }}>NGO Connect</div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '1rem', color: '#0f172a' }}>
                  {cert.activityName || cert.activity?.title || 'Community Service'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <Clock size={14} color="#16a34a" />Service Hours: <strong style={{ color: '#0f172a' }}>{cert.serviceHours} hours</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <Calendar size={14} color="#16a34a" />Issued: <strong style={{ color: '#0f172a' }}>{formatDate(cert.issuedAt)}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <CheckCircle size={14} color="#16a34a" />ID: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{cert.certificateId}</strong>
                  </div>
                </div>
                <button onClick={() => handleDownload(cert)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={downloading === cert._id}>
                  <Download size={16} /> {downloading === cert._id ? 'Generating...' : 'Download Certificate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
