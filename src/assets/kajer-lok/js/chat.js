/* ===== KAJER LOK — Chat & Messaging Logic ===== */

/**
 * Send a message and store in localStorage
 */
function sendMessage(senderId, receiverId, text) {
    if (!text.trim()) return;

    const messages = JSON.parse(localStorage.getItem('klMessages') || '[]');
    const newMessage = {
        id: Date.now(),
        senderId: senderId,
        receiverId: receiverId,
        text: text,
        timestamp: new Date().toISOString(),
        read: false
    };

    messages.push(newMessage);
    localStorage.setItem('klMessages', JSON.stringify(messages));

    // Trigger notification for receiver
    addNotificationToUser(receiverId, `নতুন বার্তা: "${text.substring(0, 20)}..."`, 'info');

    return newMessage;
}

/**
 * Get chat history between two users
 */
function getChatHistory(userA, userB) {
    const messages = JSON.parse(localStorage.getItem('klMessages') || '[]');
    return messages.filter(m =>
        (m.senderId === userA && m.receiverId === userB) ||
        (m.senderId === userB && m.receiverId === userA)
    ).sort((a, b) => a.id - b.id);
}

/**
 * Add notification specifically for a user
 */
function addNotificationToUser(userId, message, type = 'info') {
    const notifs = JSON.parse(localStorage.getItem('klNotifications') || '[]');
    notifs.push({
        id: Date.now(),
        userId: userId,
        message: message,
        type: type,
        read: false
    });
    localStorage.setItem('klNotifications', JSON.stringify(notifs));
}

/**
 * Mark messages as read
 */
function markChatAsRead(senderId, receiverId) {
    const messages = JSON.parse(localStorage.getItem('klMessages') || '[]');
    messages.forEach(m => {
        if (m.senderId === senderId && m.receiverId === receiverId) {
            m.read = true;
        }
    });
    localStorage.setItem('klMessages', JSON.stringify(messages));
}

/**
 * Minimal Chat UI Renderer (Modal based)
 */
function openChatModal(otherUserId, otherUserName) {
    let currentUser = JSON.parse(localStorage.getItem('currentCustomer') || localStorage.getItem('currentWorker') || localStorage.getItem('currentAdmin') || 'null');
    if (!currentUser) {
        showToast('Chat error: No active session', 'error');
        return;
    }

    // Create modal if not exists
    let modal = document.getElementById('chatModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'chatModal';
        modal.className = 'modal-overlay';
        modal.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:10001;align-items:center;justify-content:center;';
        modal.innerHTML = `
            <div style="background:var(--card);border-radius:16px;width:92%;max-width:400px;border:1px solid var(--border);display:flex;flex-direction:column;height:500px;overflow:hidden">
                <div style="padding:16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:var(--primary-low)">
                    <strong id="chatTargetName" style="color:var(--primary-light)">চ্যাট</strong>
                    <button onclick="document.getElementById('chatModal').style.display='none'" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">✕</button>
                </div>
                <div id="chatMessages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:rgba(255,255,255,0.01)"></div>
                <div style="padding:12px;border-top:1px solid var(--border);display:flex;gap:8px">
                    <input type="text" id="chatInput" placeholder="বার্তা লিখুন..." style="flex:1;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:20px;padding:8px 16px;color:var(--text);outline:none">
                    <button id="sendBtn" style="background:var(--primary);color:white;border:none;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center">➤</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Handle Enter key
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') document.getElementById('sendBtn').click();
        });
    }

    document.getElementById('chatTargetName').textContent = otherUserName;
    modal.style.display = 'flex';

    const myId = currentUser.customerId || currentUser.workerId || currentUser.id;

    const refreshChat = () => {
        const history = getChatHistory(myId, otherUserId);
        const container = document.getElementById('chatMessages');
        container.innerHTML = history.map(m => `
            <div style="max-width:80%; padding:8px 12px; border-radius:12px; font-size:13px; line-height:1.4; ${m.senderId === myId ? 'align-self:flex-end; background:var(--primary); color:white; border-bottom-right-radius:2px;' : 'align-self:flex-start; background:rgba(255,255,255,0.05); color:var(--text); border:1px solid var(--border); border-bottom-left-radius:2px;'}">
                ${m.text}
                <div style="font-size:9px; margin-top:4px; opacity:0.7; text-align:right">${new Date(m.timestamp).toLocaleTimeString('bn-IN', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
        markChatAsRead(otherUserId, myId);
    };

    refreshChat();

    // Setup Send Button
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.onclick = () => {
        const input = document.getElementById('chatInput');
        const text = input.value;
        if (text.trim()) {
            sendMessage(myId, otherUserId, text);
            input.value = '';
            refreshChat();
        }
    };
}
