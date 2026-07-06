/**
 * Identity & Cryptographic State Authentication Provider
 */
const AuthProvider = {
    isLoggedIn: false,
    currentMode: 'login', // 'login' | 'register'
    userSession: null,

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.checkLocalPersistence();
    },

    cacheDOM() {
        this.overlay = document.getElementById('auth-overlay');
        this.form = document.getElementById('auth-form');
        this.switchBtn = document.getElementById('auth-switch-mode');
        this.subtitle = document.getElementById('auth-subtitle');
        this.footerText = document.getElementById('auth-footer-text');
        this.submitBtn = document.getElementById('btn-auth-submit');
        this.emailGroup = document.getElementById('email-group');
        this.genderGroup = document.getElementById('gender-group');
        this.remForgotContainer = document.getElementById('remember-forgot-container');
        this.passwordToggle = document.getElementById('password-toggle');
        this.passwordInput = document.getElementById('auth-password');
        this.usernameInput = document.getElementById('auth-username');
        this.errorMsg = document.getElementById('auth-error');
        this.errorText = document.getElementById('error-text');
        this.successMsg = document.getElementById('auth-success');
        this.navLoginBtn = document.getElementById('nav-login-btn');
        this.navUserInfo = document.getElementById('nav-user-info');
        this.navUserDisplay = document.getElementById('nav-username-display');
        this.navLogoutBtn = document.getElementById('nav-logout-btn');
    },

    bindEvents() {
        if(this.navLoginBtn) this.navLoginBtn.addEventListener('click', () => this.showModal());
        if(this.navLogoutBtn) this.navLogoutBtn.addEventListener('click', () => this.logout());
        if(this.switchBtn) this.switchBtn.addEventListener('click', () => this.toggleMode());
        if(this.passwordToggle) this.passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
        if(this.form) this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Hide modal when clicking outside form
        if(this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if(e.target === this.overlay) this.hideModal();
            });
        }
    },

    showModal() {
        this.overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    hideModal() {
        this.overlay.classList.add('hidden');
        document.body.style.overflow = '';
        this.resetFormState();
    },

    togglePasswordVisibility() {
        const icon = this.passwordToggle.querySelector('i');
        if (this.passwordInput.type === 'password') {
            this.passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            this.passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    },

    toggleMode() {
        this.errorMsg.classList.remove('show');
        this.successMsg.classList.remove('show');
        
        if (this.currentMode === 'login') {
            this.currentMode = 'register';
            this.subtitle.textContent = 'إنشاء حساب جديد بالمجتمع';
            this.submitBtn.textContent = 'تأكيد الحساب الجديد';
            this.footerText.innerHTML = 'لديك حساب بالفعل؟ <a id="auth-switch-mode">تسجيل الدخول</a>';
            this.emailGroup.classList.remove('hidden');
            this.genderGroup.classList.remove('hidden');
            this.remForgotContainer.classList.add('hidden');
        } else {
            this.currentMode = 'login';
            this.subtitle.textContent = 'تسجيل الدخول للمجتمع';
            this.submitBtn.textContent = 'تسجيل الدخول';
            this.footerText.innerHTML = 'ليس لديك حساب؟ <a id="auth-switch-mode">إنشاء حساب جديد</a>';
            this.emailGroup.classList.add('hidden');
            this.genderGroup.classList.add('hidden');
            this.remForgotContainer.classList.remove('hidden');
        }
        // Re-cache dynamic switch button element
        this.switchBtn = document.getElementById('auth-switch-mode');
        this.switchBtn.addEventListener('click', () => this.toggleMode());
    },

    handleSubmit(e) {
        e.preventDefault();
        this.errorMsg.classList.remove('show');
        this.successMsg.classList.remove('show');

        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        if (username.length < 3) {
            this.showError('اسم المستخدم يجب ألا يقل عن 3 أحرف');
            return;
        }
        if (password.length < 6) {
            this.showError('كلمة المرور ضعيفة جداً! الحد الأدنى 6 رموز');
            return;
        }

        // Simulating processing state
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'جاري المعالجة...';

        setTimeout(() => {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = this.currentMode === 'login' ? 'تسجيل الدخول' : 'تأكيد الحساب الجديد';
            
            this.successMsg.classList.add('show');
            this.userSession = { username };
            localStorage.setItem('younes_user', JSON.stringify(this.userSession));
            
            setTimeout(() => {
                this.isLoggedIn = true;
                this.updateUIState();
                this.hideModal();
            }, 1000);
        }, 1200);
    },

    showError(msg) {
        this.errorText.textContent = msg;
        this.errorMsg.classList.add('show');
    },

    updateUIState() {
        if (this.userSession) {
            if(this.navLoginBtn) this.navLoginBtn.style.display = 'none';
            if(this.navUserInfo) this.navUserInfo.classList.add('show');
            if(this.navUserDisplay) this.navUserDisplay.textContent = `مرحباً، ${this.userSession.username}`;
        } else {
            if(this.navLoginBtn) this.navLoginBtn.style.style.display = 'flex';
            if(this.navUserInfo) this.navUserInfo.classList.remove('show');
        }
    },

    logout() {
        localStorage.removeItem('younes_user');
        this.userSession = null;
        this.isLoggedIn = false;
        if(this.navLoginBtn) this.navLoginBtn.style.display = 'flex';
        if(this.navUserInfo) this.navUserInfo.classList.remove('show');
        window.location.reload();
    },

    checkLocalPersistence() {
        const localData = localStorage.getItem('younes_user');
        if (localData) {
            this.userSession = JSON.parse(localData);
            this.isLoggedIn = true;
            this.updateUIState();
        }
    },

    resetFormState() {
        this.form.reset();
        this.errorMsg.classList.remove('show');
        this.successMsg.classList.remove('show');
    }
};

window.addEventListener('DOMContentLoaded', () => AuthProvider.init());