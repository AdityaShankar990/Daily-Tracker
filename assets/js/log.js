(function () {
    if (document.getElementById('__css_log'))
		return;
    const s = document.createElement('style');
    s.id = '__css_log';
    s.textContent = `
		.log-section {
			margin-bottom: 14px
		}

		.log-item {
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 8px 0;
			border-bottom: 1px solid var(--border)
		}

		.log-item:last-child {
			border-bottom: none
		}

		.log-label {
			flex: 1;
			min-width: 0
		}

		.log-name {
			font-size: 14px;
			font-weight: 600;
			line-height: 1.3
		}

		.log-hint {
			font-size: 11px;
			color: var(--muted);
			font-family: var(--mono);
			margin-top: 2px
		}

		.log-control {
			display: flex;
			align-items: center;
			gap: 8px;
			flex-shrink: 0
		}

		.log-toggle {
			display: flex;
			border: 1px solid var(--border);
			border-radius: 6px;
			overflow: hidden;
			width: 96px;
			box-sizing: border-box;
			padding: 0;
			gap: 0
		}

		.log-toggle-btn {
			flex: 1;
			padding: 5px 0;
			font-size: 12px;
			font-weight: 700;
			font-family: var(--mono);
			border: none;
			background: none;
			color: var(--muted);
			cursor: pointer;
			transition: all .14s;
			-webkit-tap-highlight-color: transparent;
			display: block;
			width: 50%;
			margin: 0
		}

		.log-toggle-btn.active {
			background: var(--accent);
			color: #fff
		}

		.log-toggle-btn:not(.active):hover {
			background: var(--surf2);
			color: var(--text)
		}

		.log-num-wrap {
			display: flex;
			align-items: center;
			gap: 6px
		}

		.log-num {
			background: var(--bg);
			border: 1px solid var(--border);
			color: var(--text);
			border-radius: 6px;
			padding: 5px 0;
			font-size: 12px;
			font-weight: 700;
			font-family: var(--mono);
			outline: none;
			text-align: center;
			-webkit-appearance: none;
			appearance: none;
			height: 32px;
			width: 96px
		}

		.log-num:focus {
			border-color: var(--accent);
			box-shadow: 0 0 0 3px rgba(124,106,247,.14)
		}

		.log-num::-webkit-inner-spin-button,
		.log-num::-webkit-outer-spin-button {
			-webkit-appearance: none;
			margin: 0
		}

		.log-num[type=number] {
			-moz-appearance: textfield
		}

		.log-unit {
			font-size: 11px;
			color: var(--muted);
			font-family: var(--mono)
		}

		.log-add-row {
			display: flex;
			gap: 8px;
			margin-top: 12px;
			flex-wrap: wrap
		}

		.log-add-row input,
		.log-add-row select {
			flex: 1;
			min-width: 100px
		}

		.log-add-row select {
			width: 100px;
			flex: 0 0 100px
		}

		.dot-log {
			background: var(--accent)
		}

		.log-stats-row {
			display: flex;
			gap: 10px;
			margin-bottom: 14px;
			flex-wrap: wrap
		}

		.log-stat-chip {
			background: var(--surface);
			border: 1px solid var(--border);
			border-radius: 8px;
			padding: 8px 14px;
			font-size: 12px;
			font-family: var(--mono);
			color: var(--muted);
			display: flex;
			align-items: center;
			gap: 6px
		}

		.log-stat-chip strong {
			color: var(--text);
			font-size: 14px
		}

		.log-del-btn {
			background: none;
			border: none;
			color: var(--muted);
			font-size: 16px;
			cursor: pointer;
			padding: 2px 4px;
			border-radius: 4px;
			opacity: 0.5;
			transition: opacity .14s;
			line-height: 1
		}

		.log-del-btn:hover {
			opacity: 1
		}

		.log-readonly {
			font-size: 10px;
			font-weight: 700;
			letter-spacing: .06em;
			text-transform: uppercase;
			color: var(--err);
			background: rgba(232,87,106,.12);
			border: 1px solid rgba(232,87,106,.3);
			border-radius: 4px;
			padding: 2px 7px;
			font-family: var(--mono);
			display: none
		}

		.log-readonly.show {
			display: inline
		}`;
    document.head.appendChild(s);
})();

