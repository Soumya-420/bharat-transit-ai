// ===== CUSTOMER DASHBOARD JS =====
// auth.js is loaded before this in dashboard-customer.html

// Mock worker data (approved workers from localStorage supplement this)
const STATIC_WORKERS = [
  { id: 'w1', name: 'রাহেলা বেগম', type: 'household', typeLabel: 'গৃহস্থালি', exp: '৫ বছর', rating: 4.8, trust: 92, price: '₹৩,৫০০/মাস', initials: 'রা', bio: 'গৃহস্থালির কাজে দক্ষ এবং নম্র স্বভাবের।', plans: { daily: 150, monthly: 3500, yearly: 38000 } },
  { id: 'w2', name: 'সুমিত্রা দাস', type: 'aya', typeLabel: 'আয়া সেবা', exp: '৮ বছর', rating: 4.5, trust: 88, price: '₹৫০০/৮ঘণ্টা', initials: 'সু', bio: 'হাসপাতাল এবং বাড়ির আয়া কাজে দীর্ঘ অভিজ্ঞতা।', hourly: { 6: 400, 8: 500, 10: 650, 12: 800, 24: 1500 } },
  { id: 'w3', name: 'মিতা বিশ্বাস', type: 'babysitter', typeLabel: 'বেবিসিটার', exp: '৩ বছর', rating: 4.9, trust: 95, price: '₹৫,০০০/মাস', initials: 'মি', bio: 'শিশুদের সাথে সময় কাটাতে এবং তাদের যত্ন নিতে ভালোবাসেন।', plans: { monthly: 5000, yearly: 55000 } },
  { id: 'w4', name: 'কল্যাণী সরকার', type: 'household', typeLabel: 'গৃহস্থালি', exp: '২ বছর', rating: 4.2, trust: 80, price: '₹৩,০০০/মাস', initials: 'কল', bio: 'মেহনতি এবং সৎ কর্মী।', plans: { daily: 120, monthly: 3000, yearly: 33000 } },
  { id: 'w5', name: 'মুনমুন ঘোষ', type: 'aya', typeLabel: 'আয়া সেবা', exp: '৬ বছর', rating: 4.7, trust: 90, price: '₹৪৫০/৬ঘণ্টা', initials: 'মু', bio: 'বৃদ্ধাশ্রম এবং ব্যক্তিগত সেবায় পারদর্শী।', hourly: { 6: 450, 8: 600, 10: 750, 12: 900, 24: 1800 } },
  { id: 'w6', name: 'রেখা মণ্ডল', type: 'babysitter', typeLabel: 'বেবিসিটার', exp: '৪ বছর', rating: 4.4, trust: 85, price: '₹৪,৫০০/মাস', initials: 'রে', bio: 'শান্ত ও ধৈর্যশীল স্বভাবের দক্ষ আয়া।', plans: { monthly: 4500, yearly: 49500 } },
  { id: 'w7', name: 'শান্তা সাহা', type: 'household', typeLabel: 'গৃহস্থালি', exp: '৭ বছর', rating: 4.6, trust: 89, price: '₹৪,০০০/মাস', initials: 'শা', bio: 'রান্না এবং ঘর পরিষ্কারে পারদর্শী।', plans: { daily: 180, monthly: 4000, yearly: 44000 } },
  { id: 'w8', name: 'টিয়া চক্রবর্তী', type: 'babysitter', typeLabel: 'বেবিসিটার', exp: '৫ বছর', rating: 5.0, trust: 98, price: '₹৬,০০০/মাস', initials: 'টি', bio: 'প্রশিক্ষিত বেবিসিটার এবং প্রাথমিক শিক্ষায় অভিজ্ঞ।', plans: { monthly: 6000, yearly: 66000 } }
];

/* Build combined worker list: static + approved from admin */
function getAllWorkers() {
  const approved = JSON.parse(localStorage.getItem('approvedWorkers') || '[]');
  const typeLabels = {
    household: getTranslation('opt_household'),
    aya: getTranslation('opt_aya'),
    babysitter: getTranslation('opt_babysitter')
  };

  const live = approved.map(w => {
    const type = w.workType || 'household';
    const expVal = w.exp ? (w.exp + ' বছর') : 'নতুন';

    // Default plans if none provided in registration
    let plans = { daily: 150, monthly: 4000, yearly: 44000 };
    let hourly = { 6: 450, 8: 600, 10: 750, 12: 900, 24: 1800 };

    // Try to use salary from registration
    let priceDisplay = w.salary || (type === 'aya' ? '₹৪৫০/৬ঘণ্টা' : '₹৪,০০০/মাস');

    return {
      id: w.workerId,
      name: w.name,
      type: type,
      typeLabel: typeLabels[type] || type,
      exp: expVal,
      rating: parseFloat(getWorkerRating(w.workerId).avg) || 4.0,
      trust: 85,
      price: priceDisplay,
      initials: w.name ? w.name.trim().charAt(0) : 'ক',
      plans: plans,
      hourly: hourly,
      isLive: true
    };
  });
  return [...STATIC_WORKERS, ...live];
}

let workers = getAllWorkers();
let selectedWorker = null;
let selectedPlan = null;
let selectedHour = null;
let activeRatingBookingId = null;
let _cUser = null;

