# PinjamLab — Prototipe Web (HTML/CSS/JS)

Hasil implementasi desain Figma "Sistem Peminjaman Alat & Bahan Lab" menjadi kode statis HTML, CSS, dan JavaScript murni (tanpa framework, tanpa perlu `npm install`).

## Cara membuka di VS Code

1. Ekstrak folder ini, lalu buka foldernya di VS Code (`File > Open Folder`).
2. Install ekstensi **Live Server** (by Ritwick Dey) dari Extensions Marketplace — supaya navigasi antar halaman & fitur JS berjalan normal (disarankan, karena beberapa browser membatasi file lokal `file://`).
3. Klik kanan `index.html` → **Open with Live Server**. Atau cukup buka `index.html` langsung di browser (double-click) — tetap berfungsi, hanya navigasinya pakai `file://`.

## Struktur folder

```
pinjamlab/
├── index.html            → Login
├── dashboard.html         → Dashboard / Beranda
├── katalog.html           → Katalog alat & bahan
├── form-pengajuan.html    → Form pengajuan peminjaman
├── riwayat.html           → Riwayat pengajuan
├── scanner.html           → Scan QR Code
├── konfirmasi.html        → Surat pengajuan / konfirmasi
├── css/style.css          → Semua style & design token (warna, spacing, komponen)
└── js/script.js           → Interaksi: toggle password, stepper jumlah, tab filter, checkbox, counter karakter
```

## Fitur interaktif yang sudah jalan

- Login → submit mengarah ke Dashboard
- Toggle lihat/sembunyikan kata sandi
- Checkbox "Ingat saya" & persetujuan form bisa diklik
- Tab filter kategori (Katalog) & status (Riwayat)
- Tombol +/- jumlah unit di Form pengajuan
- Counter karakter otomatis pada kolom keperluan
- Navigasi bawah (Beranda/Katalog/Riwayat) aktif sesuai halaman
- Tombol "Unduh/Cetak PDF" memicu dialog print browser

## Catatan

- Ikon memakai gaya **Lucide** (digambar ulang sebagai inline SVG, jadi 100% offline tanpa dependency CDN).
- Foto produk/kamera pada desain asli diganti placeholder ikon bergradasi biru karena aset foto Figma bersifat sementara (bisa Anda ganti dengan foto asli di folder `assets/` sesuai kebutuhan).
- Warna & token mengikuti palet asli desain: biru utama `#2563eb`, biru tua `#1e3a8a`, abu teks `#6b7280`, dsb — semua didefinisikan sebagai CSS variable di `css/style.css` bagian `:root`, jadi gampang diubah di satu tempat.
