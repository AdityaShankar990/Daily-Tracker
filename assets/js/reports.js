(function () {
    if (document.getElementById('__css_reports'))
		return;
    const s = document.createElement('style');
    s.id = '__css_reports';
    s.textContent = `
		.week-grid {
			display: grid;
			grid-template-columns: repeat(7,1fr);
			gap: 6px;
		}

		.day-col {
			text-align: center;
		}

		.day-lbl {
			font-size: 10px;
			font-weight: 700;
			color: var(--muted);
			margin-bottom: 8px;
			letter-spacing: .05em;
			text-transform: uppercase;
		}

		.bar-wrap {
			height: 80px;
			display: flex;
			align-items: flex-end;
			justify-content: center;
		}

		.bar {
			width: 22px;
			border-radius: 3px 3px 0 0;
			min-height: 3px;
			transition: height .45s ease;
			background: linear-gradient(180deg, var(--accent), rgba(124,106,247,.25));
		}

		.bar.today {
			background: linear-gradient(180deg, var(--a2), rgba(232,147,74,.25));
		}

		.day-pct {
			font-size: 10px;
			color: var(--muted);
			font-family: var(--mono);
			margin-top: 4px;
		}

		.day-min {
			font-size: 10px;
			color: var(--a3);
			font-family: var(--mono);
		}

		.perf-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 6px;
		}

		.perf-month-nav {
			display: flex;
			align-items: center;
			gap: 6px;
		}

		.perf-month-btn {
			background: var(--surf2);
			border: 1px solid var(--border);
			border-radius: 7px;
			color: var(--text);
			font-size: 13px;
			font-weight: 600;
			padding: 5px 12px;
			cursor: pointer;
			transition: background .14s;
			display: flex;
			align-items: center;
			gap: 6px;
		}

		.perf-month-btn:hover {
			background: var(--border);
		}

		.perf-month-btn svg {
			width: 12px;
			height: 12px;
			stroke: var(--muted);
		}

		.perf-range-btns {
			display: flex;
			gap: 4px;
		}

		.perf-range-btn {
			padding: 4px 10px;
			font-size: 12px;
			font-family: var(--mono);
			border: 1px solid var(--border);
			background: none;
			color: var(--muted);
			border-radius: 5px;
			cursor: pointer;
			transition: all .14s;
		}

		.perf-range-btn.active {
			background: var(--surf2);
			color: var(--text);
		}

		.perf-daterange {
			font-size: 12px;
			color: var(--muted);
			font-family: var(--mono);
			margin-bottom: 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.perf-updated {
			font-size: 11px;
			color: var(--muted);
		}

		#monthPerformanceChart {
			width: 100%;
			height: 240px;
		}

		.perf-stats {
			display: grid;
			grid-template-columns: repeat(4,1fr);
			gap: 0;
			border-top: 1px solid var(--border);
			margin-top: 14px;
			padding-top: 14px;
		}

		.perf-stat {
			text-align: left;
			padding: 0 clamp(8px,2vw,20px);
			border-right: 1px solid var(--border);
		}

		.perf-stat:last-child {
			border-right: none;
			padding-right: 0;
		}

		.perf-stat:first-child {
			padding-left: 0;
		}

		.perf-stat-lbl {
			font-size: 10px;
			text-transform: uppercase;
			letter-spacing: .07em;
			color: var(--muted);
			font-weight: 700;
			margin-bottom: 6px;
		}

		.perf-stat-val {
			font-size: clamp(16px,3.5vw,22px);
			font-weight: 800;
			line-height: 1;
			font-family: var(--mono);
		}

		.perf-stat-unit {
			font-size: 11px;
			font-weight: 500;
			color: var(--muted);
			margin-left: 2px;
		}

		.perf-stat-sub {
			font-size: 11px;
			color: var(--muted);
			font-family: var(--mono);
			margin-top: 4px;
		}

		@media(max-width:600px) {
			.perf-stats {
				grid-template-columns: repeat(2,1fr);
				gap: 14px;
				row-gap: 16px;
			}
			.perf-stat {
				border-right: none;
				padding: 0;
			}
		}

		.val-today {
			color: var(--text);
		}

		.val-high {
			color: var(--a2);
		}

		.val-low {
			color: var(--text);
		}

		.val-avg {
			color: var(--text);
		}

		.perf-today-label {
			font-size: 11px;
			color: var(--muted);
			font-family: var(--mono);
			margin-bottom: 10px;
		}

		@media(max-width:560px) {
			.perf-header {
				flex-direction: column;
				align-items: flex-start;
				gap: 10px;
			}
			.perf-range-btns {
				align-self: flex-end;
			}
		}

		@media(max-width:480px) {
			.perf-month-nav {
				gap: 4px;
			}
			.perf-month-btn {
				padding: 5px 10px;
				font-size: 12px;
			}
		}

		@media(max-width:400px) {
			.day-lbl {
				font-size: 9px;
			}
			.bar {
				width: 10px;
			}
			.day-pct,
			.day-min {
				font-size: 9px;
			}
		}`;
    document.head.appendChild(s);
})();