document.addEventListener('DOMContentLoaded', () => {
  try {
    _cUser = requireAuth('customer', 'login-customer.html');
    if (!_cUser) return;

    // Core Layout & Navigation
    initDashboard();
    injectCustomerSession(_cUser);

    // Data Loading
    workers = getAllWorkers();
    renderWorkers('all');
    renderCustomerBookings();
    renderCustomerNotifs();
    renderWalletUI();
    renderDashboardData();
    updateProfileUI();

    // Tools
    initFileUpload('compArea', 'compFile', 'compFileName');
    const d = document.getElementById('bmDate');
    if (d) d.min = new Date().toISOString().split('T')[0];
  } catch (err) {
    console.error('Dashboard Init Error:', err);
    showToast('ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে', 'error');
  }
});

/* ---- Inject customer name into sidebar & topbar ---- */
function injectCustomerSession(u) {
  const initials = u.name ? u.name.trim().charAt(0) : 'গ';
  const avatarEl = document.getElementById('sidebarAvatar');
  if (avatarEl) avatarEl.textContent = initials;
  const nameEl = document.getElementById('sidebarName');
  if (nameEl) nameEl.textContent = u.name || 'গ্রাহক';
  const roleEl = document.getElementById('sidebarRole');
  if (roleEl) roleEl.textContent = 'ID: ' + (u.customerId || '');
}


function switchTab(pageId) {
  const pages = document.querySelectorAll('.dash-page');
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const topTitle = document.getElementById('dashPageTitle');

  pages.forEach(p => p.classList.toggle('active', p.id === pageId));
  navItems.forEach(n => n.classList.toggle('active', n.dataset.page === pageId));

  const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (topTitle && activeNav) {
    const label = activeNav.querySelector('.nav-label');
    topTitle.textContent = label?.textContent || '';
    const i18nKey = label?.getAttribute('data-i18n');
    if (i18nKey) topTitle.setAttribute('data-i18n', i18nKey);
    else topTitle.removeAttribute('data-i18n');
  }
}

function filterWorkers() {
  const type = document.getElementById('searchType')?.value || 'all';
  const rating = document.getElementById('searchRating')?.value || 'all';
  let list = type === 'all' ? workers : workers.filter(w => w.type === type);
  if (rating !== 'all') list = list.filter(w => Math.round(w.rating) >= parseInt(rating));
  renderWorkers(list);
}

function renderWorkers(filterOrList) {
  const grid = document.getElementById('workerGrid');
  if (!grid) return;
  // Accept either a pre-filtered array or a type string
  const list = Array.isArray(filterOrList)
    ? filterOrList
    : (filterOrList === 'all' ? workers : workers.filter(w => w.type === filterOrList));
  const stars = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

  if (!list.length) {
    grid.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted)">${getTranslation('msg_no_workers_found') || 'এই ফিল্টারে কোনো কর্মী পাওয়া যায়নি'}</div>`;
    return;
  }

  // NOTE: IDs are strings (e.g. 'w1'), so we must quote them in onclick
  grid.innerHTML = list.map(w => `
    <div class="wc" style="cursor:pointer" onclick="openBookingModal('${w.id}')">
      <div class="wc-head">
        <div class="wc-avatar">${w.initials}</div>
        <div>
          <div class="wc-name">${w.name}</div>
          <div class="wc-type">${w.typeLabel}</div>
          <div class="wc-stars">${stars(w.rating)} (${(+w.rating).toFixed(1)})</div>
        </div>
      </div>
      <div class="wc-meta">
        <span class="wc-tag">🕐 ${getTranslation('label_experience')}: ${w.exp}</span>
        <span class="badge badge-green" style="font-size:10px">✓ ${getTranslation('label_verified')}</span>
      </div>
      <div class="trust-bar">
        <div class="trust-bar-label"><span>${getTranslation('label_trust_level')}</span><span style="color:var(--accent)">${w.trust}%</span></div>
        <div class="trust-bar-track"><div class="trust-bar-fill" style="width:${w.trust}%"></div></div>
      </div>
      <div class="wc-price">${w.price}</div>
      <button class="btn btn-primary btn-full" onclick="event.stopPropagation();openBookingModal('${w.id}')" data-i18n="btn_book_now">${getTranslation('btn_book_now')}</button>
    </div>
  `).join('');
}

