/* ============================================================
   FITSYNC — LOGIN SCRIPT
   ============================================================ */

const loginForm     = document.getElementById('loginForm');
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn     = document.getElementById('btn-submit');

/* ── DEMO CREDENTIALS (reemplazar con backend real) ──────── */
const DEMO_USERS = [
    { email: 'demo@fitsync.com',  password: '123456',   name: 'Atleta FitSync' },
    { email: 'admin@fitsync.com', password: 'admin123', name: 'Administrador'  }
];

/* ── TOAST ───────────────────────────────────────────────── */
let toastTimer;
function showToast(message, type = 'error') {
    const toast   = document.getElementById('toast');
    const icon    = document.getElementById('toast-icon');
    const msgSpan = document.getElementById('toast-message');

    toast.className = '';
    icon.className  = type === 'success'
        ? 'fa-solid fa-circle-check'
        : 'fa-solid fa-circle-exclamation';

    msgSpan.textContent = message;
    toast.classList.add('show', type);

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
}

/* ── FIELD VALIDATION ────────────────────────────────────── */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setFieldState(fieldId, isError) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById('error-' + fieldId);
    if (isError) {
        input.classList.add('error');
        error.classList.add('show');
    } else {
        input.classList.remove('error');
        error.classList.remove('show');
    }
}

function clearErrors() {
    setFieldState('email', false);
    setFieldState('password', false);
}

/* Live validation on blur */
emailInput.addEventListener('blur', () => {
    if (emailInput.value && !isValidEmail(emailInput.value)) {
        setFieldState('email', true);
    } else {
        setFieldState('email', false);
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error') && isValidEmail(emailInput.value)) {
        setFieldState('email', false);
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('error') && passwordInput.value.length >= 6) {
        setFieldState('password', false);
    }
});

/* ── TOGGLE PASSWORD VISIBILITY ──────────────────────────── */
function togglePassword() {
    const eyeIcon = document.getElementById('eye-icon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className  = 'fa-solid fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className  = 'fa-solid fa-eye';
    }
}

/* ── SIMULATE ASYNC LOGIN ────────────────────────────────── */
function simulateAuth(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = DEMO_USERS.find(
                u => u.email === email.toLowerCase().trim() && u.password === password
            );
            if (user) resolve(user);
            else reject(new Error('Credenciales incorrectas. Prueba con demo@fitsync.com / 123456'));
        }, 1400);
    });
}

/* ── FORM SUBMIT ─────────────────────────────────────────── */
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const email    = emailInput.value.trim();
    const password = passwordInput.value;
    let   hasError = false;

    if (!email || !isValidEmail(email)) {
        setFieldState('email', true);
        hasError = true;
    }

    if (!password || password.length < 6) {
        setFieldState('password', true);
        hasError = true;
    }

    if (hasError) return;

    /* Loading state */
    submitBtn.classList.add('loading');

    try {
        const user = await simulateAuth(email, password);

        /* Remember me */
        if (document.getElementById('remember').checked) {
            localStorage.setItem('fs_remember_email', email);
        } else {
            localStorage.removeItem('fs_remember_email');
        }

        /* Store session */
        sessionStorage.setItem('fs_user', JSON.stringify({
            name:       user.name,
            email:      user.email,
            loggedInAt: new Date().toISOString()
        }));

        showToast(`¡Bienvenido, ${user.name}! Redirigiendo…`, 'success');

        /* Redirect after brief delay */
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1800);

    } catch (err) {
        submitBtn.classList.remove('loading');
        showToast(err.message, 'error');
    }
});

/* ── SOCIAL LOGIN (placeholder) ──────────────────────────── */
function socialLogin(provider) {
    showToast(`Inicio con ${provider} próximamente disponible.`, 'error');
}

/* ── FORGOT PASSWORD (placeholder) ───────────────────────── */
function forgotPassword(e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (email && isValidEmail(email)) {
        showToast(`Enlace de recuperación enviado a ${email}`, 'success');
    } else {
        emailInput.focus();
        showToast('Primero ingresa tu correo electrónico.', 'error');
    }
}

/* ── RESTORE REMEMBERED EMAIL ────────────────────────────── */
(function restoreEmail() {
    const saved = localStorage.getItem('fs_remember_email');
    if (saved) {
        emailInput.value = saved;
        document.getElementById('remember').checked = true;
    }
})();
