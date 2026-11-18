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
├── verifikasi.html        → Persetujuan dan pencatatan pengambilan (Laboran)
├── pengembalian.html      → Pemeriksaan kondisi alat (Laboran)
├── laporan.html           → Ringkasan inventaris dan ekspor CSV (Admin)
├── scanner.html           → Pemindai QR Code Alat (Simulasi Kamera & Flash)
├── konfirmasi.html        → Surat Pengajuan / Konfirmasi Siap Cetak
├── assets/                → Aset gambar pendukung antarmuka
├── css/style.css          → Style & Design Token (tersinkronisasi juga di ./style.css)
├── js/script.js           → Interaktivitas & Mobile Engine (tersinkronisasi juga di ./script.js)
├── js/data-barang.js      → Data inventaris untuk katalog
└── js/workflow.js         → Alur transaksi lokal dan penyimpanan browser
```

## Fitur Interaktif Mobile yang Berfungsi Penuh

1. **Login (`index.html`)**:
   - Form email dan pilihan peran Mahasiswa, Dosen, Laboran, atau Admin untuk simulasi lokal (bukan autentikasi sungguhan).
   - Tombol "Eye" untuk melihat/menyembunyikan kata sandi secara dinamis.
   - Checkbox "Ingat saya" interaktif.
   - Tautan "Lupa kata sandi?" membuka modal *bottom sheet* pemulihan akun.
   - Tautan "Hubungi admin lab" membuka lembar informasi kontak laboran.
   - Tombol "Masuk →" menyimpan peran demo dan menuju Dashboard.

2. **Dashboard (`dashboard.html`)**:
   - Jam digital di status bar berjalan *real-time*.
   - Statistik dan menu menyesuaikan transaksi lokal serta peran pengguna.
   - Menu Laboran/Admin menyediakan verifikasi dan pengembalian; menu Admin menyediakan laporan.

3. **Katalog (`katalog.html`)**:
   - Memuat seluruh 50 barang dari `js/data-barang.js`, termasuk spesifikasi dan volume yang tercantum pada dokumen inventaris.
   - **Live Search**: Mengetik nama, nomor, kategori, spesifikasi, stok, atau kondisi langsung memfilter item secara *real-time*.
   - **State Kosong**: Mengetik kata yang tidak ada (misal "mikroskop") memicu kartu *Hasil tidak ditemukan* sesuai desain. Tombol "Hapus pencarian" mereset daftar kembali.
   - **Tab Kategori**: Pilihan "Semua", "Alat", dan "Bahan" memfilter daftar barang secara instan.
   - **Tombol Tambah (+)**: Menyimpan pilihan barang ke draft dan memperbarui stok tersedia.
   - **Kondisi Skeleton**: Menampilkan komponen *skeleton loading* teranimasi *shimmer*.
   - **Filter Header**: Membuka modal pengaturan filter tambahan.

4. **Form Pengajuan (`form-pengajuan.html`)**:
   - Daftar barang dipilih dapat diubah jumlahnya sesuai stok tersedia atau dihapus.
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
   - Filter tab menampilkan status Menunggu, Disetujui, Dipinjam, Ditolak, dan Selesai dari transaksi yang tersimpan.

7. **Surat Pengajuan & Cetak PDF (`konfirmasi.html`)**:
   - Pratinjau surat memuat identitas, tanggal, keperluan, daftar barang, dan status transaksi.
   - Tombol **Unduh / Cetak PDF** memicu dialog print browser yang sudah dioptimalkan (`@media print`) sehingga hanya mencetak surat bersih tanpa bingkai aplikasi.

## Alur Pengajuan, Verifikasi, dan Stok

Prototipe lokal ini mengikuti alur pada diagram: pilih alat atau bahan di katalog, kirim pengajuan dengan tanggal dan keperluan, lalu Laboran memverifikasi atau menolak dengan alasan. Pengajuan yang disetujui dicatat saat pengambilan. Stok bahan berkurang saat diserahkan; alat tetap tercatat dipinjam sampai Laboran mengisi kondisi pengembalian (baik, rusak, atau hilang). Riwayat dan laporan menampilkan perubahan transaksi dan stok.

- `verifikasi.html`: khusus peran Laboran/Admin untuk menyetujui, menolak, dan mencatat pengambilan.
- `pengembalian.html`: khusus peran Laboran/Admin untuk mencatat kondisi alat yang kembali.
- `laporan.html`: ringkasan dan ekspor CSV untuk Admin.
- Data transaksi, sesi peran, draft, dan perubahan stok disimpan di `localStorage` browser. Ini hanya simulasi satu browser/perangkat, bukan autentikasi atau penyimpanan multi-pengguna di server; data browser dapat dihapus melalui pengaturan penyimpanan browser.