function getDayTimerMins(dateKey) {
    const data = S.days[dateKey] || {};
    const sessions = data.timerSessions || [];
    return sessions.reduce((a, s) => a + s.durationMin, 0);
}

function fmtHrs(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}.${String(m).padStart(2, '0')} hrs`;
}

function fmtHrsShort(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0)
		return `${m}m`;
    if (m === 0)
		return `${h}h`;
    return `${h}h ${m}m`;
}

async function loadWeekly() {
    updatePerfUI();
    drawPerformanceChart();
}

function perfNav(dir) {
    if (perfRange === 'WEEK') {
        const d = new Date(perfNavDate + 'T12:00:00');
        d.setDate(d.getDate() + dir * 7);
        perfNavDate = d.toISOString().slice(0, 10);
    } else {
        perfMonth += dir;
        if (perfMonth < 0) {
            perfMonth = 11;
            perfYear--;
        }
        if (perfMonth > 11) {
            perfMonth = 0;
            perfYear++;
        }
        perfNavDate = `${perfYear}-${String(perfMonth + 1).padStart(2, '0')}-01`;
    }
    updatePerfUI();
    drawPerformanceChart();
}

function setPerfRange(r, el) {
    perfRange = r;
    document.querySelectorAll('.perf-range-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    updatePerfUI();
    drawPerformanceChart();
}

function updatePerfUI() {
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
    const now = new Date();
    if (perfRange === 'WEEK') {
        const d = new Date(perfNavDate + 'T12:00:00');
        const dow = d.getDay();
        const mon = new Date(d);
        mon.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);
        const fmtD = dt => dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        document.getElementById('perfMonthBtn').textContent = fmtD(mon) + ' – ' + fmtD(sun);
        document.getElementById('perfRangeLabel').textContent = fmtD(mon) + ' – ' + fmtD(sun) + ', ' + mon.getFullYear();
    } else {
        document.getElementById('perfMonthBtn').textContent = monthNames[perfMonth] + ' ' + perfYear;
        const daysInMonth = new Date(perfYear, perfMonth + 1, 0).getDate();
        const s = `${monthNames[perfMonth].slice(0, 3)} 01 – ${monthNames[perfMonth].slice(0, 3)} ${String(daysInMonth).padStart(2, '0')}, ${perfYear}`;
        document.getElementById('perfRangeLabel').textContent = s;
    }
}

function drawPerformanceChart(){
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
    let dataPoints = [];
    if (perfRange === 'WEEK') {
        const d = new Date(perfNavDate + 'T12:00:00');
        const dow = d.getDay();
        const mon = new Date(d);
        mon.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
        for (let i = 0; i < 7; i++) {
            const day = new Date(mon);
            day.setDate(mon.getDate() + i);
            const dateKey = day.toISOString().slice(0, 10);
            let mins = getDayTimerMins(dateKey);
            if (dateKey === today)
				mins = S.timerSessions.reduce((a, s) => a + s.durationMin, 0);
            const lbl = day.toLocaleDateString('en-IN', { weekday: 'short' });
            dataPoints.push({ dateKey, mins, label: lbl });
        }
    } else {
        const daysInMonth = new Date(perfYear, perfMonth + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${perfYear}-${String(perfMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            let mins = getDayTimerMins(dateKey);
            if (dateKey === today)
				mins = S.timerSessions.reduce((a, s) => a + s.durationMin, 0);
            dataPoints.push({ dateKey, mins, label: String(day) });
        }
    }

    const w = 900;
    const h = 240;
    const pl = 46;
    const pr = 20;
    const pt = 14;
    const pb = 34;
    const chartW = w - pl - pr;
    const chartH = h - pt - pb;
    const maxMins = 1440;
    const yHours = [0, 6, 12, 18, 24];

    const yLines = yHours.map(hr => {
        const mins = hr * 60;
        const y = pt + chartH - (mins / maxMins) * chartH;
        return `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="#2a2a35" stroke-width="1" stroke-dasharray="${hr === 0 ? 'none' : '4,4'}"/>
				<text x="${pl - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="#6868a0" font-family="DM Mono,monospace">${hr}h</text>`;
	});

    const n = dataPoints.length;
    const pts = dataPoints.map((d, i) => {
        const x = pl + (i / Math.max(n - 1, 1)) * chartW;
        const y = pt + chartH - (d.mins / maxMins) * chartH;
        return { x, y, d, i };
    });

    let chartSvgContent = '';
    const todayIdx = dataPoints.findIndex(d => d.dateKey === today);
    {
        const COLOR_PAST = '#6868a0';
        const COLOR_TODAY = '#00c48c';

        const todayI = dataPoints.findIndex(d => d.dateKey === today);
        const firstDate = dataPoints[0]?.dateKey || '';
        const lastDate = dataPoints[n - 1]?.dateKey || '';
        const allFuture = firstDate > today;
        const allPast = lastDate < today;
        const splitI = todayI >= 0 ? todayI : allPast ? n - 1 : -1;

        let pastPts = allFuture ? [] : pts.slice(0, splitI + 1);

        const firstDataI = pastPts.findIndex(p => {
            if (p.d.dateKey === today)
				return S.timerSessions.length > 0 || p.d.mins > 0;
            const dayData = S.days[p.d.dateKey];
            return dayData && dayData.timerSessions && dayData.timerSessions.length > 0;
        });

        if (firstDataI === -1 && !allFuture) {
            pastPts = [];
        } else if (firstDataI > 0) pastPts = pastPts.slice(firstDataI);

        const futurePts = allPast ? [] : splitI >= 0 ? pts.slice(splitI) : pts;
        const botY = pt + chartH;

        let defs = `<defs>
						<linearGradient id="gradPast" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color="#6868a0" stop-opacity=".25"/>
							<stop offset="100%" stop-color="#6868a0" stop-opacity="0"/>
						</linearGradient>
					</defs>`;

        let pastArea = '';
        let pastLine = '';
        if (pastPts.length > 1) {
            const areaStr =`${pastPts[0].x},${botY} ` + pastPts.map(p => `${p.x},${p.y}`).join(' ') + ` ${pastPts[pastPts.length - 1].x},${botY}`;
            pastArea = `<polygon points="${areaStr}" fill="url(#gradPast)"/>`;
            pastLine = `<polyline points="${pastPts.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="${COLOR_PAST}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
        }

        const firstDataDate = pastPts.length > 0 ? pastPts[0].d.dateKey : today;
        const dots = pts
            .map(p => {
                const isToday = p.d.dateKey === today;
                const isFuture = p.d.dateKey > today;
                const isBeforeStart = p.d.dateKey < firstDataDate;
                if (isFuture || isBeforeStart)
					return '';
                const col = isToday ? COLOR_TODAY : COLOR_PAST;
                const r = isToday ? 6 : 3;
                const stroke = isToday ? '#0d0d0f' : 'none';
                return `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${col}" stroke="${stroke}" stroke-width="2"/>`;
            }).join('');
        chartSvgContent = defs + pastArea + pastLine + dots;
        if (n === 1 && !allFuture) {
            chartSvgContent = `<circle cx="${pts[0].x}" cy="${pts[0].y}" r="5" fill="${COLOR_PAST}"/>`;
        }
        let labelIdxs = [];
        if (n <= 7)
			labelIdxs = pts.map((_, i) => i);
        else
			labelIdxs = [0, Math.floor(n / 4), Math.floor(n / 2), Math.floor((3 * n) / 4), n - 1];
        const xLabels = labelIdxs.map(i => {
            const pt = pts[i];
            let lbl = pt.d.label;
            if (perfRange === 'MONTH')
				lbl = `${monthNames[perfMonth].slice(0, 3)} ${lbl}`;
            return `<text x="${pt.x}" y="${h - 4}" text-anchor="middle" font-size="10" fill="#6868a0" font-family="DM Mono,monospace">${lbl}</text>`;
        });
        chartSvgContent += xLabels.join('');
    }

    document.getElementById('monthPerformanceChart').innerHTML = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:240px">${yLines.join('')}${chartSvgContent}</svg>`;
    function fmtDateSub(dateKey) {
        if (!dateKey)
			return '';
        const d = new Date(dateKey + 'T12:00:00');
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    let todayMins = 0;
    {
        const todayPt = dataPoints.find(d => d.dateKey === today);
        todayMins = todayPt ? todayPt.mins : S.timerSessions.reduce((a, s) => a + s.durationMin, 0);
    }

    const daysInCurMonth = new Date(perfYear, perfMonth + 1, 0).getDate();
    let mHighMins = 0;
    let mLowMins = null;
    let mSumMins = 0;
    let mCountDays = 0;
    let mHighDate = '';
    let mLowDate = '';
    for (let day = 1; day <= daysInCurMonth; day++) {
        const dk = `${perfYear}-${String(perfMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let mins = getDayTimerMins(dk);
        if (dk === today)
			mins = S.timerSessions.reduce((a, s) => a + s.durationMin, 0);
        if (mins > mHighMins) {
            mHighMins = mins;
            mHighDate = dk;
        }
        if (mins > 0 && (mLowMins === null || mins < mLowMins)) {
            mLowMins = mins;
            mLowDate = dk;
        }
        mSumMins += mins;
        if (mins > 0)
			mCountDays++;
    }
    if (mLowMins === null)
		mLowMins = 0;
    const mAvgMins = mCountDays > 0 ? Math.round(mSumMins / mCountDays) : 0;
    const monthNames2 = [
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
    const curMonthLabel = monthNames2[perfMonth].slice(0, 3) + ' ' + perfYear;
    document.getElementById('perfStats').innerHTML = `
		<div class="perf-stat">
			<div class="perf-stat-lbl">TODAY</div>
			<div class="perf-stat-val val-today">${fmtHrs(todayMins)}</div>
			<div class="perf-stat-sub">Today, ${fmtDateSub(today)}</div>
		</div>
		<div class="perf-stat">
			<div class="perf-stat-lbl">HIGHEST</div>
			<div class="perf-stat-val val-high">${fmtHrs(mHighMins)}</div>
			<div class="perf-stat-sub" style="color:var(--a2)">${mHighDate ? fmtDateSub(mHighDate) : '—'}</div>
		</div>
		<div class="perf-stat">
			<div class="perf-stat-lbl">LOWEST</div>
			<div class="perf-stat-val val-low">${fmtHrs(mLowMins)}</div>
			<div class="perf-stat-sub">${mLowDate ? fmtDateSub(mLowDate) : '—'}</div>
		</div>
		<div class="perf-stat">
			<div class="perf-stat-lbl">AVERAGE</div>
			<div class="perf-stat-val val-avg">${fmtHrs(mAvgMins)}</div>
			<div class="perf-stat-sub">${curMonthLabel}</div>
		</div>`;
}