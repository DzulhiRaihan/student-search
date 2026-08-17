import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle2, AlertCircle, HelpCircle, RefreshCw, Sparkles } from 'lucide-react';
import { getSheetConfig, saveSheetConfig, resetSheetConfig, fetchFromGoogleSheet, extractSheetId } from '../services/sheetService';

export default function ConfigModal({ isOpen, onClose, onConfigSaved }) {
  const [sheetInput, setSheetInput] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getSheetConfig();
      if (current) {
        setSheetInput(current.sheetInput || current.sheetId || '');
        setSheetName(current.sheetName || '');
      } else {
        setSheetInput('');
        setSheetName('');
      }
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!sheetInput.trim()) {
      setTestResult({ success: false, message: 'Harap masukkan URL atau ID Google Spreadsheet.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const sheetId = extractSheetId(sheetInput);
      const students = await fetchFromGoogleSheet(sheetId, '0', sheetName);
      if (students.length === 0) {
        setTestResult({
          success: false,
          message: 'Berhasil terhubung, namun tidak ada baris data mahasiswa yang valid ditemukan.'
        });
      } else {
        setTestResult({
          success: true,
          count: students.length,
          message: `Koneksi Berhasil! Ditemukan ${students.length} data mahasiswa.`
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Gagal terhubung. Pastikan Spreadsheet diset Publik (Anyone with the link can view).'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (!sheetInput.trim()) {
      handleResetToSample();
      return;
    }

    saveSheetConfig(sheetInput, sheetName);
    onConfigSaved();
    onClose();
  };

  const handleResetToSample = () => {
    resetSheetConfig();
    onConfigSaved();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <div className="modal-icon-badge">
              <Database size={18} />
            </div>
            <div>
              <h2 className="modal-title">Sumber Data Spreadsheet</h2>
              <p className="modal-subtitle">Hubungkan Google Spreadsheet Anda</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Input URL / ID */}
          <div className="form-group">
            <label className="form-label">
              URL atau ID Google Spreadsheet <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetInput}
              onChange={(e) => setSheetInput(e.target.value)}
            />
            <span className="form-hint">
              Tempel link URL lengkap dari Google Sheet atau ID Sheet saja.
            </span>
          </div>

          {/* Input Sheet Tab Name (Optional) */}
          <div className="form-group">
            <label className="form-label">Nama Sheet / Tab (Opsional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Sheet1 (Biarkan kosong jika tab pertama)"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
            />
          </div>

          {/* Test Connection Button & Result */}
          <div className="test-connection-section">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !sheetInput.trim()}
              className="btn btn-secondary test-btn"
            >
              {testing ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
              <span>{testing ? 'Menguji Koneksi...' : 'Uji Koneksi Sheet'}</span>
            </button>

            {testResult && (
              <div className={`test-alert ${testResult.success ? 'alert-success' : 'alert-danger'}`}>
                {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Guide Accordion / Helper */}
          <div className="guide-box">
            <button
              type="button"
              className="guide-toggle-btn"
              onClick={() => setShowGuide(!showGuide)}
            >
              <HelpCircle size={15} />
              <span>Panduan Format Kolom & Cara Berbagi</span>
            </button>

            {showGuide && (
              <div className="guide-content">
                <p><strong>1. Pengaturan Akses Google Sheet:</strong></p>
                <p>Klik tombol <strong>Bagikan / Share</strong> di Google Sheet → Ubah Akses Umum menjadi <strong>"Siapa saja yang memiliki link" (Anyone with the link)</strong> dengan peran <strong>Pelihat (Viewer)</strong>.</p>
                
                <p style={{ marginTop: '0.65rem' }}><strong>2. Susunan Header Kolom (Baris 1):</strong></p>
                <div className="table-mini-wrapper">
                  <table className="mini-table">
                    <thead>
                      <tr>
                        <th>NIM</th>
                        <th>Nama</th>
                        <th>Institusi</th>
                        <th>Status</th>
                        <th>Foto</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2108101001</td>
                        <td>Ahmad Fauzi</td>
                        <td>Univ Indonesia</td>
                        <td>Aktif</td>
                        <td>https://... (URL Foto)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="hint-photo">
                  💡 <em>Foto dapat berupa direct URL gambar atau link foto dari Google Drive.</em>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" onClick={handleResetToSample} className="btn btn-outline btn-reset-demo">
            Gunakan Data Demo
          </button>
          <div className="footer-right-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary btn-cancel">
              Batal
            </button>
            <button type="button" onClick={handleSave} className="btn btn-primary btn-save">
              Simpan & Sinkron
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          z-index: 99;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
        }

        .modal-header {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
        }

        @media (min-width: 640px) {
          .modal-header {
            padding: 1.25rem 1.5rem;
          }
        }

        .modal-title-box {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .modal-icon-badge {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (min-width: 640px) {
          .modal-icon-badge {
            width: 38px;
            height: 38px;
          }
        }

        .modal-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 0.1rem;
        }

        @media (min-width: 640px) {
          .modal-title {
            font-size: 1.15rem;
          }
        }

        .modal-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .modal-close-btn {
          background: var(--bg-surface-subtle);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          padding: 0.35rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
        }

        .modal-close-btn:hover {
          color: var(--text-main);
          background: var(--border-color);
        }

        .modal-body {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .modal-body {
            padding: 1.5rem;
            gap: 1.25rem;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .text-rose-500 {
          color: #F43F5E;
        }

        .form-input {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.65rem 0.85rem;
          font-family: var(--font-main);
          font-size: 14px;
          color: var(--text-main);
          outline: none;
          transition: all var(--transition-fast);
          min-height: 40px;
        }

        @media (min-width: 640px) {
          .form-input {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }
        }

        .form-input:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
        }

        .form-hint {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .test-connection-section {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .test-btn {
          align-self: flex-start;
          font-size: 0.82rem;
          padding: 0.5rem 0.85rem;
        }

        .test-alert {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 500;
        }

        .alert-success {
          background: var(--status-active-bg);
          color: var(--status-active-text);
          border: 1px solid var(--status-active-border);
        }

        .alert-danger {
          background: var(--status-nonaktif-bg);
          color: var(--status-nonaktif-text);
          border: 1px solid var(--status-nonaktif-border);
        }

        .guide-box {
          background: var(--bg-surface-subtle);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 0.75rem 0.85rem;
        }

        .guide-toggle-btn {
          width: 100%;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--primary-600);
          cursor: pointer;
          text-align: left;
        }

        [data-theme="dark"] .guide-toggle-btn {
          color: #A5B4FC;
        }

        .guide-content {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px dashed var(--border-color);
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .table-mini-wrapper {
          overflow-x: auto;
          margin: 0.4rem 0;
        }

        .mini-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.74rem;
        }

        .mini-table th, .mini-table td {
          border: 1px solid var(--border-color);
          padding: 0.3rem 0.45rem;
          text-align: left;
        }

        .mini-table th {
          background: var(--bg-surface);
          font-weight: 700;
        }

        .hint-photo {
          font-size: 0.72rem;
          margin-top: 0.35rem;
        }

        .modal-footer {
          padding: 1rem 1.15rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column-reverse;
          gap: 0.65rem;
        }

        @media (min-width: 540px) {
          .modal-footer {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 1.25rem 1.5rem;
          }
        }

        .btn-reset-demo {
          width: 100%;
          font-size: 0.82rem;
        }

        @media (min-width: 540px) {
          .btn-reset-demo {
            width: auto;
          }
        }

        .footer-right-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
        }

        @media (min-width: 540px) {
          .footer-right-actions {
            width: auto;
            gap: 0.75rem;
          }
        }

        .btn-cancel, .btn-save {
          flex: 1;
          font-size: 0.85rem;
        }

        @media (min-width: 540px) {
          .btn-cancel, .btn-save {
            flex: initial;
          }
        }
      `}</style>
    </div>
  );
}
