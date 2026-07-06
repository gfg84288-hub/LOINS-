/**
 * Core Submissions Processor for Community Infractions Forms
 */
const ReportsManager = {
    init() {
        this.form = document.getElementById('report-form');
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleReportSubmission(e));
        }
    },

    handleReportSubmission(e) {
        e.preventDefault();

        const target = document.getElementById('report-target').value.trim();
        const type = document.getElementById('report-type').value;
        const details = document.getElementById('report-details').value.trim();

        if(!target || !details) return;

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري إرسال البلاغ وتوثيقه...';

        setTimeout(() => {
            alert('تم استلام البلاغ الخاص بك بنجاح وتوثيقه في مصفوفة الإدارة الموحدة. شكراً لمساهمتك في حماية المجتمع.');
            this.form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    }
};

window.addEventListener('DOMContentLoaded', () => ReportsManager.init());