import React from 'react';
import { Users, UserCheck, GraduationCap, Building2 } from 'lucide-react';

export default function StatsOverview({ students }) {
  const total = students.length;
  const aktif = students.filter(s => s.status?.toLowerCase() === 'aktif').length;
  const lulus = students.filter(s => s.status?.toLowerCase() === 'lulus').length;
  const uniqueInstitutions = new Set(students.map(s => s.institusi?.trim()).filter(Boolean)).size;

  const stats = [
    {
      label: 'Total Mahasiswa',
      value: total,
      icon: Users,
      color: 'indigo',
      gradient: 'linear-gradient(135deg, #4F46E5, #6366F1)'
    },
    {
      label: 'Status Aktif',
      value: aktif,
      icon: UserCheck,
      color: 'emerald',
      gradient: 'linear-gradient(135deg, #059669, #10B981)'
    },
    {
      label: 'Alumni / Lulus',
      value: lulus,
      icon: GraduationCap,
      color: 'sky',
      gradient: 'linear-gradient(135deg, #0284C7, #38BDF8)'
    },
    {
      label: 'Perguruan Tinggi',
      value: uniqueInstitutions,
      icon: Building2,
      color: 'violet',
      gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div key={idx} className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: stat.gradient }}>
              <IconComponent size={22} color="#FFFFFF" />
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value.toLocaleString('id-ID')}</span>
            </div>
          </div>
        );
      })}

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
          margin-bottom: 1.75rem;
        }

        @media (min-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.25rem;
          }
        }

        .stat-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1rem 1.15rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-focus);
        }

        .stat-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .stat-label {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-value {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.2;
          margin-top: 0.1rem;
        }
      `}</style>
    </div>
  );
}
