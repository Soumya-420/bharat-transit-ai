/* ===== KAJER LOK — Worker Dashboard Logic ===== */

document.addEventListener('DOMContentLoaded', () => {
    initWorkerDashboard();
});

let _wUser = null;

function initWorkerDashboard() {
    // 1. Auth Guard
    _wUser = requireAuth('worker', 'login-worker.html');
    if (!_wUser) return;

    // 2. Initialize UI
    renderWorkerSidebar();
    renderWorkerProfile();
    renderWorkerStats();
    renderWorkerJobs();
    renderWorkerEarnings();
    renderWorkerSchedule();

    // 3. Setup Navigation
    setupNavigation();

    // 4. Initial Animations/Effects
    animateLimitBar();

    // 5. Apply Translations (i18n)
    if (typeof applyTranslations === 'function') applyTranslations();
}

function renderWorkerSidebar() {
    const nameEl = document.getElementById('wSideName');
    const roleEl = document.getElementById('wSideRole');
    const avatarEl = document.getElementById('wSideAvatar');

    if (nameEl) nameEl.textContent = _wUser.name;
    if (roleEl) roleEl.textContent = _wUser.workType || 'Worker';
    if (avatarEl && _wUser.name) {
        avatarEl.textContent = _wUser.name.charAt(0).toUpperCase();
        avatarEl.style.background = 'var(--primary)';
        avatarEl.style.color = '#fff';
        avatarEl.style.display = 'flex';
        avatarEl.style.alignItems = 'center';
        avatarEl.style.justifyContent = 'center';
        avatarEl.style.fontWeight = 'bold';
    }
}

function renderWorkerProfile() {
    // Top Bar Page Title
    const titleEl = document.getElementById('dashPageTitle');
    if (titleEl) titleEl.textContent = getTranslation('nav_overview');

    // Profile Section
    const pName = document.getElementById('profName');
    const pMetaTypeID = document.getElementById('profMetaTypeID');
    const pMetaPhone = document.getElementById('profMetaPhone');
    const pFullName = document.getElementById('profFullName');
    const pPhone = document.getElementById('profPhone');
    const pType = document.getElementById('profWorkType');
    const pAddr = document.getElementById('profAddress');
    const pExp = document.getElementById('profExp');
    const pId = document.getElementById('profIdType');
    const avatar = document.getElementById('profAvatar');
    const pStars = document.getElementById('profStars');
    const pTrustPct = document.getElementById('profTrustPct');
    const pTrustFill = document.getElementById('profTrustFill');

    if (pName) pName.textContent = _wUser.name;
    if (pMetaTypeID) pMetaTypeID.textContent = `${_wUser.workType} • ID: ${_wUser.workerId}`;
    if (pMetaPhone) pMetaPhone.textContent = _wUser.phone;
    if (pFullName) pFullName.textContent = _wUser.name;
    if (pPhone) pPhone.textContent = _wUser.phone;
    if (pType) pType.textContent = _wUser.workType;
    if (pAddr) pAddr.textContent = _wUser.address || '—';
    if (pExp) pExp.textContent = `${_wUser.exp} ${getTranslation('unit_years') || 'বছর'}`;
    if (pId) pId.textContent = _wUser.idType || 'Aadhaar';
    if (avatar && _wUser.name) avatar.textContent = _wUser.name.charAt(0).toUpperCase();

    // Rating & Trust
    const rdata = getWorkerRating(_wUser.workerId);
    if (pStars) pStars.innerHTML = renderStars(rdata.avg) + ` (${rdata.avg})`;

    const completedCount = getAllBookings().filter(b => b.workerId === _wUser.workerId && b.status === 'completed').length;
    const trust = Math.min(100, 50 + (completedCount * 3) + ((parseFloat(rdata.avg) || 0) * 8));
    if (pTrustPct) pTrustPct.textContent = trust + '%';
    if (pTrustFill) pTrustFill.style.width = trust + '%';
}

