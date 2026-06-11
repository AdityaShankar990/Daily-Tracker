function timerStart() {
    if (S.today !== isoToday())
		return;
    timerSec = 0;
    timerOn = true;
    timerPsd = false;
    setBtn('Start', false);
    setBtn('Pause', true);
    setBtn('Stop', true);
    document.getElementById('clockLbl').textContent = 'FOCUSING';
    timerIv = setInterval(timerTick, 1000);
}

function timerPause() {
    clearInterval(timerIv);
    timerPsd = true;
    setBtn('Pause', false);
    setBtn('Resume', true);
    document.getElementById('clockLbl').textContent = 'PAUSED';
}

function timerResume() {
    timerPsd = false;
    setBtn('Resume', false);
    setBtn('Pause', true);
    document.getElementById('clockLbl').textContent = 'FOCUSING';
    timerIv = setInterval(timerTick, 1000);
}

async function timerStop() {
    clearInterval(timerIv);
    timerOn = timerPsd = false;
    setBtn('Start', true);
    setBtn('Pause', false);
    setBtn('Resume', false);
    setBtn('Stop', false);
    document.getElementById('clockLbl').textContent = 'SESSION SAVED';
    setTimeout(() => (document.getElementById('clockLbl').textContent = 'READY TO FOCUS'), 2000);
    S.timerSessions.push({
        durationMin: Math.round(timerSec / 60),
        sessionTime: new Date().toTimeString().slice(0, 5)
    });
    timerSec = 0;
    document.getElementById('clock').textContent = '00:00:00';
    renderSessions();
    scheduleSave();
}

function timerResetForDateChange() {
    if (!timerOn && !timerPsd)
		return;
    clearInterval(timerIv);
    timerOn = timerPsd = false;
    timerSec = 0;
    setBtn('Start', true);
    setBtn('Pause', false);
    setBtn('Resume', false);
    setBtn('Stop', false);
    document.getElementById('clock').textContent = '00:00:00';
    document.getElementById('clockLbl').textContent = 'READY TO FOCUS';
}

function timerTick() {
    timerSec++;
    const h = Math.floor(timerSec / 3600);
    const m = Math.floor((timerSec % 3600) / 60);
    const s = timerSec % 60;
    document.getElementById('clock').textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
    pipSync();
}

function setBtn(name, show) {
    const map = {
		Start: 'btnStart',
		Pause: 'btnPause',
		Resume: 'btnResume',
		Stop: 'btnStop'
	};
    document.getElementById(map[name]).style.display = show ? '' : 'none';
}

function pad(n) {
    return String(n).padStart(2, '0');
}

