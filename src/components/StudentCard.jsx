import React, { useState } from 'react';
import { Building2, ArrowRight, Copy, Check } from 'lucide-react';

export default function StudentCard({ student }) {
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract initials for fallback avatar
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

  const handleCopyNim = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (student.nim) {
      navigator.clipboard.writeText(student.nim);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('aktif') && !s.includes('non')) return 'status-aktif';
    if (s.includes('cuti')) return 'status-cuti';
    if (s.includes('lulus')) return 'status-lulus';
    return 'status-nonaktif';
  };

  return (
    <div className="student-card-item">
      {/* Top Banner & Photo Area */}
      <div className="card-header-banner">
        <div className="status-badge-container">
          <span className={`status-badge ${getStatusClass(student.status)}`}>
            <span className="status-dot"></span>
            {student.status || 'Aktif'}
          </span>
        </div>
      </div>

      {/* Student Avatar */}
      <div className="avatar-wrapper">
        {!imgError && student.foto ? (
          <img
            src={student.foto}
            alt={student.nama}
            className="student-avatar-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="avatar-fallback">
            <span>{getInitials(student.nama)}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body">
        {/* NIM Badge & Copy */}
        <div className="nim-badge-row">
          <span className="nim-text" title="Nomor Induk Mahasiswa">
            NIM: <strong>{student.nim}</strong>
          </span>
          <button
            onClick={handleCopyNim}
            className="copy-nim-btn"
            title={copied ? 'Tersalin!' : 'Salin NIM'}
            aria-label="Salin NIM"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>
        </div>

        {/* Student Name */}
        <h3 className="student-name" title={student.nama}>
          {student.nama}
        </h3>

        {/* Institution */}
        <div className="institution-row" title={student.institusi}>
          <Building2 size={15} className="institution-icon" />
          <span className="institution-name">{student.institusi || 'Perguruan Tinggi'}</span>
        </div>
      </div>

      {/* Card Footer / Action */}
      <div className="card-footer">
        <a href={`#/mahasiswa/${encodeURIComponent(student.nim)}`} className="detail-action-link">
          <span>Lihat Detail Profil</span>
          <ArrowRight size={16} className="arrow-icon" />
        </a>
      </div>

      <style>{`
        .student-card-item {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-smooth);
          position: relative;
        }

        .student-card-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--border-focus);
        }

        .card-header-banner {
          height: 56px;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%);
          position: relative;
          padding: 0.65rem 1rem;
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }

        [data-theme="dark"] .card-header-banner {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%);
        }

        .avatar-wrapper {
          position: relative;
          margin-top: -36px;
          margin-left: 1.25rem;
          width: 72px;
          height: 72px;
          border-radius: var(--radius-lg);
          padding: 3px;
          background: var(--bg-surface);
          box-shadow: var(--shadow-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .student-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: calc(var(--radius-lg) - 3px);
          object-fit: cover;
          display: block;
        }

        .avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: calc(var(--radius-lg) - 3px);
          background: var(--primary-gradient);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .card-body {
          padding: 0.85rem 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .nim-badge-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
        }

        .nim-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
          font-family: var(--font-main);
        }

        .nim-text strong {
          color: var(--primary-600);
          font-weight: 700;
        }

        [data-theme="dark"] .nim-text strong {
          color: #A5B4FC;
        }

        .copy-nim-btn {
          border: none;
          background: transparent;
          color: var(--text-subtle);
          cursor: pointer;
          padding: 0.2rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .copy-nim-btn:hover {
          color: var(--text-main);
          background: var(--bg-surface-subtle);
        }

        .student-name {
          font-size: 1.12rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.35;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.7rem;
        }

        .institution-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-top: auto;
        }

        .institution-icon {
          color: var(--primary-500);
          flex-shrink: 0;
        }

        .institution-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-footer {
          border-top: 1px solid var(--border-color);
          background: var(--bg-surface-subtle);
          padding: 0.75rem 1.25rem;
        }

        .detail-action-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          color: var(--primary-600);
          font-size: 0.88rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        [data-theme="dark"] .detail-action-link {
          color: #818CF8;
        }

        .student-card-item:hover .detail-action-link {
          color: var(--primary-500);
        }

        .arrow-icon {
          transition: transform var(--transition-fast);
        }

        .student-card-item:hover .arrow-icon {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