function openBookingModal(workerId) {
  // IDs can be strings like 'w1' or numbers; use loose equality
  selectedWorker = workers.find(w => w.id == workerId);
  if (!selectedWorker) { showToast('কর্মীর তথ্য পাওয়া যায়নি', 'error'); return; }
  selectedPlan = null; selectedHour = null;
  document.getElementById('bmTitle').textContent = `${selectedWorker.name} – বুকিং`;

  // Worker info
  document.getElementById('bmWorkerInfo').innerHTML = `
    <div style="width:48px;height:48px;border-radius:50%;background:var(--gradient);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:18px;flex-shrink:0">${selectedWorker.initials}</div>
    <div>
      <div style="font-weight:700;color:var(--text)">${selectedWorker.name}</div>
      <div style="font-size:13px;color:var(--text-muted)">${selectedWorker.typeLabel} | ${getTranslation('label_experience')}: ${selectedWorker.exp}</div>
      <div style="color:var(--secondary);font-size:13px">${'★'.repeat(Math.round(selectedWorker.rating))}${'☆'.repeat(5 - Math.round(selectedWorker.rating))}</div>
    </div>`;

  // Service options
  let svcHtml = '';
  if (selectedWorker.type === 'household') {
    const dhPrices = JSON.parse(localStorage.getItem('kajerlok_kh_rates')) || {
      cooking: 80, dishes: 40, clothes: 40, mopping: 40, shopping: 30, cleaning: 30
    };
    svcHtml = `<div style="margin-bottom:16px"><label style="font-size:14px;font-weight:600;color:var(--text);display:block;margin-bottom:10px">কাজের ধরন নির্বাচন করুন</label>
        <div class="dh-checklist" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;background:var(--bg2);padding:12px;border-radius:8px;margin-bottom:12px">
            <label style="display:flex;align-items:center;gap:8px;font-size:13px"><input type="checkbox" value="${dhPrices.cooking}" onchange="calculateDHPrices()" id="taskCooking"> <span data-i18n="label_dh_cooking">রান্না</span></label>
            <label style="display:flex;align-items:center;gap:8px;font-size:13px"><input type="checkbox" value="${dhPrices.dishes}" onchange="calculateDHPrices()" id="taskDishes"> <span data-i18n="label_dh_washing_dishes">বাসন মাজা</span></label>
            <label style="display:flex;align-items:center;gap:8px;font-size:13px"><input type="checkbox" value="${dhPrices.clothes}" onchange="calculateDHPrices()" id="taskClothes"> <span data-i18n="label_dh_washing_clothes">কাপড় কাচা</span></label>
            <label style="display:flex;align-items:center;gap:8px;font-size:13px"><input type="checkbox" value="${dhPrices.mopping}" onchange="calculateDHPrices()" id="taskMopping"> <span data-i18n="label_dh_mopping">ঘর মোছা</span></label>
            <label style="display:flex;align-items:center;gap:8px;font-size:13px"><input type="checkbox" value="${dhPrices.shopping}" onchange="calculateDHPrices()" id="taskShopping"> <span data-i18n="label_dh_shopping">বাজার করা</span></label>
            <label style="display:flex;align-items:center;gap:8px;font-size:13px"><input type="checkbox" value="${dhPrices.cleaning}" onchange="calculateDHPrices()" id="taskCleaning"> <span data-i18n="label_dh_cleaning">ঘর পরিষ্কার</span></label>
        </div>
        <label style="font-size:14px;font-weight:600;color:var(--text);display:block;margin-bottom:10px" data-i18n="label_dh_plan_select">এরপর প্ল্যান নির্বাচন করুন</label>
    <div class="plan-selector">
      <div class="plan-option" id="dhPlanDaily" onclick="selectPlan('daily', 0, this)"><div class="plan-name" data-i18n="label_daily">দৈনিক (Daily)</div><div class="plan-price" id="dhPriceDaily">₹0</div><div class="plan-sub">প্রতি দিন</div></div>
      <div class="plan-option" id="dhPlanMonthly" onclick="selectPlan('monthly', 0, this)"><div class="plan-name" data-i18n="label_monthly">মাসিক (Monthly)</div><div class="plan-price" id="dhPriceMonthly">₹0</div><div class="plan-sub">প্রতি মাস</div></div>
      <div class="plan-option" id="dhPlanYearly" onclick="selectPlan('yearly', 0, this)"><div class="plan-name" data-i18n="label_yearly">বার্ষিক (Yearly)</div><div class="plan-price" id="dhPriceYearly">₹0</div><div class="plan-sub">প্রতি বছর</div></div>
    </div></div>`;
  } else if (selectedWorker.type === 'aya') {
    const h = selectedWorker.hourly;
    svcHtml = `<div style="margin-bottom:16px"><label style="font-size:14px;font-weight:600;color:var(--text);display:block;margin-bottom:10px">ঘণ্টার সময়সীমা নির্বাচন করুন</label>
    <div class="hour-selector">
      ${[6, 8, 10, 12, 24].map(hr => `<div class="hour-option" onclick="selectHour(${hr},${h[hr]},this)"><div class="hour-val">${hr}ঘন্টা</div><div class="hour-rate">₹${h[hr]}/দিন</div></div>`).join('')}
    </div>
    <label style="font-size:14px;font-weight:600;color:var(--text);display:block;margin:12px 0 10px">এরপর প্ল্যান নির্বাচন করুন</label>
    <div class="plan-selector" id="ayaPlanSel" style="pointer-events:none;opacity:0.5">
      <div class="plan-option" id="ayaDaily" onclick="selectPlanAya('daily',this)"><div class="plan-name">ডেইলি</div><div class="plan-price" id="ayaDailyprice">—</div><div class="plan-sub">প্রতি দিন</div></div>
      <div class="plan-option" id="ayaMonthly" onclick="selectPlanAya('monthly',this)"><div class="plan-name">মান্থলি</div><div class="plan-price" id="ayaMonthlyprice">—</div><div class="plan-sub">প্রতি মাস</div></div>
      <div class="plan-option" id="ayaYearly" onclick="selectPlanAya('yearly',this)"><div class="plan-name">ইয়ারলি</div><div class="plan-price" id="ayaYearlyprice">—</div><div class="plan-sub">প্রতি বছর</div></div>
    </div></div>`;
  } else { // babysitter – only monthly & yearly
    svcHtml = `<div style="margin-bottom:16px"><label style="font-size:14px;font-weight:600;color:var(--text);display:block;margin-bottom:10px">প্ল্যান নির্বাচন করুন</label>
    <div class="plan-selector" style="grid-template-columns:1fr 1fr">
      <div class="plan-option" onclick="selectPlan('monthly',${selectedWorker.plans.monthly},this)"><div class="plan-name">মান্থলি</div><div class="plan-price">₹${selectedWorker.plans.monthly}</div><div class="plan-sub">প্রতি মাস</div></div>
      <div class="plan-option" onclick="selectPlan('yearly',${selectedWorker.plans.yearly},this)"><div class="plan-name">ইয়ারলি</div><div class="plan-price">₹${selectedWorker.plans.yearly}</div><div class="plan-sub">প্রতি বছর</div></div>
    </div></div>`;
  }
  document.getElementById('bmServiceOptions').innerHTML = svcHtml;

  // Call calculate for DH to set initial 0 or default values, and apply translations
  if (selectedWorker.type === 'household') {
    calculateDHPrices();
  }
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }

  updateBookingSummary();
  openModal('bookingModal');
}

