function saveLocal() {
    syncIndicator('saving');
    try {
        commitTodayToDays();
        const today = getTodayDay();
        localStorage.setItem(
            LS_KEY,
            JSON.stringify({
                tasks: today.tasks || [],
                sites: today.sites || [],
                logItems: today.logItems || [],
                days: S.days,
                events: S.events || [],
                holidays: S.holidays || []
            })
        );
        syncIndicator('saved');
    } catch (e) {
        syncIndicator('err');
    }
}

function loadLocal() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw)
			return;
        const p = JSON.parse(raw);
        S.days = p.days || {};
        S.events = p.events || [];
        S.holidays = p.holidays || [];
        S.tasks = p.tasks || [];
        S.sites = p.sites || [];
        S.logItems = p.logItems || [];
    } catch (e) {
        console.warn('Load failed', e);
    }
}

let _saveTimer = null;
function scheduleSave() {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(saveLocal, 800);
}

function exportData() {
    commitTodayToDays();
    const today = getTodayDay();
    const blob = new Blob([
		JSON.stringify({
			tasks: today.tasks || [],
			sites: today.sites || [],
			logItems: today.logItems || [],
			days: S.days,
			events: S.events || [],
			holidays: S.holidays || []
		}, null, 2)],
        {
			type: 'application/json'
		}
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-tracker-${isoToday()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('importFile').click();
}

function handleImport(e) {
    const file = e.target.files[0];
    if (!file)
		return;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const p = JSON.parse(ev.target.result);
            if (!p.tasks && !p.days)
				throw new Error('Invalid format');
            showConfirm('Replace all current data with "' + file.name + '"?',
                () => {
                    S.days = p.days || {};
                    S.events = p.events || [];
                    S.holidays = p.holidays || [];
                    S.tasks = p.tasks || [];
                    S.sites = p.sites || [];
                    S.logItems = p.logItems || [];
                    getTodayDay();
                    loadTodayFromDays();
                    renderTasks();
                    renderManage();
                    renderManageSites();
                    renderSessions();
                    renderSites();
                    renderLog();
                    saveLocal();
                    const st = document.getElementById('gdStatus') || document.getElementById('gdStatusIn');
                    if (st) {
                        st.textContent = 'Imported from ' + file.name;
                        st.style.color = 'var(--muted)';
                    }
                }, 'Replace');
        } catch (err) {
            const st = document.getElementById('gdStatus') || document.getElementById('gdStatusIn');
            if (st) {
                st.textContent = 'Import failed: ' + err.message;
                st.style.color = 'var(--err)';
            }
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

window.addEventListener('beforeunload', () => {
    const now = Date.now();
    for (const [id, openedAt] of Object.entries(_openSiteTabs)) {
        const elapsed = Math.floor((now - openedAt) / 1000);
        if (elapsed > 0) {
            if (!S.siteTime)
				S.siteTime = {};
            S.siteTime[id] = (S.siteTime[id] || 0) + elapsed;
        }
    }
    _openSiteTabs = {};
    clearTimeout(_saveTimer);
    saveLocal();
});