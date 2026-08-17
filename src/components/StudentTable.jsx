import React, { useState } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';

export default function StudentTable({ students }) {
  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('aktif') && !s.includes('non')) return 'status-aktif';
    if (s.includes('cuti')) return 'status-cuti';
    if (s.includes('lulus')) return 'status-lulus';
    return 'status-nonaktif';
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

  return (
    <div className="table-wrapper glass-panel">
      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th>Mahasiswa</th>
              <th>NIM</th>
              <th>Institusi / Kampus</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.nim}
                onClick={() => {
                  window.location.hash = `#/mahasiswa/${encodeURIComponent(student.nim)}`;
                }}
                className="table-row-clickable"
              >
                {/* Mahasiswa Info */}
                <td>
                  <div className="table-user-cell">
                    <TableAvatar student={student} getInitials={getInitials} />
                    <span className="table-student-name">{student.nama}</span>
                  </div>
                </td>

                {/* NIM */}
                <td>
                  <span className="table-nim-badge">{student.nim}</span>
                </td>

                {/* Institusi */}
                <td>
                  <div className="table-institution-cell">
                    <Building2 size={15} className="institution-icon" />
                    <span>{student.institusi || '-'}</span>
                  </div>
                </td>

                {/* Status */}
                <td>
                  <span className={`status-badge ${getStatusClass(student.status)}`}>
                    <span className="status-dot"></span>
                    {student.status || 'Aktif'}
                  </span>
                </td>

                {/* Action Link */}
                <td className="text-right">
                  <a
                    href={`#/mahasiswa/${encodeURIComponent(student.nim)}`}
                    className="table-detail-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Detail</span>
                    <ArrowRight size={14} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .table-wrapper {
          overflow: hidden;
          margin-bottom: 2rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-color);
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .student-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .student-table th {
          background: var(--bg-surface-subtle);
          padding: 0.95rem 1.25rem;
          font-weight: 700;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
          white-space: nowrap;
        }

        .student-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-main);
          vertical-align: middle;
        }

        .table-row-clickable {
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .table-row-clickable:hover {
          background-color: var(--bg-surface-subtle);
        }

        .table-user-cell {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .table-student-name {
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
        }

        .table-nim-badge {
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          background: var(--bg-surface-subtle);
          border: 1px solid var(--border-color);
          color: var(--primary-600);
        }

        [data-theme="dark"] .table-nim-badge {
          color: #A5B4FC;
        }

        .table-institution-cell {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--text-muted);
        }

        .text-right {
          text-align: right;
        }

        .table-detail-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          text-decoration: none;
          color: var(--primary-600);
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-md);
          background: var(--bg-surface-subtle);
          border: 1px solid var(--border-color);
          transition: all var(--transition-fast);
        }

        [data-theme="dark"] .table-detail-btn {
          color: #818CF8;
        }

        .table-detail-btn:hover {
          background: var(--primary-600);
          color: #FFFFFF;
          border-color: var(--primary-600);
        }
      `}</style>
    </div>
  );
}

function TableAvatar({ student, getInitials }) {
  const [error, setError] = useState(false);

  return (
    <div className="table-avatar-box">
      {!error && student.foto ? (
        <img
          src={student.foto}
          alt={student.nama}
          className="table-avatar-img"
          onError={() => setError(true)}
        />
      ) : (
        <div className="table-avatar-fallback">
          {getInitials(student.nama)}
        </div>
      )}
      <style>{`
        .table-avatar-box {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--bg-surface-subtle);
        }

        .table-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .table-avatar-fallback {
          width: 100%;
          height: 100%;
          background: var(--primary-gradient);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.82rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
