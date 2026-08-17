import { SAMPLE_STUDENTS } from '../data/sampleData';

const CACHE_KEY = 'student_search_data_cache';
const CONFIG_KEY = 'student_search_sheet_config';

/**
 * Format Google Drive image URL to direct viewable link
 */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Google Drive match patterns
  // Pattern 1: drive.google.com/file/d/FILE_ID/view...
  const driveMatch1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch1 && driveMatch1[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch1[1]}&sz=w800`;
  }

  // Pattern 2: drive.google.com/open?id=FILE_ID or uc?id=FILE_ID
  const driveMatch2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch2 && driveMatch2[1] && trimmed.includes('drive.google.com')) {
    return `https://drive.google.com/thumbnail?id=${driveMatch2[1]}&sz=w800`;
  }

  return trimmed;
}

/**
 * Extract Google Sheet ID from URL or return raw ID
 */
export function extractSheetId(input) {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Extract GID (Sheet Tab ID) if present in URL
 */
export function extractGid(input) {
  if (!input) return '0';
  const match = input.match(/[#&?]gid=([0-9]+)/);
  return match ? match[1] : '0';
}

/**
 * Save configuration to localStorage
 */
export function saveSheetConfig(sheetIdOrUrl, sheetName = '') {
  const config = {
    sheetInput: sheetIdOrUrl,
    sheetId: extractSheetId(sheetIdOrUrl),
    gid: extractGid(sheetIdOrUrl),
    sheetName: sheetName.trim(),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  return config;
}

/**
 * Get current saved configuration
 */
export function getSheetConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore error
  }
  return null;
}

/**
 * Reset config to default sample
 */
export function resetSheetConfig() {
  localStorage.removeItem(CONFIG_KEY);
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Parse headers to identify NIM, Nama, Institusi, Status, Foto
 */
function mapColumnIndices(headers) {
  const mapping = { nim: -1, nama: -1, institusi: -1, status: -1, foto: -1 };

  headers.forEach((h, idx) => {
    const clean = (h || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');

    if (mapping.nim === -1 && (clean.includes('nim') || clean.includes('npm') || clean.includes('nrp') || clean.includes('nomorinduk') || clean === 'id')) {
      mapping.nim = idx;
    } else if (mapping.nama === -1 && (clean.includes('nama') || clean.includes('name') || clean.includes('namalengkap') || clean.includes('mahasiswa'))) {
      mapping.nama = idx;
    } else if (mapping.institusi === -1 && (clean.includes('institusi') || clean.includes('universitas') || clean.includes('kampus') || clean.includes('perguruan') || clean.includes('prodi') || clean.includes('jurusan') || clean.includes('fakultas') || clean.includes('univ'))) {
      mapping.institusi = idx;
    } else if (mapping.status === -1 && (clean.includes('status') || clean.includes('keaktifan') || clean.includes('state'))) {
      mapping.status = idx;
    } else if (mapping.foto === -1 && (clean.includes('foto') || clean.includes('photo') || clean.includes('gambar') || clean.includes('image') || clean.includes('avatar') || clean.includes('url'))) {
      mapping.foto = idx;
    }
  });

  // Fallback defaults by position if unmapped
  if (mapping.nim === -1 && headers.length > 0) mapping.nim = 0;
  if (mapping.nama === -1 && headers.length > 1) mapping.nama = 1;
  if (mapping.institusi === -1 && headers.length > 2) mapping.institusi = 2;
  if (mapping.status === -1 && headers.length > 3) mapping.status = 3;
  if (mapping.foto === -1 && headers.length > 4) mapping.foto = 4;

  return mapping;
}

/**
 * Fetch data from Google Visualization API (GViz)
 */
export async function fetchFromGoogleSheet(sheetId, gid = '0', sheetName = '') {
  let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq=`;
  if (sheetName) {
    url += `&sheet=${encodeURIComponent(sheetName)}`;
  } else if (gid && gid !== '0') {
    url += `&gid=${gid}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Gagal mengambil data dari Google Sheets (Status: ${response.status})`);
  }

  const text = await response.text();
  // GViz returns /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
  if (!jsonMatch || !jsonMatch[1]) {
    throw new Error('Format respon Google Sheets tidak valid. Pastikan sheet diatur ke "Anyone with the link can view" / Publik.');
  }

  const data = JSON.parse(jsonMatch[1]);
  if (data.status === 'error') {
    const errorMsg = data.errors?.map(e => e.message).join(', ') || 'Terjadi kesalahan pada Google Sheet.';
    throw new Error(`Google Sheets Error: ${errorMsg}`);
  }

  const table = data.table;
  if (!table || !table.rows) {
    throw new Error('Data tabel kosong di Google Sheet.');
  }

  // Extract column labels
  const headers = table.cols.map(c => (c && c.label ? c.label.trim() : ''));
  const mapping = mapColumnIndices(headers);

  const students = [];

  table.rows.forEach((row) => {
    if (!row || !row.c) return;

    const getValue = (idx) => {
      if (idx === -1 || !row.c[idx]) return '';
      const cell = row.c[idx];
      if (cell.f) return cell.f.toString().trim(); // formatted value
      if (cell.v !== null && cell.v !== undefined) return cell.v.toString().trim();
      return '';
    };

    const nim = getValue(mapping.nim);
    const nama = getValue(mapping.nama);
    const institusi = getValue(mapping.institusi);
    const status = getValue(mapping.status) || 'Aktif';
    const foto = normalizeImageUrl(getValue(mapping.foto));

    // Ignore completely empty rows or repeated headers
    if (nim && nama && nim.toLowerCase() !== 'nim' && nama.toLowerCase() !== 'nama') {
      students.push({
        nim,
        nama,
        institusi: institusi || 'Perguruan Tinggi',
        status: formatStatus(status),
        foto: foto || ''
      });
    }
  });

  return students;
}

/**
 * Format status with clean casing
 */
function formatStatus(raw) {
  if (!raw) return 'Aktif';
  const lower = raw.toLowerCase();
  if (lower.includes('aktif') && !lower.includes('non')) return 'Aktif';
  if (lower.includes('non') || lower.includes('tidak')) return 'Non-Aktif';
  if (lower.includes('cuti')) return 'Cuti';
  if (lower.includes('lulus')) return 'Lulus';
  if (lower.includes('do') || lower.includes('drop')) return 'Drop Out';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/**
 * Load student data with fallback and cache
 */
export async function loadStudentsData(forceRefresh = false) {
  const config = getSheetConfig();

  // If no custom sheet configured, return sample data
  if (!config || !config.sheetId) {
    return {
      source: 'sample',
      students: SAMPLE_STUDENTS,
      lastSync: new Date().toISOString()
    };
  }

  // Check cache if not forcing refresh
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.sheetId === config.sheetId && Array.isArray(parsed.students) && parsed.students.length > 0) {
          return {
            source: 'cache',
            students: parsed.students,
            lastSync: parsed.lastSync
          };
        }
      }
    } catch {
      // Ignore cache error
    }
  }

  // Fetch live
  try {
    const students = await fetchFromGoogleSheet(config.sheetId, config.gid, config.sheetName);
    const result = {
      source: 'live',
      sheetId: config.sheetId,
      students,
      lastSync: new Date().toISOString()
    };

    // Save to cache
    localStorage.setItem(CACHE_KEY, JSON.stringify(result));
    return result;
  } catch (err) {
    // If live fetch fails, try to return cache or fallback to sample
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          source: 'cache_fallback',
          students: parsed.students,
          lastSync: parsed.lastSync,
          error: err.message
        };
      }
    } catch {}

    return {
      source: 'sample_fallback',
      students: SAMPLE_STUDENTS,
      lastSync: new Date().toISOString(),
      error: err.message
    };
  }
}
