/* ===== KAJER LOK — Analytics & Power Tools ===== */

/**
 * Get monthly revenue data from bookings
 * @returns {Object} { labels: [], data: [] }
 */
function getMonthlyRevenueData() {
    const bookings = getAllBookings().filter(b => ['confirmed', 'active', 'completed'].includes(b.status));
    const monthlyMap = {};

    // Last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toLocaleDateString('bn-IN', { month: 'short', year: 'numeric' });
        monthlyMap[key] = 0;
    }

    bookings.forEach(b => {
        const d = new Date(b.createdAt);
        const key = d.toLocaleDateString('bn-IN', { month: 'short', year: 'numeric' });
        if (monthlyMap[key] !== undefined) {
            monthlyMap[key] += (b.price || 0);
        }
    });

    return {
        labels: Object.keys(monthlyMap),
        data: Object.values(monthlyMap)
    };
}

/**
 * Get top workers by rating and booking count
 */
function getWorkerLeaderboard() {
    const workers = JSON.parse(localStorage.getItem('approvedWorkers') || '[]');
    const allBookings = getAllBookings();

    const stats = workers.map(w => {
        const ratingObj = getWorkerRating(w.workerId);
        const count = allBookings.filter(b => b.workerId === w.workerId).length;
        return {
            name: w.name,
            id: w.workerId,
            rating: parseFloat(ratingObj.avg),
            jobs: count,
            score: (parseFloat(ratingObj.avg) * 10) + count // Simple ranking score
        };
    });

    return stats.sort((a, b) => b.score - a.score).slice(0, 10);
}

/**
 * Service distribution analytics
 */
function getServiceDistribution() {
    const bookings = getAllBookings();
    const map = {};
    bookings.forEach(b => {
        const type = b.workType || 'অন্যান্য';
        map[type] = (map[type] || 0) + 1;
    });
    return map;
}

/**
 * Export JSON data to CSV and trigger download
 */
function exportToCSV(filename, data) {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => {
            const val = row[h] === null || row[h] === undefined ? '' : row[h];
            // Escape commas and quotes
            return `"${String(val).replace(/"/g, '""')}"`;
        }).join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Render a simple CSS mini-chart
 */
function renderMiniChart(containerId, dataObj) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const max = Math.max(...dataObj.data, 1);
    container.innerHTML = `
        <div style="display:flex; align-items:flex-end; gap:8px; height:120px; padding:10px 0; border-bottom:1px solid var(--border)">
            ${dataObj.data.map((v, i) => `
                <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px">
                    <div style="width:100%; max-width:24px; background:var(--primary); height:${(v / max) * 100}%; border-radius:4px 4px 0 0; transition: height 1s;" title="${dataObj.labels[i]}: ₹${v}"></div>
                    <span style="font-size:9px; color:var(--text-muted); writing-mode:vertical-lr">${dataObj.labels[i]}</span>
                </div>
            `).join('')}
        </div>
    `;
}
