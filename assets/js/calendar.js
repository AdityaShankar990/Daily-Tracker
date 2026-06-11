(function () {
    if (document.getElementById('__css_calendar'))
		return;
	const s = document.createElement('style');
    s.id = '__css_calendar';
    s.textContent = `
        .cal-backdrop {
            position: fixed;
            inset: 0;
            z-index: 39;
            background: transparent;
            display: none;
        }

        .cal-backdrop.open {
			display: block;
		}

        .cal-panel {
            position: absolute;
            width: clamp(290px, min(90vw, 350px), 350px);
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 20px 18px 18px;
            overflow-y: auto;
            max-height: 80vh;
            z-index: 40;
            opacity: 0;
            transform: translateY(-8px) scale(.98);
            pointer-events: none;
            transition: opacity .2s cubic-bezier(.4, 0, .2, 1),
						transform .2s cubic-bezier(.4, 0, .2, 1);
            box-shadow: 0 8px 40px rgba(0, 0, 0, .5);
        }

        .cal-panel.open {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }

        .cal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
        }

        .cal-month-title {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 15px;
            font-weight: 700;
            color: var(--text);
        }

        .cal-nav {
			display: flex; gap: 2px;
		}

        .cal-nav-btn {
            width: 28px;
            height: 28px;
            border: none;
            background: none;
            color: var(--muted);
            cursor: pointer;
            font-size: 17px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background .14s;
            line-height: 1;
        }

        .cal-nav-btn:hover {
			background: var(--surf2);
			color: var(--text);
		}

        .cal-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0;
        }

        .cal-dow {
            font-size: 11px;
            font-weight: 600;
            color: var(--muted);
            text-align: center;
            padding: 3px 0 6px;
            letter-spacing: .03em;
        }

        .cal-day {
            text-align: center;
            padding: 8px 1px;
            cursor: pointer;
            border-radius: 6px;
            transition: background .14s;
            position: relative;
            font-size: 13px;
            line-height: 1.3;
            height: 45px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
        }

        .cal-day:hover:not(.cal-today) {
			background: var(--surf2);
		}

        .cal-today {
            color: #fff;
            font-weight: 700;
            border-radius: 6px;
        }

        .cal-selected:not(.cal-today) {
            background:  var(--surf2);
            font-weight: 600;
        }

        .cal-other {
			color: var(--border);
			cursor: default;
		}

        .cal-event-ring {
            outline: 2px solid;
            outline-offset: -2px;
            border-radius: 6px;
        }

        .cal-day-dot {
            display: block;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            margin: 2px auto 0;
            flex-shrink:  0;
        }

        .dot-done {
			background: var(--ok);
		}

        .dot-partial {
			background: var(--a2);
		}

        .dot-left {
			background: var(--err);
		}

        .cal-legend {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border);
            align-items: center;
        }

        .cal-legend-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            color: var(--muted);
        }

        .leg-icon {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            background: transparent;
        }

        .leg-icon svg {
			width: 12px;
			height: 12px;
		}

        .upcoming-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .08em;
            color: var(--muted);
            margin: 14px 0 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .add-event-btn {
            font-size: 11px;
            color: var(--muted);
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: color .14s;
            letter-spacing: .02em;
        }

        .add-event-btn:hover {
			color: var(--text);
		}

        .event-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 9px 0;
            border-bottom: 1px solid var(--border);
        }

        .event-item:last-child {
			border-bottom: none;
		}

        .event-cal-icon {
            width: 30px;
            height: 30px;
            flex-shrink: 0;
            position: relative;
        }

        .event-cal-icon svg {
			width: 30px;
			height: 30px;
		}

        .event-name {
            font-size: 13px;
            font-weight: 600;
            line-height: 1.3;
        }

        .event-date {
            font-size: 11px;
            color: var(--muted);
            font-family: var(--mono);
            margin-top:  2px;
        }

        .no-events {
            text-align: center;
            padding: 24px 0 14px;
            color: var(--muted);
            font-size: 12px;
            line-height: 1.6;
        }

        .no-events-icon {
            width: 52px;
            height: 52px;
            display: block;
            margin: 0 auto 10px;
            stroke: var(--muted);
            opacity: 0.5;
        }

        .event-form {
			margin-top: 10px;
			display: none;
		}

        .event-form.open {
			display: block;
		}

        .timer-display {
            text-align: center;
            padding: clamp(24px, 5vw, 40px) 0 clamp(18px, 4vw, 28px);
        }

        .timer-clock {
            font-family: var(--sans);
            font-size: clamp(42px, 10vw, 72px);
            font-weight: 800;
            letter-spacing: -2px;
            line-height: 1;
            color: var(--text);
        }

        .timer-lbl {
            font-size: 11px;
            color: var(--muted);
            margin-top: 10px;
            letter-spacing: .15em;
            text-transform: uppercase;
            font-weight: 600;
        }

        .timer-ctl {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .sess-chip {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 4px;
            font-size: 12px;
            font-family: var(--mono);
            border-bottom: 1px solid var(--border);
        }

        .sess-chip:last-child {
			border-bottom: none;
		}

        .sess-chip svg {
            width: 14px;
            height: 14px;
            stroke: var(--accent);
        }
    `;
    document.head.appendChild(s);
})();

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function _findPrevDayWith(fromDate, field) {
    const base = new Date(fromDate + 'T12:00:00');
    for (let i = 1; i <= 730; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() - i);
        const dk = d.toISOString().slice(0, 10);
        if (S.days[dk] && S.days[dk][field] != null)
			return S.days[dk][field];
    }
    return null;
}

