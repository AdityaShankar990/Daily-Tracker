loadLocal();
getTodayDay();
loadTodayFromDays();
document.getElementById('datePicker').value = isoToday();
document.getElementById('dateLabel').textContent = fmtDateShort(isoToday());
document.getElementById('dateLabel2').textContent = fmtDate(isoToday());
renderTasks();
renderManage();
renderManageSites();
renderSessions();
renderSites();
renderLog();
updatePerfUI();
updateHabitsRangeLabel();
if (typeof gdUpdateUI === 'function')
	gdUpdateUI();
if (typeof _initCanvasPip === 'function')
	_initCanvasPip();