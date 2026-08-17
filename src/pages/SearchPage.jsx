import React, { useState, useMemo } from 'react';
import StatsOverview from '../components/StatsOverview';
import SearchFilter from '../components/SearchFilter';
import StudentCard from '../components/StudentCard';
import StudentTable from '../components/StudentTable';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { ChevronLeft, ChevronRight, Sparkles, Search, ArrowRight } from 'lucide-react';

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

  // Quick sample suggestion chips
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
          <Sparkles size={13} className="hero-badge-icon" />
          <span>Direktori Mahasiswa</span>
        </div>
        <h1 className="hero-title">
          Pencarian Data <span>Mahasiswa</span>
        </h1>
        <p className="hero-subtitle">
          Ketik NIM atau Nama Mahasiswa di bawah untuk menemukan profil secara instan.
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
            Pengaturan Sheet
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

      {/* State 1: When user has NOT searched yet (Initial State) */}
      {!isActivelySearching && !isLoading && (
        <div className="initial-search-prompt glass-panel">
          <div className="search-prompt-icon animate-float">
            <Search size={30} />
          </div>
          <h3 className="prompt-title">Mulai Pencarian Data Mahasiswa</h3>
          <p className="prompt-desc">
            Masukkan <strong>NIM</strong> atau <strong>Nama Lengkap</strong> pada kolom pencarian di atas untuk menampilkan hasil.
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
                    <ArrowRight size={12} />
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
              Ditemukan <strong>{filteredStudents.length}</strong> data mahasiswa
              {searchQuery && (
                <span className="query-highlight"> "{searchQuery}"</span>
              )}
            </div>
            {totalPages > 1 && (
              <div className="page-indicator">
                Hal {activePage} dari {totalPages}
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
                <ChevronLeft size={16} />
                <span className="btn-page-text">Sebelumnya</span>
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
                <span className="btn-page-text">Berikutnya</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        .search-page-container {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .hero-section {
          text-align: center;
          padding: 0.75rem 0 1.25rem;
          max-width: 760px;
          margin: 0 auto;
        }

        @media (min-width: 640px) {
          .hero-section {
            padding: 1.5rem 0 2rem;
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.85rem;
          border-radius: var(--radius-full);
          background: var(--primary-50);
          color: var(--primary-600);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin-bottom: 0.65rem;
          border: 1px solid var(--primary-200);
        }

        @media (min-width: 640px) {
          .hero-badge {
            font-size: 0.8rem;
            padding: 0.35rem 0.95rem;
            margin-bottom: 1rem;
          }
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
          font-size: 1.65rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 0.5rem;
          letter-spacing: -0.03em;
        }

        @media (min-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }
        }

        @media (min-width: 640px) {
          .hero-title {
            font-size: 3rem;
            margin-bottom: 0.85rem;
          }
        }

        .hero-title span {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
          max-width: 580px;
          margin: 0 auto;
        }

        @media (min-width: 640px) {
          .hero-subtitle {
            font-size: 1.05rem;
            line-height: 1.6;
          }
        }

        .error-banner {
          background: rgba(244, 63, 94, 0.08);
          border: 1px solid rgba(244, 63, 94, 0.25);
          border-radius: var(--radius-lg);
          padding: 0.75rem 1rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
          color: #E11D48;
          font-size: 0.85rem;
        }

        .error-banner-sub {
          font-size: 0.75rem;
          opacity: 0.85;
          margin-top: 0.1rem;
        }

        .btn-sm {
          padding: 0.35rem 0.75rem;
          font-size: 0.78rem;
        }

        /* Initial Search Prompt */
        .initial-search-prompt {
          text-align: center;
          padding: 2.25rem 1rem 2rem;
          margin: 0.25rem 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
          border-radius: var(--radius-xl);
          width: 100%;
        }

        @media (min-width: 640px) {
          .initial-search-prompt {
            padding: 3.5rem 1.5rem 3rem;
            margin: 0.5rem auto 3rem;
          }
        }

        .search-prompt-icon {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-lg);
          background: var(--primary-50);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          border: 1px solid var(--primary-200);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.12);
        }

        @media (min-width: 640px) {
          .search-prompt-icon {
            width: 76px;
            height: 76px;
            border-radius: var(--radius-xl);
            margin-bottom: 1.25rem;
          }
        }

        [data-theme="dark"] .search-prompt-icon {
          background: rgba(99, 102, 241, 0.15);
          color: #A5B4FC;
          border-color: rgba(99, 102, 241, 0.3);
        }

        .prompt-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.45rem;
        }

        @media (min-width: 640px) {
          .prompt-title {
            font-size: 1.35rem;
            margin-bottom: 0.6rem;
          }
        }

        .prompt-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.55;
          max-width: 460px;
          margin-bottom: 1.35rem;
        }

        @media (min-width: 640px) {
          .prompt-desc {
            font-size: 0.95rem;
            margin-bottom: 1.75rem;
          }
        }

        .suggestions-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
        }

        .suggestions-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .suggestions-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.4rem;
        }

        .suggestion-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--bg-surface-subtle);
          border: 1px solid var(--border-color);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-family: var(--font-main);
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        @media (min-width: 640px) {
          .suggestion-chip {
            padding: 0.4rem 0.85rem;
            font-size: 0.82rem;
          }
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

        /* Results Header */
        .results-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding: 0 0.15rem;
          gap: 0.4rem;
        }

        .results-count {
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        @media (min-width: 640px) {
          .results-count {
            font-size: 0.95rem;
          }
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
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .student-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 640px) {
          .student-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
            margin-bottom: 2.5rem;
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
          gap: 0.35rem;
          margin-top: 0.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        @media (min-width: 640px) {
          .pagination-wrapper {
            gap: 0.5rem;
            margin-top: 1rem;
            margin-bottom: 3rem;
          }
        }

        .pagination-numbers {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .page-num-btn {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-family: var(--font-main);
          font-weight: 600;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        @media (min-width: 640px) {
          .page-num-btn {
            width: 38px;
            height: 38px;
            font-size: 0.88rem;
          }
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
          padding: 0 0.25rem;
          color: var(--text-subtle);
          font-size: 0.8rem;
        }

        .btn-page-text {
          display: none;
        }

        @media (min-width: 480px) {
          .btn-page-text {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}
