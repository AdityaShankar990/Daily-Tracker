(function () {
    if (document.getElementById('__css_sites'))
		return;
    const s = document.createElement('style');
    s.id = '__css_sites';
    s.textContent = `
		.site-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(clamp(130px,28vw,160px), 1fr));
			gap: 10px;
			margin-bottom: 14px;
		}

		.site-card {
			background: var(--surf2);
			border: 1px solid var(--border);
			border-radius: 12px;
			padding: 16px 14px 14px;
			cursor: pointer;
			transition: border-color .16s,transform .16s;
			position: relative;
			overflow: hidden;
			display: flex;
			flex-direction: column;
		}

		.site-card:hover {
			border-color: var(--accent);
			transform: translateY(-2px);
		}

		.site-card.ro-ctrl {
			cursor: not-allowed;
			opacity: 0.4;
		}

		.site-card.ro-ctrl:hover {
			border-color: var(--border);
			transform: none;
			cursor: not-allowed;
		}

		.site-visited-badge {
			position: absolute;
			top: 9px;
			right: 9px;
			font-size: 9px;
			font-weight: 700;
			letter-spacing: .05em;
			text-transform: uppercase;
			color: var(--ok);
			font-family: var(--mono);
		}
		
		.site-card-top {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-bottom: 10px;
		}

		.site-initial {
			width: 34px;
			height: 34px;
			border-radius: 8px;
			background: var(--border);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			font-weight: 800;
			color: var(--text);
			font-family: var(--mono);
			text-transform: uppercase;
		}

		.site-globe {
			color: var(--muted);
			opacity: .5;
			margin-top: 8px;
		}

		.site-globe svg {
			width: 16px;
			height: 16px;
			stroke: currentColor;
		}

		.site-name {
			font-size: 14px;
			font-weight: 700;
			line-height: 1.3;
			margin-bottom: 2px;
		}

		.site-sched {
			font-size: 11px;
			color: var(--muted);
			font-family: var(--mono);
			margin-bottom: 6px;
		}

		.site-badge-wrap {
			margin-top: auto;
			padding-top: 8px;
			border-top: 1px solid var(--border);
		}

		.site-time-badge {
			display: inline-flex;
			align-items: center;
			font-size: 11px;
			font-family: var(--mono);
			color: var(--a3);
			background: rgba(64,201,168,.1);
			border: 1px solid rgba(64,201,168,.25);
			border-radius: 5px;
			padding: 2px 8px;
		}

		.site-not-visited {
			display: inline-flex;
			font-size: 11px;
			font-family: var(--mono);
			color: var(--muted);
			background: var(--bg);
			border: 1px solid var(--border);
			border-radius: 5px;
			padding: 2px 8px;
		}

		.sites-stats {
			margin-bottom: 14px;
		}`;
	document.head.appendChild(s);
})();

function fmtSiteTime(secs) {
    if (!secs)
		return null;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0)
		return `${h}h ${m}m`;
    if (m > 0)
		return `${m}m ${s}s`;
    return `${s}s`;
}

function renderSites() {
    const gridEl = document.getElementById('siteGrid');
    const statsEl = document.getElementById('sitesStats');
    const isReadOnly = S.today !== isoToday();
    const sitesCardTitle = document.getElementById('sitesCardTitle');
    if (sitesCardTitle) {
        const roHtml = isReadOnly
            ? ` <span style="font-size: 10px;
							font-weight: 700;
							letter-spacing: .06em;
							text-transform: uppercase;
							color: var(--err);
							background: rgba(232,87,106,.12);
							border: 1px solid rgba(232,87,106,.3);
							border-radius: 4px;
							padding: 2px 7px;
							font-family: var(--mono)">read-only</span>`
            : '';
        sitesCardTitle.innerHTML = `SITES${roHtml}`;
    }
    if (statsEl)
		statsEl.innerHTML = '';
    const siteList = getDay(S.today).sites || [];
    const isFuture = S.today > isoToday();
    const currentSiteIds = isFuture ? null : new Set(todaySites().map(s => s.id));
    if (!siteList.length) {
        gridEl.innerHTML = '<div class="empty" style="grid-column:1/-1">No sites added yet.</div>';
        return;
    }
    gridEl.innerHTML = siteList
        .map(s => {
            const visited = S.siteVisits.includes(s.id);
            const secs = S.siteTime?.[s.id] || 0;
            const timeLabel = fmtSiteTime(secs);
            const isDeleted = isReadOnly && !isFuture && currentSiteIds && !currentSiteIds.has(s.id);
            const isBlocked = isReadOnly || isDeleted;
            return `<div class="site-card${visited ? ' visited' : ''}${isBlocked ? ' ro-ctrl' : ''}" onclick="visitSite('${s.id}','${esc(s.url)}')" style="">
						${visited ? '<div class="site-visited-badge">VISITED</div>' : ''}
						<div class="site-card-top">
							<div class="site-initial">${siteInitial(s.name)}</div>
							<div class="site-globe"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
						</div>
						<div class="site-name" style="${isDeleted ? 'text-decoration:line-through;color:var(--muted);' : ''}">${esc(s.name)}</div>
						${s.scheduleTime ? `<div class="site-sched">${fmtAlarm(s.scheduleTime)}</div>` : '<div class="site-sched" style="height:16px"></div>'}
						<div class="site-badge-wrap">${timeLabel ? `<div class="site-time-badge">${timeLabel}</div>` : '<div class="site-not-visited">Not visited</div>'}</div>
					</div>`;
        }).join('');
}

