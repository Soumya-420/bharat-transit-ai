import os
import re

filepath = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-worker.html'

with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
    content = f.read()

# 1. Fix the injectWorkerSession stars and currency
content = content.replace("'?'.repeat(Math.round(parseFloat(rdata.avg) || 0)) + '?'.repeat(5 - Math.round(parseFloat(rdata.avg) || 0))", 
                        "'★'.repeat(Math.round(parseFloat(rdata.avg) || 0)) + '☆'.repeat(5 - Math.round(parseFloat(rdata.avg) || 0))")

# 2. Fix the currency symbol in stats
content = content.replace("'?' + earning.toLocaleString('en-IN')", "'₹' + earning.toLocaleString('en-IN')")
content = content.replace("'?' + pending.toLocaleString('en-IN')", "'₹' + pending.toLocaleString('en-IN')")
content = content.replace("'?' + myEarn.toLocaleString('en-IN')", "'₹' + myEarn.toLocaleString('en-IN')")

# 3. Add action buttons to active jobs table
new_active_jobs_row = """
            <tr>
              <td><strong>${b.customerName || ''}</strong></td>
              <td>${b.plan || ''}</td>
              <td>${b.startDate ? new Date(b.startDate).toLocaleDateString('bn-IN') : ''}</td>
              <td>₹${(b.price || 0).toLocaleString('en-IN')}</td>
              <td>${statusBadge(b.status)}</td>
              <td>
                ${b.status === 'confirmed' ? `<button class="btn btn-sm btn-primary" onclick="updateJobStatus('${b.bookingId}', 'active')">কাজ শুরু করুন</button>` : ''}
                ${b.status === 'active' ? `<button class="btn btn-sm btn-success" style="background:var(--success);color:#fff" onclick="updateJobStatus('${b.bookingId}', 'completed')">সম্পন্ন করুন</button>` : ''}
              </td>
            </tr>"""

content = re.sub(r'activeEl\.innerHTML = activeJobs\.length \? activeJobs\.map\(b => `.*?`\)\.join\(\'\'\)', 
                 f'activeEl.innerHTML = activeJobs.length ? activeJobs.map(b => `{new_active_jobs_row}`).join(\'\')', 
                 content, flags=re.DOTALL)

# 4. Fix "No jobs" literals
content = content.replace("'<tr><td colspan=\"5\" style=\"text-align:center;color:var(--text-muted)\">???? ??????? ??? ???</td></tr>'", 
                        "'<tr><td colspan=\"6\" style=\"text-align:center;color:var(--text-muted);padding:20px;\">বর্তমানে কোনো সক্রিয় কাজ নেই</td></tr>'")
content = content.replace("'<tr><td colspan=\"7\" style=\"text-align:center;color:var(--text-muted)\">???? ????? ?????? ???</td></tr>'", 
                        "'<tr><td colspan=\"7\" style=\"text-align:center;color:var(--text-muted);padding:20px;\">কাজের কোনো ইতিহাস পাওয়া যায়নি</td></tr>'")
content = content.replace("'<div style=\"text-align:center;color:var(--text-muted);padding:20px\">???? ????????? ???</div>'", 
                        "'<div style=\"text-align:center;color:var(--text-muted);padding:20px\">কোনো বিজ্ঞপ্তি নেই</div>'")

# 5. Fix history table stars
content = content.replace("${b.rating ? '?'.repeat(b.rating) : ''}", "${b.rating ? '★'.repeat(b.rating) + '☆'.repeat(5-b.rating) : '—'}")

# 6. Add the updateJobStatus function
update_status_js = """
        function updateJobStatus(bookingId, newStatus) {
            const list = getAllBookings();
            const idx = list.findIndex(b => b.bookingId === bookingId);
            if (idx === -1) return;
            
            list[idx].status = newStatus;
            saveAllBookings(list);
            
            const msgs = {
                active: 'কাজ শুরু করা হয়েছে। শুভকামনা!',
                completed: 'অভিনন্দন! আপনি কাজটি সফলভাবে সম্পন্ন করেছেন।'
            };
            
            showToast(msgs[newStatus], 'success');
            addNotification(`বুকিং ${bookingId}: ${msgs[newStatus]}`);
            
            // Refresh UI
            loadWorkerStats(_wUser);
            loadWorkerJobs(_wUser);
        }
"""

if 'function updateJobStatus' not in content:
    content = content.replace('function renderWorkerNotifs() {', update_status_js + '\n        function renderWorkerNotifs() {')

with open(filepath, 'w', encoding='utf8') as f:
    f.write(content)

print("Worker dashboard updated successfully.")