function renderWorkerStats() {
    const bookings = getAllBookings().filter(b => b.workerId === _wUser.workerId);

    const active = bookings.filter(b => b.status === 'confirmed' || b.status === 'active').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const totalEarned = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.price || 0), 0) * 0.9; // 90% after platform fee

    const sActive = document.getElementById('statActiveJobs');
    const sCompleted = document.getElementById('statCompletedJobs');
    const sMonthEarn = document.getElementById('statMonthEarn');
    const sTotalEarn = document.getElementById('statTotalEarn');

    if (sActive) sActive.textContent = active;
    if (sCompleted) sCompleted.textContent = completed;
    if (sMonthEarn) sMonthEarn.textContent = '₹' + Math.floor(totalEarned * 0.3).toLocaleString(); // Mock monthly
    if (sTotalEarn) sTotalEarn.textContent = '₹' + Math.floor(totalEarned).toLocaleString();
}

function renderWorkerJobs() {
    const list = getAllBookings().filter(b => b.workerId === _wUser.workerId);
    const pendingArea = document.getElementById('pendingJobsArea');
    const activeArea = document.getElementById('activeJobsArea');

    if (pendingArea) {
        const pending = list.filter(b => b.status === 'pending' || b.status === 'confirmed' && !b.accepted);
        if (pending.length === 0) {
            pendingArea.innerHTML = `<div class="empty-state"><p data-i18n="msg_no_pending_jobs">${getTranslation('msg_no_pending_jobs')}</p></div>`;
        } else {
            pendingArea.innerHTML = pending.map(job => `
                <div class="job-card-flat" style="margin-bottom:12px; border-left:4px solid var(--primary)">
                    <div style="flex:1">
                        <div style="font-weight:700; color:var(--text-dark)">${job.customerName || 'Customer'}</div>
                        <div style="font-size:13px; color:var(--text-muted)">${job.plan} • ${job.startDate || '—'}</div>
                    </div>
                    <div style="display:flex; gap:8px">
                        <button class="btn btn-sm btn-primary" onclick="acceptJob('${job.bookingId}')">${getTranslation('btn_confirm_pay')}</button>
                        <button class="btn btn-sm btn-outline" onclick="declineJob('${job.bookingId}')">✕</button>
                    </div>
                </div>
            `).join('');
        }
    }

    if (activeArea) {
        const active = list.filter(b => b.status === 'active' || b.status === 'confirmed');
        if (active.length === 0) {
            activeArea.innerHTML = `<div class="empty-state"><p data-i18n="msg_no_active_jobs">${getTranslation('msg_no_active_jobs')}</p></div>`;
        } else {
            activeArea.innerHTML = active.map(job => `
                <div class="job-card-flat">
                    <div style="flex:1">
                        <div style="font-weight:700">${job.customerName}</div>
                        <div style="font-size:13px; color:var(--text-muted)">${job.plan} • ${job.createdAt.split('T')[0]}</div>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-primary" onclick="completeJob('${job.bookingId}')">${getTranslation('btn_complete_work')}</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function renderWorkerEarnings() {
    const tbody = document.querySelector('#earningsTable tbody');
    if (!tbody) return;

    const list = getAllBookings().filter(b => b.workerId === _wUser.workerId && b.status === 'completed');
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center" data-i18n="msg_no_history">${getTranslation('msg_no_history')}</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(b => `
        <tr>
            <td>${b.createdAt.split('T')[0]}</td>
            <td>${b.customerName}</td>
            <td>₹${(b.price * 0.9).toLocaleString()}</td>
            <td><span class="badge badge-green">${getTranslation('badge_completed')}</span></td>
            <td><button class="btn btn-sm btn-outline" onclick="printReceipt('${b.bookingId}')">${getTranslation('btn_receipt')}</button></td>
        </tr>
    `).join('');
}

function renderWorkerSchedule() {
    const tbody = document.querySelector('#scheduleTable tbody');
    if (!tbody) return;

    const list = getAllBookings().filter(b => b.workerId === _wUser.workerId && (b.status === 'active' || b.status === 'confirmed'));
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center" data-i18n="msg_no_active_jobs">${getTranslation('msg_no_active_jobs')}</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(b => `
        <tr>
            <td>${b.startDate || b.createdAt.split('T')[0]}</td>
            <td>${b.customerName}</td>
            <td>${b.plan}</td>
            <td><span class="badge badge-blue">${getTranslation('badge_active')}</span></td>
        </tr>
    `).join('');
}

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.onclick = () => {
            const pageId = btn.getAttribute('data-page');
            if (!pageId) return;

            // Update UI Sidebar
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch Pages
            document.querySelectorAll('.dash-page').forEach(p => p.classList.remove('active'));
            const targetPage = document.getElementById(pageId);
            if (targetPage) targetPage.classList.add('active');

            // Update title
            const label = btn.querySelector('.nav-label');
            const titleEl = document.getElementById('dashPageTitle');
            if (titleEl && label) titleEl.textContent = label.textContent;
        };
    });
}

function animateLimitBar() {
    const fill = document.getElementById('limitFill');
    if (!fill) return;
    const completed = getAllBookings().filter(b => b.workerId === _wUser.workerId && b.status === 'completed').length;
    const pct = Math.min(100, (completed / 30) * 100);
    fill.style.width = '0%';
    setTimeout(() => {
        fill.style.width = pct + '%';
        if (pct >= 90) fill.style.background = 'var(--accent)';
    }, 300);

    const lt = document.getElementById('limitText');
    if (lt) lt.textContent = `${completed} / 30 ${getTranslation('unit_days')} ${getTranslation('badge_completed')}`;
}

// Global functions for buttons
window.acceptJob = (bookingId) => {
    const list = getAllBookings();
    const idx = list.findIndex(b => b.bookingId === bookingId);
    if (idx !== -1) {
        list[idx].status = 'active';
        list[idx].accepted = true;
        saveAllBookings(list);
        showToast('কাজ সফলভাবে গ্রহণ করা হয়েছে!', 'success');
        initWorkerDashboard();
    }
};

window.declineJob = (bookingId) => {
    // In a real app, this might notify admin. Here we just hide it.
    showToast('বুকিং অনুরোধ বাতিল করা হয়েছে', 'warning');
    initWorkerDashboard();
};

window.completeJob = (bookingId) => {
    if (confirm('আপনি কি এই কাজটি সম্পন্ন হিসেবে চিহ্নিত করতে চান?')) {
        const res = completeBooking(bookingId);
        if (res) {
            showToast('অভিনন্দন! কাজ সম্পন্ন হয়েছে।', 'success');
            initWorkerDashboard();
        }
    }
};

window.toggleWorkerNotifs = () => {
    const p = document.getElementById('wNotifPanel');
    if (p) {
        p.style.display = p.style.display === 'none' ? 'block' : 'none';
        if (p.style.display === 'block') {
            markAllRead();
            renderWorkerNotifs();
        }
    }
};

function renderWorkerNotifs() {
    const list = getNotifications();
    const container = document.getElementById('wNotifList');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px">কোনো নোটিফিকেশন নেই</div>';
        return;
    }

    container.innerHTML = list.map(n => `
        <div style="padding:12px;border-bottom:1px solid #f1f5f9;display:flex;gap:12px;align-items:flex-start">
            <div style="width:8px;height:8px;border-radius:50%;background:${n.type === 'success' ? 'var(--primary)' : 'var(--accent)'};margin-top:6px;flex-shrink:0"></div>
            <div>
                <div style="font-size:13px;color:var(--text-dark);line-height:1.4">${n.message}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${new Date(n.time).toLocaleTimeString()}</div>
            </div>
        </div>
    `).join('');
}

// Modal helpers (Harmonized with main.js)
window.openModal = (id) => {
    const m = document.getElementById(id);
    if (m) {
        m.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = (id) => {
    const m = document.getElementById(id);
    if (m) {
        m.classList.remove('open');
        document.body.style.overflow = '';
    }
};

window.doChangePwd = (type) => {
    const o = document.getElementById('oldPwd').value;
    const n = document.getElementById('newPwd').value;
    if (!o || !n) { showToast(getTranslation('toast_fill_all'), 'error'); return; }

    // changePassword is from auth.js
    const res = changePassword(type, o, n);
    if (res.success) {
        showToast(res.msg, 'success');
        closeModal('pwdModal');
    } else {
        showToast(res.msg, 'error');
    }
};
