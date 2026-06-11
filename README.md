# Daily Tracker

A local-first productivity app and it supports **Browser extension** too.

<p align="center"><img src="demo/daily-tracker-demo1.png" width="75%"/></p>
<p align="center"><img src="demo/daily-tracker-demo2.png" width="75%"/></p>

## How it works

```
daily-tracker-unified/
├── index.html        ← Website entry point
├── popup.html        ← Extension popup (shares all the same assets)
├── manifest.json     ← Chrome/Firefox extension manifest
├── assets/           ← SHARED by both website and extension
│   ├── css/styles.css
│   └── js/           (all app logic lives here, used by both)
├── icons/            ← Extension icons
├── demo/
└── vercel.json       ← Deploy website to Vercel
```

## Run

```bash
# Open directly
open index.html

# Or with a local server
npx serve .
python3 -m http.server 3000
```

## Browser extension installation
<p align="center"><img src="demo/daily-tracker-demo3.png" width="75%"/></p>

### Chrome / Edge / Brave
1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select this folder (`daily-tracker-unified/`)
4. Pin **Daily Tracker** from the toolbar puzzle icon

### Firefox
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…** → select `manifest.json`

## Features

- **Tasks** — Daily checklist with done / partial / left states, scheduled times, day-of-week repeats
- **Timer** — Focus session timer with history and study-hours chart
- **Sites** — Quick-launch bookmarks with visit and time tracking
- **Habits** — Yes/no and numeric habit trackers with weekly/monthly history
- **Reports** — SVG study-hours chart with range navigation
- **Calendar** — Date picker with custom events and day navigation
- **Google Drive Sync** — Backup and restore via a short-lived OAuth token
- **Lofi Player** — Cassette-style music player, no external service

All data lives in `localStorage`. Nothing leaves your browser unless you use Drive sync.


## Google Drive Sync

1. Open [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Authorize scope `https://www.googleapis.com/auth/drive.file`
3. Exchange the code and copy the **Access token**
4. Paste it in **Manage → Google Drive → Connect**

Tokens expire after ~1 hour.