function selectPlan(type, amt, el) {
  el.closest('.plan-selector').querySelectorAll('.plan-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  selectedPlan = { type, amt };
  updateBookingSummary();
}

function selectHour(hr, rate, el) {
  el.closest('.hour-selector').querySelectorAll('.hour-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  selectedHour = { hr, rate };
  // activate plan selector
  const ps = document.getElementById('ayaPlanSel');
  if (ps) { ps.style.pointerEvents = 'auto'; ps.style.opacity = '1'; }
  const daily = Math.round(rate);
  const monthly = Math.round(rate * 26);
  const yearly = Math.round(rate * 26 * 12 * 0.9);

  const fmt = val => typeof localizeNumbers === 'function' ? localizeNumbers(`₹${val.toLocaleString('en-IN')}`) : `₹${val.toLocaleString('en-IN')}`;

  document.getElementById('ayaDailyprice').textContent = fmt(daily);
  document.getElementById('ayaMonthlyprice').textContent = fmt(monthly);
  document.getElementById('ayaYearlyprice').textContent = fmt(yearly);

  // store rates for plan
  document.getElementById('ayaDaily').dataset.amt = daily;
  document.getElementById('ayaMonthly').dataset.amt = monthly;
  document.getElementById('ayaYearly').dataset.amt = yearly;

  selectedPlan = null; updateBookingSummary();
}

function calculateDHPrices() {
  const dhPrices = JSON.parse(localStorage.getItem('kajerlok_kh_rates')) || {
    cooking: 80, dishes: 40, clothes: 40, mopping: 40, shopping: 30, cleaning: 30
  };

  let dailyRate = 0;
  if (document.getElementById('taskCooking')?.checked) dailyRate += dhPrices.cooking;
  if (document.getElementById('taskDishes')?.checked) dailyRate += dhPrices.dishes;
  if (document.getElementById('taskClothes')?.checked) dailyRate += dhPrices.clothes;
  if (document.getElementById('taskMopping')?.checked) dailyRate += dhPrices.mopping;
  if (document.getElementById('taskShopping')?.checked) dailyRate += dhPrices.shopping;
  if (document.getElementById('taskCleaning')?.checked) dailyRate += dhPrices.cleaning;

  const monthlyRate = Math.round(dailyRate * 26);
  const yearlyRate = Math.round(dailyRate * 26 * 12 * 0.9);

  // Helper inside calculateDHPrices to format correctly
  const fmt = val => typeof localizeNumbers === 'function' ? localizeNumbers(`₹${val.toLocaleString('en-IN')}`) : `₹${val.toLocaleString('en-IN')}`;

  // Update Plan UI
  document.getElementById('dhPriceDaily').textContent = fmt(dailyRate);
  document.getElementById('dhPriceMonthly').textContent = fmt(monthlyRate);
  document.getElementById('dhPriceYearly').textContent = fmt(yearlyRate);

  // Update onclick handlers
  document.getElementById('dhPlanDaily').setAttribute('onclick', `selectPlan('daily', ${dailyRate}, this)`);
  document.getElementById('dhPlanMonthly').setAttribute('onclick', `selectPlan('monthly', ${monthlyRate}, this)`);
  document.getElementById('dhPlanYearly').setAttribute('onclick', `selectPlan('yearly', ${yearlyRate}, this)`);

  // Update selected plan if any
  if (selectedPlan) {
    if (selectedPlan.type === 'daily') selectedPlan.amt = dailyRate;
    if (selectedPlan.type === 'monthly') selectedPlan.amt = monthlyRate;
    if (selectedPlan.type === 'yearly') selectedPlan.amt = yearlyRate;
    updateBookingSummary();
  }
}

function selectPlanAya(type, el) {
  el.closest('.plan-selector').querySelectorAll('.plan-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  const amt = parseInt(el.dataset.amt) || 0;
  selectedPlan = { type, amt };
  updateBookingSummary();
}

function updateBookingSummary() {
  const planEl = document.getElementById('bmSelectedPlan');
  const amtEl = document.getElementById('bmTotalAmt');
  if (selectedPlan) {
    planEl.textContent = getTranslation('label_' + selectedPlan.type) || selectedPlan.type;
    const amtStr = `₹${selectedPlan.amt.toLocaleString('en-IN')}`;
    amtEl.textContent = typeof localizeNumbers === 'function' ? localizeNumbers(amtStr) : amtStr;
  } else {
    planEl.textContent = '— (' + getTranslation('opt_select_type') + ')';
    amtEl.textContent = '—';
  }
}

function confirmBooking() {
  if (!selectedPlan) { showToast('অনুগ্রহ করে একটি প্ল্যান নির্বাচন করুন', 'error'); return; }
  const dateEl = document.getElementById('bmDate');
  if (dateEl && !dateEl.value) { showToast('শুরুর তারিখ দিন', 'error'); return; }
  const selectedServices = [];
  ['taskCooking', 'taskDishes', 'taskClothes', 'taskMopping', 'taskShopping', 'taskCleaning'].forEach(id => {
    const el = document.getElementById(id);
    if (el?.checked) selectedServices.push(el.closest('label').querySelector('span')?.textContent || id);
  });
  const PLAN_LABELS = { daily: 'ডেইলি', monthly: 'মান্থলি', yearly: 'ইয়ারলি' };
  const planLabel = PLAN_LABELS[selectedPlan.type] || selectedPlan.type;
  const res = payWithWallet(_cUser?.customerId || _cUser?.id, selectedPlan.amt, `BK-${Date.now()}`, selectedWorker.name);
  if (!res.success) {
    showToast(`❌ ${res.message}. দয়া করে ওয়ালেটে টাকা যোগ করুন।`, 'error');
    openAddFundsModal();
    return;
  }

  createBooking({
    customerId: _cUser?.customerId,
    customerName: _cUser?.name,
    workerId: selectedWorker.id,
    workerName: selectedWorker.name,
    workerType: selectedWorker.typeLabel,
    services: selectedServices.length ? selectedServices : [selectedWorker.typeLabel],
    plan: planLabel,
    planKey: selectedPlan.type,
    price: selectedPlan.amt,
    startDate: dateEl?.value || new Date().toISOString()
  });
  addNotification('✅ বুকিং নিশ্চিত! (ওয়ালেট পেমেন্ট) কর্মী: ' + selectedWorker.name + ' | প্ল্যান: ' + planLabel);
  closeModal('bookingModal');
  renderCustomerBookings();
  renderWalletUI();
  showToast('✅ বুকিং সফল! ওয়ালেট থেকে টাকা কাটা হয়েছে।', 'success');
}


/* ---- Real Bookings List ---- */
function renderCustomerBookings() {
  const allBookings = window.getAllBookings ? window.getAllBookings() : JSON.parse(localStorage.getItem('klBookings') || '[]');
  const myBookings = allBookings.filter(b => b.customerId === _cUser?.customerId);
  const tbody = document.querySelector('#bookingsTable tbody');
  if (!tbody) return;

  if (!myBookings.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:24px">কোনো বুকিং নেই। উপরে "কর্মী খুঁজুন" থেকে বুক করুন</td></tr>';
  } else {
    // Sort by newest first
    myBookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    tbody.innerHTML = myBookings.map(b => {
      // Create translation fallbacks
      const statusHtml = typeof statusBadge === 'function' ? statusBadge(b.status) : `<span class="badge badge-blue">${b.status}</span>`;
      const dateStr = b.startDate ? new Date(b.startDate).toLocaleDateString('bn-IN') : '—';
      const svcStr = Array.isArray(b.services) ? b.services.join(', ') : (b.services || '—');
      const priceStr = `₹${(b.price || 0).toLocaleString('en-IN')}`;

      let actionHtml = '—';
      if (['confirmed', 'active'].includes(b.status)) {
        actionHtml = `
          <button class="btn btn-sm btn-danger" onclick="doCancelBooking('${b.bookingId}')">✕ বাতিল</button>
          <button class="btn btn-sm btn-secondary" onclick="printReceipt('${b.bookingId}')">📄 রসিদ</button>
          <button class="btn btn-sm btn-outline" onclick="openChatModal('${b.workerId}', '${b.workerName}')" style="margin-top:4px">💬 চ্যাট</button>
          <button class="btn btn-sm btn-outline" onclick="doRequestReplacement('${b.bookingId}')" style="margin-top:4px">🔄 প্রতিস্থাপন</button>
        `;
      } else if (b.status === 'completed') {
        if (!b.rated) {
          actionHtml = `<button class="btn btn-sm btn-warning" onclick="openRateModal('${b.bookingId}','${b.workerName || ''}')">⭐ রেট করুন</button>`;
        } else {
          actionHtml = `<span class="badge badge-green">রেটিং দেওয়া হয়েছে ✓</span>`;
        }
      } else if (b.status === 'replacement_requested') {
        actionHtml = `<span class="badge badge-yellow">অপেক্ষমাণ</span>`;
      }

      return `
      <tr data-status="${b.status}">
        <td><strong>${b.workerName || '—'}</strong><br><small style="color:var(--text-muted)">${b.workerType || ''}</small></td>
        <td style="max-width:200px;white-space:normal">${svcStr}</td>
        <td>${b.plan || '—'}</td>
        <td>${dateStr}</td>
        <td>${priceStr}</td>
        <td>${statusHtml}</td>
        <td style="white-space:nowrap">${actionHtml}</td>
      </tr>`;
    }).join('');
  }

  // Update Stats
  const active = myBookings.filter(b => ['confirmed', 'active'].includes(b.status)).length;
  const spent = myBookings.filter(b => ['confirmed', 'active', 'completed'].includes(b.status)).reduce((s, b) => s + (b.price || 0), 0);
  const statVals = document.querySelectorAll('#pa-bookings .stat-card .sc-value');
  if (statVals[0]) statVals[0].textContent = active.toLocaleString('en-IN');
  if (statVals[1]) statVals[1].textContent = myBookings.filter(b => b.status === 'completed').length.toLocaleString('en-IN');
  if (statVals[2]) statVals[2].textContent = '₹' + spent.toLocaleString('en-IN');
}

function doCancelBooking(id) {
  if (!confirm(getTranslation('msg_confirm_cancel') || 'আপনি কি নিশ্চিত যে আপনি এই বুকিংটি বাতিল করতে চান?')) return;
  if (typeof window.cancelBooking === 'function') {
    window.cancelBooking(id);
  } else {
    // Fallback if not injected properly
    const list = JSON.parse(localStorage.getItem('klBookings') || '[]');
    const idx = list.findIndex(b => b.bookingId === id);
    if (idx !== -1) { list[idx].status = 'cancelled'; localStorage.setItem('klBookings', JSON.stringify(list)); }
  }

  addNotification('বুকিং বাতিল হয়েছে');
  renderCustomerBookings();
  showToast('বুকিং বাতিল হয়েছে', 'info');
}

function doRequestReplacement(id) {
  if (!confirm(getTranslation('msg_confirm_replacement') || 'আপনি কি এই কর্মীর পরিবর্তে অন্য কর্মী (প্রতিস্থাপন) চান?')) return;

  if (typeof window.requestReplacement === 'function') {
    window.requestReplacement(id);
  } else {
    // Fallback
    const list = JSON.parse(localStorage.getItem('klBookings') || '[]');
    const idx = list.findIndex(b => b.bookingId === id);
    if (idx !== -1) { list[idx].status = 'replacement_requested'; localStorage.setItem('klBookings', JSON.stringify(list)); }
  }

  addNotification(getTranslation('msg_replacement_requested') || '🔄 প্রতিস্থাপন অনুরোধ পাঠানো হয়েছে। অ্যাডমিন শীঘ্রই আপনার সাথে যোগাযোগ করবেন।');
  renderCustomerBookings();
  showToast(getTranslation('msg_replacement_requested_short') || '🔄 প্রতিস্থাপন অনুরোধ পাঠানো হয়েছে', 'info');
}
function openRateModal(bookingId, workerName) {
  activeRatingBookingId = bookingId; currentRating = 0; setRating(0);
  const wtEl = document.getElementById('rateWorkerTitle');
  if (wtEl) wtEl.textContent = (getTranslation('label_rate') || 'রেট করুন: ') + ' ' + workerName;
  openModal('rateModal');
}

function filterBookings(status, btn) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#bookingsTable tbody tr').forEach(row => {
    row.style.display = (status === 'all' || row.dataset.status === status) ? '' : 'none';
  });
}

