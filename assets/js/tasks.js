(function () {
    if (document.getElementById('__css_tasks'))
		return;
    const s = document.createElement('style');
    s.id = '__css_tasks';
    s.textContent = `
		.task-item {
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 12px 0;
			border-bottom: 1px solid var(--border);
		}

		.task-item:last-child {
			border-bottom: none;
		}

		.chk {
			flex-shrink: 0;
			width: 28px;
			height: 28px;
			border-radius: 50%;
			border: none;
			background: transparent;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all .16s;
			-webkit-tap-highlight-color: transparent;
			padding: 0;
		}

		.chk:hover {
			opacity: .75;
		}

		.chk[data-s="partial"] {
			border: none;
			background: transparent;
		}

		.chk[data-s="done"] {
			border: none;
			background: transparent;
		}

		.task-info {
			flex: 1;
			min-width: 0;
		}

		.task-name {
			font-size: 14px;
			font-weight: 600;
		}

		.task-meta {
			font-size: 11px;
			color: var(--muted);
			font-family: var(--mono);
			margin-top: 3px;
		}

		.alarm-badge {
			font-size: 10px;
			font-family: var(--mono);
			color: var(--a2);
			background: rgba(232,147,74,.1);
			border: 1px solid rgba(232,147,74,.25);
			padding: 1px 6px;
			border-radius: 4px;
			margin-left: 6px;
		}

		.sched-badge {
			font-size: 10px;
			font-family: var(--mono);
			color: var(--a3);
			background: rgba(64,201,168,.08);
			border: 1px solid rgba(64,201,168,.2);
			padding: 3px 8px;
			border-radius: 5px;
			white-space: nowrap;
			flex-shrink: 0;
		}

		.task-acts {
			display: flex;
			gap: 6px;
		}

		.badge {
			display: inline-block;
			padding: 1px 7px;
			border-radius: 4px;
			font-size: 10px;
			font-weight: 700;
			letter-spacing: .04em;
			text-transform: uppercase;
		}

		.empty {
			text-align: center;
			padding: 36px 20px;
			color: var(--muted);
			font-size: 13px;
		}

		.tasks-layout {
			display: block;
			position: relative;
		}

		.tasks-main {
			width: 100%;
		}

		.alarm-section {
			border: 1px solid var(--border);
			border-radius: 8px;
			padding: 12px 14px;
			margin-bottom: 14px;
			background: var(--bg);
		}

		.alarm-toggle-row {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 0;
		}

		.alarm-toggle-row input[type="checkbox"] {
			width: 16px;
			height: 16px;
			accent-color: var(--accent);
			cursor: pointer;
			flex-shrink: 0;
		}

		.alarm-toggle-label {
			font-size: 13px;
			color: var(--muted);
			cursor: pointer;
			margin-bottom: 0;
			text-transform: none;
			letter-spacing: 0;
			font-weight: 500;
		}

		.alarm-inputs {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 8px;
			margin-top: 12px;
		}

		.alarm-inputs label {
			font-size: 10px;
			text-transform: uppercase;
			letter-spacing: .06em;
			color: var(--muted);
			margin-bottom: 3px;
		}

		.sched-section {
			border: 1px solid var(--border);
			border-radius: 8px;
			padding: 12px 14px;
			margin-bottom: 14px;
			background: var(--bg);
		}

		.sched-toggle-row {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 0;
		}

		.sched-toggle-row input[type="checkbox"] {
			width: 16px;
			height: 16px;
			accent-color: var(--accent);
			cursor: pointer;
			flex-shrink: 0;
		}

		.sched-toggle-label {
			font-size: 13px;
			color: var(--muted);
			cursor: pointer;
			margin-bottom: 0;
			text-transform: none;
			letter-spacing: 0;
			font-weight: 500;
		}

		.sched-info {
			margin-top: 10px;
			font-size: 11px;
			font-family: var(--mono);
			color: var(--a3);
			padding: 6px 10px;
			background: rgba(64,201,168,.06);
			border-radius: 5px;
			border: 1px solid rgba(64,201,168,.15);
		}`;
	document.head.appendChild(s);
})();

function tasksForDay(dateKey) {
    const tasks = getDay(dateKey).tasks || [];
    const dow = new Date(dateKey + 'T12:00:00').getDay();
    const dn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow];
    return tasks.filter(t => !t.days || !t.days.length || t.days.includes(dn));
}

function tasksForDayFromSnapshot(dateKey, dayData) {
    return tasksForDay(dateKey);
}