function habitsNav(dir) {
    if (habitsRange === 'WEEK') {
        const d = new Date(habitsNavDate + 'T12:00:00');
        d.setDate(d.getDate() + dir * 7);
        habitsNavDate = d.toISOString().slice(0, 10);
    } else {
        const d = new Date(habitsNavDate + 'T12:00:00');
        d.setMonth(d.getMonth() + dir);
        habitsNavDate = d.toISOString().slice(0, 10);
    }
    renderLogHistory();
    updateHabitsRangeLabel();
}

function setHabitsRange(r, el) {
    habitsRange = r;
    document.querySelectorAll('#logHistoryCard .perf-range-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderLogHistory();
    updateHabitsRangeLabel();
}

function updateHabitsRangeLabel() {
    const monthBtn = document.getElementById('habitsMonthBtn');
    const rangeLabel = document.getElementById('habitsRangeLabel');
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
    if (habitsRange === 'WEEK') {
        const d = new Date(habitsNavDate + 'T12:00:00');
        const dow = d.getDay();
        const mon = new Date(d);
        mon.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);
        const fmt = dt => dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        const rangeStr = fmt(mon) + ' – ' + fmt(sun) + ', ' + mon.getFullYear();
        if (monthBtn)
			monthBtn.textContent = fmt(mon) + ' – ' + fmt(sun);
        if (rangeLabel)
			rangeLabel.textContent = rangeStr;
    } else {
        const d = new Date(habitsNavDate + 'T12:00:00');
        const yr = d.getFullYear();
        const mo = d.getMonth();
        const daysInMonth = new Date(yr, mo + 1, 0).getDate();
        if (monthBtn)
			monthBtn.textContent = monthNames[mo] + ' ' + yr;
        const s = `${monthNames[mo].slice(0, 3)} 01 – ${monthNames[mo].slice(0, 3)} ${String(daysInMonth).padStart(2, '0')}, ${yr}`;
        if (rangeLabel)
			rangeLabel.textContent = s;
    }
}

const DEFAULT_LOG_ITEMS = [];

function getLogItems() {
    const custom = (todayLogItems() || []).filter(i => !i.builtIn);
    return [...DEFAULT_LOG_ITEMS, ...custom];
}

function getLogItemsForDay(dateKey) {
    if (dateKey >= isoToday())
		return getLogItems();
    const dayItems = getDay(dateKey).logItems || [];
    const custom = dayItems.filter(i => !i.builtIn);
    return [...DEFAULT_LOG_ITEMS, ...custom];
}

function getDayLog(dateKey) {
    if (dateKey === isoToday())
        commitTodayToDays();
    const dayData = S.days[dateKey] || {};
    return dayData.log || {};
}

function saveDayLog(dateKey, log) {
    if (!S.days[dateKey])
		S.days[dateKey] = {};
    S.days[dateKey].log = log;
    if (dateKey === S.today) {
        if (!S.days[S.today])
			S.days[S.today] = {};
        S.days[S.today].log = log;
    }
    scheduleSave();
}

function setLogValue(dateKey, itemId, value, skipRender) {
    const log = getDayLog(dateKey);
    log[itemId] = value;
    saveDayLog(dateKey, log);
    renderLog();
    if (calVisible)
		renderCal();
}

