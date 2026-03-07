// ===== MAIN JS (Updated) =====
document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  }
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const t = document.querySelector(anchor.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (mobileMenu) mobileMenu.classList.remove('open'); }
    });
  });
  // Apply saved lang buttons active state (Visual only)
  const savedLang = localStorage.getItem('kajerlok_lang') || 'bn';
  ['bn', 'en', 'hi'].forEach(l => {
    const b = document.getElementById('lang-' + l);
    if (b) b.classList.toggle('active', l === savedLang);
  });
});

// ===== TOAST =====
function showToast(msg, type = 'info') {
  let c = document.querySelector('.toast-container');
  if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.cssText = 'opacity:0;transform:translateX(40px);transition:0.4s'; setTimeout(() => t.remove(), 400); }, 3800);
}

// ===== OTP SIMULATION & VALIDATION =====
function sendOTP(fieldId) {
  const v = document.getElementById(fieldId)?.value?.trim();
  const t = (typeof getTranslation === 'function') ? getTranslation : (k) => k;

  if (!v) {
    showToast(t('msg_enter_mobile'), 'error');
    return;
  }

  // Regex for Mobile (Indian format: optional +91, followed by 10 digits)
  const mobileRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
  // Regex for Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!mobileRegex.test(v) && !emailRegex.test(v)) {
    showToast('বৈধ মোবাইল নম্বর বা ইমেইল দিন (Enter a valid mobile or email)', 'error');
    return;
  }

  showToast(t('msg_otp_sent') + v, 'success');
  const hint = document.getElementById(fieldId + '_otp_sent');
  if (hint) hint.classList.add('show');
}

// ===== FILE UPLOAD =====
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const MAX_FILE_MB = 10;

function validateFile(file) {
  if (!file) return true;
  if (!ALLOWED_TYPES.includes(file.type)) {
    showToast('❌ শুধুমাত্র JPG, PNG বা PDF ফাইল আপলোড করুন', 'error');
    return false;
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    showToast(`❌ ফাইলের আকার সর্বোচ্চ ${MAX_FILE_MB}MB হতে হবে`, 'error');
    return false;
  }
  return true;
}

function initFileUpload(areaId, inputId, nameId) {
  const area = document.getElementById(areaId), input = document.getElementById(inputId), nameEl = document.getElementById(nameId);
  if (!area || !input) return;
  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', e => { e.preventDefault(); area.style.borderColor = 'var(--primary)'; });
  area.addEventListener('dragleave', () => area.style.borderColor = '');
  area.addEventListener('drop', e => {
    e.preventDefault(); area.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      // Push dropped file into input
      const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files;
      if (nameEl) nameEl.textContent = '✅ ' + file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
    }
  });
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) {
      if (!validateFile(file)) { input.value = ''; if (nameEl) nameEl.textContent = ''; return; }
      if (nameEl) nameEl.textContent = '✅ ' + file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
    }
  });
}

// ===== MODAL =====
function openModal(id) { const m = document.getElementById(id); if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; } }
function closeModal(id) { const m = document.getElementById(id); if (m) { m.classList.remove('open'); document.body.style.overflow = ''; } }
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) { e.target.classList.remove('open'); document.body.style.overflow = ''; } });

// ===== DASHBOARD NAV =====
function initDashboard() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-page]');
  const pages = document.querySelectorAll('.dash-page');
  const topTitle = document.getElementById('dashPageTitle');

  function showPage(pageId) {
    pages.forEach(p => p.classList.toggle('active', p.id === pageId));
    navItems.forEach(n => n.classList.toggle('active', n.dataset.page === pageId));

    const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (topTitle && activeNav) {
      const label = activeNav.querySelector('.nav-label');
      topTitle.textContent = label?.textContent || '';
      // Update i18n key for the title as well
      const i18nKey = label?.getAttribute('data-i18n');
      if (i18nKey) {
        topTitle.setAttribute('data-i18n', i18nKey);
      } else {
        topTitle.removeAttribute('data-i18n');
      }
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      showPage(item.dataset.page);
      if (window.innerWidth < 1024) {
        // Close sidebar on mobile if desired
      }
    });
  });

  // Show initial page (from hash or first item)
  const initialPage = window.location.hash.replace('#', '') || (navItems[0]?.dataset.page);
  if (initialPage) showPage(initialPage);
}

// ===== PLAN SELECTOR =====
function initPlanSelector() {
  document.querySelectorAll('.plan-option, .hour-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const siblings = opt.closest('.plan-selector, .hour-selector')?.querySelectorAll('.plan-option, .hour-option');
      if (siblings) siblings.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

// ===== REGISTRATION WIZARD =====
function initWizard() {
  let current = 0;
  const steps = document.querySelectorAll('.step-form');
  const indicators = document.querySelectorAll('.reg-step');
  function goTo(n) {
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    indicators.forEach((s, i) => { s.classList.toggle('active', i === n); s.classList.toggle('done', i < n); });
    current = n;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', () => { if (current < steps.length - 1) goTo(current + 1); }));
  document.querySelectorAll('[data-prev]').forEach(btn => btn.addEventListener('click', () => { if (current > 0) goTo(current - 1); }));
  if (steps.length > 0) goTo(0);
}

// ===== SELECT ALL CHECKBOXES =====
function selectAll(containerId) {
  const checks = document.querySelectorAll(`#${containerId} input[type=checkbox]`);
  const allChecked = Array.from(checks).every(c => c.checked);
  checks.forEach(c => c.checked = !allChecked);
}


