// ===== WALLET & PAYMENT JS =====

const BACKEND_URL = 'http://localhost:5000';

function getUserWallet(userId) {
    const wallets = JSON.parse(localStorage.getItem('klWallets') || '{}');
    if (!wallets[userId]) {
        wallets[userId] = {
            balance: 0,
            transactions: []
        };
        localStorage.setItem('klWallets', JSON.stringify(wallets));
    }
    return wallets[userId];
}

function updateWallet(userId, amount, type, description) {
    const wallets = JSON.parse(localStorage.getItem('klWallets') || '{}');
    const wallet = wallets[userId] || { balance: 0, transactions: [] };

    wallet.balance += amount;
    wallet.transactions.push({
        id: Date.now(),
        amount,
        type, // 'credit' or 'debit'
        description,
        date: new Date().toISOString()
    });

    wallets[userId] = wallet;
    localStorage.setItem('klWallets', JSON.stringify(wallets));

    // Also log globally for admin
    const globalLogs = JSON.parse(localStorage.getItem('klGlobalTransactions') || '[]');
    globalLogs.push({
        id: Date.now(),
        userId,
        amount,
        type,
        description,
        date: new Date().toISOString()
    });
    localStorage.setItem('klGlobalTransactions', JSON.stringify(globalLogs));

    return wallet;
}

async function initRazorpayPayment(userId, amount, userName, userEmail, userPhone) {
    try {
        // 1. Create order on backend
        const response = await fetch(`${BACKEND_URL}/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, receipt: `receipt_wallet_${userId}_${Date.now()}` })
        });
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to create order');
        }

        const order = data.order;

        // 1.5 Fetch Key ID
        const configResponse = await fetch(`${BACKEND_URL}/config`);
        const { key_id } = await configResponse.json();

        // 2. Open Razorpay Checkout
        const options = {
            key: key_id,
            amount: order.amount,
            currency: order.currency,
            name: "Kajer Lok",
            description: "Add Funds to Wallet",
            order_id: order.id,
            handler: async function (response) {
                // 3. Verify payment on backend
                const verifyResponse = await fetch(`${BACKEND_URL}/verify-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    })
                });
                const verifyData = await verifyResponse.json();

                if (verifyData.success) {
                    updateWallet(userId, amount, 'credit', 'Added funds via Razorpay');
                    showToast('✅ পেমেন্ট সফল! ওয়ালেটে টাকা যোগ করা হয়েছে।', 'success');
                    if (typeof renderWalletUI === 'function') renderWalletUI();
                } else {
                    showToast('❌ পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে।', 'error');
                }
            },
            prefill: {
                name: userName,
                email: userEmail,
                contact: userPhone
            },
            theme: { color: "#1A56DB" }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error('Payment Error:', error);
        showToast('❌ পেমেন্ট শুরু করতে সমস্যা হয়েছে।', 'error');
    }
}

function payWithWallet(userId, amount, bookingId, workerName) {
    const wallet = getUserWallet(userId);
    if (wallet.balance < amount) {
        return { success: false, message: 'ওয়ালেটে পর্যাপ্ত টাকা নেই' };
    }

    updateWallet(userId, -amount, 'debit', `Payment for booking ${bookingId} (Worker: ${workerName})`);
    return { success: true, message: 'পেমেন্ট সফল হয়েছে' };
}
