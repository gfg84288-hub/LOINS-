/**
 * UI Matrix Micro-Animations & Rendering Engine
 */
const AnimationsEngine = {
    init() {
        this.initRevealOnScroll();
        this.generateMatrixParticles();
    },

    initRevealOnScroll() {
        const revealElements = document.querySelectorAll('.reveal');
        const observerOptions = { root: null, threshold: 0.1, rootMargin: '0px' };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, observerOptions);

        revealElements.forEach(element => scrollObserver.observe(element));
    },

    generateMatrixParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        const particleCount = window.innerWidth < 768 ? 15 : 40;
        container.innerHTML = '';

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random distribution parameters
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 25}s`;
            particle.style.animationDuration = `${15 + Math.random() * 20}s`;
            
            const scale = 0.5 + Math.random() * 1.5;
            particle.style.transform = `scale(${scale})`;

            container.appendChild(particle);
        }
    }
};

window.addEventListener('DOMContentLoaded', () => AnimationsEngine.init());