/* ===== KAJER LOK — Auth & Session Manager ===== */

/* ---- Session Keys ---- */
const SESSION_KEYS = {
    customer: 'currentCustomer',
    worker: 'currentWorker',
    admin: 'currentAdmin',
    bookings: 'klBookings',
    notifications: 'klNotifications'
};

/* ---- Get current logged-in user by type ---- */
function getSession(type) {
    const raw = localStorage.getItem(SESSION_KEYS[type]);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

/* ---- Save session ---- */
function setSession(type, data) {
    localStorage.setItem(SESSION_KEYS[type], JSON.stringify(data));
}

/* ---- Clear session ---- */
function clearSession(type) {
    localStorage.removeItem(SESSION_KEYS[type]);
}

/* ---- Auth Guard: call at top of each protected page ---- */
function requireAuth(type, loginPage) {
    const user = getSession(type);
    if (!user) {
        window.location.replace(loginPage || 'index.html');
        return null;
    }
    return user;
}

/* ---- Logout ---- */
function logout(type, loginPage) {
    clearSession(type);
    showToast('লগআউট সফল হয়েছে', 'info');
    setTimeout(() => window.location.replace(loginPage || 'index.html'), 800);
}

/* ===== BOOKING HELPERS ===== */
function getAllBookings() {
    return JSON.parse(localStorage.getItem(SESSION_KEYS.bookings) || '[]');
}
function saveAllBookings(list) {
    localStorage.setItem(SESSION_KEYS.bookings, JSON.stringify(list));
}
function createBooking(bookingData) {
    const list = getAllBookings();
    const booking = {
        ...bookingData,
        bookingId: 'BK-' + Date.now(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        rated: false
    };
    list.push(booking);
    saveAllBookings(list);
    addNotification(`নতুন বুকিং নিশ্চিত করা হয়েছে! আইডি: ${booking.bookingId}`, 'success');
    return booking;
}
function cancelBooking(bookingId) {
    const list = getAllBookings();
    const idx = list.findIndex(b => b.bookingId === bookingId);
    if (idx !== -1) { list[idx].status = 'cancelled'; saveAllBookings(list); return true; }
    return false;
}
function completeBooking(bookingId) {
    const list = getAllBookings();
    const idx = list.findIndex(b => b.bookingId === bookingId);
    if (idx !== -1) { list[idx].status = 'completed'; saveAllBookings(list); return true; }
    return false;
}
function requestReplacement(bookingId) {
    const list = getAllBookings();
    const idx = list.findIndex(b => b.bookingId === bookingId);
    if (idx !== -1) { list[idx].status = 'replacement_requested'; saveAllBookings(list); return true; }
    return false;
}

/* ===== RATING HELPERS ===== */
function getWorkerRating(workerId) {
    const bookings = getAllBookings().filter(b => b.workerId === workerId && b.rating);
    if (!bookings.length) return { avg: 0, count: 0 };
    const sum = bookings.reduce((a, b) => a + (b.rating || 0), 0);
    return { avg: (sum / bookings.length).toFixed(1), count: bookings.length };
}
function submitRating(bookingId, stars, comment) {
    const list = getAllBookings();
    const idx = list.findIndex(b => b.bookingId === bookingId);
    if (idx !== -1) {
        list[idx].rating = stars;
        list[idx].ratingComment = comment;
        list[idx].rated = true;
        saveAllBookings(list);
        return true;
    }
    return false;
}

/* ===== NOTIFICATION HELPERS ===== */
function addNotification(message, type = 'info') {
    const list = JSON.parse(localStorage.getItem(SESSION_KEYS.notifications) || '[]');
    list.unshift({ message, type, time: new Date().toISOString(), read: false });
    localStorage.setItem(SESSION_KEYS.notifications, JSON.stringify(list.slice(0, 50)));
}
function getNotifications() {
    return JSON.parse(localStorage.getItem(SESSION_KEYS.notifications) || '[]');
}
function markAllRead() {
    const list = getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(SESSION_KEYS.notifications, JSON.stringify(list));
}
function unreadCount() {
    return getNotifications().filter(n => !n.read).length;
}

/* ===== STAR RATING RENDERER ===== */
function renderStars(avg) {
    const full = Math.floor(avg);
    const half = avg - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/* ===== STATUS BADGE RENDERER ===== */
function statusBadge(status) {
    const map = {
        confirmed: ['badge-blue', '✅ নিশ্চিত'],
        active: ['badge-green', '🟢 সক্রিয়'],
        completed: ['badge-green', '✔️ সম্পন্ন'],
        cancelled: ['badge-red', '❌ বাতিল'],
        replacement_requested: ['badge-yellow', '🔄 প্রতিস্থাপন অনুরোধ'],
        pending: ['badge-yellow', '⏳ অপেক্ষমাণ']
    };
    const [cls, label] = map[status] || ['badge-blue', status];
    return `<span class="badge ${cls}">${label}</span>`;
}

/* ===== PRICE CALCULATOR ===== */
const SERVICE_RATES = {
    cooking: { daily: 300, monthly: 5500 },
    dishwash: { daily: 200, monthly: 3500 },
    laundry: { daily: 250, monthly: 4500 },
    mopping: { daily: 200, monthly: 3500 },
    shopping: { daily: 350, monthly: 6000 },
    cleaning: { daily: 280, monthly: 5000 },
    all: { daily: 900, monthly: 16000 }
};
function calculatePrice(services, plan = 'monthly') {
    if (!services || services.includes('all')) return SERVICE_RATES.all[plan];
    return services.reduce((sum, s) => sum + (SERVICE_RATES[s]?.[plan] || 0), 0);
}
/* ===== PASSWORD & SECURITY ===== */
function changePassword(type, oldPwd, newPwd) {
    const user = getSession(type);
    if (!user) return { success: false, msg: 'সেশন পাওয়া যায়নি' };

    // In our simplified system, we don't store encrypted passwords, just plain text in approved lists
    const key = type === 'customer' ? 'approvedCustomers' : (type === 'worker' ? 'approvedWorkers' : null);
    if (!key && type !== 'admin') return { success: false, msg: 'অবৈধ ইউজার টাইপ' };

    if (type === 'admin') {
        // Admin password is mock or in session
        if (oldPwd !== 'Admin@123') return { success: false, msg: 'বর্তমান পাসওয়ার্ড ভুল' };
        // For admin we'll just show success for demo
        return { success: true, msg: 'পাসওয়ার্ড পরিবর্তন সফল হয়েছে' };
    }

    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const idKey = type === 'customer' ? 'customerId' : 'workerId';
    const idx = list.findIndex(u => u[idKey] === user[idKey]);

    if (idx === -1) return { success: false, msg: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি' };
    if (list[idx].password !== oldPwd) return { success: false, msg: 'বর্তমান পাসওয়ার্ড ভুল' };

    list[idx].password = newPwd;
    localStorage.setItem(key, JSON.stringify(list));

    // Update session too
    user.password = newPwd;
    setSession(type, user);

    return { success: true, msg: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে' };
}

/* ===== RECEIPT GENERATOR ===== */
function printReceipt(bookingId) {
    const b = getAllBookings().find(x => x.bookingId === bookingId);
    if (!b) return;

    const win = window.open('', '_blank');
    win.document.write(`
        <html>
        <head>
            <title>বুকিং রসিদ - ${b.bookingId}</title>
            <style>
                body { font-family: 'Hind Siliguri', sans-serif; padding: 40px; color: #1e293b; }
                .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 12px; }
                .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: 800; color: #3b82f6; }
                .row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #f1f5f9; padding-bottom: 8px; }
                .label { font-weight: 600; color: #64748b; }
                .total { margin-top: 30px; font-size: 20px; font-weight: 800; color: #1e293b; border-top: 2px solid #e2e8f0; padding-top: 20px; }
                .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="receipt">
                <div class="header">
                    <div class="logo">কাজের লোক (Kajer Lok)</div>
                    <div style="font-size: 14px; margin-top: 4px;">বুকিং পেমেন্ট রসিদ</div>
                </div>
                <div class="row"><span class="label">বুকিং আইডি:</span><span>${b.bookingId}</span></div>
                <div class="row"><span class="label">তারিখ:</span><span>${new Date(b.createdAt).toLocaleDateString('bn-IN')}</span></div>
                <div class="row"><span class="label">গ্রাহকের নাম:</span><span>${b.customerName || '—'}</span></div>
                <div class="row"><span class="label">কর্মীর নাম:</span><span>${b.workerName || '—'}</span></div>
                <div class="row"><span class="label">সেবার ধরন:</span><span>${b.workerType || '—'}</span></div>
                <div class="row"><span class="label">প্ল্যান:</span><span>${b.plan || '—'}</span></div>
                <div class="total"><span class="label">মোট পরিশোধিত:</span><span>₹${(b.price || 0).toLocaleString('en-IN')}</span></div>
                <div class="footer">
                    <p>এটি একটি কম্পিউটার জেনারেটেড রসিদ। কোনো স্বাক্ষরের প্রয়োজন নেই।</p>
                    <p>ধন্যবাদ, কাজের লোক টিম</p>
                </div>
                <div style="text-align:center; margin-top:20px;" class="no-print">
                    <button onclick="window.print()" style="padding:10px 20px; background:#3b82f6; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">প্রিন্ট করুন</button>
                </div>
            </div>
        </body>
        </html>
    `);
    win.document.close();
}