function renderLog() {
    const dateKey = S.today;
    const isReadOnly = dateKey !== isoToday();
    const items = getLogItems();
    const log = getDayLog(dateKey);

    const habitsCardTitle = document.querySelector('#logHistoryCard .card-title');
    if (habitsCardTitle) {
        const roHtml = isReadOnly
            ? ` <span style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--err);background:rgba(232,87,106,.12);border:1px solid rgba(232,87,106,.3);border-radius:4px;padding:2px 7px;font-family:var(--mono)">read-only</span>`
            : '';
        habitsCardTitle.innerHTML = `HABITS${roHtml}`;
    }

    const roEl = document.getElementById('logReadOnly');
    if (roEl)
		roEl.classList.toggle('show', isReadOnly);
    const addHabitSection = document.getElementById('addHabitSection');
    if (addHabitSection) {
        addHabitSection.querySelectorAll('input,select,button').forEach(el => {
            if (isReadOnly) {
                el.setAttribute('disabled', 'disabled');
                el.style.opacity = '0.4';
                el.style.cursor = 'not-allowed';
            } else {
                el.removeAttribute('disabled');
                el.style.opacity = '';
                el.style.cursor = '';
            }
        });
    }

    const listEl = document.getElementById('logList');
    if (!listEl)
		return;

    const liveValues = {};
    listEl.querySelectorAll('input.log-num[data-id]').forEach(inp => {
        liveValues[inp.dataset.id] = inp.value;
    });

    listEl.innerHTML = items
        .map(item => {
            const savedVal = log[item.id];
            const liveVal = liveValues[item.id];
            const val = liveVal !== undefined ? liveVal : savedVal;
            let controlHtml = '';

            if (item.type === 'toggle') {
                const yes = savedVal === true || savedVal === 'yes';
                const no = savedVal === false || savedVal === 'no';
                controlHtml = `<div class="log-toggle">
									<button class="log-toggle-btn yes${yes ? ' active' : ''}" ${isReadOnly ? 'disabled style="opacity:0.4;cursor:not-allowed"' : 'onclick="setLogValue(\'' + dateKey + "','" + item.id + "','yes')\""}>YES</button>
									<button class="log-toggle-btn no${no ? ' active' : ''}" ${isReadOnly ? 'disabled style="opacity:0.4;cursor:not-allowed"' : 'onclick="setLogValue(\'' + dateKey + "','" + item.id + "','no')\""}>NO</button>
								</div>`;
            } else if (item.type === 'number') {
                const displayVal = val !== undefined && val !== '' ? val : '';
                controlHtml = `<div class="log-num-wrap">
									<input class="log-num" 
											type="number" 
											min="0" 
											step="${item.unit === 'kg' ? '0.1' : '1'}" 
											placeholder="0"
											data-id="${item.id}" 
											value="${displayVal}" 
											${isReadOnly ? 'disabled style="opacity:0.4;cursor:not-allowed"' : ''}
											oninput="setLogValue('${dateKey}','${item.id}',this.value===''?undefined:parseFloat(this.value))">
							</div>`;
            }

            const delBtn = item.builtIn ? '' : isReadOnly
												? `<button disabled class="log-del-btn" 
															style="margin-left:8px;
																	flex-shrink:0;
																	opacity:0.4;
																	cursor:not-allowed">&times;</button>`
												: `<button class="log-del-btn" 
															style="margin-left:8px;
																	flex-shrink:0;" 
															onclick="delLogItem('${item.id}')">&times;</button>`;
            return `<div class="log-item">
						<div class="log-label">
							<div class="log-name">${esc(item.name)}</div>
							${item.unit && item.type === 'number' ? `<div class="log-hint">${item.unit}</div>` : ''}
						</div>
						<div class="log-control">${controlHtml}${delBtn}</div>
				</div>`;
        }).join('');
	renderLogHistory();
}

