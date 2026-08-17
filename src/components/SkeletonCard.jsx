import React from 'react';

export default function SkeletonCard({ count = 8, viewMode = 'grid' }) {
  const items = Array.from({ length: count });

  if (viewMode === 'table') {
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
              {items.map((_, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="skeleton" style={{ width: '38px', height: '38px', borderRadius: '50%' }}></div>
                      <div className="skeleton" style={{ width: '140px', height: '18px' }}></div>
                    </div>
                  </td>
                  <td><div className="skeleton" style={{ width: '90px', height: '18px' }}></div></td>
                  <td><div className="skeleton" style={{ width: '160px', height: '18px' }}></div></td>
                  <td><div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '999px' }}></div></td>
                  <td className="text-right"><div className="skeleton" style={{ width: '60px', height: '28px', marginLeft: 'auto' }}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {items.map((_, idx) => (
        <div key={idx} className="skeleton-card">
          <div className="skeleton" style={{ height: '56px', width: '100%', borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)' }}></div>
          <div style={{ padding: '0 1.25rem' }}>
            <div className="skeleton" style={{ width: '72px', height: '72px', marginTop: '-36px', borderRadius: 'var(--radius-lg)' }}></div>
            <div className="skeleton" style={{ width: '90px', height: '14px', marginTop: '1rem' }}></div>
            <div className="skeleton" style={{ width: '80%', height: '24px', marginTop: '0.6rem' }}></div>
            <div className="skeleton" style={{ width: '60%', height: '16px', marginTop: '0.5rem' }}></div>
          </div>
          <div className="skeleton" style={{ width: '100%', height: '42px', marginTop: '1.25rem', borderBottomLeftRadius: 'var(--radius-xl)', borderBottomRightRadius: 'var(--radius-xl)' }}></div>
        </div>
      ))}

      <style>{`
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 640px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1280px) {
          .cards-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .skeleton-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
