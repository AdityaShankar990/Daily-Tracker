function isoToday() {
    return new Date().toISOString().slice(0, 10);
}

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

function esc(s) {
    return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function siteInitial(name) {
    return (name || '?').trim().charAt(0).toUpperCase();
}

function syncIndicator(state) {
    const el = document.getElementById('syncIndicator');
    if (state === 'saving') {
        el.className = 'saving';
        el.textContent = 'saving…';
    } else if (state === 'saved') {
        el.className = 'saved';
        el.textContent = 'saved';
        setTimeout(() => {
            el.textContent = 'idle';
            el.className = '';
        }, 2000);
    } else if (state === 'err') {
        el.className = 'err';
        el.textContent = 'error';
    } else {
        el.textContent = 'idle';
        el.className = '';
    }
}

function fmtDate(d) {
    return new Date(d + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
}

function fmtDateShort(d) {
    const [y, m, day] = d.split('-');
    return `${day}-${m}-${y}`;
}

function switchTab(id, el) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('tab-' + id).classList.add('active');
    if (id === 'timer') {
        const clockEl = document.getElementById('clock');
        if (clockEl && typeof timerSec !== 'undefined' && typeof timerOn !== 'undefined') {
            const isToday = typeof S !== 'undefined' && S.today === isoToday();
            if (isToday && (timerOn || timerPsd)) {
                const h = Math.floor(timerSec / 3600);
                const m = Math.floor((timerSec % 3600) / 60);
                const s = timerSec % 60;
                clockEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
                clockEl.style.opacity = '';
            } else if (isToday) {
                clockEl.textContent = '00:00:00';
                clockEl.style.opacity = '';
            } else {
                clockEl.textContent = '00:00:00';
                clockEl.style.opacity = '0.2';
            }
        }
    }
    if (id === 'tasks')
		renderTasks();
    if (id === 'timer')
		renderSessions();
    if (id === 'sites')
		renderSites();
    if (id === 'weekly') {
        loadWeekly();
        renderLog();
    }
    if (id === 'manage') {
        renderManage();
        renderManageSites();
    }
}