function renderLogHistory() {
    const el = document.getElementById('logHistory');
    if (!el)
		return;
    const today = isoToday();
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const days = [];
    if (habitsRange === 'WEEK') {
        const d = new Date(habitsNavDate + 'T12:00:00');
        const dow = d.getDay();
        const mon = new Date(d);
        mon.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
        for (let i = 0; i < 7; i++) {
            const day = new Date(mon);
            day.setDate(mon.getDate() + i);
            days.push(day.toISOString().slice(0, 10));
        }
    } else {
        const d = new Date(habitsNavDate + 'T12:00:00');
        const yr = d.getFullYear();
        const mo = d.getMonth();
        const daysInMonth = new Date(yr, mo + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(`${yr}-${String(mo + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
        }
    }
    const seenIds = new Set();
    const allItems = [];
    days.forEach(dk => {
        const dayItems = getLogItemsForDay(dk);
        dayItems.forEach(item => {
            if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                allItems.push(item);
            }
        });
    });
    getLogItems().forEach(item => {
        if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            allItems.push(item);
        }
    });
    const items = allItems;
    const currentLogIds = new Set(getLogItems().map(i => i.id));

    let html = `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">
				<thead><tr>
				<th style="text-align:left;padding:6px 8px 6px 0;color:var(--muted);font-size:11px;font-weight:600;border-bottom:1px solid var(--border)">Item</th>`;
    days.forEach(dk => {
        const d = new Date(dk + 'T12:00');
        const isToday = dk === today;
        html += `<th style="text-align:center;padding:6px 4px;color:${isToday ? 'var(--accent)' : 'var(--muted)'};font-size:11px;font-weight:${isToday ? 700 : 600};border-bottom:1px solid var(--border);white-space:nowrap">${dayNames[d.getDay()]}<br><span style="font-size:10px">${d.getDate()}</span></th>`;
    });
    html += '</tr></thead><tbody>';
    items.forEach(item => {
        const isDeleted = !currentLogIds.has(item.id);
        const nameStyle = isDeleted ? 'text-decoration:line-through;color:var(--muted);opacity:0.7;' : '';
        html += `<tr><td style="padding:7px 8px 7px 0;
								color:var(--text);
								font-weight:600;
								white-space:nowrap;
								border-bottom:1px solid var(--border);
								${nameStyle}">${esc(item.name)}</td>`;
		days.forEach(dk => {
            const log = getDayLog(dk);
            const val = log[item.id];
            let cell = '<span style="color:var(--border)">—</span>';
            if (val !== undefined && val !== null && val !== '') {
                if (item.type === 'toggle') {
                    cell =
                        val === 'yes'
                            ? '<svg viewBox="0 0 24 24" fill="none" width="16" height="16" style="display:inline-block;vertical-align:middle"><circle cx="12" cy="12" r="11" fill="rgba(124,106,247,.25)" stroke="none"/><path d="M7 12l3.5 3.5 7-7" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                            : '<svg viewBox="0 0 24 24" fill="none" width="16" height="16" style="display:inline-block;vertical-align:middle"><circle cx="12" cy="12" r="11" fill="rgba(232,147,74,.2)" stroke="none"/><path d="M8 12h8" stroke="var(--a2)" stroke-width="2.5" stroke-linecap="round"/></svg>';
                } else if (item.type === 'number') {
                    cell = `<span style="color:var(--text);font-family:var(--mono)">${val}${item.unit ? '<span style="color:var(--muted);font-size:10px"> ' + item.unit + '</span>' : ''}</span>`;
                }
            }
            const isCurDay = dk === S.today;
            html += `<td style="text-align:center;padding:7px 4px;border-bottom:1px solid var(--border);${isCurDay ? 'background:rgba(124,106,247,.07)' : ''}">${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    el.innerHTML = html;
}

function addLogItem() {
    if (S.today !== isoToday())
		return;
    const name = document.getElementById('logNewName').value.trim();
    const type = document.getElementById('logNewType').value;
    const unit = document.getElementById('logNewUnit').value.trim();
    if (!name)
        return;
    const d = getTodayDay();
    if (!d.logItems)
		d.logItems = [];
    d.logItems.push({ id: 'log_' + uid(), name, type, unit, builtIn: false });
    document.getElementById('logNewName').value = '';
    document.getElementById('logNewUnit').value = '';
    scheduleSave();
    renderLog();
}

function delLogItem(id) {
    if (S.today !== isoToday())
		return;
    showConfirm('Remove this habit?', () => {
        const d = getTodayDay();
        d.logItems = (d.logItems || []).filter(i => i.id !== id);
        scheduleSave();
        renderLog();
    });
}
