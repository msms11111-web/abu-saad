# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"أبو سعد" (Abu Saad) — a personal Arabic dashboard PWA: clock with Hijri date, prayer times, adhkar, task planner with calendar, Quran reader with audio, live TV links, tasbih counter, a word game, and a photo gallery. Static site, no build step, no dependencies, no test framework. The UI language is Arabic and the whole document is RTL (`dir="rtl"`).

## Structure

Nearly everything lives in `index.html` (~3,600 lines), in three blocks:

- **CSS** (lines ~23–780): one `<style>` block, organized by section comments (`/* QURAN */`, `/* CLOCK */`, `/* TASBIH */`, …).
- **HTML** (lines ~780–1260): one card per feature, marked with comments (`<!-- QURAN -->`, `<!-- TASKS -->`, …). Each card is a `.card` div with an id (`#quran`, `#planner`, `#tasbih`, `#game`, …).
- **JS** (lines ~1261–3590): a single IIFE in one `<script>` block, organized as `init*()`/`render*()` functions per feature (`initQuran`, `renderCalendar`, `initGame`, …).

Other files: `sw.js` (service worker), `manifest.json` (PWA manifest), `assets/` (icons + Quran cover image), `CHANGELOG.md` (Arabic, user-facing).

## Layout system

The page is a CSS grid with named areas defined **three times** for three breakpoints (desktop 4-col, tablet 2-col, mobile 1-col) near the top of the CSS (`grid-template-areas`, around lines 41–52). Adding, removing, or reordering a card requires updating all three definitions plus the card's `grid-area`.

## Versioning — always bump on user-visible changes

Three places must stay in sync on every release (v3.3.2 exists solely because one was forgotten):

1. `APP_VERSION` in `index.html` (search for `var APP_VERSION`).
2. `CACHE = "abusaad-vX.Y.Z"` in `sw.js` — this is what forces installed PWAs and cached browsers to pick up the new version.
3. A new entry at the **top** of the `RELEASES` array in `index.html` (Arabic text, Arabic-numeral date, tags `new`/`imp`/`fix`) — this feeds the in-app "what's new" modal.

Also add a matching section to `CHANGELOG.md` (Arabic, categories **جديد / تحسين / إصلاح**).

## Conventions

- Commit messages, PR titles/bodies, and changelog entries are written in **Arabic**.
- Work lands on `main` via PRs from `claude/*` branches.
- Digits shown to the user are converted to Arabic-Indic numerals via the `toAr()` helper.
- `localStorage` keys are prefixed `abusaad_` and versioned (e.g. `abusaad_tasks_v1`); bump the suffix when the stored shape changes.
- Fonts: Tajawal (UI) and Amiri (Quran text), loaded from Google Fonts — the only external origins the service worker will cache.

## External services (all client-side fetch, no keys)

- Prayer times: `api.aladhan.com` (Riyadh, method 4).
- Quran text: `api.alquran.cloud` (cached per-surah in localStorage under `abusaad_quran_cache_v1_*`).
- Quran audio: `server7.mp3quran.net` / `download.quranicaudio.com` (Saud Al-Shuraim).

The service worker deliberately never caches these APIs; HTML is network-first, static assets are stale-while-revalidate.

## Developing and verifying

No build, lint, or test commands — open `index.html` directly in a browser (the service worker only registers on `https:`, so `file://` testing skips caching, which is what you want during development).

Verify visual changes by screenshotting the affected card with headless Chromium/Playwright at a mobile viewport (~390px wide — the owner uses it on a phone) and, where relevant, checking interactive states (e.g. the Quran card's collapsed vs. expanded controls toggle, planner tabs, the game board). Measure element bounding boxes when a change is about spacing/alignment rather than eyeballing it.
