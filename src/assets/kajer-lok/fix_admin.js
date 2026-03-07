const fs = require('fs');
let html = fs.readFileSync('dashboard-admin.html', 'utf8');

// =====================================================================
// 1. Fix loadTransactions Bengali strings
// =====================================================================
html = html.replace(
  /toLocaleDateString\('bn-IN'\)/g,
  'toLocaleDateString()'
);
html = html.replace(
  /<span class="badge badge-green">সফল<\/span>/g,
  '<span class="badge badge-green">${getTranslation(\'status_success\')||\'Success\'}</span>'
);
html = html.replace(
  '\'<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--text-muted)">কোনো লেনদেন পাওয়া যায়নি</td></tr>\'',
  '`<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--text-muted)">${getTranslation(\'msg_no_transactions\')||\'No transactions found\'}</td></tr>`'
);

// =====================================================================
// 2. Fix viewDocument Bengali strings
// =====================================================================
html = html.replace(
  "showToast('ডকুমেন্ট পাওয়া যায়নি।', 'error')",
  "showToast(getTranslation('msg_doc_not_found')||'Document not found.', 'error')"
);
html = html.replace(
  "const docLabels = { aadhaar: 'আধার কার্ড', voter: 'ভোটার কার্ড', pan: 'প্যান কার্ড' };",
  "const docLabels = { aadhaar: getTranslation('doc_aadhaar')||'Aadhaar Card', voter: getTranslation('doc_voter')||'Voter Card', pan: getTranslation('doc_pan')||'PAN Card' };"
);
html = html.replace(
  "const label = docLabels[rec.docType] || rec.docType || 'ডকুমেন্ট';",
  "const label = docLabels[rec.docType] || rec.docType || (getTranslation('label_document')||'Document');"
);

// =====================================================================
// 3. Fix resolveDispute Bengali strings
// =====================================================================
html = html.replace(
  "showToast('অভিযোগটি সমাধান হিসেবে চিহ্নিত করা হয়েছে', 'success')",
  "showToast(getTranslation('msg_dispute_resolved')||'Dispute marked as resolved', 'success')"
);
html = html.replace(
  "addNotificationToUser(disputes[idx].userId, 'আপনার অভিযোগটি সমাধান করা হয়েছে।', 'success')",
  "addNotificationToUser(disputes[idx].userId, getTranslation('msg_your_dispute_resolved')||'Your dispute has been resolved.', 'success')"
);

// =====================================================================
// 4. Fix h3 in docViewModal (Bengali label)
// =====================================================================
html = html.replace(
  '<h3 id="docViewTitle" style="color:var(--text);margin-bottom:16px;padding-right:32px">পরিচয়পত্র</h3>',
  '<h3 id="docViewTitle" style="color:var(--text);margin-bottom:16px;padding-right:32px">' + (require('fs').readFileSync ? '${getTranslation(\'label_id_docs\')||\'Documents\'}' : 'Documents') + '</h3>'
);

// =====================================================================
// 5. Fix analytics.js Bengali date locale (patch inline equiv)
// =====================================================================
// Already done by #1 above for all toLocaleDateString('bn-IN') calls

// =====================================================================
// 6. Add real-data overview/bookings functions + init calls
//    Insert before the closing </script> of the main inline script
// =====================================================================
const newAdminFunctions = `
                /* ===== REAL DATA OVERVIEW + BOOKINGS ===== */
                function loadBookingsTable() {
                  const bookings = getAllBookings();
                  const tbody = document.querySelector('#pa-bookings tbody');
                  if (!tbody) return;
                  if (bookings.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px">' + (getTranslation('msg_no_data')||'No data') + '</td></tr>';
                    return;
                  }
                  tbody.innerHTML = bookings.slice(0,50).map(function(b) { return '<tr>' +
                    '<td>' + new Date(b.createdAt||b.date||Date.now()).toLocaleDateString() + '</td>' +
                    '<td>' + (b.customerName||'&mdash;') + '</td>' +
                    '<td>' + (b.workerName||'&mdash;') + '</td>' +
                    '<td>' + (b.serviceType||b.service||'&mdash;') + '</td>' +
                    '<td>' + (b.plan||'&mdash;') + '</td>' +
                    '<td>' + statusBadge(b.status) + '</td>' +
                  '</tr>'; }).join('');
                }

                function loadRecentBookingsOverview() {
                  var bookings = getAllBookings();
                  var tbody = document.querySelector('#recentBookingsTable tbody');
                  if (!tbody) return;
                  if (bookings.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:12px">' + (getTranslation('msg_no_data')||'No data') + '</td></tr>';
                    return;
                  }
                  tbody.innerHTML = bookings.slice(0,5).map(function(b) { return '<tr>' +
                    '<td>' + (b.customerName||'&mdash;') + '</td>' +
                    '<td>' + (b.workerName||'&mdash;') + '</td>' +
                    '<td>' + (b.plan||'&mdash;') + '</td>' +
                    '<td>' + statusBadge(b.status) + '</td>' +
                  '</tr>'; }).join('');
                }

                function loadRecentDisputesOverview() {
                  var disputes = JSON.parse(localStorage.getItem('klDisputes')||'[]');
                  var tbody = document.querySelector('#recentDisputesTable tbody');
                  if (!tbody) return;
                  if (disputes.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:12px">' + (getTranslation('msg_no_disputes')||'No disputes') + '</td></tr>';
                    return;
                  }
                  tbody.innerHTML = disputes.slice(0,5).map(function(d) { return '<tr>' +
                    '<td>' + (d.userName||'&mdash;') + '</td>' +
                    '<td>&mdash;</td>' +
                    '<td>' + (d.subject||'&mdash;') + '</td>' +
                    '<td><span class="badge ' + (d.status==='resolved'?'badge-green':'badge-yellow') + '">' +
                      (d.status==='resolved'?(getTranslation('status_resolved')||'Resolved'):(getTranslation('status_review')||'Review')) +
                    '</span></td>' +
                  '</tr>'; }).join('');
                }
`;

// Find the closing </script> of the main inline script block
// The main script block contains all admin functions
const scriptEnd = html.indexOf('</script>', html.indexOf('function saveSettings'));
if (scriptEnd !== -1) {
  html = html.slice(0, scriptEnd) + newAdminFunctions + html.slice(scriptEnd);
  console.log('Inserted new admin functions before </script> at position', scriptEnd);
} else {
  console.log('WARNING: Could not find insertion point for new functions!');
}

// =====================================================================
// 7. Wire up new functions in i18n.js DOMContentLoaded for admin page
// =====================================================================
// The actual init wiring will be done separately in i18n.js

fs.writeFileSync('dashboard-admin.html', html);
console.log('dashboard-admin.html updated. Size:', html.length);

// Check remaining Bengali chars (rough count)
const bn = (html.match(/[\u0980-\u09FF]/g) || []).length;
console.log('Remaining Bengali chars:', bn, '(data-i18n fallback text expect ~1500)');
