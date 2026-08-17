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
            <AlertCircle size={38} />
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
            margin: 1.5rem auto;
            padding: 0 0.5rem;
          }
          .not-found-card {
            text-align: center;
            padding: 2.5rem 1.25rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.85rem;
          }
          .not-found-icon {
            color: #F43F5E;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: rgba(244, 63, 94, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .not-found-card h2 {
            font-size: 1.3rem;
          }
          .not-found-card p {
            color: var(--text-muted);
            max-width: 420px;
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
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
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </a>

        <button onClick={handleCopyLink} className="btn btn-secondary share-link-btn" title="Salin tautan profil ini">
          {copiedLink ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
          <span>{copiedLink ? 'Tersalin!' : 'Bagikan Profil'}</span>
        </button>
      </div>

      {/* Main Student Profile ID Card */}
      <div className="profile-id-card glass-panel">
        {/* Card Top Glow Banner */}
        <div className="card-top-banner">
          <div className="banner-logo-badge">
            <GraduationCap size={16} />
            <span>KARTU IDENTITAS MAHASISWA</span>
          </div>

          <div className="verified-badge">
            <ShieldCheck size={14} />
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
                  <Hash size={16} />
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
                      {copiedNim ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Field: Nama Lengkap */}
              <div className="info-field-card">
                <div className="field-icon-box">
                  <User size={16} />
                </div>
                <div className="field-content">
                  <span className="field-title">Nama Lengkap</span>
                  <span className="field-value-text">{student.nama}</span>
                </div>
              </div>

              {/* Field: Institusi */}
              <div className="info-field-card">
                <div className="field-icon-box">
                  <Building2 size={16} />
                </div>
                <div className="field-content">
                  <span className="field-title">Institusi / Perguruan Tinggi</span>
                  <span className="field-value-text">{student.institusi || '-'}</span>
                </div>
              </div>

              {/* Field: Status Akademik */}
              <div className="info-field-card">
                <div className="field-icon-box">
                  <CheckCircle2 size={16} />
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
          padding: 0.25rem 0 2.5rem;
          width: 100%;
        }

        .detail-nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          gap: 0.65rem;
        }

        @media (min-width: 640px) {
          .detail-nav-row {
            margin-bottom: 1.5rem;
            gap: 1rem;
          }
        }

        .back-nav-btn, .share-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          padding: 0.55rem 0.85rem;
        }

        @media (min-width: 640px) {
          .back-nav-btn, .share-link-btn {
            font-size: 0.9rem;
            padding: 0.65rem 1.15rem;
            gap: 0.5rem;
          }
        }

        .profile-id-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .card-top-banner {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #06B6D4 100%);
          padding: 0.85rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          color: #FFFFFF;
        }

        @media (min-width: 640px) {
          .card-top-banner {
            padding: 1.25rem 1.75rem;
          }
        }

        .banner-logo-badge {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        @media (min-width: 640px) {
          .banner-logo-badge {
            font-size: 0.85rem;
            letter-spacing: 0.08em;
            gap: 0.6rem;
          }
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 600;
        }

        @media (min-width: 640px) {
          .verified-badge {
            padding: 0.25rem 0.75rem;
            font-size: 0.75rem;
          }
        }

        .card-main-content {
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @media (min-width: 680px) {
          .card-main-content {
            flex-direction: row;
            align-items: flex-start;
            padding: 2rem 1.75rem;
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
          width: 130px;
          height: 130px;
          border-radius: var(--radius-lg);
          padding: 3px;
          background: var(--bg-surface);
          border: 2px solid var(--border-color);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 640px) {
          .profile-photo-wrapper {
            width: 170px;
            height: 170px;
            border-radius: var(--radius-xl);
            padding: 4px;
            box-shadow: var(--shadow-lg);
          }
        }

        .profile-photo-img {
          width: 100%;
          height: 100%;
          border-radius: calc(var(--radius-lg) - 3px);
          object-fit: cover;
        }

        @media (min-width: 640px) {
          .profile-photo-img {
            border-radius: calc(var(--radius-xl) - 4px);
          }
        }

        .profile-photo-fallback {
          width: 100%;
          height: 100%;
          border-radius: calc(var(--radius-lg) - 3px);
          background: var(--primary-gradient);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-size: 2.25rem;
          font-weight: 800;
        }

        @media (min-width: 640px) {
          .profile-photo-fallback {
            border-radius: calc(var(--radius-xl) - 4px);
            font-size: 3rem;
          }
        }

        .status-pill-box {
          margin-top: 0.85rem;
        }

        @media (min-width: 640px) {
          .status-pill-box {
            margin-top: 1.15rem;
          }
        }

        .profile-info-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .profile-header-meta {
          margin-bottom: 1rem;
          text-align: center;
        }

        @media (min-width: 680px) {
          .profile-header-meta {
            text-align: left;
            margin-bottom: 1.5rem;
          }
        }

        .profile-full-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-bottom: 0.25rem;
          word-break: break-word;
        }

        @media (min-width: 640px) {
          .profile-full-name {
            font-size: 1.75rem;
            margin-bottom: 0.35rem;
          }
        }

        .profile-sub-title {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .info-fields-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (min-width: 640px) {
          .info-fields-grid {
            gap: 1rem;
          }
        }

        .info-field-card {
          background: var(--bg-surface-subtle);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.75rem 0.85rem;
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          transition: border-color var(--transition-fast);
          min-width: 0;
        }

        @media (min-width: 640px) {
          .info-field-card {
            border-radius: var(--radius-lg);
            padding: 0.95rem 1.15rem;
            gap: 0.85rem;
          }
        }

        .info-field-card:hover {
          border-color: var(--border-focus);
        }

        .field-icon-box {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-600);
          flex-shrink: 0;
        }

        @media (min-width: 640px) {
          .field-icon-box {
            width: 36px;
            height: 36px;
          }
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
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-bottom: 0.15rem;
        }

        @media (min-width: 640px) {
          .field-title {
            font-size: 0.76rem;
            letter-spacing: 0.03em;
            margin-bottom: 0.2rem;
          }
        }

        .field-value-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .field-value-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
          word-break: break-word;
        }

        @media (min-width: 640px) {
          .field-value-text {
            font-size: 1.05rem;
          }
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
          padding: 0.2rem 0.35rem;
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
          padding: 0.75rem 1rem;
          text-align: center;
        }

        @media (min-width: 640px) {
          .card-footer-note {
            padding: 1rem 1.75rem;
          }
        }

        .card-footer-note p {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        @media (min-width: 640px) {
          .card-footer-note p {
            font-size: 0.82rem;
          }
        }
      `}</style>
    </div>
  );
}