function renderTasks() {
    const isReadOnly = S.today !== isoToday();
    const list = tasksForDay(S.today);
    const isFuture = S.today > isoToday();
    const todayIds = isFuture ? null : new Set(todayTasks().map(t => t.id));
    const listEl = document.getElementById('taskList');
    const statEl = document.getElementById('taskStats');
    const taskCardTitle = document.querySelector('#tab-tasks .card-title');
    if (taskCardTitle) {
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
        taskCardTitle.innerHTML = `TASKS <small id="dateLabel2" style="color:var(--muted);
																		font-weight:400;
																		font-size:12px;
																		text-transform:none;
																		letter-spacing:0;
																		margin-left:6px">${fmtDate(S.today)}</small>${roHtml}`;
    }
    if (!list.length) {
        listEl.innerHTML = '<div class="empty">No tasks for this day.</div>';
        statEl.innerHTML = '';
        return;
    }
    let done = 0;
    let partial = 0;
    list.forEach(t => {
        const s = S.completions[t.id] || 'none';
        if (s === 'done')
			done++;
        if (s === 'partial')
			partial++;
    });
    const left = list.length - done - partial;
    const pct = Math.round(((done + partial * 0.5) / list.length) * 100);
    statEl.innerHTML = `
		<div class="stat-card">
			<div class="stat-card-left"><div class="stat-num num-done">${done}</div><div class="stat-lbl">done</div></div>
			<div class="stat-card-icon ic-done">
				<svg viewBox="0 0 24 24" fill="none" width="28" height="28">
					<circle cx="12" cy="12" r="11" fill="rgba(124,106,247,.18)" stroke="none"/>
					<path d="M7 12l3.5 3.5 7-7" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-card-left"><div class="stat-num num-partial">${partial}</div><div class="stat-lbl">partial</div></div>
			<div class="stat-card-icon ic-partial">
				<svg viewBox="0 0 24 24" fill="none" width="28" height="28">
					<circle cx="12" cy="12" r="11" fill="rgba(64,201,168,.18)" stroke="none"/>
					<path d="M12 1a11 11 0 0 1 0 22V1z" fill="var(--ok)" stroke="none"/>
				</svg>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-card-left"><div class="stat-num num-left">${left}</div><div class="stat-lbl">left</div></div>
			<div class="stat-card-icon ic-left">
				<svg viewBox="0 0 24 24" fill="none" width="28" height="28">
					<circle cx="12" cy="12" r="11" fill="rgba(232,147,74,.18)" stroke="none"/>
					<path d="M8 12h8" stroke="var(--a2)" stroke-width="2.5" stroke-linecap="round"/>
				</svg>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-card-left"><div class="stat-num num-prog">${pct}%</div><div class="stat-lbl">progress</div></div>
			<div class="stat-card-icon ic-prog"><svg viewBox="0 0 24 24" fill="none" width="48" height="48"><circle cx="12" cy="12" r="11" fill="rgba(124,106,247,.18)" stroke="none"/><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/><polyline points="16 7 22 7 22 13" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/></svg></div>
		</div>`;
    listEl.innerHTML = list
        .map(t => {
            const s = S.completions[t.id] || 'none';
            const isDeleted = isReadOnly && !isFuture && todayIds && !todayIds.has(t.id);
            const iconSvg =
                s === 'done'
                    ? `<svg viewBox="0 0 24 24" fill="none" width="28" height="28" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="11" fill="rgba(124,106,247,.18)" stroke="none"/><path d="M7 12l3.5 3.5 7-7" stroke="var(--accent)" stroke-width="2.5"/></svg>`
                    : s === 'partial'
                      ? `<svg viewBox="0 0 24 24" fill="none" width="28" height="28"><circle cx="12" cy="12" r="11" fill="rgba(64,201,168,.18)" stroke="none"/><path d="M12 1a11 11 0 0 1 0 22V1z" fill="var(--ok)" stroke="none"/></svg>`
                      : `<svg viewBox="0 0 24 24" fill="none" width="28" height="28"><circle cx="12" cy="12" r="11" fill="rgba(232,147,74,.18)" stroke="none"/><path d="M8 12h8" stroke="var(--a2)" stroke-width="2.5" stroke-linecap="round"/></svg>`;
            const alarmBadge = t.alarmTime ? `<span class="alarm-badge">${esc(fmtAlarm(t.alarmTime))}</span>` : '';
            const schedBadge = t.schedEnd
                ? `<span class="sched-badge">${esc(t.schedStart)}–${esc(t.schedEnd)}</span>`
                : '';
            const nameStyle = isDeleted ? 'text-decoration:line-through;color:var(--muted);' : '';
            return `<div class="task-item"${isDeleted ? ' style="opacity:0.55"' : ''}>
						<button class="chk" data-s="${s}" onclick="cycleStatus('${t.id}')" style="${isReadOnly ? 'opacity:0.4;cursor:not-allowed' : ''}">${iconSvg}</button>
						<div class="task-info">
							<div class="task-name" style="${nameStyle}">${esc(t.name)}${alarmBadge}</div>
							<div class="task-meta">${t.duration ? esc(t.duration) + ' &middot; ' : ''}${t.days && t.days.length ? t.days.join(',') : 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'}</div>
						</div>
						${schedBadge}
					</div>`;
        }).join('');
}

function cycleStatus(id) {
    if (S.today !== isoToday())
		return;
    const cur = S.completions[id] || 'none';
    S.completions[id] = cur === 'none' ? 'partial' : cur === 'partial' ? 'done' : 'none';
    renderTasks();
    if (calVisible)
		renderCal();
    scheduleSave();
}

