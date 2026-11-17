# PinjamLab — Prototipe Aplikasi Mobile (HTML/CSS/JS)

Implementasi presisi desain Figma **"Sistem Peminjaman Alat & Bahan Lab TRPL Politani Samarinda"** menjadi prototipe web statis HTML, CSS, dan JavaScript murni dengan visual yang identik dan interaktivitas layaknya aplikasi mobile sungguhan.

## Cara Menjalankan

1. Buka folder proyek ini di VS Code (`File > Open Folder`).
2. Disarankan menggunakan ekstensi **Live Server**:
   - Klik kanan pada `index.html` → **Open with Live Server**.
   - Atau langsung buka `index.html` di browser Anda (misalnya Google Chrome).
3. Untuk tampilan terbaik yang menyerupai mobile phone sungguhan, gunakan **Device Mode** di Chrome DevTools (`F12` lalu tekan `Ctrl + Shift + M`).

## Struktur Proyek

```
pinjamlab/
├── index.html            → Halaman Login
├── dashboard.html         → Dashboard / Beranda
├── katalog.html           → Katalog Alat & Bahan (Pencarian & Filter Kategori)
├── form-pengajuan.html    → Form Pengajuan Peminjaman
├── riwayat.html           → Riwayat Pengajuan (Filter Status & Detail Modal)
├── scanner.html           → Pemindai QR Code Alat (Simulasi Kamera & Flash)
├── konfirmasi.html        → Surat Pengajuan / Konfirmasi Siap Cetak
├── assets/                → Aset gambar asli desain Figma (drill, wood, hero workshop, scanner)
├── css/style.css          → Style & Design Token (tersinkronisasi juga di ./style.css)
└── js/script.js           → Interaktivitas & Mobile Engine (tersinkronisasi juga di ./script.js)
```

## Fitur Interaktif Mobile yang Berfungsi Penuh

1. **Login (`index.html`)**:
   - Form input email & password interaktif.
   - Tombol "Eye" untuk melihat/menyembunyikan kata sandi secara dinamis.
   - Checkbox "Ingat saya" interaktif.
   - Tautan "Lupa kata sandi?" membuka modal *bottom sheet* pemulihan akun.
   - Tautan "Hubungi admin lab" membuka lembar informasi kontak laboran.
   - Tombol "Masuk →" dengan animasi loading lalu menuju ke Dashboard.

2. **Dashboard (`dashboard.html`)**:
   - Jam digital di status bar berjalan *real-time*.
   - Tombol lonceng notifikasi membuka panel pengingat jatuh tempo & pengajuan.
   - Kartu statistik "02 Sedang dipinjam" dan "01 Menunggu verifikasi" dapat diklik dan langsung memfilter tab di halaman Riwayat.
   - Kartu pinjaman jatuh tempo dan item siap pinjam dapat diklik untuk navigasi cepat.

3. **Katalog (`katalog.html`)**:
   - **Live Search**: Mengetik kata kunci (misal "bor", "papan", "kayu") langsung memfilter item secara *real-time*.
   - **State Kosong**: Mengetik kata yang tidak ada (misal "mikroskop") memicu kartu *Hasil tidak ditemukan* sesuai desain. Tombol "Hapus pencarian" mereset daftar kembali.
   - **Tab Kategori**: Pilihan "Semua", "Alat", dan "Bahan" memfilter daftar barang secara instan.
   - **Tombol Tambah (+)**: Memiliki animasi *bump* dan memunculkan notifikasi *toast* interaktif.
   - **Kondisi Skeleton**: Menampilkan komponen *skeleton loading* teranimasi *shimmer*.
   - **Filter Header**: Membuka modal pengaturan filter tambahan.

4. **Form Pengajuan (`form-pengajuan.html`)**:
   - Tombol `+` dan `−` pada stepper jumlah barang berfungsi dinamis dengan batas min/maksimal unit.
   - Counter karakter otomatis pada kolom catatan Keperluan (`75/250`).
   - Checkbox persetujuan tanggung jawab wajib dicentang sebelum pengajuan dikirim.
   - Tombol "Kirim pengajuan" memvalidasi data dan berpindah ke halaman konfirmasi surat.
   - Tombol bantuan `(?)` menampilkan aturan masa peminjaman lab.

5. **Scan QR Code (`scanner.html`)**:
   - Animasi garis laser biru yang bergerak memindai *viewfinder*.
   - **Simulasi Pindai**: Mengetuk area kamera akan mendeteksi QR Code dan memunculkan konfirmasi alat ditemukan.
   - Tombol **Flash** berfungsi menghidupkan/mematikan lampu kamera.
   - Tombol **Ganti kamera** beralih antara kamera belakang dan depan.
   - Tombol **Masukkan kode alat manual** membuka lembar input kode inventaris dengan saran cepat.

6. **Riwayat Pengajuan (`riwayat.html`)**:
   - Filter tab "Semua", "Menunggu", dan "Disetujui" menyaring kartu riwayat secara instan.
   - Kartu riwayat dapat diklik untuk membuka rincian peminjaman dan tautan surat.

7. **Surat Pengajuan & Cetak PDF (`konfirmasi.html`)**:
   - Pratinjau surat resmi peminjaman dengan format kop, tabel item, dan tanda tangan Prodi.
   - Tombol **Unduh / Cetak PDF** memicu dialog print browser yang sudah dioptimalkan (`@media print`) sehingga hanya mencetak surat bersih tanpa bingkai aplikasi.