let currentRating = 0;
function setRating(n) {
  currentRating = n;
  const stars = document.querySelectorAll('#starRating span');
  stars.forEach((s, i) => { s.textContent = i < n ? '★' : '☆'; s.style.color = i < n ? 'var(--secondary)' : 'var(--text-dim)'; });
}

function submitRating() {
  if (!currentRating) { showToast(getTranslation('toast_give_rating') || 'অনুগ্রহ করে রেটিং দিন', 'error'); return; }
  const comment = document.querySelector('#rateModal textarea')?.value || '';

  if (activeRatingBookingId) {
    const success = window.submitRating && typeof window.submitRating === 'function'
      ? window.submitRating(activeRatingBookingId, currentRating, comment)
      : false;

    if (success) {
      addNotification(getTranslation('msg_rate_thanks') || '★ রেটিং দেওয়ার জন্য ধন্যবাদ!');
      showToast(getTranslation('toast_review_submitted') || 'রিভিউ জমা দেওয়া হয়েছে। ধন্যবাদ!', 'success');
    } else {
      // Fallback if auth.js link is broken
      const list = getAllBookings();
      const idx = list.findIndex(b => b.bookingId === activeRatingBookingId);
      if (idx !== -1) {
        list[idx].rating = currentRating;
        list[idx].ratingComment = comment;
        list[idx].rated = true;
        saveAllBookings(list);
        addNotification(getTranslation('msg_rate_thanks') || '★ রেটিং দেওয়ার জন্য ধন্যবাদ!');
        showToast(getTranslation('toast_review_submitted') || 'রিভিউ জমা দেওয়া হয়েছে। ধন্যবাদ!', 'success');
      }
    }
  }
  closeModal('rateModal');
  renderCustomerBookings();
}