function getTodayDay() {
    const today = isoToday();
    if (!S.days[today]) {
        S.days[today] = {
            completions: {},
            timerSessions: [],
            siteVisits: [],
            siteTime: {},
            log: {}
        };
    }
    const d = S.days[today];
    if (!d.tasks) {
        const prev = _findPrevDayWith(today, 'tasks');
        d.tasks = prev
            ? deepClone(prev)
            : (S.tasks && S.tasks.length ? deepClone(S.tasks) : []);
    }
    if (!d.sites) {
        const prev = _findPrevDayWith(today, 'sites');
        d.sites = prev
            ? deepClone(prev)
            : (S.sites && S.sites.length ? deepClone(S.sites) : []);
    }
    if (!d.logItems) {
        const prev = _findPrevDayWith(today, 'logItems');
        d.logItems = prev
            ? deepClone(prev)
            : (S.logItems && S.logItems.length ? deepClone(S.logItems) : []);
    }
    return d;
}

function getDay(dateKey) {
    const today = isoToday();
    if (dateKey === today)
		return getTodayDay();
    if (!S.days[dateKey]) {
        S.days[dateKey] = {
            completions: {},
            timerSessions: [],
            siteVisits: [],
            siteTime: {},
            log: {}
        };
    }
    const d = S.days[dateKey];
    if (dateKey > today) {
        const td = getTodayDay();
        d.tasks = td.tasks;
        d.sites = td.sites;
        d.logItems = td.logItems;
        return d;
    }
    if (!d.tasks) { 
		const prev = _findPrevDayWith(dateKey, 'tasks');
		d.tasks = prev 
				? deepClone(prev)
				: deepClone(S.tasks || []); 
	}
    if (!d.sites) {
		const prev = _findPrevDayWith(dateKey, 'sites');
		d.sites = prev 
				? deepClone(prev) 
				: deepClone(S.sites || []);
	}
    if (!d.logItems) {
		const prev = _findPrevDayWith(dateKey, 'logItems');
		d.logItems = prev 
					? deepClone(prev) 
					: deepClone(S.logItems || []);
	}
    return d;
}

function todayTasks() {
	return getTodayDay().tasks;
}

function todaySites() {
	return getTodayDay().sites;
}

function todayLogItems() {
	return getTodayDay().logItems;
}

function syncLegacyGlobals() {
    const d = getTodayDay();
    S.tasks = d.tasks;
    S.sites = d.sites;
    S.logItems = d.logItems;
}

function commitTodayToDays() {
    const d = getTodayDay();
    d.completions = deepClone(S.completions);
    d.timerSessions = deepClone(S.timerSessions);
    d.siteVisits = deepClone(S.siteVisits);
    d.siteTime = deepClone(S.siteTime);
    S.days[isoToday()] = d;
}

function loadTodayFromDays() {
    const d = getDay(S.today);
    S.completions = deepClone(d.completions || {});
    if (S.today === isoToday()) {
        S.timerSessions = deepClone(d.timerSessions || []);
    } else {
        S.timerSessions = deepClone(getDay(isoToday()).timerSessions || []);
        S._viewSessions = deepClone(d.timerSessions || []);
    }
    S.siteVisits = deepClone(d.siteVisits || []);
    S.siteTime = deepClone(d.siteTime || {});
    syncLegacyGlobals();
}

function snapshotAllPastDays() {
}

function getNearestSnapshot(dateKey, field, fallback) {
    return getDay(dateKey)[field] || fallback;
}

function _applyDateSwitch(dateKey) {
    S.today = dateKey;
    document.getElementById('datePicker').value = dateKey;
    const dl = document.getElementById('dateLabel');
    const dl2 = document.getElementById('dateLabel2');
    if (dl) 
		dl.textContent = fmtDateShort(dateKey);
    if (dl2)
		dl2.textContent = fmtDate(dateKey);
    loadTodayFromDays();
    renderTasks();
    renderSessions();
    renderSites();
    renderLog();
    renderManage();
    renderManageSites();
    if (calVisible)
		renderCal();
}

