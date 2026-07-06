/**
 * Tab Navigation Router and Responsive Drawer Controller
 */
const NavigationRouter = {
    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.menuToggle = document.getElementById('menu-toggle');
        this.navLinksContainer = document.getElementById('nav-links');
        this.scrollTopBtn = document.getElementById('scroll-top');
        this.brandLogo = document.getElementById('brand-logo');
        this.ctaButtons = document.querySelectorAll('.current-tab-btn');
    },

    bindEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('data-target');
                this.switchTab(target);
                
                // Close menu frame on responsive layouts
                if(this.navLinksContainer.classList.contains('show')) {
                    this.toggleMobileMenu();
                }
            });
        });

        if(this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        if(this.brandLogo) {
            this.brandLogo.addEventListener('click', () => this.switchTab('home-section'));
        }

        this.ctaButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                this.switchTab(target);
            });
        });

        window.addEventListener('scroll', () => this.handleScrollState());
        if(this.scrollTopBtn) {
            this.scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    },

    switchTab(targetSectionId) {
        if (!document.getElementById(targetSectionId)) return;

        // Deactivate everything
        this.sections.forEach(sec => sec.classList.remove('active'));
        this.navLinks.forEach(link => link.classList.remove('active'));

        // Activate targets
        const activeSection = document.getElementById(targetSectionId);
        activeSection.classList.add('active');
        
        const correspondingLink = document.querySelector(`.nav-link[data-target="${targetSectionId}"]`);
        if(correspondingLink) correspondingLink.classList.add('active');

        // Scroll back smoothly to frame top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    toggleMobileMenu() {
        this.navLinksContainer.classList.toggle('show');
        const icon = this.menuToggle.querySelector('i');
        if(this.navLinksContainer.classList.contains('show')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    },

    handleScrollState() {
        if (!this.scrollTopBtn) return;
        if (window.scrollY > 400) {
            this.scrollTopBtn.classList.add('show');
        } else {
            this.scrollTopBtn.classList.remove('show');
        }
    }
};

window.addEventListener('DOMContentLoaded', () => NavigationRouter.init());