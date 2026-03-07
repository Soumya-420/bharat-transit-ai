import os

filepath = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\js\customer-dashboard.js'

with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
    js_content = f.read()

# Replace the renderCustomerBookings function to purely use live data and remove hardcoded HTML initial state
new_render_bookings = """
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
  if (!confirm('আপনি কি নিশ্চিত যে আপনি এই বুকিংটি বাতিল করতে চান?')) return;
  if(typeof window.cancelBooking === 'function') {
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
  if (!confirm('আপনি কি এই কর্মীর পরিবর্তে অন্য কর্মী (প্রতিস্থাপন) চান?')) return;
  
  if(typeof window.requestReplacement === 'function') {
      window.requestReplacement(id);
  } else {
      // Fallback
      const list = JSON.parse(localStorage.getItem('klBookings') || '[]');
      const idx = list.findIndex(b => b.bookingId === id);
      if (idx !== -1) { list[idx].status = 'replacement_requested'; localStorage.setItem('klBookings', JSON.stringify(list)); }
  }

  addNotification('🔄 প্রতিস্থাপন অনুরোধ পাঠানো হয়েছে। অ্যাডমিন শীঘ্রই আপনার সাথে যোগাযোগ করবেন।');
  renderCustomerBookings(); 
  showToast('🔄 প্রতিস্থাপন অনুরোধ পাঠানো হয়েছে', 'info');
}
"""

start_idx = js_content.find("/* ---- Real Bookings List ---- */")
end_idx = js_content.find("function openRateModal(", start_idx)

if start_idx != -1 and end_idx != -1:
    js_content = js_content[:start_idx] + new_render_bookings + js_content[end_idx:]
    with open(filepath, 'w', encoding='utf8') as f:
        f.write(js_content)
    print("Successfully updated customer-dashboard.js")
else:
    print("Failed to find injection points for bookings render logic")

# Now strip the hardcoded HTML rows from dashboard-customer.html
html_path = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-customer.html'
with open(html_path, 'r', encoding='utf8', errors='ignore') as f:
    html = f.read()

# Replace the tbody contents with empty waiting for JS to inject
start_tbody = html.find('<table id="bookingsTable">')
if start_tbody != -1:
    tbody_start = html.find('<tbody>', start_tbody)
    tbody_end = html.find('</tbody>', tbody_start)
    if tbody_start != -1 and tbody_end != -1:
        html = html[:tbody_start] + '<tbody>\n                                        <tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-muted)">লোড হচ্ছে...</td></tr>\n                                    ' + html[tbody_end:]
        with open(html_path, 'w', encoding='utf8') as f:
            f.write(html)
        print("Successfully trimmed dummy HTML bookings rows")