function onDateChange() {
    const v = document.getElementById('datePicker').value;
    if (v)
		_applyDateSwitch(v);
}

function toggleCal(e) {
    if (e)
		e.stopPropagation();
    const panel = document.getElementById('calPanel');
    const backdrop = document.getElementById('calBackdrop');
    const btn = document.getElementById('dateBtnWrap');
    calVisible = !calVisible;
    if (calVisible) {
        const r = btn.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        const panelW = Math.min(350, window.innerWidth * 0.9);
        const margin = 8;
        let left = r.right + scrollX - panelW;
        if (left < margin)
			left = margin;
        if (left + panelW > window.innerWidth - margin)
			left = window.innerWidth - panelW - margin;
        panel.style.top = (r.bottom + scrollY + 8) + 'px';
        panel.style.left = left + 'px';
        panel.style.right = 'auto';
        panel.style.width = panelW + 'px';
        calYear = new Date().getFullYear();
        calMonth = new Date().getMonth();
        renderCal();
        renderEventList();
    }
    panel.classList.toggle('open', calVisible);
    backdrop.classList.toggle('open', calVisible);
    btn.classList.toggle('cal-open', calVisible);
}

function closeCal() {
    calVisible = false;
    document.getElementById('calPanel').classList.remove('open');
    document.getElementById('calBackdrop').classList.remove('open');
    document.getElementById('dateBtnWrap').classList.remove('cal-open');
}

function calNav(dir) {
    calMonth += dir;
    if (calMonth < 0) {
		calMonth = 11;
		calYear--;
	}
    if (calMonth > 11) {
		calMonth = 0;
		calYear++;
	}
    renderCal();
    renderEventList();
}

