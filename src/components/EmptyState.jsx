import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function EmptyState({ searchQuery, onResetFilters }) {
  return (
    <div className="empty-state-box glass-panel">
      <div className="empty-icon-wrapper animate-float">
        <SearchX size={44} />
      </div>
      <h3 className="empty-title">Data Mahasiswa Tidak Ditemukan</h3>
      <p className="empty-desc">
        {searchQuery
          ? `Tidak ada hasil yang cocok dengan kata kunci "${searchQuery}". Silakan periksa kembali ejaan NIM atau nama.`
          : 'Tidak ada mahasiswa yang sesuai dengan kombinasi filter yang Anda pilih.'}
      </p>
      <button onClick={onResetFilters} className="btn btn-primary empty-action-btn">
        <RotateCcw size={16} />
        <span>Reset Filter Pencarian</span>
      </button>

      <style>{`
        .empty-state-box {
          text-align: center;
          padding: 3.5rem 1.5rem;
          margin: 1.5rem 0 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 540px;
          margin-left: auto;
          margin-right: auto;
        }

        .empty-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-xl);
          background: var(--bg-surface-subtle);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-500);
          margin-bottom: 1.25rem;
          box-shadow: var(--shadow-sm);
        }

        .empty-title {
          font-size: 1.35rem;
          margin-bottom: 0.5rem;
        }

        .empty-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .empty-action-btn {
          padding: 0.75rem 1.5rem;
        }
      `}</style>
    </div>
  );
}
