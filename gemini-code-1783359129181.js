/**
 * Advanced Dynamic Matrix Palette Color Modeler Engine
 */
const ColorStudioEngine = {
    colorDatabase: {
        neon: [
            { name: "فوسفوري ساطع", hex: "#00FF66" },
            { name: "أزرق سيان غلو", hex: "#00D4FF" },
            { name: "فوشيا نيون", hex: "#FF007F" },
            { name: "بنفسجي كهربائي", hex: "#9900FF" },
            { name: "أصفر ليموني ناصع", hex: "#CCFF00" }
        ],
        dark: [
            { name: "ميدنايت بلو", hex: "#0A0A0F" },
            { name: "أسود رمادي بريميوم", hex: "#12121A" },
            { name: "أردوازي داكن", hex: "#1E1E2F" },
            { name: "رمادي معدني خشن", hex: "#2A2A35" },
            { name: "رمادي معتم مخصص", hex: "#3D3D4D" }
        ],
        pastel: [
            { name: "خزامي ناعم", hex: "#E3D5CA" },
            { name: "وردي باستيل هادئ", hex: "#FFB5A7" },
            { name: "أزرق مائي ناعم", hex: "#98F5E1" },
            { name: "نعناعي بارد رقيق", hex: "#B9FBC0" },
            { name: "مشمشي كريمي دافئ", hex: "#FECD1A" }
        ]
    },

    palettesData: [
        { title: "الواجهة الإلكترونية النارية", colors: ["#FF0000", "#FF5500", "#FFAA00", "#111116"] },
        { title: "المنظومة السيبرانية المتكاملة", colors: ["#00D4FF", "#0066FF", "#9900FF", "#0A0A0F"] },
        { title: "الغابة الاستوائية الرقمية", colors: ["#00FF66", "#00AA44", "#333344", "#12121A"] },
        { title: "الذهبي الملكي الفاخر", colors: ["#D4AF37", "#AA8010", "#FFDF00", "#1A1A24"] }
    ],

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderQuickColors('all');
        this.renderPalettes();
        this.updateColorOutputs(this.pickerInput.value);
    },

    cacheDOM() {
        this.pickerInput = document.getElementById('color-picker-input');
        this.hexInput = document.getElementById('hex-string-input');
        this.applyHexBtn = document.getElementById('btn-apply-hex');
        this.mainPreview = document.getElementById('main-preview');
        this.fmtHex = document.getElementById('fmt-hex');
        this.fmtRgb = document.getElementById('fmt-rgb');
        this.fmtHsl = document.getElementById('fmt-hsl');
        this.catTabs = document.querySelectorAll('#palette-categories .category-tab');
        this.colorsGrid = document.getElementById('quick-colors-grid');
        this.palettesContainer = document.getElementById('palettes-container');
        this.harmonyTabs = document.querySelectorAll('#harmony-modes .harmony-tab');
        this.harmonyOutput = document.getElementById('harmony-colors-output');
        this.gradC1 = document.getElementById('grad-c1');
        this.gradC2 = document.getElementById('grad-c2');
        this.gradPreview = document.getElementById('grad-preview-box');
        this.fmtGradCode = document.getElementById('fmt-gradient-code');
        this.loader = document.getElementById('page-loader');
    },

    bindEvents() {
        // Universal Native Live Input Tracker
        if(this.pickerInput) {
            this.pickerInput.addEventListener('input', (e) => this.updateColorOutputs(e.target.value));
        }
        if(this.applyHexBtn) {
            this.applyHexBtn.addEventListener('click', () => this.updateColorOutputs(this.hexInput.value));
        }

        // Quick Pick Category Tab Filter
        this.catTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.catTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderQuickColors(tab.getAttribute('data-cat'));
            });
        });

        // Harmony Modes Matrix Switcher
        this.harmonyTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.harmonyTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.updateHarmonySection(this.pickerInput.value);
            });
        });

        // Gradient Linear Controller Matrix
        if(this.gradC1 && this.gradC2) {
            const updateGrad = () => {
                const c1 = this.gradC1.value;
                const c2 = this.gradC2.value;
                const css = `linear-gradient(135deg, ${c1}, ${c2})`;
                this.gradPreview.style.background = css;
                this.fmtGradCode.textContent = css;
            };
            this.gradC1.addEventListener('input', updateGrad);
            this.gradC2.addEventListener('input', updateGrad);
        }

        // Standard Dynamic Event Delegated Clipboard Extractor
        document.body.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('.btn-copy');
            if (copyBtn) {
                const targetId = copyBtn.getAttribute('data-clipboard');
                const text = document.getElementById(targetId).textContent;
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.classList.add('copied');
                    const icon = copyBtn.querySelector('i');
                    icon.className = 'fas fa-check';
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        icon.className = 'fas fa-copy';
                    }, 1200);
                });
            }
        });

        // Global Page Loader Frame Deactivator
        window.addEventListener('load', () => {
            if(this.loader) this.loader.classList.add('hidden');
        });
    },

    updateColorOutputs(hex) {
        if(!hex.startsWith('#')) hex = '#' + hex;
        // Basic regex parsing calibration protection guardrail
        if(!/^#[0-9A-F]{6}$/i.test(hex)) return;

        this.pickerInput.value = hex;
        this.hexInput.value = hex.toUpperCase();
        this.mainPreview.style.backgroundColor = hex;
        this.mainPreview.textContent = hex.toUpperCase();
        
        // Generate shadow box accent follow state
        this.mainPreview.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 50px ${hex}`;

        // Format conversions
        this.fmtHex.textContent = hex.toUpperCase();
        
        const rgb = this.hexToRgb(hex);
        this.fmtRgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        this.fmtHsl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        this.updateHarmonySection(hex);
    },

    renderQuickColors(category) {
        if(!this.colorsGrid) return;
        this.colorsGrid.innerHTML = '';
        
        let pool = [];
        if(category === 'all') {
            pool = [...this.colorDatabase.neon, ...this.colorDatabase.dark, ...this.colorDatabase.pastel];
        } else {
            pool = this.colorDatabase[category] || [];
        }

        pool.forEach(color => {
            const card = document.createElement('div');
            card.className = 'color-card';
            card.innerHTML = `
                <div class="color-swatch" style="background-color: ${color.hex}"></div>
                <div class="color-name">${color.name}</div>
                <div class="color-hex">${color.hex}</div>
            `;
            card.addEventListener('click', () => this.updateColorOutputs(color.hex));
            this.colorsGrid.appendChild(card);
        });
    },

    renderPalettes() {
        if(!this.palettesContainer) return;
        this.palettesContainer.innerHTML = '';

        this.palettesData.forEach(p => {
            const card = document.createElement('div');
            card.className = 'palette-card';
            card.innerHTML = `
                <div class="palette-title"><i class="fas fa-tags"></i> ${p.title}</div>
                <div class="palette-colors">
                    ${p.colors.map(c => `<div class="palette-color" style="background-color: ${c}" data-hex="${c}"></div>`).join('')}
                </div>
            `;
            
            card.querySelectorAll('.palette-color').forEach(swatch => {
                swatch.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.updateColorOutputs(swatch.getAttribute('data-hex'));
                });
            });

            this.palettesContainer.appendChild(card);
        });
    },

    updateHarmonySection(hex) {
        if(!this.harmonyOutput) return;
        this.harmonyOutput.innerHTML = '';

        const activeModeTab = document.querySelector('#harmony-modes .harmony-tab.active');
        const mode = activeModeTab ? activeModeTab.getAttribute('data-mode') : 'analogous';
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

        let colors = [];

        switch(mode) {
            case 'analogous':
                colors = [
                    this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
                    hex,
                    this.hslToHex((hsl.h - 15 + 360) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
                ];
                break;
            case 'monochromatic':
                colors = [
                    this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 90)),
                    this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 10, 80)),
                    hex,
                    this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 10, 20)),
                    this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 10))
                ];
                break;
            case 'triadic':
                colors = [
                    hex,
                    this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
                ];
                break;
            case 'complementary':
                colors = [
                    hex,
                    this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
                ];
                break;
        }

        colors.forEach(c => {
            const block = document.createElement('div');
            block.className = 'harmony-color';
            block.style.backgroundColor = c;
            block.textContent = c.toUpperCase();
            block.addEventListener('click', () => this.updateColorOutputs(c));
            this.harmonyOutput.appendChild(block);
        });
    },

    // Conversion Utilities
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 0, b: 0 };
    },

    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    },

    hslToHex(h, s, l) {
        s /= 100; l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

        const toHex = x => {
            const hex = Math.round((x + m) * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
};

window.addEventListener('DOMContentLoaded', () => ColorStudioEngine.init());