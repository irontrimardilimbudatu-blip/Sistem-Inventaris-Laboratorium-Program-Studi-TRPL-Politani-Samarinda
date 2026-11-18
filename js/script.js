// =========================================================
// PinjamLab — Core Interactive Engine
// Vanilla JavaScript, Zero Dependencies, Full Mobile UX
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Toast Notification System
  // ==========================================
  const ensureToastContainer = () => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  };

  window.showToast = (message, type = 'info', iconSvg = null) => {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'warning' ? 'toast-warning' : ''}`;

    let iconHtml = iconSvg;
    if (!iconHtml) {
      if (type === 'success') {
        iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else if (type === 'warning') {
        iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
      } else {
        iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
      }
    }

    toast.innerHTML = `${iconHtml}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.25s ease forwards';
      setTimeout(() => toast.remove(), 260);
    }, 2800);
  };

  // ==========================================
  // 2. Interactive Bottom Sheet Modal System
  // ==========================================
  window.showBottomSheet = ({ title, contentHtml, buttons = [] }) => {
    let backdrop = document.querySelector('.sheet-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sheet-backdrop';
      backdrop.innerHTML = `
        <div class="bottom-sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title"></h3>
            <button class="sheet-close" aria-label="Tutup"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </div>
          <div class="sheet-body"></div>
          <div class="sheet-actions" style="display:flex;flex-direction:column;gap:8px;margin-top:6px;"></div>
        </div>
      `;
      document.body.appendChild(backdrop);

      const closeBtn = backdrop.querySelector('.sheet-close');
      const closeSheet = () => {
        backdrop.classList.remove('active');
      };
      closeBtn.addEventListener('click', closeSheet);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeSheet();
      });
    }

    const titleEl = backdrop.querySelector('.sheet-title');
    const bodyEl = backdrop.querySelector('.sheet-body');
    const actionsEl = backdrop.querySelector('.sheet-actions');

    titleEl.textContent = title;
    bodyEl.innerHTML = contentHtml;
    actionsEl.innerHTML = '';

    buttons.forEach((btnConfig) => {
      const btn = document.createElement('button');
      btn.className = `btn ${btnConfig.primary ? 'btn-primary' : 'btn-outline'}`;
      btn.textContent = btnConfig.text;
      btn.onclick = () => {
        if (btnConfig.onClick) btnConfig.onClick();
        backdrop.classList.remove('active');
      };
      actionsEl.appendChild(btn);
    });

    // Animate open
    requestAnimationFrame(() => {
      backdrop.classList.add('active');
    });
  };

  // ==========================================
  // 3. Status Bar Realtime Clock
  // ==========================================
  const clockEl = document.querySelector('.status-bar .clock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${hrs}.${mins}`;
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  // ==========================================
  // 4. Toggle Checkboxes
  // ==========================================
  document.querySelectorAll('[data-toggle-check]').forEach((box) => {
    const parent = box.closest('.checkbox-row') || box;
    parent.addEventListener('click', (e) => {
      e.preventDefault();
      box.classList.toggle('unchecked');
    });
  });

  // ==========================================
  // 5. Password Visibility Toggle
  // ==========================================
  document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const wrapper = btn.closest('.input');
      const passInput = wrapper.querySelector('input');
      const isPassword = passInput.getAttribute('type') === 'password';

      if (isPassword) {
        passInput.setAttribute('type', 'text');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      } else {
        passInput.setAttribute('type', 'password');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 8 10 8a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>`;
      }
    });
  });

  // ==========================================
  // 6. Login Page Interactivity (index.html)
  // ==========================================
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      if (window.PinjamlabWorkflow) return;
      e.preventDefault();
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const email = document.getElementById('email-input')?.value;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Memproses masuk...</span>`;

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 400);
    });

    const forgotPassBtn = document.getElementById('forgot-password-link');
    if (forgotPassBtn) {
      forgotPassBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showBottomSheet({
          title: 'Lupa Kata Sandi?',
          contentHtml: `
            <p style="font-size:13px;color:var(--muted);margin:0 0 12px;line-height:1.5;">Masukkan email kampus Anda untuk menerima tautan pemulihan kata sandi akun PinjamLab.</p>
            <div class="input">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
              <input type="email" id="reset-email" value="raka.pratama@mahasiswa.ac.id" placeholder="Email kampus Anda">
            </div>
          `,
          buttons: [
            {
              text: 'Kirim Tautan Reset',
              primary: true,
              onClick: () => {
                showToast('Tautan reset telah dikirim ke email kampus Anda!', 'success');
              }
            }
          ]
        });
      });
    }

    const contactAdminBtn = document.getElementById('contact-admin-link');
    if (contactAdminBtn) {
      contactAdminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showBottomSheet({
          title: 'Hubungi Admin Lab',
          contentHtml: `
            <div style="display:flex;flex-direction:column;gap:10px;font-size:13px;">
              <p style="color:var(--muted);margin:0;">Jika belum memiliki akun atau mengalami kendala akses, hubungi laboran Teknik TRPL Politani Samarinda.</p>
              <div style="background:var(--neutral-50);padding:12px;border-radius:var(--radius-sm);display:flex;flex-direction:column;gap:6px;">
                <div><strong>Lokasi:</strong> Gedung Laboratorium Teknik Lt. 1</div>
                <div><strong>Jam Operasional:</strong> Senin – Jumat, 08.00 – 16.00 WITA</div>
                <div><strong>Email:</strong> lab.trpl@politanisamarinda.ac.id</div>
                <div><strong>WhatsApp:</strong> +62 821-5550-1234</div>
              </div>
            </div>
          `,
          buttons: [
            {
              text: 'Hubungi via WhatsApp',
              primary: true,
              onClick: () => {
                showToast('Membuka kontak WhatsApp admin lab...');
              }
            }
          ]
        });
      });
    }
  }

  // ==========================================
  // 7. Dashboard Screen (dashboard.html)
  // ==========================================
  const notifBtn = document.getElementById('notif-btn');
  if (notifBtn && !window.PinjamlabWorkflow) {
    notifBtn.addEventListener('click', () => {
      showBottomSheet({
        title: 'Notifikasi Peminjaman',
        contentHtml: `
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="background:var(--orange-bg);border:1px solid #fed7aa;padding:12px;border-radius:var(--radius-sm);display:flex;gap:10px;align-items:flex-start;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;color:var(--orange-text);flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div>
                <div style="font-size:12px;font-weight:700;color:var(--orange-text);">Jatuh Tempo Besok!</div>
                <div style="font-size:11px;color:var(--text);margin-top:2px;">Raspberry Pi Pico (PJM-261024-008) harus dikembalikan paling lambat besok pukul 16.00 WITA.</div>
              </div>
            </div>
            <div style="background:var(--primary-50);border:1px solid var(--primary-100);padding:12px;border-radius:var(--radius-sm);display:flex;gap:10px;align-items:flex-start;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;color:var(--primary);flex-shrink:0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <div>
                <div style="font-size:12px;font-weight:700;color:var(--primary);">Pengajuan Dalam Antrean</div>
                <div style="font-size:11px;color:var(--text);margin-top:2px;">Praktikum IoT (PJM-261028-012) sedang diperiksa oleh admin lab.</div>
              </div>
            </div>
          </div>
        `,
        buttons: [
          {
            text: 'Lihat Semua Riwayat',
            primary: true,
            onClick: () => { window.location.href = 'riwayat.html'; }
          }
        ]
      });
    });
  }

  // Stat cards on Dashboard
  const statBorrowed = document.getElementById('stat-borrowed');
  if (statBorrowed) {
    statBorrowed.addEventListener('click', () => {
      window.location.href = window.PinjamlabWorkflow
        ? 'riwayat.html?status=dipinjam'
        : 'riwayat.html?tab=disetujui';
    });
  }
  const statPending = document.getElementById('stat-pending');
  if (statPending) {
    statPending.addEventListener('click', () => {
      window.location.href = 'riwayat.html?status=menunggu';
    });
  }

  // ==========================================
  // 8. Katalog Interactivity & Live Search
  // ==========================================
  const katalogSearch = document.getElementById('katalog-search');
  const katalogItemsContainer = document.getElementById('katalog-items-list');
  const emptyStateCard = document.getElementById('empty-state-card');
  const emptyQueryLabel = document.getElementById('empty-query-label');
  const resetSearchBtn = document.getElementById('reset-search-btn');
  const filterBtn = document.getElementById('filter-btn');

  // Filter Bottom Sheet on Katalog & Riwayat
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      showBottomSheet({
        title: 'Filter Katalog',
        contentHtml: `
          <div style="display:flex;flex-direction:column;gap:14px;font-size:13px;">
            <div>
              <label style="font-weight:700;font-size:12px;color:var(--heading);display:block;margin-bottom:8px;">Kategori Barang</label>
              <div class="tab-row" style="margin-bottom:6px;">
                <button type="button" class="tab active" data-filter-cat="semua">Semua</button>
                <button type="button" class="tab" data-filter-cat="alat">Alat</button>
                <button type="button" class="tab" data-filter-cat="bahan">Bahan</button>
              </div>
            </div>
            <div>
              <label style="font-weight:700;font-size:12px;color:var(--heading);display:block;margin-bottom:8px;">Ketersediaan</label>
              <label style="display:flex;align-items:center;gap:8px;font-size:12px;cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--primary);"> Hanya tampilkan barang yang tersedia
              </label>
            </div>
            <div>
              <label style="font-weight:700;font-size:12px;color:var(--heading);display:block;margin-bottom:8px;">Laboratorium</label>
              <select style="width:100%;height:42px;border:1px solid var(--border);border-radius:var(--radius-md);padding:0 12px;font-family:inherit;background:var(--surface);">
                <option>Laboratorium Teknik (Gedung B)</option>
                <option>Laboratorium Komputer TRPL</option>
                <option>Workshop Mekatronika</option>
              </select>
            </div>
          </div>
        `,
        buttons: [
          {
            text: 'Terapkan Filter',
            primary: true,
            onClick: () => {
              showToast('Filter berhasil diterapkan', 'success');
            }
          }
        ]
      });
    });
  }

  // Interactive Live Filter function
  const applyKatalogFilter = () => {
    if (!katalogItemsContainer) return;

    const query = (katalogSearch?.value || '').trim().toLowerCase();
    const activeTab = document.querySelector('.tab-row [data-category].active')?.dataset.category || 'semua';
    const items = katalogItemsContainer.querySelectorAll('.catalog-card');

    let visibleCount = 0;

    items.forEach((card) => {
      const name = (card.querySelector('.name')?.textContent || '').toLowerCase();
      const meta = (card.querySelector('.meta')?.textContent || '').toLowerCase();
      const stock = (card.querySelector('.volume')?.textContent || '').toLowerCase();
      const category = card.dataset.category || '';

      const specification = (card.querySelector('.spec')?.textContent || '').toLowerCase();
      const matchesQuery = !query || name.includes(query) || meta.includes(query) || stock.includes(query) || specification.includes(query);
      const matchesCategory = activeTab === 'semua' || category === activeTab;

      if (matchesQuery && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyStateCard) {
      if (visibleCount === 0) {
        emptyStateCard.style.display = 'flex';
        if (emptyQueryLabel) {
          emptyQueryLabel.textContent = `“${query || activeTab}” belum tersedia`;
        }
      } else {
        emptyStateCard.style.display = 'none';
      }
    }
  };

  if (katalogSearch) {
    katalogSearch.addEventListener('input', applyKatalogFilter);
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (katalogSearch) {
        katalogSearch.value = '';
        katalogSearch.focus();
      }
      applyKatalogFilter();
    });
  }

  // Category tab clicks on Katalog
  document.querySelectorAll('.tab-row [data-category]').forEach((tab) => {
    tab.addEventListener('click', () => {
      tab.parentElement.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      applyKatalogFilter();
    });
  });

  // "+" Add-item button interaction
  document.querySelectorAll('[data-add-item]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (window.PinjamlabWorkflow) return;
      e.stopPropagation();
      const card = btn.closest('.catalog-card') || btn.closest('.card');
      const itemName = card.querySelector('.name')?.textContent || 'Item';

      btn.style.transform = 'scale(1.25)';
      btn.style.background = '#2563eb';
      btn.style.color = '#fff';

      setTimeout(() => {
        btn.style.transform = '';
        btn.style.background = '';
        btn.style.color = '';
      }, 200);

      showToast(`${itemName} ditambahkan ke pengajuan`, 'success');
    });
  });

  // ==========================================
  // 9. Quantity Steppers
  // ==========================================
  document.querySelectorAll('[data-stepper]').forEach((stepper) => {
    const qtyEl = stepper.querySelector('.qty');
    const minus = stepper.querySelector('[data-step="minus"]');
    const plus = stepper.querySelector('[data-step="plus"]');
    const min = parseInt(stepper.dataset.min || '1', 10);
    const max = parseInt(stepper.dataset.max || '99', 10);

    const render = (val) => { qtyEl.textContent = String(val); };

    minus.addEventListener('click', (e) => {
      e.preventDefault();
      let val = parseInt(qtyEl.textContent, 10);
      if (val > min) {
        render(val - 1);
      } else {
        showToast(`Jumlah minimum adalah ${min} unit`, 'warning');
      }
    });

    plus.addEventListener('click', (e) => {
      e.preventDefault();
      let val = parseInt(qtyEl.textContent, 10);
      if (val < max) {
        render(val + 1);
      } else {
        showToast(`Maksimum tersedia adalah ${max} unit`, 'warning');
      }
    });
  });

  // ==========================================
  // 10. Character Counter for Textarea
  // ==========================================
  document.querySelectorAll('[data-char-count]').forEach((textarea) => {
    const counter = document.querySelector(textarea.dataset.charCount);
    const max = textarea.maxLength || 250;
    const update = () => {
      if (counter) counter.textContent = `${textarea.value.length}/${max}`;
    };
    textarea.addEventListener('input', update);
    update();
  });

  // ==========================================
  // 11. Form Pengajuan Screen (form-pengajuan.html)
  // ==========================================
  const formPengajuan = document.getElementById('form-pengajuan');
  if (formPengajuan) {
    const helpBtn = document.getElementById('form-help-btn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        showBottomSheet({
          title: 'Petunjuk Pengajuan Peminjaman',
          contentHtml: `
            <div style="font-size:13px;line-height:1.5;color:var(--text);display:flex;flex-direction:column;gap:10px;">
              <div><strong>1. Durasi Peminjaman:</strong> Maksimal peminjaman adalah 7 hari kalender. Pengembalian melewati batas tempo dikenakan sanksi administratif.</div>
              <div><strong>2. Tanggung Jawab:</strong> Barang wajib dijaga keutuhannya dan dikembalikan dalam kondisi bersih dan berfungsi.</div>
              <div><strong>3. Pengambilan Barang:</strong> Bawa lembar surat pengajuan yang sudah diverifikasi dan ditandatangani oleh Ketua Program Studi TRPL ke Laboratorium Teknik (Gedung B Lt. 1).</div>
            </div>
          `,
          buttons: [{ text: 'Saya Mengerti', primary: true }]
        });
      });
    }

    // Submit validation
    formPengajuan.addEventListener('submit', (e) => {
      if (window.PinjamlabWorkflow) return;
      e.preventDefault();
      const agreeBox = document.getElementById('agree-checkbox');
      if (agreeBox && agreeBox.classList.contains('unchecked')) {
        showToast('Harap centang persetujuan tanggung jawab barang terlebih dahulu!', 'warning');
        agreeBox.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const submitBtn = document.getElementById('submit-pengajuan-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Mengirim pengajuan...</span>`;
      }

      showToast('Pengajuan peminjaman berhasil dikirim!', 'success');
      setTimeout(() => {
        window.location.href = 'konfirmasi.html';
      }, 500);
    });

    // Date change automatic duration calculator
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const durationLabel = document.getElementById('duration-label');

    const recalculateDuration = () => {
      if (durationLabel) {
        durationLabel.textContent = 'Durasi 3 hari · Maksimal peminjaman 7 hari';
      }
    };
    startDateInput?.addEventListener('change', recalculateDuration);
    endDateInput?.addEventListener('change', recalculateDuration);
  }

  // ==========================================
  // 12. Scanner QR Code Screen (scanner.html)
  // ==========================================
  const cameraArea = document.getElementById('camera-area');
  const flashToggleBtn = document.getElementById('flash-toggle-btn');
  const cameraSwitchBtn = document.getElementById('camera-switch-btn');
  const manualCodeBtn = document.getElementById('manual-code-btn');
  const scannerHelpBtn = document.getElementById('scanner-help-btn');

  if (cameraArea) {
    // Click on viewfinder simulates detection
    cameraArea.addEventListener('click', () => {
      const scanStatus = cameraArea.querySelector('.scan-status');
      if (scanStatus) {
        scanStatus.innerHTML = `<span class="dot" style="background:#38bdf8;"></span> QR Code Terdeteksi!`;
      }

      showBottomSheet({
        title: 'QR Code Ditemukan!',
        contentHtml: `
          <div style="display:flex;gap:12px;align-items:center;background:var(--primary-50);padding:14px;border-radius:var(--radius-md);border:1px solid var(--primary-100);">
            <div class="item-thumb sm inventory-thumb" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>
            </div>
            <div>
              <div style="font-size:11px;color:var(--muted);">No. 1 · Alat</div>
              <div style="font-size:14px;font-weight:700;color:var(--primary-dark);">ESP32 NodeMCU Development Board</div>
              <div style="font-size:11px;color:var(--primary);font-weight:600;margin-top:2px;">Volume inventaris: 10 Unit</div>
            </div>
          </div>
        `,
        buttons: [
          {
            text: 'Tambahkan ke Form Pengajuan',
            primary: true,
            onClick: () => {
              window.location.href = 'form-pengajuan.html';
            }
          }
        ]
      });
    });

    // Toggle Flash
    if (flashToggleBtn) {
      let isFlashOn = false;
      flashToggleBtn.addEventListener('click', () => {
        isFlashOn = !isFlashOn;
        const sub = flashToggleBtn.querySelector('.sub');
        if (isFlashOn) {
          sub.textContent = 'Aktif';
          flashToggleBtn.classList.add('active');
          cameraArea.classList.add('flash-on');
          showToast('Lampu flash kamera diaktifkan');
        } else {
          sub.textContent = 'Nonaktif';
          flashToggleBtn.classList.remove('active');
          cameraArea.classList.remove('flash-on');
          showToast('Lampu flash kamera dinonaktifkan');
        }
      });
    }

    // Toggle Camera (front / back)
    if (cameraSwitchBtn) {
      let isFrontCamera = false;
      cameraSwitchBtn.addEventListener('click', () => {
        isFrontCamera = !isFrontCamera;
        const sub = cameraSwitchBtn.querySelector('.sub');
        sub.textContent = isFrontCamera ? 'Kamera depan' : 'Kamera belakang';
        cameraArea.style.transform = isFrontCamera ? 'scaleX(-1)' : 'none';
        showToast(`Beralih ke ${sub.textContent}`);
      });
    }

    // Manual Code Entry
    if (manualCodeBtn) {
      manualCodeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showBottomSheet({
          title: 'Masukkan Kode Alat Manual',
          contentHtml: `
            <div style="display:flex;flex-direction:column;gap:12px;">
              <p style="font-size:13px;color:var(--muted);margin:0;">Masukkan nomor barang sesuai daftar inventaris.</p>
              <div class="input">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="10.01"/><line x1="10" y1="10" x2="10" y2="10.01"/><line x1="14" y1="10" x2="14" y2="10.01"/><line x1="18" y1="10" x2="18" y2="10.01"/><line x1="6" y1="14" x2="18" y2="14"/></svg>
                <input type="text" id="manual-code-input" placeholder="Contoh: 1 atau 44">
              </div>
              <div style="display:flex;gap:6px;align-items:center;">
                <span style="font-size:11px;color:var(--muted);">Saran:</span>
                <button type="button" class="badge badge-blue" style="cursor:pointer;" onclick="document.getElementById('manual-code-input').value='1'">No. 1</button>
                <button type="button" class="badge badge-blue" style="cursor:pointer;" onclick="document.getElementById('manual-code-input').value='44'">No. 44</button>
              </div>
            </div>
          `,
          buttons: [
            {
              text: 'Gunakan Kode Ini',
              primary: true,
              onClick: () => {
                const code = document.getElementById('manual-code-input')?.value || '1';
                showToast(`Nomor barang ${code} ditambahkan ke pengajuan`, 'success');
                setTimeout(() => {
                  window.location.href = 'form-pengajuan.html';
                }, 400);
              }
            }
          ]
        });
      });
    }

    if (scannerHelpBtn) {
      scannerHelpBtn.addEventListener('click', () => {
        showBottomSheet({
          title: 'Bantuan Pindai QR Code',
          contentHtml: `
            <div style="font-size:13px;color:var(--text);display:flex;flex-direction:column;gap:8px;line-height:1.5;">
              <div>1. Posisikan kamera tepat di depan label stiker QR Code yang tertera pada badan alat.</div>
              <div>2. Gunakan tombol <strong>Flash</strong> bila kondisi pencahayaan di ruangan laboratorium minim.</div>
              <div>3. Jika stiker QR rusak atau tidak terbaca, pilih <strong>Masukkan kode alat manual</strong> di bagian bawah.</div>
            </div>
          `,
          buttons: [{ text: 'Mengerti', primary: true }]
        });
      });
    }
  }

  // ==========================================
  // 13. Riwayat Screen (riwayat.html)
  // ==========================================
  const riwayatContainer = document.getElementById('riwayat-container');
  if (riwayatContainer && !window.PinjamlabWorkflow) {
    const riwayatTabs = document.querySelectorAll('.tab-row [data-status]');

    const filterRiwayat = (status) => {
      const cards = riwayatContainer.querySelectorAll('.card[data-status]');
      cards.forEach((card) => {
        if (status === 'semua' || card.dataset.status === status) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    };

    riwayatTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        riwayatTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        filterRiwayat(tab.dataset.status);
      });
    });

    // Handle URL query parameter ?tab=menunggu or ?tab=disetujui
    const urlParams = new URLSearchParams(window.location.search);
    const targetTab = urlParams.get('tab');
    if (targetTab) {
      const matchingTab = document.querySelector(`.tab-row [data-status="${targetTab}"]`);
      if (matchingTab) {
        matchingTab.click();
      }
    }

    // Detail Bottom Sheet on clicking Riwayat cards
    riwayatContainer.querySelectorAll('.card[data-status]').forEach((card) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const id = card.querySelector('.card-row-between span:first-child')?.textContent || 'Peminjaman';
        const title = card.querySelector('.item-title')?.textContent || 'Detail Pengajuan';
        const items = card.querySelector('.item-sub')?.textContent || '';
        const date = card.querySelector('.note-row span')?.textContent || '';
        const badge = card.querySelector('.badge')?.textContent || '';

        showBottomSheet({
          title: `Rincian: ${id}`,
          contentHtml: `
            <div style="display:flex;flex-direction:column;gap:12px;font-size:13px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:700;color:var(--primary-dark);font-size:15px;">${title}</span>
                <span class="badge ${badge === 'Disetujui' ? 'badge-blue' : badge === 'Menunggu' ? 'badge-orange' : 'badge-neutral'}">${badge}</span>
              </div>
              <div style="background:var(--neutral-50);padding:12px;border-radius:var(--radius-sm);display:flex;flex-direction:column;gap:6px;">
                <div><strong>Daftar Item:</strong> ${items}</div>
                <div><strong>Periode:</strong> ${date}</div>
                <div><strong>Lokasi Pengambilan:</strong> Laboratorium Teknik (Gedung B Lt. 1)</div>
              </div>
              <div style="font-size:12px;color:var(--muted);line-height:1.45;">
                Untuk pengambilan atau verifikasi berkas cetak, tunjukkan surat peminjaman kepada pengelola lab.
              </div>
            </div>
          `,
          buttons: [
            {
              text: 'Lihat Surat Pengajuan',
              primary: true,
              onClick: () => {
                window.location.href = 'konfirmasi.html';
              }
            }
          ]
        });
      });
    });
  }

  // ==========================================
  // 14. Konfirmasi / Surat Screen (konfirmasi.html)
  // ==========================================
  const printBtn = document.getElementById('print-pdf-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      showToast('Mempersiapkan pencetakan dokumen PDF...', 'info');
      setTimeout(() => {
        window.print();
      }, 350);
    });
  }

  const confirmHelpBtn = document.getElementById('confirm-help-btn');
  if (confirmHelpBtn) {
    confirmHelpBtn.addEventListener('click', () => {
      showBottomSheet({
        title: 'Verifikasi Surat Peminjaman',
        contentHtml: `
          <div style="font-size:13px;line-height:1.5;color:var(--text);display:flex;flex-direction:column;gap:10px;">
            <div>1. Unduh atau cetak surat pengajuan peminjaman ini.</div>
            <div>2. Bawa lembar fisik ke ruang Program Studi TRPL Politani Samarinda untuk mendapatkan tanda tangan dan stempel persetujuan.</div>
            <div>3. Serahkan surat yang telah disetujui kepada petugas di Laboratorium Teknik saat pengambilan alat.</div>
          </div>
        `,
        buttons: [{ text: 'Saya Mengerti', primary: true }]
      });
    });
  }

});
