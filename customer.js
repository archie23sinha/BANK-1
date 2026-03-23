// Static Customer Banking System
// US001-5 complete with localStorage 'customers'

let customers = JSON.parse(localStorage.getItem('customers') || '[]');

// ===== US001 Registration (customer-register.html) =====
function registerCustomer() {
    const ssnId = document.getElementById('ssnId').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const address = document.getElementById('address').value.trim();
    const contact = document.getElementById('contact').value.trim();

    if (password !== confirmPassword) return alert('Passwords must match');
    if (password.length > 30 || lastName.length > 50 || address.length > 100 || contact.length !== 10 || !/^\d{10}$/.test(contact)) return alert('Field format error');
    if (customers.find(c => c.ssnId === ssnId || c.email === email)) return alert('SSN/Email exists');

    const customerId = 'CUST' + Date.now();
    const accountNumber = 'ACC' + Date.now().toString().slice(-4);
    const newCustomer = {
        ssnId, lastName, email, password, address, contact,
        customerId, accountNumber, balance: 0, transactions: []
    };
    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));

    // Success popup
    const popup = document.createElement('div');
    popup.innerHTML = `<div class="popup" style="display:flex;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9999;justify-content:center;align-items:center">
        <div class="popup-content">
            <h2 style="color:green;">Customer Registration successful.</h2>
            <p>Customer ID: ${customerId}<br>Name: ${lastName}<br>Email: ${email}</p>
            <button onclick="this.parentElement.parentElement.remove();window.location='customer-login.html'">Login</button>
        </div>
    </div>`;
    document.body.appendChild(popup);
    return false;
}

// ===== US002 Login (customer-login.html) =====
function validateLogin() {
    const id = document.getElementById('ssn').value.trim();
    const pass = document.getElementById('password').value;
    
    const customer = customers.find(c => (c.ssnId === id || c.email === id) && c.password === pass);
    if (!customer) return alert('Invalid credentials');

    localStorage.setItem('currentCustomer', JSON.stringify(customer));

    // Success popup
    const popup = document.createElement('div');
    popup.innerHTML = `<div class="popup" style="display:flex;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9999;justify-content:center;align-items:center">
        <div class="popup-content">
            <h2 style="color:green;">Customer Login successful.</h2>
            <button onclick="window.location.href='dashboard.html'">Dashboard</button>
        </div>
    </div>`;
    document.body.appendChild(popup);
    return false;
}

// ===== Dashboard US004/US005 =====
function initDashboard() {
    const customer = JSON.parse(localStorage.getItem('currentCustomer'));
    if (!customer) {
        document.getElementById('loginPrompt').style.display = 'block';
        return;
    }
    document.getElementById('loginPrompt').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'block';
    
    document.getElementById('accountDetails').textContent = `SSN: ${customer.ssnId} | Acct: ${customer.accountNumber}`;
    document.getElementById('currentBalance').textContent = `₹${Number(customer.balance).toLocaleString('en-IN')}`;
    
    const trans = customer.transactions.slice(0,5);
    document.getElementById('transactionsList').innerHTML = trans.length ? trans.map(t => `<div class="transaction-item">${new Date(t.date).toLocaleDateString()} ${t.description} <span style="float: right; color: ${t.amount < 0 ? 'red' : 'green'}">₹${Number(t.amount).toLocaleString('en-IN')}</span></div>`).join('') : '<div class="transaction-item">No transactions</div>';
    
    // Update global
    window.currentCustomer = customer;
}

function handleWithdraw() {
    const amount = Number(document.getElementById('withdrawAmount').value);
    const customer = JSON.parse(localStorage.getItem('currentCustomer'));
    
    if (!amount || amount < 1000 || customer.balance - amount < 500) {
        document.getElementById('errorPopup').querySelector('#errorMessage').textContent = 'Minimum balance should be 500';
        document.getElementById('errorPopup').style.display = 'flex';
        return;
    }
    
    customer.balance -= amount;
    customer.transactions.unshift({date: new Date().toISOString(), description: 'Withdraw', amount: -amount});
    localStorage.setItem('currentCustomer', JSON.stringify(customer));
    
    initDashboard();
    document.getElementById('successPopup').querySelector('#popupTitle').textContent = 'Withdraw Success';
    document.getElementById('successPopup').querySelector('#popupMessage').textContent = `New Balance: ₹${Number(customer.balance).toLocaleString('en-IN')}`;
    document.getElementById('successPopup').style.display = 'flex';
    document.getElementById('withdrawAmount').value = '';
}

function handleDeposit() {
    const amount = Number(document.getElementById('depositAmount').value);
    const customer = JSON.parse(localStorage.getItem('currentCustomer'));
    
    if (!amount || amount < 1) return alert('Valid deposit amount');
    
    customer.balance += amount;
    customer.transactions.unshift({date: new Date().toISOString(), description: 'Deposit', amount});
    localStorage.setItem('currentCustomer', JSON.stringify(customer));
    
    initDashboard();
    document.getElementById('successPopup').querySelector('#popupTitle').textContent = 'Deposit Success';
    document.getElementById('successPopup').querySelector('#popupMessage').textContent = `Updated Balance: ₹${Number(customer.balance).toLocaleString('en-IN')}`;
    document.getElementById('successPopup').style.display = 'flex';
    document.getElementById('depositAmount').value = '';
}

function logout() {
    localStorage.removeItem('currentCustomer');
    window.location.href = 'index.html';
}

// Auto load on dashboard
if (window.location.pathname.includes('dashboard')) initDashboard();

