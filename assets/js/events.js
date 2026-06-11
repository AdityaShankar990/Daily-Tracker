// wires up all inline handlers removed for MV3 CSP compliance
document.addEventListener('DOMContentLoaded', function () {
    var lofiBtn = document.getElementById('lofiBtn');
    if (lofiBtn)
		lofiBtn.addEventListener('click', function () {
			lofiToggle();
		});

    var dateChevronBtn = document.getElementById('dateChevronBtn');
    if (dateChevronBtn)
		dateChevronBtn.addEventListener('click', function (e) {
			toggleCal(e);
		});

    var datePicker = document.getElementById('datePicker');
    if (datePicker)
		datePicker.addEventListener('change', function () {
			onDateChange();
		});

    var calBackdrop = document.getElementById('calBackdrop');
    if (calBackdrop)
		calBackdrop.addEventListener('click', function () {
			closeCal();
		});

    document.querySelectorAll('.tab-btn').forEach(function (btn) {
        var tab = btn.textContent.trim().toLowerCase();
        var tabMap = {
			tasks: 'tasks',
			timer: 'timer',
			sites: 'sites',
			reports: 'weekly',
			manage: 'manage'
		};
        var tabId = tabMap[tab] || tab;
        btn.addEventListener('click', function () {
			switchTab(tabId, btn);
		});
    });

    var btnStart = document.getElementById('btnStart');
    if (btnStart)
		btnStart.addEventListener('click', function () {
			timerStart();
		});

    var btnPause = document.getElementById('btnPause');
    if (btnPause)
		btnPause.addEventListener('click', function () {
			timerPause();
		});

    var btnResume = document.getElementById('btnResume');
    if (btnResume)
		btnResume.addEventListener('click', function () {
			timerResume();
		});

    var btnStop = document.getElementById('btnStop');
    if (btnStop)
		btnStop.addEventListener('click', function () {
			timerStop();
		});

    var pipBtn = document.getElementById('pipBtn');
    if (pipBtn)
		pipBtn.addEventListener('click', function () {
			togglePip();
		});

    var pipCloseBtn = document.getElementById('pipCloseBtn');
    if (pipCloseBtn)
		pipCloseBtn.addEventListener('click', function () {
			togglePip();
		});

    var pipPauseBtnEl = document.getElementById('pipPauseBtn');
    if (pipPauseBtnEl)
		pipPauseBtnEl.addEventListener('click', function () {
			timerPause();
		});

    var pipResumeBtn = document.getElementById('pipResumeBtn');
    if (pipResumeBtn)
		pipResumeBtn.addEventListener('click', function () {
			timerResume();
		});

    var pipStopBtn = document.getElementById('pipStopBtn');
    if (pipStopBtn)
		pipStopBtn.addEventListener('click', function () {
			timerStop();
		});

    var pipWindow = document.getElementById('pipWindow');
    if (pipWindow)
		pipWindow.addEventListener('mousedown', function (e) {
			pipDragStart(e);
		});

    document.querySelectorAll('.perf-month-btn').forEach(function (btn) {
        var parent = btn.closest('.perf-header');
        if (!parent)
			return;
        var section = btn.closest('.tab-panel, .card');
        var isHabits = section && section.querySelector('#habitsRangeLabel');
        var idx = Array.from(parent.querySelectorAll('.perf-month-btn')).indexOf(btn);
        if (isHabits) {
            btn.addEventListener('click', function () { habitsNav(idx === 0 ? -1 : 1); });
        } else {
            btn.addEventListener('click', function () { perfNav(idx === 0 ? -1 : 1); });
        }
    });

    document.querySelectorAll('.perf-range-btn').forEach(function (btn) {
        var label = btn.textContent.trim().toUpperCase();
        var section = btn.closest('.tab-panel, .card');
        var isHabits = section && section.querySelector('#habitsRangeLabel');
        btn.addEventListener('click', function () {
            if (isHabits) {
                setHabitsRange(label, btn);
            } else {
                setPerfRange(label, btn);
            }
        });
    });

    var addLogItemBtn = document.querySelector('#tab-habits .btn.primary.sm, .btn[data-action="addLogItem"]');
    document.querySelectorAll('.btn.primary.sm').forEach(function (btn) {
        if (btn.textContent.trim() === 'Add Habit') {
            btn.addEventListener('click', function () {
				addLogItem();
			});
        }
    });

    document.querySelectorAll('.btn.primary').forEach(function (btn) {
        var txt = btn.textContent.trim();
        if (txt === 'Add Task')
			btn.addEventListener('click', function () { openTaskModal(); });
        if (txt === 'Add Site')
			btn.addEventListener('click', function () { openSiteModal(); });
    });

    document.querySelectorAll('.btn').forEach(function (btn) {
        var txt = btn.textContent.trim();
        if (txt === 'Connect')
			btn.addEventListener('click', function () {
				gdConnect();
			});
        if (txt === 'Save to Drive')
			btn.addEventListener('click', function () {
				gdPush();
			});
        if (txt === 'Restore from Drive')
			btn.addEventListener('click', function () {
				gdPull();
			});
        if (txt === 'Export JSON')
			btn.addEventListener('click', function () {
				exportData();
			});
        if (txt === 'Import JSON')
			btn.addEventListener('click', function () {
				importData();
			});
    });

    var gdDisconnectBtn = document.getElementById('gdDisconnectBtn');
    if (gdDisconnectBtn)
		gdDisconnectBtn.addEventListener('click', function () {
			gdDisconnect();
		});

    var importFile = document.getElementById('importFile');
    if (importFile)
		importFile.addEventListener('change', function (e) {
			handleImport(e);
		});

    var tSchedStart = document.getElementById('tSchedStart');
    if (tSchedStart)
		tSchedStart.addEventListener('input', function () {
			calcSchedEnd();
		});

    var mTask = document.getElementById('mTask');
    if (mTask) {
        var mTaskBtns = mTask.querySelectorAll('.btn-row .btn');
        mTaskBtns.forEach(function (btn) {
            if (btn.classList.contains('primary'))
				btn.addEventListener('click', function () {
					saveTask();
				});
            else
				btn.addEventListener('click', function () {
					closeMTask();
				});
        });
    }

    var mSite = document.getElementById('mSite');
    if (mSite) {
        var mSiteBtns = mSite.querySelectorAll('.btn-row .btn');
        mSiteBtns.forEach(function (btn) {
            if (btn.classList.contains('primary'))
				btn.addEventListener('click', function () {
					saveSite();
				});
            else
				btn.addEventListener('click', function () {
					closeMSite();
				});
        });
    }

    var calNavBtns = document.querySelectorAll('.cal-nav-btn');
    if (calNavBtns[0])
		calNavBtns[0].addEventListener('click', function () {
			calNav(-1);
		});
    if (calNavBtns[1])
		calNavBtns[1].addEventListener('click', function () {
			calNav(1);
		});

    var addEventBtn = document.querySelector('.add-event-btn');
    if (addEventBtn)
		addEventBtn.addEventListener('click', function () {
			toggleEventForm();
		});

    var addEventSubmitBtn = document.getElementById('addEventSubmitBtn');
    if (addEventSubmitBtn) addEventSubmitBtn.addEventListener('click', function () {
		addEvent();
	});

    var eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.querySelectorAll('.btn.sm').forEach(function (btn) {
            if (btn.textContent.trim() === 'Cancel') {
                btn.addEventListener('click', function () {
					toggleEventForm();
				});
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMTask && closeMTask();
            closeMSite && closeMSite();
            closeCal && closeCal();
        }
    });
});