function renderCal() {
    const today = isoToday();
    const monthNames = [
        'January',
		'February',
		'March',
		'April',
        'May',
		'June',
		'July',
		'August',
        'September',
		'October',
		'November',
		'December'
    ];
    document.getElementById('calMonthLabel').textContent = monthNames[calMonth] + ' ' + calYear;
    const dows = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrev = new Date(calYear, calMonth, 0).getDate();
    let html = '';
    dows.forEach(d => { html += `<div class="cal-dow">${d}</div>`; });
    for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="cal-day cal-other">${daysInPrev - i}</div>`;
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = dateKey === today;
        const isSelected = dateKey === S.today && !isToday;
        const dayData = S.days[dateKey] || {};
        const comps = dayData.completions || {};
        const tasks = tasksForDayFromSnapshot(dateKey, dayData);
        let dot = '';
        if (tasks.length) {
            const done = Object.values(comps).filter(v => v === 'done').length;
            const partial = Object.values(comps).filter(v => v === 'partial').length;
            const left = tasks.length - done - partial;
            if (left === 0 && done + partial > 0) {
                dot = `<svg viewBox="0 0 24 24" fill="none" width="12" height="12" style="display:block;margin:2px auto 0;flex-shrink:0">
                           <circle cx="12" cy="12" r="11" fill="rgba(124,106,247,.25)" stroke="none"/>
                           <path d="M7 12l3.5 3.5 7-7" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                       </svg>`;
            } else if (done + partial > 0) {
                dot = `<svg viewBox="0 0 24 24" fill="none" width="12" height="12" style="display:block;margin:2px auto 0;flex-shrink:0">
                           <circle cx="12" cy="12" r="11" fill="rgba(64,201,168,.2)" stroke="none"/>
                           <path d="M12 1a11 11 0 0 1 0 22V1z" fill="var(--ok)" stroke="none"/>
                       </svg>`;
            } else if (dateKey >= today) {
                dot = `<svg viewBox="0 0 24 24" fill="none" width="12" height="12" style="display:block;margin:2px auto 0;flex-shrink:0">
                           <circle cx="12" cy="12" r="11" fill="rgba(232,147,74,.2)" stroke="none"/>
                           <path d="M8 12h8" stroke="var(--a2)" stroke-width="2.5" stroke-linecap="round"/>
                       </svg>`;
            }
        }
        const ev = (S.events || []).find(ev =>
            ev.date === dateKey || (ev.endDate && dateKey >= ev.date && dateKey <= ev.endDate)
        );
        let cls = 'cal-day';
        if (isToday)
			cls += ' cal-today';
        else if (isSelected)
			cls += ' cal-selected';
        const todaySvg = isToday
            ? `<svg viewBox="0 0 24 24" fill="none" preserveAspectRatio="none" style="position:absolute;top:-2px;left:-2px;width:calc(100% + 4px);height:calc(100% + 4px)">
                   <rect x="1" y="1" width="22" height="22" rx="4" fill="var(--accent)" stroke="var(--accent)" stroke-width="1.5"/>
               </svg>`
            : '';
        const evCorner = ev
            ? `<svg viewBox="0 0 24 24" fill="none" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.18">
                   <rect x="2" y="3" width="20" height="19" rx="3" fill="${ev.color}" stroke="${ev.color}" stroke-width="1.5"/>
                   <path d="M7 1v4M17 1v4" stroke="${ev.color}" stroke-width="1.8" stroke-linecap="round"/>
               </svg>
               <svg viewBox="0 0 24 24" fill="none" style="position:absolute;inset:0;width:100%;height:100%">
                   <rect x="2" y="3" width="20" height="19" rx="3" fill="none" stroke="${ev.color}" stroke-width="1.5"/>
                   <path d="M7 1v4M17 1v4" stroke="${ev.color}" stroke-width="1.5" stroke-linecap="round"/>
               </svg>`
            : '';
        html += `
            <div class="${cls}" style="position:relative;overflow:visible" onclick="selectCalDay('${dateKey}')">
                ${todaySvg}
                ${evCorner}
                <span style="position:relative;z-index:1">${d}</span>
                <div style="display:flex;justify-content:center;gap:2px;flex-wrap:wrap;position:relative;z-index:1">
                    ${dot}
                </div>
            </div>`;
    }
    const total = firstDay + daysInMonth;
    const remaining = (7 - total % 7) % 7;
    for (let d = 1; d <= remaining; d++) {
        html += `<div class="cal-day cal-other">${d}</div>`;
    }
    document.getElementById('calGrid').innerHTML = html;
}

function selectCalDay(dateKey) {
    _applyDateSwitch(dateKey);
    renderCal();
    closeCal();
}

function toggleEventForm() {
    document.getElementById('eventForm').classList.toggle('open');
}

function eventColorFromName(name) {
    const palette = [
        '#7c6af7',
		'#40c9a8',
		'#e8934a',
		'#e8576a',
        '#4a90d9',
		'#c97ae8',
		'#e8c44a',
		'#5ab8f7'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
    }
    return palette[Math.abs(hash) % palette.length];
}

function addEvent() {
    const name = document.getElementById('evName').value.trim();
    const date = document.getElementById('evDate').value;
    if (!name || !date)
		return;
    if (!S.events)
		S.events = [];
    const color = eventColorFromName(name);
    S.events.push({ id: uid(), name, date, color });
    document.getElementById('evName').value = '';
    document.getElementById('evDate').value = '';
    document.getElementById('eventForm').classList.remove('open');
    renderEventList();
    renderCal();
    scheduleSave();
}

function renderEventList() {
    const el = document.getElementById('eventList');
    if (!el)
		return;
    const today = isoToday();
    if (!S.events)
		S.events = [];
    const upcoming = S.events.filter(ev => ev && ev.date && ev.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    if (!upcoming.length) {
        el.innerHTML = `
            <div class="no-events">
                <svg class="no-events-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="18" rx="3" stroke="var(--muted)" stroke-width="1.5" fill="none"/>
                    <path d="M2 10h20"   stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M7 2v4M17 2v4" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <div style="color:var(--muted);font-size:13px;font-weight:600;margin-bottom:4px">No events</div>
                <span style="font-size:11px;color:var(--muted);opacity:0.7">Add an event to plan your day better.</span>
            </div>`;
        return;
    }
    const fmtLong = iso => new Date(iso + 'T12:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    el.innerHTML = upcoming.map(ev => {
        const c = ev.color || '#7c6af7';
        const startFmt = fmtLong(ev.date);
        const endFmt = ev.endDate ? fmtLong(ev.endDate) : '';
        const dateRangeLabel = ev.endDate && ev.endDate !== ev.date ? `${startFmt} → ${endFmt}` : startFmt;
        return `
            <div class="event-item" data-evid="${ev.id}">
                <div class="event-cal-icon" style="position:relative;flex-shrink:0">
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                        <rect x="2" y="5" width="26" height="23" rx="4" stroke="${c}" stroke-width="2" fill="${c}22"/>
                        <path d="M9 2v6M21 2v6" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div style="flex:1;min-width:0">
                    <div class="event-name">${esc(ev.name)}</div>
                    <div class="event-date">${dateRangeLabel}</div>
                </div>
                <button onclick="delEvent(this)"
                        data-evid="${ev.id}"
                        style="margin-left:auto;flex-shrink:0;background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;padding:0 4px;line-height:1">
                    &times;
                </button>
            </div>`;
    }).join('');
}

function delEvent(btnEl) {
    const id = typeof btnEl === 'string' ? btnEl : btnEl.getAttribute('data-evid');
    if (!id)
		return;
    const ev = (S.events || []).find(e => e.id === id);
    const evName = ev && ev.name ? ev.name : 'event';
    showConfirm(`Delete this ${evName}?`, () => {
        S.events = (S.events || []).filter(e => e.id !== id);
        renderEventList();
        renderCal();
        scheduleSave();
    });
}