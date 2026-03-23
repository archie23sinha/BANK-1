function validateLogin() {
    const identifier = document.getElementById("ssn").value.trim();
    const password = document.getElementById("password").value;

    if (password.length === 0) {
        alert("Password required");
        return false;
    }

    let customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customer = customers.find(c => (c.ssnId === identifier || c.email === identifier) && c.password === password);

    if (!customer) {
        alert("Invalid SSN ID/Email or Password");
        return false;
    }

    // Set session first
    localStorage.setItem('currentCustomer', JSON.stringify(customer));
    
    // Success popup
    const popupHtml = `
        <div class="popup" style="display:flex;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000;">
            <div class="popup-content">
                <h2 style="color: green;">Customer Login successful.</h2>
                <button onclick="window.location.href='dashboard.html'" style="margin-top:20px;">Go to Dashboard</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
    return false;
}