function calcSchedEnd() {
    const startVal = document.getElementById('tSchedStart').value;
    const durNum = parseFloat(document.getElementById('tDurNum').value || 0);
    const durUnit = document.getElementById('tDurUnit').value;
    const calcEl = document.getElementById('schedCalc');
    if (!startVal || !durNum) {
        calcEl.style.display = 'none';
        return;
    }
    const [sh, sm] = startVal.split(':').map(Number);
    const totalMin = durUnit === 'hrs' ? durNum * 60 : durNum;
    const endMin = sh * 60 + sm + totalMin;
    const eh = Math.floor(endMin / 60) % 24;
    const em = Math.round(endMin % 60);
    const fmtTime = (h, m) => {
        const ap = h >= 12 ? 'PM' : 'AM';
        const hh = h % 12 || 12;
        return `${hh}:${String(m).padStart(2, '0')} ${ap}`;
    };
    calcEl.style.display = 'block';
    calcEl.textContent = `${fmtTime(sh, sm)} → ${fmtTime(eh, em)} (${totalMin} min)`;
    calcEl.dataset.start = fmtTime(sh, sm);
    calcEl.dataset.end = fmtTime(eh, em);
}

function buildDayPicker(sel = []) {
    document.getElementById('dayPicker').innerHTML = DAYS_SHORT.map(d =>
            `<button type="button" class="btn sm${sel.includes(d) ? ' primary' : ''}" data-day="${d}" onclick="this.classList.toggle('primary')">${d}</button>`
    ).join('');
}

function getSelDays() {
    return [...document.querySelectorAll('#dayPicker .primary')].map(b => b.dataset.day);
}

function parse24h(time) {
    if (!time)
		return {
			hr: 6,
			min: 0,
			ampm: 'AM'
		};
    const [h, m] = time.split(':').map(Number);
    return {
		hr: h % 12 || 12,
		min: m,
		ampm: h >= 12 ? 'PM' : 'AM'
	};
}

function to24h(hr, min, ampm) {
    let h = parseInt(hr) % 12;
    if (ampm === 'PM')
		h += 12;
    return String(h).padStart(2, '0') + ':' + String(parseInt(min) || 0).padStart(2, '0');
}

function parseDuration(dur) {
    if (!dur)
		return { num: '', unit: 'min' };
    const m = String(dur).match(/^([\d.]+)\s*(min|hr|hrs)?/i);
    if (!m)
		return { num: dur, unit: 'min' };
    return {
		num: m[1],
		unit: (m[2] || 'min').toLowerCase().startsWith('h') ? 'hrs' : 'min'
	};
}

function openTaskModal(task = null) {
    if (!task && S.today !== isoToday())
		return;
    editTaskId = task ? task.id : null;
    document.getElementById('mTaskTitle').textContent = task ? 'Edit Task' : 'Add Task';
    document.getElementById('tName').value = task?.name || '';
    const { num, unit } = parseDuration(task?.duration);
    document.getElementById('tDurNum').value = num;
    document.getElementById('tDurUnit').value = unit;
    document.getElementById('tSchedStart').value = task?.schedStartRaw || '';
    document.getElementById('schedCalc').style.display = 'none';
    if (task?.schedStartRaw)
		calcSchedEnd();
    buildDayPicker(task?.days || []);
    document.getElementById('mTask').classList.add('open');
    document.getElementById('tDurNum').oninput = calcSchedEnd;
    document.getElementById('tDurUnit').onchange = calcSchedEnd;
}

function closeMTask() {
    document.getElementById('mTask').classList.remove('open');
    editTaskId = null;
}

function saveTask() {
    if (!editTaskId && S.today !== isoToday())
		return;
    const name = document.getElementById('tName').value.trim();
    if (!name)
        return;
    const durNum = document.getElementById('tDurNum').value.trim();
    const durUnit = document.getElementById('tDurUnit').value;
    const duration = durNum ? `${durNum} ${durUnit}` : '';
    const alarmTime = '';
    const calcEl = document.getElementById('schedCalc');
    let schedStart = '';
    let schedEnd = '';
    let schedStartRaw = '';
    schedStartRaw = document.getElementById('tSchedStart').value;
    if (schedStartRaw) {
        schedStart = calcEl.dataset.start || '';
        schedEnd = calcEl.dataset.end || '';
    }
    const tasks = todayTasks();
    const existing = editTaskId ? tasks.find(t => t.id === editTaskId) : null;
    const task = {
        id: editTaskId || uid(),
        name,
        category: existing?.category || 'other',
        duration,
        days: getSelDays(),
        alarmTime,
        schedStart,
        schedEnd,
        schedStartRaw
    };
    if (editTaskId) {
        const i = tasks.findIndex(t => t.id === editTaskId);
        if (i >= 0)
			tasks[i] = task;
    } else {
		tasks.push(task);
	}
    closeMTask();
    renderTasks();
    renderManage();
    scheduleSave();
}

async function deleteTask(id) {
    if (S.today !== isoToday())
		return;
    showConfirm('Delete this task?', () => {
        const tasks = todayTasks();
        getTodayDay().tasks = tasks.filter(t => t.id !== id);
        delete S.completions[id];
        renderTasks();
        renderManage();
        scheduleSave();
    });
}