import os

filepath = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-admin.html'

with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
    html = f.read()

# 1. Add Sidebar Nav Item for Reviews
nav_item_reviews = """<button class="nav-item" data-page="pa-reviews">
        <span class="nav-icon"></span>
        <span class="nav-label" data-i18n="nav_reviews">রিভিউ ও রেটিং</span>
      </button>"""

html = html.replace('<button class="nav-item" data-page="pa-bookings">', 
                    nav_item_reviews + '\n      <button class="nav-item" data-page="pa-bookings">')

# 2. Add Reviews Page Content
reviews_page = """
    <!-- REVIEWS -->
    <div class="dash-page" id="pa-reviews">
      <div class="card">
        <div class="card-header"><span class="card-title" data-i18n="nav_reviews">রিভিউ ও রেটিং</span></div>
        <div class="table-wrap">
          <table id="reviewTable">
            <thead>
              <tr>
                <th data-i18n="table_date">তারিখ</th>
                <th data-i18n="table_customer">গ্রাহক</th>
                <th data-i18n="table_worker">কর্মী</th>
                <th data-i18n="table_rating">রেটিং</th>
                <th data-i18n="table_comment">মন্তব্য</th>
                <th data-i18n="table_action">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              <!-- Injected by JS -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
"""

html = html.replace('<!-- BOOKINGS -->', reviews_page + '\n    <!-- BOOKINGS -->')

# 3. Add renderReviews() to JS
render_reviews_js = """
function renderReviews() {
  const allBookings = getAllBookings();
  const reviews = allBookings.filter(b => b.rated);
  const tbody = document.querySelector('#reviewTable tbody');
  if (!tbody) return;
  
  if (reviews.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px;">কোনো রিভিউ পাওয়া যায়নি</td></tr>';
    return;
  }
  
  tbody.innerHTML = reviews.map(r => `
    <tr>
      <td>${r.startDate ? new Date(r.startDate).toLocaleDateString('bn-IN') : '—'}</td>
      <td>${r.customerName || '—'}</td>
      <td>${r.workerName || '—'}</td>
      <td style="color:var(--secondary)">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)} (${r.rating})</td>
      <td style="max-width:250px;white-space:normal;font-size:13px">${r.ratingComment || '—'}</td>
      <td><button class="btn btn-sm btn-danger" onclick="deleteReview('${r.bookingId}')">ডিলিট</button></td>
    </tr>
  `).join('');
}

function deleteReview(bookingId) {
  if (!confirm('আপনি কি নিশ্চিত যে আপনি এই রিভিউটি মুছে ফেলতে চান?')) return;
  const list = getAllBookings();
  const idx = list.findIndex(b => b.bookingId === bookingId);
  if (idx !== -1) {
    list[idx].rated = false;
    delete list[idx].rating;
    delete list[idx].ratingComment;
    saveAllBookings(list);
    showToast('রিভিউ মুছে ফেলা হয়েছে', 'info');
    renderReviews();
  }
}
"""

html = html.replace('function renderWorkers() {', render_reviews_js + '\nfunction renderWorkers() {')

# 4. Correct the DOMContentLoaded to call renderReviews()
html = html.replace('renderWorkers();', 'renderWorkers();\n  renderReviews();')

with open(filepath, 'w', encoding='utf8') as f:
    f.write(html)

print("Admin dashboard updated with Reviews section.")
