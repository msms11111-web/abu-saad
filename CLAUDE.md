# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"أبو سعد" (Abu Saad) — a personal Arabic dashboard PWA: greeting card, wooden clock with Hijri/Gregorian date and live weather, next-prayer countdown, adhkar, a full tasks app (home / calendar / add / stats / settings), Quran reader with audio and tafsir, live TV links, tasbih counter. Static site, no build step, no dependencies, no test framework. The UI language is Arabic and the whole document is RTL (`dir="rtl"`).

It is deployed on GitHub Pages at `https://msms11111-web.github.io/abu-saad/` and the owner uses it as an installed iPhone home-screen app.

## Structure

Nearly everything lives in `index.html` (~3,700 lines), in three blocks:

- **CSS** (lines ~27–780): one `<style>` block, organized by section comments (`/* ADHKAR CARD */`, `/* ===== TASKS APP ===== */`, …).
- **HTML** (lines ~780–1310): one card per feature, marked with comments (`<!-- HERO -->`, `<!-- PRAYER -->`, `<!-- TASKS -->`, `<!-- QURAN -->`, …). Each card is a `.card` div with an id (`#hero`, `#time`, `#prayer`, `#adhkar`, `#planner`, `#quran`, `#live`, `#tasbih`, `#about`, `#social-row`).
- **JS** (lines ~1314–3657): a single IIFE in one `<script>` block, organized as `init*()`/`render*()` functions per feature (`initTasksApp`, `initQuran`, `initTasbih`, `initPrayerTimes`, `initAdhkar`, `loadWeather`). A second tiny `<script>` at the end conditionally loads the GoatCounter visitor counter.

Other files:

- `sw.js` — service worker. `manifest.json` — PWA manifest. `assets/` — icons + Quran cover.
- `CHANGELOG.md` — Arabic, user-facing.
- `.github/workflows/pages.yml` — deploys to GitHub Pages on every push to `main` (GitHub's built-in "pages build and deployment" runs alongside it). If a release does not show up on the live site, check the Actions runs for that commit before touching code; the workflow can be re-run with `workflow_dispatch`.
- `game.html`, `gallery.html` — a word game and a photo gallery that were removed from the dashboard but kept as standalone pages for reuse elsewhere. They are not linked from `index.html`; don't delete them.

### The tasks app

The `#planner` card hosts a self-contained app (`.ta` root, all functions and constants prefixed `ta`/`TA_`). State is one object `TA` persisted under `abusaad_tasks_app_v1`. Views are `<section class="ta-view">` elements switched by `taSwitch()`; `taRenderCurrent()` re-renders whichever is showing. Mutations that should be undoable go through `taAct(msg, fn)`, which snapshots the task list and offers "تراجع" in the snackbar. `taParseQuick()` is the Arabic natural-language parser behind the quick-add bar; `taNorm()` (strip diacritics, unify digits/alef/yaa/taa-marbuta) is reused for search across the site.

Icons are Material Symbols Rounded ligatures in `<span class="msr">`; `taDetectIcons()` hides them (`.no-icons`) if the font failed to load. The `.ta .msr` rule only applies inside `.ta`.

## Layout system

The page is a CSS grid with named areas defined **three times** for three breakpoints (desktop 4-col, tablet 2-col ≤820px, mobile 1-col ≤520px) near the top of the CSS (`grid-template-areas`, around lines 45–56). Adding, removing, or reordering a card requires updating all three definitions plus the card's `grid-area`.

Grid items default to `min-width:auto`, so a card whose content has a wide min-content (a horizontally scrolling chip row, a long unbreakable string) will stretch its column past the screen. `#planner` carries `min-width:0` for this reason — do the same for any new card with scrolling rows.

## Versioning — always bump on user-visible changes

Three places must stay in sync on every release (v3.3.2 exists solely because one was forgotten):

1. `APP_VERSION` in `index.html` (search for `var APP_VERSION`).
2. `CACHE = "abusaad-vX.Y.Z"` in `sw.js` — a byte change in `sw.js` is what makes installed PWAs notice the release.
3. A new entry at the **top** of the `RELEASES` array in `index.html` (Arabic text, Arabic-numeral date, tags `new`/`imp`/`fix`) — this feeds the in-app "what's new" modal.

Also add a matching section to `CHANGELOG.md` (Arabic, categories **جديد / تحسين / إصلاح**).

### How an installed app gets the update

An iOS home-screen app resumes from memory instead of reloading, so it would sit on an old version for days. The self-update block at the end of the main script handles this: on every return to the app (`visibilitychange`) and hourly it calls `registration.update()`; when the new service worker takes control (`controllerchange`) the page reloads itself and shows "تم التحديث إلى الإصدار …". It never reloads while the user is typing, has the add-task form open, or is playing Quran audio — it shows a "تحديث الآن" button instead and applies on the next return. The service worker fetches the page with `cache: "no-store"` so the reload is not served from the browser's HTTP cache.

## Conventions

- Commit messages, PR titles/bodies, and changelog entries are written in **Arabic**.
- Work lands on `main` via PRs from `claude/*` branches.
- Digits shown to the user are converted to Arabic-Indic numerals via the `toAr()` helper; `pad()` and `fmt()` (local `YYYY-MM-DD`) are the other shared helpers.
- `localStorage` keys are prefixed `abusaad_` and versioned (e.g. `abusaad_tasks_app_v1`); bump the suffix when the stored shape changes. The settings backup exports/imports every `abusaad_*` key, so anything stored under that prefix is included automatically.
- All persistence is `localStorage` only — there is no server and no sync. `abusaad_quran_cache_v1_*` (surah text) is the only large, re-downloadable data; `taSave()` evicts it if the quota is hit so the user's own data always saves.
- Anything that depends on "today" must survive the app staying open across midnight: hook it into `refreshLiveData()` (runs on return to the app and on day change).
- Fonts: Tajawal (UI), Amiri (Quran text), Aref Ruqaa / Cormorant / Space Mono (display), and Material Symbols Rounded (tasks-app icons), loaded from Google Fonts — the only external origin the service worker will cache.

## External services (all client-side fetch, no keys)

- Prayer times: `api.aladhan.com` (method 4; device location, falling back to Riyadh).
- Weather in the clock: `api.open-meteo.com` (current temperature and humidity; same location).
- Quran text and tafsir: `api.alquran.cloud`. The `quran-uthmani` text prefixes the basmala to ayah 1 of every surah except 1 and 9; `stripBasmala()` removes it because the reader draws its own.
- Quran audio: `download.quranicaudio.com` / `server7.mp3quran.net` (Saud Al-Shuraim).
- Visitor counter: GoatCounter (`abusaad.goatcounter.com`), not loaded when `abusaad_skip_count` is set.

The device location is rounded to two decimals and cached for 12 hours under `abusaad_geo_v1` (`getCoords()`), shared by prayer times and weather.

The service worker deliberately never caches these APIs; HTML is network-first, static assets are stale-while-revalidate. Every feature must degrade gracefully offline (show the last cached value or a dash, never a fabricated number).

## Developing and verifying

No build, lint, or test commands — open `index.html` directly in a browser. The service worker registers only on `https:` and on `localhost`/`127.0.0.1`, so `file://` testing skips caching (what you want for UI work), while `python3 -m http.server` on localhost lets you exercise the service worker and the self-update flow.

Verify visual changes by screenshotting the affected card with headless Chromium/Playwright at a mobile viewport (~390px wide — the owner uses it on a phone) and, where relevant, checking interactive states (the Quran card's collapsed vs. expanded controls, each tasks-app view, light and dark tasks themes). Measure element bounding boxes when a change is about spacing/alignment rather than eyeballing it, and check that nothing is wider than the viewport.

Sandboxed environments usually cannot reach the external APIs or Google Fonts: mock the APIs with Playwright routes, and serve the fonts from a local copy if the screenshot needs real icons — without the icon font the tasks app correctly falls back to hiding its icons.