function renderSessions() {
    const el = document.getElementById('sessions');
	const badgeEl = document.getElementById('timerTotalBadge');
    const isReadOnly = S.today !== isoToday();
    const displaySessions = isReadOnly ? S._viewSessions || [] : S.timerSessions;
    const timerCardHeader = document.getElementById('timerCardHeader');
    if (timerCardHeader) {
        const roHtml = isReadOnly
            ? ` <span style="font-size:10px;
							font-weight:700;
							letter-spacing:.06em;
							text-transform:uppercase;
							color:var(--err);
							background:rgba(232,87,106,.12);
							border:1px solid rgba(232,87,106,.3);
							border-radius:4px;
							padding:2px 7px;
							font-family:var(--mono)">read-only</span>`
            : '';
        timerCardHeader.innerHTML = `TIMER${roHtml}`;
    }

    const clockEl = document.getElementById('clock');
    const clockLbl = document.getElementById('clockLbl');
    if (isReadOnly) {
        if (clockEl) {
            clockEl.textContent = '00:00:00';
            clockEl.style.opacity = '0.2';
            clockEl.style.cursor = '';
        }
        if (clockLbl) {
            clockLbl.textContent = timerOn ? 'TIMER RUNNING IN BACKGROUND' : 'READY TO FOCUS';
            clockLbl.style.opacity = '0.35';
        }
    } else {
        if (clockEl) {
            const h = Math.floor(timerSec / 3600);
            const m = Math.floor((timerSec % 3600) / 60);
            const s = timerSec % 60;
            clockEl.textContent = timerOn || timerPsd ? pad(h) + ':' + pad(m) + ':' + pad(s) : '00:00:00';
            clockEl.style.opacity = '';
            clockEl.style.cursor = '';
        }
        if (clockLbl) {
            clockLbl.textContent = timerOn && !timerPsd ? 'FOCUSING' : timerPsd ? 'PAUSED' : 'READY TO FOCUS';
            clockLbl.style.opacity = '';
        }
    }

    const btnStart = document.getElementById('btnStart');
    const btnPause = document.getElementById('btnPause');
    const btnResume = document.getElementById('btnResume');
    const btnStop = document.getElementById('btnStop');
    if (isReadOnly) {
        [btnStart, btnPause, btnResume, btnStop].forEach(b => {
            if (b)
				b.style.display = 'none';
        });
    } else {
        const isFoc = timerOn && !timerPsd;
        const isPsd = timerOn && timerPsd;
        if (btnStart) {
            btnStart.style.display = timerOn ? 'none' : '';
            btnStart.disabled = false;
            btnStart.style.opacity = '';
        }
        if (btnPause) {
            btnPause.style.display = isFoc ? '' : 'none';
            btnPause.disabled = false;
            btnPause.style.opacity = '';
        }
        if (btnResume) {
            btnResume.style.display = isPsd ? '' : 'none';
            btnResume.disabled = false;
            btnResume.style.opacity = '';
        }
        if (btnStop) {
            btnStop.style.display = timerOn ? '' : 'none';
            btnStop.disabled = false;
            btnStop.style.opacity = '';
        }
    }

    const pipBtn = document.getElementById('pipBtn');
    if (pipBtn)
		pipBtn.style.display = 'flex';

    const timerCardTitle = document.querySelector('#tab-timer .card-title:last-of-type');
    if (timerCardTitle)
		timerCardTitle.innerHTML = `Sessions Today <small id="timerTotalBadge"></small>`;

    if (!displaySessions.length) {
        el.innerHTML = '<div class="empty">No sessions yet.</div>';
        if (badgeEl)
			badgeEl.textContent = '';
        return;
    }

    const total = displaySessions.reduce((a, s) => a + s.durationMin, 0);
    const h = Math.floor(total / 60);
    const m = total % 60;
    const freshBadge = document.getElementById('timerTotalBadge');
    if (freshBadge)
		freshBadge.textContent = h ? `${h}h ${m}m total` : `${m}m total`;
    el.innerHTML = displaySessions.map((s, i) => `<div class="sess-chip" style="justify-content:space-between;">
														<div style="display:flex;align-items:center;gap:8px">
															<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
															${s.sessionTime} &middot; <b style="font-family:var(--sans);font-weight:800;font-size:13px">${s.durationMin}m</b>
														</div>
														<button onclick="${isReadOnly ? '' : ` deleteSession(${i})`}" style="margin-left:auto;
																															flex-shrink:0;
																															background:none;
																															border:none;
																															color:var(--muted);
																															cursor:${isReadOnly ? 'not-allowed' : 'pointer'};
																															font-size:18px;
																															padding:0 4px;
																															line-height:1;
																															opacity:${isReadOnly ? '0.3' : '1'}
																													" title="${isReadOnly ? 'Read-only' : 'Delete session'}" ${isReadOnly ? 'disabled' : ''} >&times;</button>
												</div>`).join('');
}

function deleteSession(idx) {
    if (S.today !== isoToday())
		return;
    showConfirm('Delete this session?', () => {
        S.timerSessions.splice(idx, 1);
        renderSessions();
        scheduleSave();
    });
}

let _pipOpen = false;
let _pipDocWin = null;
let _pipRaf = null;
let _pipTickIv = null;

function togglePip() {
    _pipOpen ? _closePip() : _openPip();
}

async function _openPip() {
    if ('documentPictureInPicture' in window) {
        try {
            await _openDocPip();
            return;
        } catch (e) {
            console.warn('Document PiP failed, using fallback:', e);
        }
    }
    _openFallback();
}

