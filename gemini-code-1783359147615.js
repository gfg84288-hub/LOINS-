/**
 * Dynamic Legal Rulebook Data Processor & Matrix Tab Renderer
 */
const RulesEngine = {
    data: {
        general: [
            "يجب الالتزام بالاحترام المتبادل بين جميع أعضاء المجتمع دون استثناء.",
            "يمنع منعاً باتاً التطرق إلى المواضيع السياسية، الدينية أو العرقية.",
            "انتحال صفة الإدارة أو أي عضو آخر يعرض حسابك للحظر النهائي الفوري.",
            "يمنع نشر أو مشاركة أي محتوى إباحي، دموي أو مخالف للآداب العامة."
        ],
        chat: [
            "يمنع تكرار الرسائل (Spam) أو إرسال الروابط العشوائية والمخلفة بشكل مكثف.",
            "الكتابة بالحروف الكبيرة أو استخدام درجات ألوان مزعجة بشكل متتالي ومستمر ممنوع.",
            "احترم الخصوصية؛ يمنع نشر البيانات الشخصية أو المحادثات الخاصة بدون إذن مسبق.",
            "مشاركة روابط سيرفرات أخرى أو الترويج الخارجي غير المصرح به يعتبر مخالفة جسيمة."
        ],
        voice: [
            "يمنع تشغيل الأصوات المزعجة، الموسيقى الصاخبة أو تشغيل أجهزة تحويل الصوت.",
            "عدم الدخول والتنقل بين الغرف الصوتية بشكل متكرر ومزعج (Channel Hopping).",
            "تسجيل المحادثات الصوتية دون علم وعملية موافقة الأطراف المتواجدة يعرضك للمساءلة.",
            "الالتزام بالهدوء والموضوعية داخل غرف النقاش والمحاضرات العامة التابعة للمجتمع."
        ],
        games: [
            "يمنع استخدام أي نوع من البرامج المساعدة أو برامج الغش (Cheats / Hacks).",
            "استغلال الثغرات البرمجية (Glitches) داخل خوادمنا بدلاً من الإبلاغ عنها يعرضك للحظر.",
            "التخريب المتعمد على أعضاء فريقك (Griefing) يعرضك لعقوبات الحرمان المؤقت.",
            "الالتزام التام بالروح الرياضية والقرارات الصادرة من حكام البطولات الرسمية للمجتمع."
        ],
        commands: [
            "استخدم الأوامر البرمجية فقط في الغرف المخصصة لها (Bot Commands Room).",
            "محاولة إغراق البوتات بالأوامر المتتالية لتعطيل استجابتها يعرض حسابك للحظر التلقائي.",
            "جميع أوامر التنسيق اللوني يجب ألا تخالف الرؤية البصرية المريحة للأعضاء.",
            "عند مواجهة أي خلل برمني في معالجة الأوامر، تواصل فوراً مع مطوري السيرفر."
        ]
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderTab('general'); // Core standard fallback
    },

    cacheDOM() {
        this.tabs = document.querySelectorAll('.rule-tab');
        this.contentTarget = document.getElementById('rules-content-target');
        this.indicator = document.getElementById('rules-indicator');
    },

    bindEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.tabs.forEach(t => t.classList.remove('active-tab'));
                tab.classList.add('active-tab');
                
                const selectedTab = tab.getAttribute('data-tab');
                this.renderTab(selectedTab);
                this.updateTrackIndicator(tab);
            });
        });
        
        // Window responsive calibration dynamic listener
        window.addEventListener('resize', () => {
            const activeTabElement = document.querySelector('.rule-tab.active-tab');
            if(activeTabElement) this.updateTrackIndicator(activeTabElement);
        });
    },

    renderTab(tabName) {
        if (!this.contentTarget) return;

        let html = '';
        const rulesList = this.data[tabName];

        if (tabName === 'commands') {
            html = `
                <div class="rule-card">
                    <h3><i class="fas fa-terminal"></i> الدليل البرمجي للأوامر العامة</h3>
                    <div class="search-container">
                        <input type="text" class="search-input" id="cmd-search" placeholder="ابحث عن كود أمر برمي محدد...">
                        <i class="fas fa-search search-icon"></i>
                    </div>
                    <ul class="command-list" id="cmd-list-wrapper">
                        <li class="command-item"><div><strong>!help</strong> - عرض قائمة المساعدة والدعم الفني التلقائي</div><i class="fas fa-code"></i></li>
                        <li class="command-item"><div><strong>!rules</strong> - جلب كود رابط منظومة القوانين المحدثة مباشرة</div><i class="fas fa-code"></i></li>
                        <li class="command-item"><div><strong>!stats</strong> - استعراض الإحصائيات الفورية لملفك الشخصي</div><i class="fas fa-code"></i></li>
                        <li class="command-item"><div><strong>!report [name]</strong> - فتح تذكرة بلاغ إلكتروني سري ضد مخالف</div><i class="fas fa-code"></i></li>
                        <li class="command-item"><div><strong>!color [hex]</strong> - تعديل وتغيير لون هويتك داخل السيرفر</div><i class="fas fa-code"></i></li>
                    </ul>
                </div>
            `;
            this.contentTarget.innerHTML = html;
            this.attachSearchEngine();
        } else {
            const titleMap = {
                general: { title: "القوانين العامة للمجتمع", icon: "fa-globe" },
                chat: { title: "شروط وضوابط المحادثات النصية", icon: "fa-comments" },
                voice: { title: "إرشادات القنوات والاتصالات الصوتية", icon: "fa-microphone" },
                games: { title: "قواعد اللعب العادل والمنافسات", icon: "fa-gamepad" }
            };

            const current = titleMap[tabName];
            
            html = `
                <div class="rule-card">
                    <h3><i class="fas ${current.icon}"></i> ${current.title}</h3>
                    <ul>
                        ${rulesList.map(rule => `<li><i class="fas fa-circle-chevron-left"></i> <span>${rule}</span></li>`).join('')}
                    </ul>
                </div>
            `;
            this.contentTarget.innerHTML = html;
        }
    },

    updateTrackIndicator(element) {
        if (!this.indicator) return;
        const parent = element.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // Calculate exact absolute horizontal metrics offset orientation for RTL layout compatibility
        const offsetRight = parentRect.right - elementRect.right;
        this.indicator.style.right = `${offsetRight}px`;
        this.indicator.style.width = `${elementRect.width}px`;
    },

    attachSearchEngine() {
        const searchInput = document.getElementById('cmd-search');
        const items = document.querySelectorAll('.command-item');

        if (!searchInput) return;

        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase().trim();
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if(text.includes(filter)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
};

window.addEventListener('DOMContentLoaded', () => RulesEngine.init());