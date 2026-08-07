// ---------------- REGISTER ----------------

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const user = {
            name,
            email,
            password
        };

        localStorage.setItem("user", JSON.stringify(user));

        alert("Registration Successful!");

        window.location.href = "index.html";
    });
}


// ---------------- LOGIN ----------------

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (!savedUser) {
            alert("No account found! Please register first.");
            return;
        }

        if (
            email === savedUser.email &&
            password === savedUser.password
        ) {

            // store previous lastLogin and set new one
            const prev = localStorage.getItem('lastLogin') || null;
            if (prev) localStorage.setItem('lastLoginPrev', prev);
            localStorage.setItem('lastLogin', new Date().toISOString());

            localStorage.setItem("loggedIn", "true");

            window.location.href = "dashboard.html";

        } else {

            alert("Invalid Email or Password!");

        }

    });
}


// ---------------- DASHBOARD ----------------

// Dashboard fancy load + display
const welcomeEl = document.getElementById('welcome');
const userInfoEl = document.getElementById('userInfo');

if (welcomeEl || userInfoEl) {
    const savedUser = JSON.parse(localStorage.getItem('user')) || { name: 'User', email: '' };

    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'index.html';
    } else {
        // show a small loader then display polished welcome
        welcomeEl.textContent = 'Loading…';

        // create subtle spinner
        const spinner = document.createElement('span');
        spinner.style.display = 'inline-block';
        spinner.style.width = '14px';
        spinner.style.height = '14px';
        spinner.style.border = '2px solid rgba(255,255,255,0.25)';
        spinner.style.borderTop = '2px solid rgba(255,255,255,0.9)';
        spinner.style.borderRadius = '50%';
        spinner.style.marginLeft = '8px';
        spinner.style.animation = 'spin 900ms linear infinite';
        welcomeEl.appendChild(spinner);

        // animation keyframes (injected once)
        if (!document.getElementById('spin-anim')) {
            const style = document.createElement('style');
            style.id = 'spin-anim';
            style.innerHTML = '@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}';
            document.head.appendChild(style);
        }

        setTimeout(() => {
            // remove spinner
            spinner.remove();

            // avatar (initials)
            const initials = (savedUser.name || '').split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase() || 'U';
            const avatar = document.createElement('div');
            avatar.textContent = initials;
            avatar.style.width = '64px';
            avatar.style.height = '64px';
            avatar.style.borderRadius = '12px';
            avatar.style.display = 'flex';
            avatar.style.alignItems = 'center';
            avatar.style.justifyContent = 'center';
            avatar.style.fontSize = '20px';
            avatar.style.fontWeight = '700';
            avatar.style.background = 'linear-gradient(135deg,#7c3aed,#06b6d4)';
            avatar.style.boxShadow = '0 8px 24px rgba(6,182,212,0.12)';
            avatar.style.marginBottom = '12px';

            // compose welcome
            welcomeEl.textContent = '';
            welcomeEl.appendChild(avatar);

            const nameLine = document.createElement('div');
            nameLine.textContent = `Welcome, ${savedUser.name || savedUser.email}`;
            nameLine.style.marginTop = '8px';
            nameLine.style.fontSize = '18px';
            nameLine.style.fontWeight = '600';
            welcomeEl.appendChild(nameLine);

            // last login
            const prev = localStorage.getItem('lastLoginPrev');
            const last = prev ? new Date(prev) : null;
            if (userInfoEl) {
                if (last) {
                    userInfoEl.textContent = `Signed in as ${savedUser.email} • Last visit: ${last.toLocaleString()}`;
                } else {
                    userInfoEl.textContent = `Signed in as ${savedUser.email}`;
                }
            }

            // slight fade-in
            if (welcomeEl.parentElement) {
                welcomeEl.parentElement.style.opacity = '0';
                welcomeEl.parentElement.style.transition = 'opacity .32s ease';
                requestAnimationFrame(() => { welcomeEl.parentElement.style.opacity = '1'; });
            }

        }, 800);
    }
}


// ---------------- LOGOUT ----------------

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("loggedIn");

        alert("Logged Out Successfully!");

        window.location.href = "index.html";

    });

}