/* ---- Notifications ---- */
function renderCustomerNotifs() {
  const cnt = unreadCount();
  const dot = document.getElementById('cNotifDot');
  if (dot) dot.style.display = cnt > 0 ? '' : 'none';
  const el = document.getElementById('cNotifList');
  if (!el) return;
  const list = getNotifications().slice(0, 15);
  el.innerHTML = list.length ? list.map(n => `
    <div style="padding:10px 12px;border-radius:8px;margin-bottom:4px;background:${n.read ? 'transparent' : 'rgba(26,86,219,0.05)'};font-size:13px">
      <div>${n.message}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:3px">${new Date(n.time).toLocaleString(getCurrentLang() === 'bn' ? 'bn-IN' : 'en-IN')}</div>
    </div>`).join('') :
    `<div style="text-align:center;color:var(--text-muted);padding:20px">${getTranslation('msg_no_notifs') || 'কোনো বিজ্ঞপ্তি নেই'}</div>`;
}
function toggleCustomerNotifs() {
  const p = document.getElementById('cNotifPanel');
  if (!p) return;
  p.style.display = p.style.display === 'none' ? 'block' : 'none';
  if (p.style.display === 'block') { markAllRead(); renderCustomerNotifs(); }
}
document.addEventListener('click', e => {
  const p = document.getElementById('cNotifPanel');
  const b = document.getElementById('cNotifBtn');
  if (p && b && !p.contains(e.target) && !b.contains(e.target)) p.style.display = 'none';
});

