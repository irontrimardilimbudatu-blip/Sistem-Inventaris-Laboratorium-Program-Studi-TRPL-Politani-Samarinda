(() => {
  const keys = {
    inventory: 'pinjamlab_inventory',
    loans: 'pinjamlab_loans',
    draft: 'pinjamlab_draft',
    user: 'pinjamlab_user',
    lastLoan: 'pinjamlab_last_loan'
  };
  const seedInventory = window.dataBarangInventaris.map((item) => ({
    ...item,
    stock: Number.parseInt(item.volume, 10) || null,
    damaged: 0
  }));
  const getInventory = () => readStore(keys.inventory, seedInventory);
  const getLoans = () => readStore(keys.loans, []);
  const getDraft = () => readStore(keys.draft, []);
  const saveInventory = (items) => writeStore(keys.inventory, items);
  const saveLoans = (loans) => writeStore(keys.loans, loans);
  const saveDraft = (items) => writeStore(keys.draft, items);

  function readStore(key, initialValue) {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      writeStore(key, initialValue);
      return initialValue;
    }
    return JSON.parse(stored);
  }

  function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function currentUser() {
    const stored = localStorage.getItem(keys.user);
    return stored
      ? JSON.parse(stored)
      : { name: 'Raka', email: 'raka.pratama@mahasiswa.ac.id', role: 'mahasiswa' };
  }

  function getItem(number) {
    return getInventory().find((item) => item.nomor === Number(number));
  }

  function reservedQuantity(number, category, excludedLoanId) {
    return getLoans().reduce((total, loan) => {
      if (loan.id === excludedLoanId) return total;
      const reservedStatus = loan.status === 'Disetujui'
        || (category === 'alat' && loan.status === 'Dipinjam');
      if (!reservedStatus) return total;
      return total + loan.items.reduce((quantity, item) => (
        item.nomor === Number(number) ? quantity + item.jumlah : quantity
      ), 0);
    }, 0);
  }

  function availableStock(item, excludedLoanId) {
    if (!item || item.stock === null) return null;
    return Math.max(0, item.stock - (item.damaged || 0) - reservedQuantity(item.nomor, item.kategori, excludedLoanId));
  }

  function statusKey(status) {
    return status.toLowerCase();
  }

  function formatDate(date) {
    if (!date) return '-';
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      .format(new Date(`${date}T00:00:00`));
  }

  function roleName(role) {
    return ({ mahasiswa: 'Mahasiswa', dosen: 'Dosen', laboran: 'Laboran', admin: 'Admin' })[role] || 'Mahasiswa';
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function makeButton(text, className, handler) {
    const button = makeElement('button', `btn ${className || 'btn-outline'}`, text);
    button.type = 'button';
    button.addEventListener('click', handler);
    return button;
  }

  function showMessage(container, text) {
    container.replaceChildren(makeElement('div', 'card workflow-message', text));
  }

  function addDraftItem(number) {
    const item = getItem(number);
    const stock = availableStock(item);
    if (!item || stock === null) {
      window.showToast('Jumlah stok barang ini belum dicantumkan, sehingga belum bisa diajukan.', 'warning');
      return false;
    }
    const draft = getDraft();
    const existing = draft.find((entry) => entry.nomor === item.nomor);
    if (existing && existing.jumlah >= stock) {
      window.showToast('Jumlah pilihan sudah mencapai stok yang tersedia.', 'warning');
      return false;
    }
    if (existing) existing.jumlah += 1;
    else draft.push({ nomor: item.nomor, jumlah: 1 });
    saveDraft(draft);
    refreshCatalog();
    window.showToast(`${item.nama} ditambahkan ke pilihan pengajuan.`, 'success');
    return true;
  }

  function refreshCatalog() {
    const countLabel = document.getElementById('draft-item-count');
    const draft = getDraft();
    const quantity = draft.reduce((total, item) => total + item.jumlah, 0);
    if (countLabel) countLabel.textContent = `${quantity} dipilih`;
    const continueButton = document.getElementById('continue-request');
    if (continueButton) {
      const disabled = draft.length === 0;
      continueButton.setAttribute('aria-disabled', String(disabled));
      continueButton.classList.toggle('is-disabled', disabled);
    }

    document.querySelectorAll('#katalog-items-list .catalog-card').forEach((card) => {
      const item = getItem(card.dataset.itemNo);
      const available = availableStock(item);
      const label = card.querySelector('.volume');
      const button = card.querySelector('[data-add-item]');
      const selected = draft.find((entry) => entry.nomor === item.nomor)?.jumlah || 0;
      if (label) {
        label.textContent = available === null
          ? 'Jumlah belum dicantumkan'
          : `Stok tersedia: ${available} dari ${item.stock} · kondisi ${item.damaged ? `${item.damaged} rusak` : 'baik'}${selected ? ` · dipilih ${selected}` : ''}`;
      }
      if (button) {
        button.disabled = available === null || available === 0;
        button.setAttribute('aria-label', button.disabled ? `Stok ${item.nama} tidak diketahui atau habis` : `Tambah ${item.nama}`);
      }
    });
  }

  function initCatalog() {
    const list = document.getElementById('katalog-items-list');
    if (!list) return;

    const initialCategory = new URLSearchParams(window.location.search).get('category');
    if (initialCategory === 'alat' || initialCategory === 'bahan') {
      document.querySelectorAll('.tab-row [data-category]').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.category === initialCategory);
      });
      list.querySelectorAll('.catalog-card').forEach((card) => {
        card.style.display = card.dataset.category === initialCategory ? 'flex' : 'none';
      });
    }

    list.addEventListener('click', (event) => {
      const button = event.target.closest('[data-add-item]');
      if (!button || button.disabled) return;
      addDraftItem(button.closest('.catalog-card').dataset.itemNo);
    });

    const continueButton = document.getElementById('continue-request');
    if (continueButton) {
      continueButton.addEventListener('click', (event) => {
        if (getDraft().length === 0) {
          event.preventDefault();
          window.showToast('Pilih setidaknya satu barang terlebih dahulu.', 'warning');
        }
      });
    }

    refreshCatalog();
  }

  function initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('email-input').value.trim();
      const namePart = email.split('@')[0].replace(/[._-]+/g, ' ');
      const name = namePart.replace(/\b\w/g, (letter) => letter.toUpperCase());
      const role = document.getElementById('role-input').value;
      writeStore(keys.user, { name, email, role });
      window.location.href = 'dashboard.html';
    });
  }

  function initDashboard() {
    const menu = document.getElementById('dashboard-menu');
    if (!menu) return;

    const user = currentUser();
    const loans = getLoans();
    const ownLoans = loans.filter((loan) => loan.borrower.email === user.email);
    const staff = user.role === 'laboran' || user.role === 'admin';
    const greeting = document.getElementById('dashboard-greeting');
    const roleLabel = document.getElementById('dashboard-role');
    const dateLabel = document.getElementById('dashboard-date');
    if (greeting) greeting.textContent = `Halo, ${user.name}`;
    if (roleLabel) roleLabel.textContent = roleName(user.role);
    if (dateLabel) dateLabel.textContent = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date());

    const borrowed = ownLoans.filter((loan) => loan.status === 'Dipinjam').length;
    const pending = staff
      ? loans.filter((loan) => loan.status === 'Menunggu').length
      : ownLoans.filter((loan) => loan.status === 'Menunggu' || loan.status === 'Disetujui').length;
    document.getElementById('stat-borrowed-value').textContent = String(borrowed).padStart(2, '0');
    document.getElementById('stat-pending-value').textContent = String(pending).padStart(2, '0');

    const links = [
      ['Data Alat', 'katalog.html?category=alat', 'Cari dan lihat stok alat'],
      ['Data Bahan', 'katalog.html?category=bahan', 'Lihat stok bahan praktik'],
      ['Peminjaman', 'katalog.html', 'Pilih barang dan ajukan peminjaman'],
      ['Riwayat', 'riwayat.html', 'Pantau status dan transaksi']
    ];
    if (staff) links.splice(3, 0, ['Verifikasi Laboran', 'verifikasi.html', 'Setujui atau tolak pengajuan']);
    if (staff) links.splice(4, 0, ['Pengembalian', 'pengembalian.html', 'Catat kondisi alat yang kembali']);
    if (user.role === 'admin') links.push(['Laporan', 'laporan.html', 'Ringkasan stok dan transaksi']);

    menu.replaceChildren();
    links.forEach(([title, href, description]) => {
      const link = makeElement('a', 'card workflow-menu-card');
      link.href = href;
      link.append(makeElement('strong', '', title), makeElement('span', '', description));
      menu.appendChild(link);
    });

    const dueList = document.getElementById('dashboard-due-list');
    if (dueList) {
      const dueLoans = ownLoans.filter((loan) => loan.status === 'Dipinjam');
      if (dueLoans.length === 0) {
        showMessage(dueList, 'Belum ada alat yang sedang dipinjam.');
      } else {
        dueList.replaceChildren();
        dueLoans.forEach((loan) => {
          const card = makeElement('a', 'card workflow-menu-card');
          card.href = 'riwayat.html?status=dipinjam';
          card.append(
            makeElement('strong', '', loan.id),
            makeElement('span', '', loan.items.map((item) => `${item.nama} ×${item.jumlah}`).join(' · ')),
            makeElement('span', 'meta', `Batas kembali ${formatDate(loan.tanggalKembali)}`)
          );
          dueList.appendChild(card);
        });
      }
    }

    const logout = document.getElementById('logout-btn');
    logout?.addEventListener('click', () => {
      localStorage.removeItem(keys.user);
      window.location.href = 'index.html';
    });
    const notifications = document.getElementById('notif-btn');
    notifications?.addEventListener('click', () => {
      const needsAttention = staff
        ? loans.filter((loan) => loan.status === 'Menunggu').length
        : ownLoans.filter((loan) => loan.status === 'Menunggu' || loan.status === 'Disetujui').length;
      window.showToast(needsAttention
        ? `Ada ${needsAttention} pengajuan yang perlu diperiksa melalui Riwayat.`
        : 'Tidak ada pembaruan pengajuan saat ini.');
    });
  }

  function renderDraftItems() {
    const list = document.getElementById('form-items-list');
    if (!list) return;
    const draft = getDraft();
    list.replaceChildren();
    if (draft.length === 0) {
      showMessage(list, 'Belum ada barang dipilih. Buka katalog untuk memilih alat atau bahan.');
      return;
    }
    draft.forEach((entry) => {
      const item = getItem(entry.nomor);
      const row = makeElement('div', 'workflow-draft-row');
      const info = makeElement('div', 'item-info');
      info.append(
        makeElement('strong', 'name', item.nama),
        makeElement('span', 'meta', `No. ${item.nomor} · ${item.kategori === 'alat' ? 'Alat' : 'Bahan'}`)
      );
      const quantity = document.createElement('input');
      quantity.type = 'number';
      quantity.min = '1';
      quantity.max = String(availableStock(item));
      quantity.value = String(entry.jumlah);
      quantity.dataset.draftQuantity = String(item.nomor);
      quantity.setAttribute('aria-label', `Jumlah ${item.nama}`);
      quantity.addEventListener('change', () => {
        const value = Number(quantity.value);
        const max = availableStock(item);
        if (!Number.isInteger(value) || value < 1 || max === null || value > max) {
          quantity.value = String(entry.jumlah);
          window.showToast(`Jumlah ${item.nama} harus antara 1 dan ${max ?? 'stok yang tersedia'}.`, 'warning');
          return;
        }
        const updated = getDraft();
        updated.find((draftItem) => draftItem.nomor === item.nomor).jumlah = value;
        saveDraft(updated);
      });
      const remove = makeButton('Hapus', 'btn-outline', () => {
        saveDraft(getDraft().filter((draftItem) => draftItem.nomor !== item.nomor));
        renderDraftItems();
        const submit = document.getElementById('submit-pengajuan-btn');
        if (submit) submit.disabled = getDraft().length === 0;
      });
      row.append(info, quantity, remove);
      list.appendChild(row);
    });
  }

  function initLoanForm() {
    const form = document.getElementById('form-pengajuan');
    if (!form) return;
    renderDraftItems();

    const start = document.getElementById('start-date');
    const end = document.getElementById('end-date');
    const today = new Date();
    const todayIso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const nextDay = new Date(`${todayIso}T00:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    const tomorrowIso = new Date(nextDay.getTime() - nextDay.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (!start.value) start.value = todayIso;
    if (!end.value) end.value = tomorrowIso;

    const recalculateDuration = () => {
      const days = Math.floor((new Date(`${end.value}T00:00:00`) - new Date(`${start.value}T00:00:00`)) / 86400000) + 1;
      const label = document.getElementById('duration-label');
      if (label) label.textContent = Number.isFinite(days) && days > 0
        ? `Durasi ${days} hari · Maksimal peminjaman 7 hari`
        : 'Tanggal kembali harus sama atau sesudah tanggal pinjam.';
    };
    start.addEventListener('change', recalculateDuration);
    end.addEventListener('change', recalculateDuration);
    recalculateDuration();

    const submit = document.getElementById('submit-pengajuan-btn');
    if (submit) submit.disabled = getDraft().length === 0;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const user = currentUser();
      if (user.role !== 'mahasiswa' && user.role !== 'dosen') {
        window.showToast('Hanya Mahasiswa atau Dosen yang dapat mengirim peminjaman.', 'warning');
        return;
      }
      if (document.getElementById('agree-checkbox').classList.contains('unchecked')) {
        window.showToast('Setujui tanggung jawab barang sebelum mengirim pengajuan.', 'warning');
        return;
      }
      const draft = getDraft();
      if (draft.length === 0) {
        window.showToast('Pilih barang dari katalog terlebih dahulu.', 'warning');
        return;
      }
      const days = Math.floor((new Date(`${end.value}T00:00:00`) - new Date(`${start.value}T00:00:00`)) / 86400000) + 1;
      if (!start.value || !end.value || start.value < todayIso || days < 1 || days > 7) {
        window.showToast('Periksa tanggal peminjaman. Durasi harus 1 sampai 7 hari.', 'warning');
        return;
      }
      const items = draft.map((entry) => {
        const item = getItem(entry.nomor);
        const unit = item.volume.replace(/^\d+\s*/, '');
        return { nomor: item.nomor, nama: item.nama, kategori: item.kategori, jumlah: entry.jumlah, unit };
      });
      const unavailable = items.find((entry) => {
        const item = getItem(entry.nomor);
        const available = availableStock(item);
        return available === null || entry.jumlah > available;
      });
      if (unavailable) {
        window.showToast(`Stok ${unavailable.nama} tidak cukup atau belum dicatat.`, 'warning');
        return;
      }

      const loan = {
        id: `PJM-${Date.now().toString().slice(-9)}`,
        borrower: { name: user.name, email: user.email, role: user.role },
        items,
        tanggalPinjam: start.value,
        tanggalKembali: end.value,
        keperluan: document.getElementById('keperluan-text').value.trim(),
        status: 'Menunggu',
        dibuatPada: new Date().toISOString()
      };
      if (!loan.keperluan) {
        window.showToast('Keperluan peminjaman wajib diisi.', 'warning');
        return;
      }
      saveLoans([...getLoans(), loan]);
      saveDraft([]);
      writeStore(keys.lastLoan, loan.id);
      window.location.href = `konfirmasi.html?loan=${encodeURIComponent(loan.id)}`;
    });
  }

  function initConfirmation() {
    const container = document.getElementById('confirmation-content');
    if (!container) return;
    const loanId = new URLSearchParams(window.location.search).get('loan') || localStorage.getItem(keys.lastLoan);
    const loan = getLoans().find((entry) => entry.id === loanId);
    if (!loan) {
      const status = document.getElementById('confirm-status');
      status.textContent = 'Belum tersedia';
      status.className = 'badge badge-neutral';
      document.getElementById('confirm-state-note').textContent = 'Belum ada pengajuan tersimpan. Pilih barang dari katalog untuk memulai.';
      document.getElementById('print-pdf-btn').disabled = true;
      return;
    }
    const status = document.getElementById('confirm-status');
    status.textContent = loan.status;
    status.className = `badge badge-${statusKey(loan.status)}`;
    document.getElementById('confirm-request-id').textContent = loan.id;
    document.getElementById('confirm-request-date').textContent = formatDate(loan.tanggalPinjam);
    document.getElementById('confirm-borrower').textContent = loan.borrower.name;
    document.getElementById('confirm-email').textContent = loan.borrower.email;
    document.getElementById('confirm-purpose').textContent = loan.keperluan;
    document.getElementById('confirm-period').textContent = formatDate(loan.tanggalPinjam);
    document.getElementById('confirm-return-date').textContent = formatDate(loan.tanggalKembali);
    document.getElementById('confirm-signature-name').textContent = loan.borrower.name;
    const items = document.getElementById('confirm-items');
    items.replaceChildren();
    loan.items.forEach((item) => {
      const row = makeElement('div', 'row');
      row.append(makeElement('span', '', item.nama), makeElement('span', '', `${item.jumlah} ${item.unit || 'unit'}`));
      items.appendChild(row);
    });
    const notes = {
      Menunggu: 'Pengajuan menunggu verifikasi Laboran.',
      Disetujui: 'Pengajuan disetujui. Silakan koordinasikan pengambilan dengan Laboran.',
      Dipinjam: 'Barang sudah dicatat keluar dan sedang dipinjam.',
      Ditolak: `Pengajuan ditolak: ${loan.alasanPenolakan || 'tidak ada alasan tercatat'}`,
      Selesai: 'Transaksi selesai dan sudah tercatat pada riwayat.'
    };
    document.getElementById('confirm-state-note').textContent = notes[loan.status] || loan.status;
  }

  function cardHeader(loan) {
    const header = makeElement('div', 'card-row-between');
    header.append(
      makeElement('strong', '', loan.id),
      makeElement('span', `badge badge-${statusKey(loan.status)}`, loan.status)
    );
    return header;
  }

  function loanSummary(loan) {
    const summary = makeElement('div', 'workflow-summary');
    summary.append(
      makeElement('strong', '', loan.borrower.name),
      makeElement('span', '', `${roleName(loan.borrower.role)} · ${loan.borrower.email}`),
      makeElement('span', '', loan.items.map((item) => `${item.nama} ×${item.jumlah}`).join(' · ')),
      makeElement('span', '', `${formatDate(loan.tanggalPinjam)} – ${formatDate(loan.tanggalKembali)}`),
      makeElement('span', '', `Keperluan: ${loan.keperluan}`)
    );
    return summary;
  }

  function requireStaff(container, adminOnly = false) {
    const role = currentUser().role;
    if (adminOnly ? role !== 'admin' : !['laboran', 'admin'].includes(role)) {
      showMessage(container, adminOnly
        ? 'Halaman ini hanya dapat diakses Admin.'
        : 'Halaman ini hanya dapat diakses Laboran atau Admin.');
      return false;
    }
    return true;
  }

  function initVerification() {
    const list = document.getElementById('verification-list');
    if (!list || !requireStaff(list)) return;
    renderVerification();
  }

  function renderVerification() {
    const list = document.getElementById('verification-list');
    if (!list) return;
    const loans = getLoans();
    const visible = loans.filter((loan) => loan.status === 'Menunggu' || loan.status === 'Disetujui');
    document.getElementById('verification-count').textContent = `${visible.length} pengajuan`;
    if (visible.length === 0) {
      showMessage(list, 'Tidak ada pengajuan yang perlu diverifikasi atau disiapkan untuk diambil.');
      return;
    }
    list.replaceChildren();
    visible.forEach((loan) => {
      const card = makeElement('article', 'card workflow-card');
      card.append(cardHeader(loan), loanSummary(loan));
      if (loan.status === 'Menunggu') {
        const stockCheck = loan.items.map((entry) => {
          const item = getItem(entry.nomor);
          const available = availableStock(item);
          return `${item.nama}: ${available === null ? 'jumlah tidak diketahui' : `${available} tersedia`}`;
        }).join(' · ');
        card.append(makeElement('p', 'workflow-note', `Pemeriksaan stok: ${stockCheck}`));
        const reason = document.createElement('textarea');
        reason.className = 'workflow-input';
        reason.placeholder = 'Alasan penolakan (wajib diisi jika ditolak)';
        reason.setAttribute('aria-label', `Alasan penolakan ${loan.id}`);
        const actions = makeElement('div', 'workflow-actions');
        actions.append(
          makeButton('Setujui', 'btn-primary', () => {
            const insufficient = loan.items.find((entry) => {
              const available = availableStock(getItem(entry.nomor));
              return available === null || entry.jumlah > available;
            });
            if (insufficient) {
              window.showToast(`Stok ${insufficient.nama} tidak cukup untuk disetujui.`, 'warning');
              return;
            }
            updateLoan(loan.id, (current) => ({
              ...current,
              status: 'Disetujui',
              disetujuiOleh: currentUser().name,
              disetujuiPada: new Date().toISOString()
            }));
            window.showToast('Pengajuan disetujui.', 'success');
            renderVerification();
          }),
          makeButton('Tolak', 'btn-outline', () => {
            const reasonText = reason.value.trim();
            if (!reasonText) {
              window.showToast('Tuliskan alasan penolakan terlebih dahulu.', 'warning');
              reason.focus();
              return;
            }
            updateLoan(loan.id, (current) => ({
              ...current,
              status: 'Ditolak',
              alasanPenolakan: reasonText,
              ditolakOleh: currentUser().name,
              ditolakPada: new Date().toISOString()
            }));
            window.showToast('Pengajuan ditolak dan alasannya dicatat.', 'success');
            renderVerification();
          })
        );
        card.append(reason, actions);
      } else {
        card.append(
          makeElement('p', 'workflow-note', `Disetujui oleh ${loan.disetujuiOleh || 'Laboran'}. Catat pengambilan barang saat diserahkan.`),
          makeButton('Catat Pengambilan', 'btn-primary', () => recordPickup(loan.id))
        );
      }
      list.appendChild(card);
    });
  }

  function updateLoan(id, updater) {
    saveLoans(getLoans().map((loan) => loan.id === id ? updater(loan) : loan));
  }

  function recordPickup(id) {
    const loan = getLoans().find((entry) => entry.id === id);
    if (!loan || loan.status !== 'Disetujui') return;
    const inventory = getInventory();
    const materials = loan.items.filter((item) => item.kategori === 'bahan');
    const unavailable = loan.items.find((entry) => {
      const item = inventory.find((stockItem) => stockItem.nomor === entry.nomor);
      return !item || item.stock === null || availableStock(item, loan.id) < entry.jumlah;
    });
    if (unavailable) {
      window.showToast(`Stok ${unavailable.nama} tidak cukup saat pengambilan.`, 'warning');
      return;
    }
    materials.forEach((entry) => {
      const item = inventory.find((stockItem) => stockItem.nomor === entry.nomor);
      item.stock -= entry.jumlah;
    });
    saveInventory(inventory);
    const hasTools = loan.items.some((item) => item.kategori === 'alat');
    updateLoan(id, (current) => ({
      ...current,
      status: hasTools ? 'Dipinjam' : 'Selesai',
      diambilPada: new Date().toISOString(),
      dicatatDiambilOleh: currentUser().name,
      statusBahan: materials.length ? 'Stok bahan berkurang saat pengambilan; tidak perlu dikembalikan.' : ''
    }));
    window.showToast(hasTools
      ? 'Pengambilan dicatat. Alat menunggu proses pengembalian.'
      : 'Pengambilan bahan dicatat dan stok otomatis dikurangi.', 'success');
    renderVerification();
  }

  function initReturns() {
    const list = document.getElementById('return-list');
    if (!list || !requireStaff(list)) return;
    renderReturns();
  }

  function renderReturns() {
    const list = document.getElementById('return-list');
    if (!list) return;
    const loans = getLoans().filter((loan) => loan.status === 'Dipinjam');
    document.getElementById('return-count').textContent = `${loans.length} pengembalian`;
    if (loans.length === 0) {
      showMessage(list, 'Belum ada alat yang menunggu pengembalian.');
      return;
    }
    list.replaceChildren();
    loans.forEach((loan) => {
      const card = makeElement('article', 'card workflow-card');
      card.append(cardHeader(loan), loanSummary(loan));
      loan.items.filter((item) => item.kategori === 'alat').forEach((item) => {
        const row = makeElement('label', 'workflow-condition');
        row.append(makeElement('span', '', `${item.nama} ×${item.jumlah}`));
        const select = document.createElement('select');
        select.className = 'workflow-select';
        select.dataset.returnCondition = String(item.nomor);
        [['Baik', 'Baik'], ['Rusak', 'Rusak'], ['Hilang', 'Hilang']].forEach(([value, text]) => {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = text;
          select.appendChild(option);
        });
        const prompt = document.createElement('option');
        prompt.value = '';
        prompt.textContent = 'Pilih kondisi';
        prompt.selected = true;
        select.insertBefore(prompt, select.firstChild);
        row.appendChild(select);
        card.appendChild(row);
      });
      card.append(makeButton('Simpan Pengembalian', 'btn-primary', () => completeReturn(loan, card)));
      list.appendChild(card);
    });
  }

  function completeReturn(loan, card) {
    const inventory = getInventory();
    const kondisi = {};
    card.querySelectorAll('[data-return-condition]').forEach((select) => {
      kondisi[select.dataset.returnCondition] = select.value;
    });
    if (loan.items.some((item) => item.kategori === 'alat' && !kondisi[item.nomor])) {
      window.showToast('Pilih kondisi untuk setiap alat sebelum menyimpan pengembalian.', 'warning');
      return;
    }
    loan.items.filter((item) => item.kategori === 'alat').forEach((item) => {
      const stockItem = inventory.find((entry) => entry.nomor === item.nomor);
      const condition = kondisi[item.nomor];
      if (condition === 'Rusak') stockItem.damaged = (stockItem.damaged || 0) + item.jumlah;
      if (condition === 'Hilang') stockItem.stock = Math.max(0, stockItem.stock - item.jumlah);
    });
    saveInventory(inventory);
    updateLoan(loan.id, (current) => ({
      ...current,
      status: 'Selesai',
      kondisiPengembalian: kondisi,
      dikembalikanPada: new Date().toISOString(),
      dicatatKembaliOleh: currentUser().name
    }));
    window.showToast('Kondisi alat dicatat dan stok diperbarui.', 'success');
    renderReturns();
  }

  function initHistory() {
    const list = document.getElementById('riwayat-container');
    if (!list) return;
    const tabs = document.querySelectorAll('[data-status-filter]');
    const params = new URLSearchParams(window.location.search);
    let activeStatus = params.get('status') || 'semua';

    function render() {
      const user = currentUser();
      const staff = ['laboran', 'admin'].includes(user.role);
      list.hidden = false;
      const loans = getLoans()
        .filter((loan) => staff || loan.borrower.email === user.email)
        .filter((loan) => activeStatus === 'semua' || statusKey(loan.status) === activeStatus)
        .sort((a, b) => b.dibuatPada.localeCompare(a.dibuatPada));
      list.replaceChildren();
      if (loans.length === 0) {
        showMessage(list, 'Belum ada riwayat pada status ini.');
      } else {
        loans.forEach((loan) => {
          const card = makeElement('article', 'card workflow-card history-card');
          card.append(cardHeader(loan), loanSummary(loan));
          if (loan.alasanPenolakan) card.append(makeElement('p', 'workflow-note', `Alasan penolakan: ${loan.alasanPenolakan}`));
          if (loan.kondisiPengembalian) {
            const results = Object.entries(loan.kondisiPengembalian).map(([number, condition]) => `${getItem(number).nama}: ${condition}`).join(' · ');
            card.append(makeElement('p', 'workflow-note', `Kondisi pengembalian: ${results}`));
          }
          if (loan.statusBahan) card.append(makeElement('p', 'workflow-note', loan.statusBahan));
          list.appendChild(card);
        });
      }
      document.getElementById('history-count').textContent = `${loans.length} transaksi`;
      tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.statusFilter === activeStatus));
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => {
      activeStatus = tab.dataset.statusFilter;
      render();
    }));
    render();
  }

  function initReports() {
    const container = document.getElementById('report-content');
    if (!container || !requireStaff(container, true)) return;

    const inventory = getInventory();
    const loans = getLoans();
    const summary = document.getElementById('report-summary');
    const counts = [
      ['Total barang', inventory.length],
      ['Pengajuan', loans.length],
      ['Menunggu', loans.filter((loan) => loan.status === 'Menunggu').length],
      ['Sedang dipinjam', loans.filter((loan) => loan.status === 'Dipinjam').length],
      ['Ditolak', loans.filter((loan) => loan.status === 'Ditolak').length]
    ];
    summary.replaceChildren();
    counts.forEach(([label, count]) => {
      const card = makeElement('div', 'card workflow-stat');
      card.append(makeElement('strong', '', String(count)), makeElement('span', '', label));
      summary.appendChild(card);
    });

    const tableBody = document.getElementById('report-inventory');
    tableBody.replaceChildren();
    inventory.forEach((item) => {
      const row = document.createElement('tr');
      [
        `No. ${item.nomor}`,
        item.nama,
        item.kategori === 'alat' ? 'Alat' : 'Bahan',
        item.stock === null ? 'Tidak dicantumkan' : String(item.stock),
        item.stock === null ? '-' : String(availableStock(item)),
        String(item.damaged || 0)
      ].forEach((value) => row.appendChild(makeElement('td', '', value)));
      tableBody.appendChild(row);
    });

    document.getElementById('export-report-btn').addEventListener('click', () => {
      const rows = [
        ['Nomor', 'Nama', 'Kategori', 'Stok', 'Tersedia', 'Rusak'],
        ...inventory.map((item) => [
          item.nomor,
          item.nama,
          item.kategori,
          item.stock ?? 'Tidak dicantumkan',
          availableStock(item) ?? '-',
          item.damaged || 0
        ])
      ];
      const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
      const link = makeElement('a');
      link.href = url;
      link.download = 'laporan-inventaris-pinjamlab.csv';
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  window.PinjamlabWorkflow = {
    addDraftItem,
    getInventory,
    getLoans,
    getCurrentUser: currentUser
  };

  document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initDashboard();
    initCatalog();
    initLoanForm();
    initConfirmation();
    initVerification();
    initReturns();
    initHistory();
    initReports();
  });
})();
