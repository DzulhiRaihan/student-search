import React, { useState, useMemo } from 'react';
import StatsOverview from '../components/StatsOverview';
import SearchFilter from '../components/SearchFilter';
import StudentCard from '../components/StudentCard';
import StudentTable from '../components/StudentTable';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { ChevronLeft, ChevronRight, Sparkles, Search, UserCheck, ArrowRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function SearchPage({
  students,
  isLoading,
  error,
  onOpenConfig
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedInstitusi, setSelectedInstitusi] = useState('Semua Institusi');
  const [sortBy, setSortBy] = useState('nama-asc');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique institutions list for dropdown
  const institusiList = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.institusi && s.institusi.trim()) {
        set.add(s.institusi.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [students]);

  // Check whether the user is actively searching
  const isActivelySearching =
    searchQuery.trim().length > 0 ||
    selectedStatus !== 'Semua Status' ||
    selectedInstitusi !== 'Semua Institusi';

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    if (!isActivelySearching) {
      return [];
    }

    return students
      .filter((student) => {
        // Query search match (NIM or Nama)
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          (student.nama && student.nama.toLowerCase().includes(q)) ||
          (student.nim && student.nim.toLowerCase().includes(q));

        // Status match
        const matchesStatus =
          selectedStatus === 'Semua Status' ||
          (student.status && student.status.toLowerCase() === selectedStatus.toLowerCase());

        // Institusi match
        const matchesInstitusi =
          selectedInstitusi === 'Semua Institusi' ||
          (student.institusi && student.institusi.trim().toLowerCase() === selectedInstitusi.toLowerCase());

        return matchesQuery && matchesStatus && matchesInstitusi;
      })
      .sort((a, b) => {
        if (sortBy === 'nama-asc') {
          return (a.nama || '').localeCompare(b.nama || '', 'id');
        }
        if (sortBy === 'nama-desc') {
          return (b.nama || '').localeCompare(a.nama || '', 'id');
        }
        if (sortBy === 'nim-asc') {
          return (a.nim || '').localeCompare(b.nim || '', undefined, { numeric: true });
        }
        if (sortBy === 'nim-desc') {
          return (b.nim || '').localeCompare(a.nim || '', undefined, { numeric: true });
        }
        return 0;
      });
  }, [students, searchQuery, selectedStatus, selectedInstitusi, sortBy, isActivelySearching]);

  // Reset pagination & filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('Semua Status');
    setSelectedInstitusi('Semua Institusi');
    setSortBy('nama-asc');
    setCurrentPage(1);
  };

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedStudents = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStudents, activePage]);

  // Quick sample suggestion chips for quick testing
  const sampleSuggestions = useMemo(() => {
    return students.slice(0, 3).map((s) => ({
      label: s.nama,
      query: s.nim || s.nama
    }));
  }, [students]);

  return (
    <div className="search-page-container fade-in">
      {/* Hero Header Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={14} className="hero-badge-icon" />
          <span>Direktori Mahasiswa</span>
        </div>
        <h1 className="hero-title">
          Pencarian Data <span>Mahasiswa</span>
        </h1>
        <p className="hero-subtitle">
          Ketik NIM atau Nama Mahasiswa di bawah untuk menemukan detail data secara instan dan akurat.
        </p>
      </section>

      {/* Error Alert Banner if Sheet fetch failed */}
      {error && (
        <div className="error-banner">
          <div className="error-banner-content">
            <strong>Peringatan Koneksi:</strong> {error}
            <div className="error-banner-sub">Menampilkan data fallback demo.</div>
          </div>
          <button onClick={onOpenConfig} className="btn btn-secondary btn-sm">
            Periksa Pengaturan Sheet
          </button>
        </div>
      )}

      {/* Quick Statistics Overview */}
      <StatsOverview students={students} />

      {/* Search Bar & Filters */}
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        setSelectedStatus={(s) => {
          setSelectedStatus(s);
          setCurrentPage(1);
        }}
        selectedInstitusi={selectedInstitusi}
        setSelectedInstitusi={(i) => {
          setSelectedInstitusi(i);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        institusiList={institusiList}
        onResetFilters={handleResetFilters}
        hasActiveFilters={isActivelySearching}
      />

      {/* State 1: When user has NOT searched yet (Initial State without list) */}
      {!isActivelySearching && !isLoading && (
        <div className="initial-search-prompt glass-panel">
          <div className="search-prompt-icon animate-float">
            <Search size={36} />
          </div>
          <h3 className="prompt-title">Mulai Pencarian Data Mahasiswa</h3>
          <p className="prompt-desc">
            Masukkan <strong>Nomor Induk Mahasiswa (NIM)</strong> atau <strong>Nama Lengkap</strong> pada kolom pencarian di atas untuk menampilkan hasil.
          </p>

          {sampleSuggestions.length > 0 && (
            <div className="suggestions-box">
              <span className="suggestions-label">Contoh pencarian cepat:</span>
              <div className="suggestions-chips">
                {sampleSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item.query);
                      setCurrentPage(1);
                    }}
                    className="suggestion-chip"
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={13} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* State 2: When user IS actively searching */}
      {isActivelySearching && (
        <>
          {/* Results Header Info */}
          <div className="results-header">
            <div className="results-count">
              Ditemukan <strong>{filteredStudents.length}</strong> mahasiswa cocok dengan pencarian
              {searchQuery && (
                <span className="query-highlight"> "{searchQuery}"</span>
              )}
            </div>
            {totalPages > 1 && (
              <div className="page-indicator">
                Halaman {activePage} dari {totalPages}
              </div>
            )}
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <SkeletonCard count={4} viewMode={viewMode} />
          ) : filteredStudents.length === 0 ? (
            /* Empty State */
            <EmptyState searchQuery={searchQuery} onResetFilters={handleResetFilters} />
          ) : viewMode === 'grid' ? (
            /* Matched Students Grid */
            <div className="student-grid">
              {paginatedStudents.map((student) => (
                <StudentCard key={student.nim} student={student} />
              ))}
            </div>
          ) : (
            /* Matched Students Table */
            <StudentTable students={paginatedStudents} />
          )}

          {/* Pagination if multiple pages */}
          {!isLoading && totalPages > 1 && (
            <div className="pagination-wrapper">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={activePage === 1}
                className="btn btn-secondary pagination-btn"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
                <span>Sebelumnya</span>
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= activePage - 1 && pageNum <= activePage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`page-num-btn ${activePage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (
                    (pageNum === 2 && activePage > 3) ||
                    (pageNum === totalPages - 1 && activePage < totalPages - 2)
                  ) {
                    return <span key={pageNum} className="page-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={activePage === totalPages}
                className="btn btn-secondary pagination-btn"
                aria-label="Next page"
              >
                <span>Berikutnya</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        .search-page-container {
          display: flex;
          flex-direction: column;
        }

        .hero-section {
          text-align: center;
          padding: 1.5rem 0 2rem;
          max-width: 760px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.35rem 0.95rem;
          border-radius: var(--radius-full);
          background: var(--primary-50);
          color: var(--primary-600);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          border: 1px solid var(--primary-200);
        }

        [data-theme="dark"] .hero-badge {
          background: rgba(99, 102, 241, 0.15);
          color: #A5B4FC;
          border-color: rgba(99, 102, 241, 0.3);
        }

        .hero-badge-icon {
          color: var(--primary-500);
        }

        .hero-title {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 0.85rem;
          letter-spacing: -0.03em;
        }

        @media (min-width: 640px) {
          .hero-title {
            font-size: 3rem;
          }
        }

        .hero-title span {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.05rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .error-banner {
          background: rgba(244, 63, 94, 0.08);
          border: 1px solid rgba(244, 63, 94, 0.25);
          border-radius: var(--radius-lg);
          padding: 0.85rem 1.25rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: #E11D48;
          font-size: 0.88rem;
        }

        .error-banner-sub {
          font-size: 0.78rem;
          opacity: 0.85;
          margin-top: 0.15rem;
        }

        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
        }

        /* Initial Search Prompt (State when no search active) */
        .initial-search-prompt {
          text-align: center;
          padding: 3.5rem 1.5rem 3rem;
          margin: 0.5rem 0 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
          border-radius: var(--radius-xl);
        }

        .search-prompt-icon {
          width: 76px;
          height: 76px;
          border-radius: var(--radius-xl);
          background: var(--primary-50);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          border: 1px solid var(--primary-200);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.12);
        }

        [data-theme="dark"] .search-prompt-icon {
          background: rgba(99, 102, 241, 0.15);
          color: #A5B4FC;
          border-color: rgba(99, 102, 241, 0.3);
        }

        .prompt-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.6rem;
        }

        .prompt-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 480px;
          margin-bottom: 1.75rem;
        }

        .suggestions-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.65rem;
          width: 100%;
        }

        .suggestions-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .suggestions-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }

        .suggestion-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-surface-subtle);
          border: 1px solid var(--border-color);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .suggestion-chip:hover {
          border-color: var(--primary-400);
          color: var(--primary-600);
          background: var(--bg-surface-elevated);
          transform: translateY(-1px);
        }

        [data-theme="dark"] .suggestion-chip:hover {
          color: #A5B4FC;
        }

        /* Results Display */
        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          padding: 0 0.25rem;
        }

        .results-count {
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .results-count strong {
          color: var(--text-main);
          font-weight: 700;
        }

        .query-highlight {
          color: var(--primary-600);
          font-weight: 600;
        }

        [data-theme="dark"] .query-highlight {
          color: #818CF8;
        }

        .page-indicator {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .student-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          .student-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .student-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1280px) {
          .student-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .pagination-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .pagination-numbers {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .page-num-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-family: var(--font-main);
          font-weight: 600;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .page-num-btn:hover {
          border-color: var(--primary-400);
          color: var(--primary-600);
        }

        .page-num-btn.active {
          background: var(--primary-600);
          color: #FFFFFF;
          border-color: var(--primary-600);
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
        }

        .page-ellipsis {
          padding: 0 0.4rem;
          color: var(--text-subtle);
        }
      `}</style>
    </div>
  );
}