function submitComplaint() {
  const compType = document.getElementById('compType')?.value;
  const compDesc = document.querySelector('#pg-complaint textarea')?.value?.trim();
  const compFile = document.getElementById('compFile')?.files?.[0];
  if (!compType) { showToast(getTranslation('toast_select_complaint_type') || '⚠️ অভিযোগের ধরন নির্বাচন করুন', 'error'); return; }
  if (!compDesc || compDesc.length < 10) { showToast(getTranslation('toast_desc_short') || '⚠️ অভিযোগের বিস্তারিত বিবরণ লিখুন (কমপক্ষে ১০ অক্ষর)', 'error'); return; }
  if (compFile && typeof validateFile === 'function') { if (!validateFile(compFile)) return; }

  const disputes = JSON.parse(localStorage.getItem('klDisputes') || '[]');
  disputes.push({
    id: Date.now(),
    userId: _cUser?.customerId || _cUser?.id,
    userName: _cUser?.name,
    role: 'customer',
    subject: compType,
    description: compDesc,
    status: 'pending'
  });
  localStorage.setItem('klDisputes', JSON.stringify(disputes));

  addNotification(getTranslation('msg_complaint_submitted_notif') || 'বিজ্ঞপ্তি: আপনার অভিযোগ দাখিল হয়েছে');
  showToast(getTranslation('msg_complaint_submitted_toast') || '✅ অভিযোগ দাখিল হয়েছে। অ্যাডমিন শীঘ্রই যোগাযোগ করবেন।', 'success');

  // Reset form
  const ta = document.querySelector('#pg-complaint textarea');
  if (ta) ta.value = '';
}

/* ---- Profile Management ---- */
function updateProfileUI() {
  if (!_cUser) return;
  const initials = _cUser.name ? _cUser.name.trim().charAt(0) : 'গ';

  // Header/Sidebar
  const avatarLg = document.getElementById('profileAvatar');
  if (avatarLg) avatarLg.textContent = initials;
  const nameEl = document.getElementById('profileName');
  if (nameEl) nameEl.textContent = _cUser.name || 'গ্রাহক';
  const addrEl = document.getElementById('profileAddress');
  if (addrEl) addrEl.textContent = `📍 ${_cUser.address || 'ঠিকানা নেই'}`;
  const contEl = document.getElementById('profileContact');
  if (contEl) contEl.textContent = `📱 ${_cUser.phone || 'ফোন নেই'} | ✉️ ${_cUser.email || ''}`;

  // Info Grid
  const infoName = document.getElementById('profileInfoName');
  if (infoName) infoName.textContent = _cUser.name;
  const infoAddr = document.getElementById('profileInfoAddress');
  if (infoAddr) infoAddr.textContent = _cUser.address || '—';
  const infoPhone = document.getElementById('profileInfoPhone');
  if (infoPhone) infoPhone.textContent = _cUser.phone || '—';
  const infoWA = document.getElementById('profileInfoWA');
  if (infoWA) infoWA.textContent = _cUser.phone || '—';
  const infoEmail = document.getElementById('profileInfoEmail');
  if (infoEmail) infoEmail.textContent = _cUser.email || '—';
}

function openEditProfileModal() {
  if (!_cUser) return;
  document.getElementById('editName').value = _cUser.name || '';
  document.getElementById('editPhone').value = _cUser.phone || '';
  document.getElementById('editAddress').value = _cUser.address || '';
  document.getElementById('editEmail').value = _cUser.email || '';
  openModal('editProfileModal');
}

