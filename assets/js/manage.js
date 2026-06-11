(function () {
    if (document.getElementById('__css_manage'))
		return;
    const s = document.createElement('style');
    s.id = '__css_manage';
    s.textContent = `
		.manage-task-item {
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 14px 0;
			border-bottom: 1px solid var(--border);
		}

		.manage-task-item:last-child {
			border-bottom: none;
		}

		.manage-task-info {
			flex: 1;
			min-width: 0;
		}

		.manage-task-name {
			font-size: 14px;
			font-weight: 600;
			margin-bottom: 3px;
		}

		.manage-task-meta {
			font-size: 11px;
			color: var(--muted);
			font-family: var(--mono);
		}

		.manage-task-acts {
			display: flex;
			align-items: center;
			gap: 6px;
			flex-shrink: 0;
		}

		.manage-edit-btn {
			display: flex;
			align-items: center;
			gap: 5px;
			padding: 5px 12px;
			background: none;
			border: 1px solid var(--border);
			border-radius: 6px;
			color: var(--text);
			font-size: 12px;
			cursor: pointer;
			transition: background .14s;
		}

		.manage-edit-btn:hover {
			background: var(--surf2);
		}

		.manage-del-btn {
			display: flex;
			align-items: center;
			padding: 5px 8px;
			background: none;
			border: none;
			border-radius: 6px;
			color: var(--muted);
			font-size: 18px;
			cursor: pointer;
			transition: color .14s;
			line-height: 1;
		}

		.manage-del-btn:hover {
			color: var(--muted);
		}`;
    document.head.appendChild(s);
})();

function renderManage() {
    const isReadOnly = isoToday() !== S.today;
    const newTaskRow = document.getElementById('newTaskBtnRow');
    const addSiteRow = document.getElementById('addSiteBtnRow');
    [newTaskRow, addSiteRow].forEach(row => {
        if (!row)
			return;
        row.querySelectorAll('button,input,select').forEach(el => {
            if (isReadOnly) {
                el.disabled = true;
                el.style.opacity = '0.4';
                el.style.cursor = 'not-allowed';
            } else {
                el.disabled = false;
                el.style.opacity = '';
                el.style.cursor = '';
            }
        });
    });
    const manageTasksTitle = document.getElementById('manageTasksTitle');
    if (manageTasksTitle)
        manageTasksTitle.innerHTML = `TASKS${isReadOnly ? ' <span style=\"font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--err);background:rgba(232,87,106,.12);border:1px solid rgba(232,87,106,.3);border-radius:4px;padding:2px 7px;font-family:var(--mono)\">read-only</span>' : ''}`;
    const manageSitesTitle = document.getElementById('manageSitesTitle');
    if (manageSitesTitle)
        manageSitesTitle.innerHTML = `SITES${isReadOnly ? ' <span style=\"font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--err);background:rgba(232,87,106,.12);border:1px solid rgba(232,87,106,.3);border-radius:4px;padding:2px 7px;font-family:var(--mono)\">read-only</span>' : ''}`;
    const el = document.getElementById('manageList');
    const taskList = getDay(S.today).tasks || [];
    const isFutureT = S.today > isoToday();
    const currentTaskIds = isFutureT ? null : new Set(todayTasks().map(t => t.id));
    if (!taskList.length) {
        el.innerHTML = '<div class="empty">No tasks yet.</div>';
        return;
    }
    el.innerHTML = taskList
        .map(t => {
            const isDeleted = isReadOnly && !isFutureT && currentTaskIds && !currentTaskIds.has(t.id);
            const nameStyle = isDeleted ? 'text-decoration:line-through;color:var(--muted);' : '';
            const roStyle = isReadOnly || isDeleted ? 'opacity:0.4;cursor:not-allowed' : '';
            const tJson = JSON.stringify(t).replace(/'/g, '&#39;');
            return `<div class="manage-task-item"${isDeleted ? ' style="opacity:0.55"' : ''}>
						<div class="manage-task-info">
							<div class="manage-task-name" style="${nameStyle}">${esc(t.name)}${t.alarmTime ? `<span class="alarm-badge">${esc(fmtAlarm(t.alarmTime))}</span>` : ''}</div>
							<div class="manage-task-meta">${t.duration ? esc(t.duration) + ' &middot; ' : ''}${t.days && t.days.length ? t.days.join(',') : 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'}</div>
						</div>
						<div class="manage-task-acts">
							${t.schedEnd ? `<span class="sched-badge" style="margin-right:6px">${esc(t.schedStart)}–${esc(t.schedEnd)}</span>` : ''}
							<button class="manage-edit-btn" style="${roStyle}" ${isReadOnly || isDeleted ? 'disabled' : `onclick='openTaskModal(${tJson})'`}>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
								Edit
							</button>
							<button class="manage-del-btn" style="${roStyle}" ${isReadOnly || isDeleted ? 'disabled' : `onclick="deleteTask('${t.id}')"`} title="Delete task">&times;</button>
						</div>
					</div>`;
        }).join('');
}

function renderManageSites() {
    const isReadOnly = isoToday() !== S.today;
    const el = document.getElementById('manageSiteList');
    const siteList = getDay(S.today).sites || [];
    const isFutureS = S.today > isoToday();
    const currentSiteIds = isFutureS ? null : new Set(todaySites().map(s => s.id));
    if (!siteList.length) {
        el.innerHTML = '<div class="empty">No sites yet.</div>';
        return;
    }
    el.innerHTML = siteList
        .map(s => {
            const isDeleted = isReadOnly && !isFutureS && currentSiteIds && !currentSiteIds.has(s.id);
            const nameStyle = isDeleted ? 'text-decoration:line-through;color:var(--muted);' : '';
            const roStyle = isReadOnly || isDeleted ? 'opacity:0.4;cursor:not-allowed' : '';
            return `<div class="manage-task-item"${isDeleted ? ' style="opacity:0.55"' : ''}>
						<div class="site-initial" style="flex-shrink:0">${siteInitial(s.name)}</div>
						<div class="manage-task-info">
							<div class="manage-task-name" style="${nameStyle}">${esc(s.name)}</div>
							<div class="manage-task-meta">${esc(s.url)}${s.scheduleTime ? ' &middot; ' + esc(fmtAlarm(s.scheduleTime)) : ''}</div>
						</div>
						<div class="manage-task-acts">
							<button class="manage-edit-btn" style="${roStyle}" ${isReadOnly || isDeleted ? 'disabled' : `onclick="editSite('${s.id}')"`}>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
								Edit
							</button>
							<button class="manage-del-btn" style="${roStyle}" ${isReadOnly || isDeleted ? 'disabled' : `onclick="delSite('${s.id}')"`} title="Delete site">&times;</button>
						</div>
					</div>`;
        }).join('');
}

function fmtAlarm(time24) {
    if (!time24)
		return '';
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 || 12;
    return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}