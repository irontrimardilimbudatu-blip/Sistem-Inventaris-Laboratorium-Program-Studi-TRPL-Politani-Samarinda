// PinjamLab — shared interactivity (vanilla JS, no dependency)

document.addEventListener('DOMContentLoaded', () => {

  // --- Toggle checkbox (ingat saya / persetujuan) ---
  document.querySelectorAll('[data-toggle-check]').forEach((box) => {
    box.addEventListener('click', () => box.classList.toggle('unchecked'));
  });

  // --- Toggle password visibility ---
  document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.input');
      const valueEl = wrapper.querySelector('[data-password-value]');
      const isHidden = wrapper.dataset.hidden !== 'false';
      if (isHidden) {
        valueEl.textContent = 'raka12345';
        wrapper.dataset.hidden = 'false';
      } else {
        valueEl.textContent = '••••••••••••';
        wrapper.dataset.hidden = 'true';
      }
    });
  });

  // --- Pill tab / filter switching (visual only) ---
  document.querySelectorAll('[data-tab-group]').forEach((group) => {
    const tabs = group.querySelectorAll('.tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });

  // --- Quantity stepper ---
  document.querySelectorAll('[data-stepper]').forEach((stepper) => {
    const qtyEl = stepper.querySelector('.qty');
    const minus = stepper.querySelector('[data-step="minus"]');
    const plus = stepper.querySelector('[data-step="plus"]');
    const min = parseInt(stepper.dataset.min || '1', 10);
    const max = parseInt(stepper.dataset.max || '99', 10);

    const render = (val) => { qtyEl.textContent = String(val).padStart(1, '0'); };

    minus.addEventListener('click', () => {
      let val = parseInt(qtyEl.textContent, 10);
      if (val > min) render(val - 1);
    });
    plus.addEventListener('click', () => {
      let val = parseInt(qtyEl.textContent, 10);
      if (val < max) render(val + 1);
    });
  });

  // --- Character counter for textarea ---
  document.querySelectorAll('[data-char-count]').forEach((textarea) => {
    const counter = document.querySelector(textarea.dataset.charCount);
    const max = textarea.maxLength || 250;
    const update = () => { counter.textContent = `${textarea.value.length}/${max}`; };
    textarea.addEventListener('input', update);
    update();
  });

  // --- "+" add-to-submission button: small bump feedback ---
  document.querySelectorAll('[data-add-item]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.style.transform = 'scale(1.15)';
      btn.style.background = '#2563eb';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });

});
