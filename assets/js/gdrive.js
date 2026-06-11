(() => {
    const GD_KEY = 'dt_gdrive_v1';
    const BACKUP_FILENAME = 'daily-tracker-backup.json';
	function gdGet() {
        try {
            return JSON.parse(localStorage.getItem(GD_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function gdSet(v) {
        localStorage.setItem(GD_KEY, JSON.stringify(v));
    }

    function gdStatus(msg, color) {
        const cfg = gdGet();
        const id = cfg.accessToken ? 'gdStatusIn' : 'gdStatus';
        const el = document.getElementById(id);
        if (!el)
			return;
        el.textContent = msg;
        el.style.color = color || 'var(--muted)';
    }

    function gdUpdateUI() {
        const cfg = gdGet();
        const out = document.getElementById('gdSignedOut');
        const inp = document.getElementById('gdSignedIn');
        if (!out || !inp)
			return;
        const hasToken = !!cfg.accessToken;
        out.style.display = hasToken ? 'none' : 'block';
        inp.style.display = hasToken ? 'block' : 'none';
        if (hasToken) {
            const lbl = document.getElementById('gdUserLabel');
            if (lbl)
				lbl.textContent = cfg.email ? cfg.email : 'Connected to Google Drive';
            const ls = document.getElementById('gdLastSync');
            if (ls)
				ls.textContent = cfg.lastSync ? 'Last sync: ' + cfg.lastSync : 'Never synced';
            const st = document.getElementById('gdStatus');
            if (st)
				st.textContent = '';
        } else {
            const st = document.getElementById('gdStatusIn');
            if (st)
				st.textContent = '';
        }
    }

    window.gdConnect = async function () {
        const el = document.getElementById('gdAccessToken');
        const token = el ? el.value.trim() : '';
        if (!token) {
            gdStatus('Paste an access token first.', 'var(--err)');
            return;
        }
        gdStatus('Verifying token…');
        try {
            const r = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=1&fields=files(id)', { headers: { Authorization: 'Bearer ' + token } });
            if (r.status === 401)
				throw new Error('Token rejected by Google (401).');
            if (!r.ok)
				throw new Error('Validation failed (status ' + r.status + ')');
            const cfg = gdGet();
            cfg.accessToken = token;
            gdSet(cfg);
            if (el)
				el.value = '';
            gdUpdateUI();
            gdStatus('Connected to Google Drive');
        } catch (e) {
            gdStatus('Error: ' + e.message, 'var(--err)');
        }
    };

    window.gdDisconnect = function () {
        showConfirm('Disconnect from Google Drive?',
            () => {
                const cfg = gdGet();
                delete cfg.accessToken;
                delete cfg.email;
                delete cfg.fileId;
                gdSet(cfg);
                gdUpdateUI();
                gdStatus('');
            },
			'Disconnect'
        );
    };

    function gdToken() {
        return gdGet().accessToken || null;
    }

    async function gdFindFile(token) {
        const q = encodeURIComponent(`name='${BACKUP_FILENAME}' and trashed=false`);
        const r = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&spaces=drive&fields=files(id,name,modifiedTime)`, { headers: { Authorization: 'Bearer ' + token }});
        if (r.status === 401)
            throw new Error('Token expired.');
        const data = await r.json();
        return data.files && data.files.length > 0 ? data.files[0] : null;
    }

    window.gdPush = async function () {
        const token = gdToken();
        if (!token) {
            gdStatus('Not connected.', 'var(--err)');
            gdUpdateUI();
            return;
        }
        commitTodayToDays();
        const todayD = getTodayDay();
        const payload = JSON.stringify(
            {
                exportedAt: new Date().toISOString(),
                exportType: 'daily-tracker-backup',
                tasks: todayD.tasks || [],
                sites: todayD.sites || [],
                events: S.events || [],
                holidays: S.holidays || [],
                logItems: todayD.logItems || [],
                days: S.days
            },
            null,
            2
        );
        gdStatus('Saving to Google Drive…');
        try {
            const existing = await gdFindFile(token);
            const form = new FormData();
            form.append(
                'metadata',
                new Blob([JSON.stringify({ name: BACKUP_FILENAME, mimeType: 'application/json' })], {
                    type: 'application/json'
                })
            );
            form.append('file', new Blob([payload], { type: 'application/json' }));
            let res;
            if (existing) {
                res = await fetch(
                    `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`,
                    { method: 'PATCH', headers: { Authorization: 'Bearer ' + token }, body: form }
                );
            } else {
                res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + token },
                    body: form
                });
            }
            if (res.status === 401) {
                gdStatus('Token expired.', 'var(--err)');
                return;
            }
            if (!res.ok) {
                gdStatus('Upload failed: ' + (await res.text()), 'var(--err)');
                return;
            }
            const fd = await res.json();
            const cfg = gdGet();
            cfg.fileId = fd.id;
            cfg.lastSync = new Date().toLocaleString('en-IN');
            gdSet(cfg);
            gdUpdateUI();
            gdStatus('Saved to Google Drive');
        } catch (e) {
            gdStatus('Error: ' + e.message, 'var(--err)');
        }
    };

    window.gdPull = async function () {
        const token = gdToken();
        if (!token) {
            gdStatus('Not connected.', 'var(--err)');
            gdUpdateUI();
            return;
        }
        gdStatus('Fetching from Google Drive…');
        try {
            const file = await gdFindFile(token);
            if (!file) {
                gdStatus('No backup file found on Drive.', 'var(--warn)');
                return;
            }
            const r = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
                headers: { Authorization: 'Bearer ' + token }
            });
            if (r.status === 401) {
                gdStatus('Token expired.', 'var(--err)');
                return;
            }
            if (!r.ok) {
                gdStatus('Download failed: ' + r.statusText, 'var(--err)');
                return;
            }
            const p = await r.json();
            if (!p.days && !p.tasks) {
                gdStatus('Invalid backup format.', 'var(--err)');
                return;
            }
            showConfirm('Replace all local data with the Google Drive backup?', () => {
                S.days = p.days || S.days;
                S.events = p.events || S.events;
                S.holidays = p.holidays || S.holidays;
                S.tasks = p.tasks || [];
                S.sites = p.sites || [];
                S.logItems = p.logItems || [];
                getTodayDay();
                loadTodayFromDays();
                scheduleSave();
                renderTasks();
                renderManage();
                renderManageSites();
                renderSessions();
                renderSites();
                renderLog();
                gdStatus('Restored from Google Drive');
            });
        } catch (e) {
            gdStatus('Error: ' + e.message, 'var(--err)');
        }
    };
    window.gdUpdateUI = gdUpdateUI;
    gdUpdateUI();
})();