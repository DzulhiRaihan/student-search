import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import ConfigModal from './components/ConfigModal';
import { loadStudentsData } from './services/sheetService';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Data state
  const [students, setStudents] = useState([]);
  const [dataSource, setDataSource] = useState({ source: 'sample', lastSync: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Config modal state
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Simple Hash Routing state
  const [currentRoute, setCurrentRoute] = useState(() => window.location.hash || '#/');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch student data
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    setFetchError(null);

    try {
      const res = await loadStudentsData(forceRefresh);
      setStudents(res.students || []);
      setDataSource({
        source: res.source,
        lastSync: res.lastSync,
        sheetId: res.sheetId
      });
      if (res.error) {
        setFetchError(res.error);
      }
    } catch (err) {
      setFetchError(err.message || 'Gagal memuat data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse route: #/mahasiswa/:nim
  const parseRoute = () => {
    const hash = currentRoute.replace(/^#\/?/, '');
    if (hash.startsWith('mahasiswa/')) {
      const nim = decodeURIComponent(hash.replace('mahasiswa/', ''));
      return { page: 'detail', nim };
    }
    return { page: 'search' };
  };

  const routeInfo = parseRoute();

  return (
    <div className="app-container">
      {/* Background ambient lighting */}
      <div className="ambient-glow" />

      {/* Navbar Header */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        dataSource={dataSource}
        onOpenConfig={() => setIsConfigOpen(true)}
        onRefreshData={() => fetchData(true)}
        isRefreshing={isRefreshing}
        totalStudents={students.length}
      />

      {/* Main Page Routing */}
      <main className="main-content">
        {routeInfo.page === 'detail' ? (
          <DetailPage
            nim={routeInfo.nim}
            students={students}
            onBack={() => {
              window.location.hash = '#/';
            }}
          />
        ) : (
          <SearchPage
            students={students}
            isLoading={isLoading}
            error={fetchError}
            onOpenConfig={() => setIsConfigOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Portal Data Mahasiswa. Terhubung Langsung dengan Google Spreadsheet.</p>
          <div className="footer-links">
            <button onClick={() => setIsConfigOpen(true)} className="footer-btn">
              Pengaturan Sumber Data
            </button>
            <span className="footer-sep">•</span>
            <a href="#/" className="footer-btn">
              Beranda Pencarian
            </a>
          </div>
        </div>
      </footer>

      {/* Configuration Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onConfigSaved={() => fetchData(true)}
      />

      <style>{`
        .app-footer {
          border-top: 1px solid var(--border-color);
          background: var(--bg-surface);
          padding: 1.5rem 1.25rem;
          margin-top: auto;
          position: relative;
          z-index: 10;
        }

        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          text-align: center;
        }

        @media (min-width: 640px) {
          .footer-content {
            flex-direction: row;
            text-align: left;
          }
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .footer-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-main);
          font-size: 0.82rem;
          cursor: pointer;
          text-decoration: none;
          transition: color var(--transition-fast);
          padding: 0;
        }

        .footer-btn:hover {
          color: var(--primary-500);
          text-decoration: underline;
        }

        .footer-sep {
          color: var(--border-color);
        }
      `}</style>
    </div>
  );
}
