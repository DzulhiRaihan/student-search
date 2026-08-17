import React, { useRef, useEffect } from 'react';
import { Search, X, Filter, ArrowUpDown, LayoutGrid, ListFilter, RotateCcw, Building } from 'lucide-react';

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedInstitusi,
  setSelectedInstitusi,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  institusiList,
  onResetFilters,
  hasActiveFilters
}) {
  const inputRef = useRef(null);

  // Keyboard shortcut listener (/ or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const statusOptions = ['Semua Status', 'Aktif', 'Cuti', 'Lulus', 'Non-Aktif'];

  return (
    <div className="filter-container glass-panel">
      {/* Search Input Box */}
      <div className="search-bar-wrapper">
        <div className="search-input-box">
          <Search className="search-icon" size={18} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Cari NIM atau Nama Mahasiswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari data mahasiswa"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
              title="Hapus pencarian"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
          <div className="search-shortcut" title="Tekan '/' untuk mencari">
            <span>/</span>
          </div>
        </div>
      </div>

      {/* Filter & Sort Controls Grid */}
      <div className="filter-controls-grid">
        {/* Status Filter */}
        <div className="filter-group group-status">
          <label className="filter-label">
            <Filter size={13} /> <span>Status:</span>
          </label>
          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter status mahasiswa"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Urutan Filter */}
        <div className="filter-group group-sort">
          <label className="filter-label">
            <ArrowUpDown size={13} /> <span>Urutan:</span>
          </label>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Urutkan data"
          >
            <option value="nama-asc">Nama (A - Z)</option>
            <option value="nama-desc">Nama (Z - A)</option>
            <option value="nim-asc">NIM (Terkecil)</option>
            <option value="nim-desc">NIM (Terbesar)</option>
          </select>
        </div>

        {/* Institusi Filter */}
        <div className="filter-group group-institution">
          <label className="filter-label">
            <Building size={13} /> <span>Institusi:</span>
          </label>
          <select
            className="filter-select"
            value={selectedInstitusi}
            onChange={(e) => setSelectedInstitusi(e.target.value)}
            aria-label="Filter institusi"
          >
            <option value="Semua Institusi">Semua Institusi / Kampus</option>
            {institusiList.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls (Reset & View Mode) */}
        <div className="filter-actions-row">
          {hasActiveFilters ? (
            <button
              onClick={onResetFilters}
              className="btn btn-outline reset-btn"
              title="Reset semua filter"
            >
              <RotateCcw size={14} />
              <span>Reset Filter</span>
            </button>
          ) : (
            <div className="filter-spacer" />
          )}

          {/* View Mode Toggle */}
          <div className="view-mode-group">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Tampilan Kartu (Grid View)"
              aria-label="Grid View"
            >
              <LayoutGrid size={16} />
              <span className="view-btn-text">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              title="Tampilan Tabel (Table View)"
              aria-label="Table View"
            >
              <ListFilter size={16} />
              <span className="view-btn-text">Tabel</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .filter-container {
          padding: 0.85rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-md);
        }

        @media (min-width: 640px) {
          .filter-container {
            padding: 1.25rem;
            margin-bottom: 2rem;
          }
        }

        .search-bar-wrapper {
          margin-bottom: 0.75rem;
        }

        @media (min-width: 640px) {
          .search-bar-wrapper {
            margin-bottom: 1.15rem;
          }
        }

        .search-input-box {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--bg-surface-elevated);
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 0.2rem 0.5rem 0.2rem 0.85rem;
          transition: all var(--transition-fast);
        }

        @media (min-width: 640px) {
          .search-input-box {
            padding: 0.25rem 0.75rem 0.25rem 1.1rem;
          }
        }

        .search-input-box:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
        }

        .search-icon {
          color: var(--primary-500);
          flex-shrink: 0;
          margin-right: 0.6rem;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-main);
          font-size: 16px; /* Prevents auto-zoom on iOS safari */
          color: var(--text-main);
          padding: 0.65rem 0;
          outline: none;
          min-width: 0;
        }

        .search-input::placeholder {
          color: var(--text-subtle);
          font-size: 0.9rem;
        }

        @media (min-width: 640px) {
          .search-input::placeholder {
            font-size: 0.95rem;
          }
        }

        .clear-search-btn {
          background: var(--bg-surface-subtle);
          border: none;
          color: var(--text-muted);
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-right: 0.35rem;
          flex-shrink: 0;
          transition: all var(--transition-fast);
        }

        .clear-search-btn:hover {
          color: var(--text-main);
          background: var(--border-color);
        }

        .search-shortcut {
          display: none;
          align-items: center;
          justify-content: center;
          background: var(--bg-surface-subtle);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 0.2rem 0.55rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          user-select: none;
        }

        @media (min-width: 768px) {
          .search-shortcut {
            display: flex;
          }
        }

        /* Filter Controls Grid */
        .filter-controls-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
        }

        @media (min-width: 640px) {
          .filter-controls-grid {
            grid-template-columns: 1.1fr 1.1fr 1.6fr auto;
            align-items: center;
            gap: 0.75rem;
          }
        }

        .group-status {
          grid-column: span 1;
        }

        .group-sort {
          grid-column: span 1;
        }

        .group-institution {
          grid-column: span 2;
        }

        @media (min-width: 640px) {
          .group-institution {
            grid-column: span 1;
          }
        }

        .filter-actions-row {
          grid-column: span 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        @media (min-width: 640px) {
          .filter-actions-row {
            grid-column: span 1;
            margin-top: 0;
            justify-content: flex-end;
          }
        }

        .filter-spacer {
          flex: 1;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        @media (min-width: 768px) {
          .filter-group {
            flex-direction: row;
            align-items: center;
            gap: 0.45rem;
          }
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .filter-select {
          width: 100%;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.65rem;
          font-family: var(--font-main);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-main);
          outline: none;
          cursor: pointer;
          transition: border-color var(--transition-fast);
          min-width: 0;
          min-height: 38px;
        }

        @media (min-width: 640px) {
          .filter-select {
            padding: 0.55rem 0.85rem;
          }
        }

        .filter-select:focus {
          border-color: var(--border-focus);
        }

        .reset-btn {
          padding: 0.45rem 0.75rem;
          font-size: 0.78rem;
          border-radius: var(--radius-md);
        }

        .view-mode-group {
          display: flex;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.2rem;
          gap: 0.2rem;
          margin-left: auto;
        }

        .view-btn {
          border: none;
          background: transparent;
          color: var(--text-muted);
          padding: 0.4rem 0.55rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-main);
          font-size: 0.75rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .view-btn-text {
          display: inline;
        }

        @media (min-width: 640px) {
          .view-btn-text {
            display: none;
          }
          .view-btn {
            padding: 0.45rem;
          }
        }

        .view-btn:hover {
          color: var(--text-main);
        }

        .view-btn.active {
          background: var(--primary-600);
          color: #FFFFFF;
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
        }
      `}</style>
    </div>
  );
}