function _closePip() {
    if (_pipDocWin)
		_closeDocPip(false);
    else
		_closeFallback();
}

async function _openDocPip() {
    _pipDocWin = await window.documentPictureInPicture.requestWindow({
		width: 45,
		height: 25
	});
    const rs = getComputedStyle(document.documentElement);
    const textCol = rs.getPropertyValue('--text').trim() || '#e8e8f0';
    const mutedCol = rs.getPropertyValue('--muted').trim() || '#6868a0';
    const accentCol = rs.getPropertyValue('--accent').trim() || '#7c6af7';
    const errCol = '#e8576a';
    const borderCol = rs.getPropertyValue('--border').trim() || '#2a2a35';
    const monoFont = rs.getPropertyValue('--mono').trim() || 'ui-monospace, monospace';

    const doc = _pipDocWin.document;
    doc.head.innerHTML = `<style>
        *,
		*::before,
		*::after {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

        html,
		body {
            width: 100%;
			height: 100%;
            background: rgba(13,13,15,0.85);
            font-family: ${monoFont};
        }

        body {
            display: flex;
			flex-direction: column;
            align-items: flex-start;
			justify-content: center;
            padding: 18px 22px 16px;
        }

        #pc {
            font-size: 38px;
			font-weight: 700;
            letter-spacing: .04em;
			line-height: 1;
            color: ${mutedCol};
			transition: color .3s;
        }

        #pc.active {
			color: ${textCol};
		}

        #pl {
            font-size: 9px;
			font-weight: 600;
            letter-spacing: .15em;
			text-transform: uppercase;
            color: ${mutedCol};
			margin-top: 8px;
			transition: color .3s;
        }

        #pl.focusing {
			color: ${accentCol};
		}

        #pl.paused {
			color: ${errCol};
		}

        .pbrow {
			display: flex;
			gap: 6px;
			margin-top: 14px;
		}

        .pb {
            display: none;
			background: none;
            border: 1px solid ${borderCol};
			border-radius: 6px;
            padding: 5px 14px;
			font-size: 10px;
            font-family: ${monoFont};
			color: ${textCol};
            cursor: pointer;
			letter-spacing: .05em;
        }

        .pb:hover {
			border-color: ${accentCol};
			color: ${accentCol};
		}

        .pb.stop {
			border-color: rgba(232,87,106,.4);
			color: ${errCol};
		}

        .pb.stop:hover {
			border-color: ${errCol};
		}
    </style>`;

    doc.body.innerHTML = `
		<div id="pc">00:00:00</div>
		<div id="pl">READY TO FOCUS</div>
		<div class="pbrow">
			<button class="pb" id="pp">Pause</button>
			<button class="pb" id="pr">Resume</button>
            <button class="pb stop" id="ps">Stop &amp; Save</button>
        </div>`;

    doc.getElementById('pp').addEventListener('click', () => opener.timerPause());
    doc.getElementById('pr').addEventListener('click', () => opener.timerResume());
    doc.getElementById('ps').addEventListener('click', () => opener.timerStop());

    _pipOpen = true;
    _updatePipBtn(true);
    _pipTickIv = setInterval(_syncDocPip, 250);
    _syncDocPip();
    _pipDocWin.addEventListener('pagehide', () => _closeDocPip(true));
}

function _syncDocPip() {
    if (!_pipDocWin)
		return;
    const doc = _pipDocWin.document;
    const pc = doc.getElementById('pc');
    const pl = doc.getElementById('pl');
    const pp = doc.getElementById('pp');
    const pr = doc.getElementById('pr');
    const ps = doc.getElementById('ps');
    const isFoc = timerOn && !timerPsd;
    const isPsd = timerPsd;
    const h = Math.floor(timerSec / 3600);
    const m = Math.floor((timerSec % 3600) / 60);
    const s = timerSec % 60;
    if (pc) {
		pc.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
		pc.className = timerOn ? 'active' : '';
	}
    if (pl) {
		pl.textContent = isFoc ? 'FOCUSING' : isPsd ? 'PAUSED' : 'READY TO FOCUS';
		pl.className = isFoc ? 'focusing' : isPsd ? 'paused' : '';
	}
    if (pp)
		pp.style.display = isFoc ? '' : 'none';
    if (pr)
		pr.style.display = isPsd ? '' : 'none';
    if (ps)
		ps.style.display = timerOn ? '' : 'none';
}