function saveProfile() {
  const name = document.getElementById('editName').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  const address = document.getElementById('editAddress').value.trim();

  if (!name || !phone) {
    showToast('নাম এবং ফোন নম্বর প্রয়োজন', 'error');
    return;
  }

  // Update localStorage
  const customers = JSON.parse(localStorage.getItem('approvedCustomers') || '[]');
  const idx = customers.findIndex(c => c.email === _cUser.email);

  if (idx !== -1) {
    customers[idx].name = name;
    customers[idx].phone = phone;
    customers[idx].address = address;
    localStorage.setItem('approvedCustomers', JSON.stringify(customers));

    // Update current session
    _cUser.name = name;
    _cUser.phone = phone;
    _cUser.address = address;
    localStorage.setItem('currentCustomer', JSON.stringify(_cUser));

    // Refresh UI
    updateProfileUI();
    injectCustomerSession(_cUser);
    closeModal('editProfileModal');
    showToast('প্রোফাইল সফলভাবে আপডেট করা হয়েছে', 'success');
  }
}


/* ---- Dynamic Dashboard Functions ---- */
function renderDashboardData() {
  if (!_cUser) return;
  const userId = _cUser.customerId;
  if (!userId) {
    console.warn('No customerId found in session');
    return;
  }
  const allBookings = typeof getAllBookings === 'function' ? getAllBookings() : [];
  const customerBookings = allBookings.filter(b => b.customerId == userId);
  const wallet = typeof getUserWallet === 'function' ? getUserWallet(userId) : { balance: 0, transactions: [] };

  // Update Stats
  const activeCount = customerBookings.filter(b => ['pending', 'confirmed', 'active'].includes(b.status)).length;
  const completedCount = customerBookings.filter(b => b.status === 'completed').length;
  const totalSpent = customerBookings.reduce((sum, b) => sum + (b.price || 0), 0);

  const statActive = document.getElementById('statActiveBookings');
  const statCompleted = document.getElementById('statCompletedBookings');
  const statTotal = document.getElementById('statTotalPayments');

  if (statActive) statActive.textContent = activeCount.toLocaleString('bn-IN');
  if (statCompleted) statCompleted.textContent = completedCount.toLocaleString('bn-IN');
  if (statTotal) statTotal.textContent = `৳${totalSpent.toLocaleString('bn-IN')}`;

  renderRecentBookings(customerBookings);
  renderPaymentHistory(wallet.transactions);
  updateComplaintWorkers(customerBookings);
}

function renderRecentBookings(bookings) {
  const tbody = document.getElementById('recentBookingsTable');
  if (!tbody) return;

  const recent = bookings.slice(-5).reverse(); // Last 5
  tbody.innerHTML = recent.length ? recent.map(b => `
        <tr>
            <td><strong>${b.workerName}</strong></td>
            <td>${b.workerType}</td>
            <td>${b.plan}</td>
            <td>${new Date(b.startDate).toLocaleDateString('bn-IN')}</td>
            <td>৳${(b.price || 0).toLocaleString('bn-IN')}</td>
            <td>${statusBadge(b.status)}</td>
        </tr>
    `).join('') : '<tr><td colspan="6" style="text-align:center;padding:20px">কোনো সাম্প্রতিক বুকিং নেই</td></tr>';
}

function renderPaymentHistory(transactions) {
  const tbody = document.getElementById('paymentHistoryTable');
  if (!tbody) return;

  const reversed = [...transactions].reverse();
  tbody.innerHTML = reversed.length ? reversed.map(t => `
        <tr>
            <td>${new Date(t.date).toLocaleDateString('bn-IN')}</td>
            <td>—</td>
            <td>—</td>
            <td>৳${Math.abs(t.amount).toLocaleString('bn-IN')}</td>
            <td>${t.type === 'credit' ? 'Razorpay' : 'Wallet'}</td>
            <td><span class="badge badge-green">সফল</span></td>
        </tr>
    `).join('') : '<tr><td colspan="6" style="text-align:center;padding:20px">কোনো পেমেন্ট ইতিহাস নেই</td></tr>';
}

function updateComplaintWorkers(bookings) {
  const select = document.getElementById('complaintWorker');
  if (!select) return;

  const uniqueWorkers = [...new Set(bookings.map(b => b.workerName))];
  select.innerHTML = uniqueWorkers.length
    ? uniqueWorkers.map(name => `<option value="${name}">${name}</option>`).join('')
    : '<option value="">কর্মী নেই</option>';
}


/* ---- Wallet UI Handlers ---- */
function renderWalletUI() {
  if (!_cUser) return;
  const wallet = getUserWallet(_cUser.customerId || _cUser.id);
  const balanceStr = `৳${wallet.balance.toLocaleString('en-IN')}`;

  const badge = document.getElementById('walletBadge');
  if (badge) badge.textContent = `💳 ওয়ালেট: ${balanceStr}`;

  const stat = document.getElementById('statWalletBalance');
  if (stat) stat.textContent = balanceStr;
}

function openAddFundsModal() {
  openModal('addFundsModal');
}

function handleAddFunds() {
  const amount = parseInt(document.getElementById('addAmount').value);
  if (!amount || amount < 100) {
    showToast('⚠️ ন্যূনতম ১০০ টাকা যোগ করুন', 'error');
    return;
  }

  closeModal('addFundsModal');
  initRazorpayPayment(
    _cUser.customerId || _cUser.id,
    amount,
    _cUser.name,
    _cUser.email || 'customer@example.com',
    _cUser.phone || '9999999999'
  );
}

