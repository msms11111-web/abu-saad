# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"أبو سعد · لوحة التحكم الشخصية" (Abu Saad's Personal Dashboard) — a single-page, installable PWA in Arabic (RTL) bundling: a wooden analog/digital clock with Gregorian+Hijri dates and live prayer times, morning/evening adhkar, a unified task+calendar "Planner" (day/week/month views), a Quran reader (book UI with tafsir and audio), three live-TV links, an electronic tasbih counter, an "about me" card, a photo gallery, and social links.

There is **no build system, package manager, bundler, or test suite**. The entire app is three static files served as-is:

- `index.html` — everything: all CSS (in a `<style>` block) and all JS (in one `<script>` block at the bottom) for every feature. ~3000 lines.
- `sw.js` — the service worker (offline caching).
- `manifest.json` — PWA manifest.
- `assets/` — icons and the Quran cover image.
- `CHANGELOG.md` — human-readable release log in Arabic.

## Running / testing locally

There are no npm scripts, linters, or automated tests. To work on this app:

```bash
python3 -m http.server 8000   # or any static file server, from the repo root
```

Then open `http://localhost:8000/`. Verify changes by actually loading the page in a browser — there is no other feedback loop. When testing service-worker behavior (offline mode, cache updates), use a hard reload / "update on reload" in devtools, since `sw.js` aggressively caches `index.html`.

## Architecture inside `index.html`

Everything lives in one IIFE (`(function () { "use strict"; ... })()`), procedural style (`var`, plain functions, no framework, no modules, no JSX). Each feature area is a self-contained block of functions operating on `document.getElementById(...)` and its own state object/localStorage key — there is no shared component system or virtual DOM.

Layout is a single CSS grid (`#app`) with named `grid-template-areas` (`hero`, `time`, `adhkar`, `planner`, `quran`, `live`, `tasbih`, `about`, `gallery`, `social`), reflowed at two breakpoints (820px, 520px) for tablet/mobile. Each feature is a `.card` matching one grid area.

Key feature modules (in source order) and their entry points:
- **Clock** (`renderClock`, `buildDialTicks`) — updates every second; Hijri date via `Intl.DateTimeFormat` with the `islamic-umalqura` calendar.
- **Planner / Tasks** (`state`, `loadTasks`/`saveTasks`, `renderTasks`, `renderWeekBoard`, `renderCalendar`) — day/week/month tabs share one `tasks` array; day view groups tasks into time-of-day sections plus an "overdue" rollup. `parseSmartInput` does lightweight Arabic NLP to extract a date/time from free-text task entry (e.g. "اجتماع غدًا الساعة ٥ مساءً").
- **Quran reader** (`quranState`, `fetchSurahAyahs`, `renderQuranBook`, `goToSurah`, `handleAudio`) — fetches ayah text from `api.alquran.cloud`, tafsir from the same host, and audio from `download.quranicaudio.com` / `server7.mp3quran.net` with a fallback chain. Fetched surahs are cached per-surah in localStorage.
- **Prayer times** (`fetchPrayerTimings`, `applyPrayerTimings`, `updateNextPrayer`) — calls `api.aladhan.com` (geolocation first, Riyadh as fallback), caches one day of timings in localStorage, and highlights the next upcoming prayer on the clock card.
- **Adhkar** (`renderAdhkar`, `initAdhkar`) — switches between morning/evening dhikr sets based on time of day (`isMorningNow`).
- **Tasbih** (`tasbihData`, `renderTasbih`, `initTasbih`) — per-phrase counters with configurable targets.
- **Gallery** (`loadGallery`/`saveGallery`, `resizeImage`, `renderGallery`) — 4 fixed slots; images are resized client-side and stored as data URLs in localStorage (no backend/upload).
- **What's new / versioning** (`APP_VERSION`, `RELEASES`, whatsnew modal IIFE near the end of the script) — see Versioning below.

All persistence is `localStorage` (wrapped in try/catch everywhere since it's a client-only app) — there is no backend, no API keys of ours, no database. Every key is prefixed `abusaad_` and versioned (e.g. `abusaad_tasks_v1`); bump the suffix if you ever change a stored shape incompatibly.

Arabic numerals: UI text uses Arabic-Indic digits via the `toAr()` helper — when displaying any number to the user, route it through `toAr` (or the existing formatting helpers) rather than interpolating raw JS numbers.

## Service worker (`sw.js`)

`CACHE` is a version string (`"abusaad-vX.Y.Z"`) that **must be bumped together with `APP_VERSION`** in `index.html` — this is what busts old clients' caches on deploy. Strategy: HTML is network-first with cache fallback (so deploys show up immediately); other same-origin assets and Google Fonts are stale-while-revalidate; all other cross-origin requests (prayer times, Quran text/audio APIs) are intentionally left uncached so that live data stays fresh.

## Versioning and release notes

There are **three places to keep in sync** on every user-facing release, all in Arabic:

1. `CHANGELOG.md` — new `## vX.Y.Z — YYYY-MM-DD` entry at the top, categorized under `### جديد` (new) / `### تحسين` (improved) / `### إصلاح` (fixed).
2. The `RELEASES` array in `index.html` (near `APP_VERSION`) — same content, structured as `{ v, date, items: [[tag, text], ...] }` with `tag` one of `new`/`imp`/`fix`; this drives the in-app "ما الجديد؟" (What's New) modal, dates are written with Arabic-Indic digits.
3. `APP_VERSION` in `index.html` and `CACHE` in `sw.js` — bump both to the same new version so the "has new update" indicator and the service-worker cache-bust both fire correctly.

Follow semantic-ish versioning as already used in the changelog (major bump for structural rewrites like the v3.0.0 Planner overhaul, minor for new features, patch-ish for fixes/tweaks — see `CHANGELOG.md` for precedent).

## Conventions worth following

- RTL-first: `<html dir="rtl" lang="ar">`. New UI text should be Arabic; keep the existing gold/dark "luxury" visual language (`#C9A96A` gold, `#1A1917`/`#141312` dark backgrounds, `Amiri`/`Aref Ruqaa`/`Cormorant Garamond`/`Tajawal`/`Space Mono` fonts already loaded via Google Fonts).
- Respect `prefers-reduced-motion` (already handled globally near the top of the `<style>` block) when adding new animations.
- Don't introduce a build step, framework, or external JS dependency without discussing it first — the project's entire value proposition is a zero-dependency file that a service worker can cache and that loads instantly.