function _closeDocPip(fromEvent) {
    clearInterval(_pipTickIv);
    _pipTickIv = null;
    if (!fromEvent && _pipDocWin) {
		try {
			_pipDocWin.close();
		} catch(e) {
		}
	}
    _pipDocWin = null;
    _pipOpen = false;
    _updatePipBtn(false);
}

function _openFallback() {
	_pipOpen = true;
    document.getElementById('pipWindow').style.display = 'flex';
    _updatePipBtn(true);
    _pipDrawLoop();
}

function _closeFallback() {
    _pipOpen = false;
    cancelAnimationFrame(_pipRaf);
    _pipRaf = null;
    document.getElementById('pipWindow').style.display = 'none';
    _updatePipBtn(false);
}

function _pipDrawLoop() {
    if (!_pipOpen || _pipDocWin)
		return;
    _pipRenderDom();
    _pipRaf = requestAnimationFrame(_pipDrawLoop);
}

function _pipRenderDom() {
    const clockEl = document.getElementById('pipClock');
    const lblEl = document.getElementById('pipLbl');
    if (!clockEl || !lblEl)
		return;
    const isFoc = timerOn && !timerPsd;
    const isPsd = timerPsd;
    const h = Math.floor(timerSec / 3600);
    const m = Math.floor((timerSec % 3600) / 60);
    const s = timerSec % 60;
    const timeStr = pad(h) + ':' + pad(m) + ':' + pad(s);
    const label = isFoc ? 'FOCUSING' : isPsd ? 'PAUSED' : 'READY TO FOCUS';
    if (clockEl.textContent !== timeStr)
		clockEl.textContent = timeStr;
    if (lblEl.textContent !== label)
		lblEl.textContent = label;
    clockEl.style.color = timerOn ? 'var(--text)' : 'var(--muted)';
    lblEl.style.color = isFoc ? 'var(--accent)' : isPsd ? 'var(--err)' : 'var(--muted)';
    const sh = (id, v) => {
		const el = document.getElementById(id);
		if (el)
			el.style.display = v ? '' : 'none';
	};
    sh('pipPauseBtn', isFoc);
    sh('pipResumeBtn', isPsd);
    sh('pipStopBtn', timerOn);
}

function _updatePipBtn(on) {
    const btn = document.getElementById('pipBtn');
    if (!btn)
		return;
    btn.style.color = on ? 'var(--accent)' : 'var(--muted)';
    btn.style.borderColor = on ? 'var(--accent)' : 'var(--border)';
}

function pipSync() {
    if (!_pipOpen)
		return;
    if (_pipDocWin)
		_syncDocPip();
    else
		_pipRenderDom();
}

let _pd = {
	dragging: false,
	ox: 0,
	oy: 0
};

function pipDragStart(e) {
    if (e.target.tagName === 'BUTTON')
		return;
    _pd.dragging = true;
    const r = document.getElementById('pipWindow').getBoundingClientRect();
    _pd.ox = e.clientX - r.left;
    _pd.oy = e.clientY - r.top;
    document.addEventListener('mousemove', pipDragMove);
    document.addEventListener('mouseup',   pipDragEnd);
    e.preventDefault();
}

function pipDragMove(e) {
    if (!_pd.dragging)
		return;
    const win = document.getElementById('pipWindow');
    win.style.left = (e.clientX - _pd.ox) + 'px';
    win.style.top = (e.clientY - _pd.oy) + 'px';
    win.style.right = win.style.bottom = 'auto';
}

function pipDragEnd() {
    _pd.dragging = false;
    document.removeEventListener('mousemove', pipDragMove);
    document.removeEventListener('mouseup', pipDragEnd);
}