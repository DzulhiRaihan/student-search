import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  GraduationCap,
  ShieldCheck,
  User,
  Hash,
  AlertCircle
} from 'lucide-react';

export default function DetailPage({ nim, students, onBack }) {
  const [imgError, setImgError] = useState(false);
  const [copiedNim, setCopiedNim] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find student by NIM
  const student = students.find(
    (s) => s.nim && s.nim.toString().trim() === (nim || '').toString().trim()
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nim]);

  const handleCopyNim = () => {
    if (student?.nim) {
      navigator.clipboard.writeText(student.nim);
      setCopiedNim(true);
      setTimeout(() => setCopiedNim(false), 2000);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getInitials = (name) => {
    if (!name) return 'M';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('aktif') && !s.includes('non')) return 'status-aktif';
    if (s.includes('cuti')) return 'status-cuti';
    if (s.includes('lulus')) return 'status-lulus';
    return 'status-nonaktif';
  };

  // If student not found
  if (!student) {
    return (
      <div className="detail-container fade-in">
        <div className="not-found-card glass-panel">
          <div className="not-found-icon">
            <AlertCircle size={44} />
          </div>
          <h2>Mahasiswa Tidak Ditemukan</h2>
          <p>
            Data mahasiswa dengan NIM <strong>{nim}</strong> tidak ditemukan dalam basis data atau telah diperbarui.
          </p>
          <a href="#/" className="btn btn-primary" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Kembali ke Pencarian</span>
          </a>
        </div>

        <style>{`
          .detail-container {
            max-width: 780px;
            margin: 2rem auto;
          }
          .not-found-card {
            text-align: center;
            padding: 3.5rem 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .not-found-icon {
            color: #F43F5E;
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(244, 63, 94, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .not-found-card h2 {
            font-size: 1.5rem;
          }
          .not-found-card p {
            color: var(--text-muted);
            max-width: 420px;
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="detail-page-wrapper fade-in">
      {/* Top Navigation Row */}
      <div className="detail-nav-row">
        <a href="#/" className="btn btn-secondary back-nav-btn" onClick={onBack}>
          <ArrowLeft size={17} />
          <span>Kembali ke Pencarian</span>
        </a>

        <button onClick={handleCopyLink} className="btn btn-secondary share-link-btn" title="Salin tautan profil ini">
          {copiedLink ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
          <span>{copiedLink ? 'Tautan Tersalin!' : 'Bagikan Profil'}</span>
        </button>
      </div>

      {/* Main Student Profile ID Card */}
      <div className="profile-id-card glass-panel">
        {/* Card Top Glow Banner */}
        <div className="card-top-banner">
          <div className="banner-logo-badge">
            <GraduationCap size={18} />
            <span>KARTU IDENTITAS MAHASISWA</span>
          </div>

          <div className="verified-badge">
            <ShieldCheck size={15} />
            <span>Terverifikasi</span>
          </div>
        </div>

        {/* Card Main Body */}
        <div className="card-main-content">
          {/* Left / Top: Photo & Status */}
          <div className="profile-photo-col">
            <div className="profile-photo-wrapper">
              {!imgError && student.foto ? (
                <img
                  src={student.foto}
                  alt={student.nama}
                  className="profile-photo-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="profile-photo-fallback">
                  <span>{getInitials(student.nama)}</span>
                </div>
              )}
            </div>

            {/* Academic Status Badge */}
            <div className="status-pill-box">
              <span className={`status-badge ${getStatusClass(student.status)}`}>
                <span className="status-dot"></span>
                {student.status || 'Aktif'}
              </span>
            </div>
          </div>

          {/* Right / Body: Details Breakdown */}
          <div className="profile-info-col">
            <div className="profile-header-meta">
              <h1 className="profile-full-name">{student.nama}</h1>
              <p className="profile-sub-title">Profil Akademik Terdaftar</p>
            </div>

            {/* Structured Information Fields */}
            <div className="info-fields-grid">
              {/* Field: NIM */}
              <div className="info-field-card">
                <div className="field-icon-box">
                  <Hash size={18} />
                </div>
                <div className="field-content">
                  <span className="field-title">Nomor Induk Mahasiswa (NIM)</span>
                  <div className="field-value-row">
                    <span className="field-value-text">{student.nim}</span>
                    <button
                      onClick={handleCopyNim}
                      className="copy-mini-btn"
                      title={copiedNim ? 'NIM Tersalin!' : 'Salin NIM'}
                      aria-label="Copy NIM"
                    >
                      {copiedNim ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Field: Nama Lengkap */}
              <div className="info-field-card">
                <div className="field-icon-box">
                  <User size={18} />
                </div>
                <div className="field-content">
                  <span className="field-title">Nama Lengkap</span>
                  <span className="field-value-text">{student.nama}</span>
                </div>
              </div>

              {/* Field: Institusi */}
              <div className="info-field-card">
                <div className="field-icon-box">
                  <Building2 size={18} />
                </div>
                <div className="field-content">
                  <span className="field-title">Institusi / Perguruan Tinggi</span>
                  <span className="field-value-text">{student.institusi || '-'}</span>
                </div>
              </div>

              {/* Field: Status Akademik */}
              <div className="info-field-card">
                <div className="field-icon-box">
                  <CheckCircle2 size={18} />
                </div>
                <div className="field-content">
                  <span className="field-title">Status Akademik</span>
                  <span className="field-value-text font-semibold">{student.status || 'Aktif'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Note */}
        <div className="card-footer-note">
          <p>
            Data ini bersumber secara langsung dari direktori Google Spreadsheet dan diperbarui secara berkala.
          </p>
        </div>
      </div>

      <style>{`
        .detail-page-wrapper {
          max-width: 820px;
          margin: 0 auto;
          padding: 0.5rem 0 3rem;
        }

        .detail-nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .back-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .share-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .profile-id-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }

        .card-top-banner {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #06B6D4 100%);
          padding: 1.25rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #FFFFFF;
        }

        .banner-logo-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-main-content {
          padding: 2rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 680px) {
          .card-main-content {
            flex-direction: row;
            align-items: flex-start;
            gap: 2.5rem;
          }
        }

        .profile-photo-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .profile-photo-wrapper {
          width: 170px;
          height: 170px;
          border-radius: var(--radius-xl);
          padding: 4px;
          background: var(--bg-surface);
          border: 2px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-photo-img {
          width: 100%;
          height: 100%;
          border-radius: calc(var(--radius-xl) - 4px);
          object-fit: cover;
        }

        .profile-photo-fallback {
          width: 100%;
          height: 100%;
          border-radius: calc(var(--radius-xl) - 4px);
          background: var(--primary-gradient);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-size: 3rem;
          font-weight: 800;
        }

        .status-pill-box {
          margin-top: 1.15rem;
        }

        .profile-info-col {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .profile-header-meta {
          margin-bottom: 1.5rem;
        }

        .profile-full-name {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-bottom: 0.35rem;
        }

        .profile-sub-title {
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .info-fields-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-field-card {
          background: var(--bg-surface-subtle);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 0.95rem 1.15rem;
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          transition: border-color var(--transition-fast);
        }

        .info-field-card:hover {
          border-color: var(--border-focus);
        }

        .field-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-600);
          flex-shrink: 0;
        }

        [data-theme="dark"] .field-icon-box {
          color: #818CF8;
        }

        .field-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .field-title {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.2rem;
        }

        .field-value-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .field-value-text {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .font-semibold {
          font-weight: 600;
        }

        .copy-mini-btn {
          border: none;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          border-radius: 6px;
          padding: 0.25rem 0.4rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .copy-mini-btn:hover {
          color: var(--text-main);
          border-color: var(--primary-400);
        }

        .card-footer-note {
          background: var(--bg-surface-subtle);
          border-top: 1px solid var(--border-color);
          padding: 1rem 1.75rem;
          text-align: center;
        }

        .card-footer-note p {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
