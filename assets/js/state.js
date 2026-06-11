const DAYS_SHORT = [
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri',
	'Sat',
	'Sun'
];

const LS_KEY = 'dt_data_v3';

let S = {
    today: isoToday(),
    tasks: [],
    sites: [],
    completions: {},
    timerSessions: [],
    siteVisits: [],
    siteTime: {},
    days: {},
    events: [],
    holidays: [],
    logItems: []
};

let editTaskId = null;
let editSiteId = null;

let timerSec = 0;
let timerIv = null;
let timerOn = false;
let timerPsd = false;

let alarmTimers = [];
let _openSiteTabs = {};

let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let perfYear = new Date().getFullYear();
let perfMonth = new Date().getMonth();

let perfRange = 'MONTH';
let perfNavDate = isoToday();

let calVisible = false;

let habitsRange = 'WEEK';
let habitsNavDate = isoToday();