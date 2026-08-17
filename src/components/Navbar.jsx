import React from 'react';
import { GraduationCap, Database, Sun, Moon, RefreshCw, Sliders, ExternalLink } from 'lucide-react';

export default function Navbar({
  theme,
  toggleTheme,
  dataSource,
  onOpenConfig,
  onRefreshData,
  isRefreshing,
  totalStudents
}) {
  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Logo & Name */}
        <a href="#/" className="navbar-brand">
          <div className="brand-icon-box">
            <GraduationCap className="brand-icon" size={26} />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              Data<span>Mahasiswa</span>
            </div>
            <div className="brand-tagline">Portal Pencarian & Direktori</div>
          </div>
        </a>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Data Source Indicator */}
          <button
            onClick={onOpenConfig}
            className={`source-badge ${dataSource.source === 'live' ? 'source-live' : 'source-sample'}`}
            title="Klik untuk konfigurasi Google Spreadsheet"
          >
            <Database size={14} className="source-icon" />
            <span className="source-label">
              {dataSource.source === 'live' ? 'Google Sheets' : 'Demo Data'}
            </span>
            <span className="source-count">({totalStudents})</span>
          </button>

          {/* Refresh Data Button */}
          <button
            onClick={onRefreshData}
            className={`btn-icon ${isRefreshing ? 'animate-spin' : ''}`}
            title="Segarkan / Sinkronisasi Data"
            aria-label="Refresh Data"
            disabled={isRefreshing}
          >
            <RefreshCw size={18} />
          </button>

          {/* Config Google Sheet Modal Trigger */}
          <button
            onClick={onOpenConfig}
            className="btn-icon config-btn"
            title="Pengaturan Google Sheets"
            aria-label="Pengaturan Google Sheets"
          >
            <Sliders size={18} />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon theme-toggle-btn"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 40;
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          transition: background-color var(--transition-normal);
        }

        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .navbar-container {
            padding: 1rem 2rem;
          }
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-decoration: none;
          color: var(--text-main);
          transition: transform var(--transition-fast);
        }

        .navbar-brand:hover {
          transform: translateY(-1px);
        }

        .brand-icon-box {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .brand-title span {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-tagline {
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.01em;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (min-width: 640px) {
          .navbar-actions {
            gap: 0.75rem;
          }
        }

        .source-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: 1px solid transparent;
        }

        .source-live {
          background: var(--status-active-bg);
          color: var(--status-active-text);
          border-color: var(--status-active-border);
        }

        .source-live:hover {
          box-shadow: 0 0 12px var(--status-active-glow);
        }

        .source-sample {
          background: var(--primary-50);
          color: var(--primary-600);
          border-color: var(--primary-200);
        }

        [data-theme="dark"] .source-sample {
          background: rgba(99, 102, 241, 0.12);
          color: #A5B4FC;
          border-color: rgba(99, 102, 241, 0.3);
        }

        .source-sample:hover {
          transform: translateY(-1px);
        }

        .source-count {
          opacity: 0.8;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </header>
  );
}
