# 🎓 Portal Pencarian Data Mahasiswa (Google Spreadsheet)

Aplikasi web modern, cepat, dan responsif untuk mencari dan menampilkan detail data mahasiswa yang terintegrasi secara langsung (*real-time*) dengan Google Spreadsheet.

---

## ✨ Fitur Utama

- **2 Halaman Utama**:
  1. **Halaman Pencarian (Search Page)**: Pencarian cepat NIM & Nama, filter Status (Aktif/Cuti/Lulus/Non-Aktif), filter Institusi, pengurutan, statistik cepat, dan mode tampilan Grid/Tabel.
  2. **Halaman Detail Mahasiswa (Detail Page)**: Tampilan kartu profil premium dengan NIM, Nama Lengkap, Institusi, Status Akademik, dan Foto (tanpa tombol cetak kartu).
- **Integrasi Google Spreadsheet**:
  - Hubungkan Google Spreadsheet Anda sendiri dengan menempelkan URL/ID di modal Pengaturan.
  - Terdapat tombol uji koneksi dan panduan format kolom.
  - Dilengkapi *built-in sample dataset* mahasiswa Indonesia untuk pengujian langsung.
- **Desain & UX**:
  - Tampilan Glassmorphism modern & responsif (Mobile, Tablet, Desktop).
  - Mode Gelap & Terang (*Dark / Light Mode*).
  - Shortcut pencarian keyboard (`/` atau `Ctrl+K`).
  - Salin NIM dan Salin Tautan Profil dengan sekali klik.

---

## 🛠️ Format Google Spreadsheet

Pastikan sheet diatur ke **"Anyone with the link can view" / "Siapa saja yang memiliki link: Pelihat"**.

Header baris ke-1 yang didukung:
- `NIM`
- `Nama`
- `Institusi`
- `Status`
- `Foto` (URL langsung atau Link Google Drive)

---

## 🚀 Cara Menjalankan

```bash
# 1. Install dependensi (jika belum)
npm install

# 2. Jalankan server lokal (otomatis expose host network)
npm run dev

# 3. Jalankan ngrok tunnel (bisa di terminal terpisah kapan saja)
npm run tunnel
# atau
ngrok http 5173

# 4. Build untuk produksi
npm run build
```
Akses aplikasi melalui browser di `http://localhost:5173/` atau via URL publik yang diberikan oleh **ngrok** (misal: `https://xxxx.ngrok-free.app`).
