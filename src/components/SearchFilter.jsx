import React, { useRef, useEffect } from 'react';
import { Search, X, Filter, ArrowUpDown, LayoutGrid, ListFilter, RotateCcw } from 'lucide-react';

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
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Cari berdasarkan NIM atau Nama Lengkap Mahasiswa..."
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
              <X size={16} />
            </button>
          )}
          <div className="search-shortcut" title="Tekan '/' untuk mencari">
            <span>/</span>
          </div>
        </div>
      </div>

      {/* Filter & Sort Controls Row */}
      <div className="filter-controls-row">
        {/* Status Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <Filter size={14} /> Status:
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

        {/* Institusi Filter */}
        <div className="filter-group">
          <label className="filter-label">
            Institusi:
          </label>
          <select
            className="filter-select select-institution"
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

        {/* Sort Order */}
        <div className="filter-group">
          <label className="filter-label">
            <ArrowUpDown size={14} /> Urutan:
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

        {/* Right side: View Toggle & Reset */}
        <div className="filter-actions-right">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="btn btn-outline reset-btn"
              title="Reset semua filter"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          )}

          {/* View Mode Toggle: Grid or Table */}
          <div className="view-mode-group">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Tampilan Kartu (Grid View)"
              aria-label="Grid View"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              title="Tampilan Tabel (Table View)"
              aria-label="Table View"
            >
              <ListFilter size={17} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .filter-container {
          padding: 1.25rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-md);
        }

        .search-bar-wrapper {
          margin-bottom: 1.15rem;
        }

        .search-input-box {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--bg-surface-elevated);
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 0.25rem 0.75rem 0.25rem 1.1rem;
          transition: all var(--transition-fast);
        }

        .search-input-box:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
        }

        .search-icon {
          color: var(--primary-500);
          flex-shrink: 0;
          margin-right: 0.75rem;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-main);
          font-size: 1rem;
          color: var(--text-main);
          padding: 0.65rem 0;
          outline: none;
          min-width: 0;
        }

        .search-input::placeholder {
          color: var(--text-subtle);
          font-size: 0.95rem;
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
          margin-right: 0.5rem;
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

        @media (min-width: 640px) {
          .search-shortcut {
            display: flex;
          }
        }

        .filter-controls-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.85rem;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1 1 auto;
          min-width: 140px;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .filter-select {
          flex: 1;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.55rem 0.85rem;
          font-family: var(--font-main);
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-main);
          outline: none;
          cursor: pointer;
          transition: border-color var(--transition-fast);
          min-width: 0;
        }

        .filter-select:focus {
          border-color: var(--border-focus);
        }

        .select-institution {
          max-width: 260px;
        }

        .filter-actions-right {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-left: auto;
        }

        .reset-btn {
          padding: 0.5rem 0.85rem;
          font-size: 0.82rem;
          border-radius: var(--radius-md);
        }

        .view-mode-group {
          display: flex;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.2rem;
          gap: 0.2rem;
        }

        .view-btn {
          border: none;
          background: transparent;
          color: var(--text-muted);
          padding: 0.45rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
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