async function visitSite(id, url) {
    if (S.today !== isoToday())
		return;
    if (!S.siteTime)
		S.siteTime = {};
    if (!S.siteVisits.includes(id))
		S.siteVisits.push(id);
    _openSiteTabs[id] = Date.now();
    renderSites();
    scheduleSave();
    window.open(url, '_blank', 'noopener');
    const pollId = setInterval(() => {
        if (!_openSiteTabs[id]) {
            clearInterval(pollId);
            return;
        }
        const elapsed = Math.floor((Date.now() - _openSiteTabs[id]) / 1000);
        if (elapsed > 0) {
            S.siteTime[id] = (S.siteTime[id] || 0) + elapsed;
            _openSiteTabs[id] = Date.now();
            renderSites();
            scheduleSave();
        }
    }, 30000);
    function onFocus() {
        clearInterval(pollId);
        window.removeEventListener('focus', onFocus);
        if (_openSiteTabs[id]) {
            const elapsed = Math.floor((Date.now() - _openSiteTabs[id]) / 1000);
            if (elapsed > 0)
				S.siteTime[id] = (S.siteTime[id] || 0) + elapsed;
            delete _openSiteTabs[id];
            renderSites();
            scheduleSave();
        }
    }
    window.addEventListener('focus', onFocus);
}

async function delSite(id) {
    if (S.today !== isoToday())
		return;
    showConfirm('Delete this site?', () => {
        const d = getTodayDay();
        d.sites = d.sites.filter(s => s.id !== id);
        S.siteVisits = S.siteVisits.filter(v => v !== id);
        if (S.siteTime)
			delete S.siteTime[id];
        renderSites();
        renderManageSites();
        scheduleSave();
    });
}

function editSite(id) {
    if (S.today !== isoToday())
		return;
    const s = todaySites().find(x => x.id === id);
    if (!s)
		return;
    editSiteId = id;
    document.getElementById('mSiteTitle').textContent = 'Edit Site';
    document.getElementById('sName').value = s.name;
    document.getElementById('sUrl').value = s.url;
    document.getElementById('sTime').value = s.scheduleTime || '';
    document.getElementById('mSite').classList.add('open');
}

function openSiteModal() {
    if (S.today !== isoToday())
		return;
    document.getElementById('mSite').classList.add('open');
}

function closeMSite() {
    document.getElementById('mSite').classList.remove('open');
    editSiteId = null;
    document.getElementById('mSiteTitle').textContent = 'Add Site';
    ['sName', 'sUrl', 'sTime'].forEach(id => (document.getElementById(id).value = ''));
}

function saveSite() {
    if (!editSiteId && S.today !== isoToday())
		return;
    const name = document.getElementById('sName').value.trim();
    let url = document.getElementById('sUrl').value.trim();
    if (!name || !url)
        return;
    if (!url.startsWith('http'))
		url = 'https://' + url;
    const sites = todaySites();
    const existingSite = editSiteId ? sites.find(s => s.id === editSiteId) : null;
    const site = { id: editSiteId || uid(), name, url, scheduleTime: document.getElementById('sTime').value };
    if (editSiteId) {
        const i = sites.findIndex(s => s.id === editSiteId);
        if (i >= 0)
			sites[i] = site;
    } else {
        sites.push(site);
    }
    closeMSite();
    renderSites();
    renderManageSites();
    scheduleSave();
}