/* يرسم مشاهد scene.html إطارًا إطارًا ثم يجمّعها بالصوت في ملف MP4 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const TL = JSON.parse(readFileSync(path.join(here, 'timeline.json'), 'utf8'));
const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v = 'true'] = a.replace(/^--/, '').split('=');
  return [k, v];
}));

const FPS = +(args.fps || TL.fps);
const W = TL.width, H = TL.height;
const DUR = +(args.duration || TL.duration);
const OUT = path.resolve(args.out || path.join(here, 'ahli-support.mp4'));
const AUDIO = args.audio ? path.resolve(args.audio) : path.join(here, 'build', 'audio.wav');
const FFMPEG = args.ffmpeg || process.env.FFMPEG || 'ffmpeg';
const FRAMES = Math.round(DUR * FPS);

mkdirSync(path.dirname(OUT), { recursive: true });

const ffArgs = [
  '-y', '-hide_banner', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-i', 'pipe:0',
];
const hasAudio = existsSync(AUDIO);
if (hasAudio) ffArgs.push('-i', AUDIO);
ffArgs.push(
  '-c:v', 'libx264', '-preset', args.preset || 'slow', '-crf', String(args.crf || 22),
  '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
  '-r', String(FPS),
);
if (hasAudio) ffArgs.push('-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-shortest');
ffArgs.push(OUT);

const ff = spawn(FFMPEG, ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((res, rej) => {
  ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
  ff.on('error', rej);
});

const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--disable-lcd-text'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(here, 'scene.html') + '#static');
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => typeof window.__seek === 'function');

const t0 = Date.now();
for (let f = 0; f < FRAMES; f++) {
  const t = f / FPS;
  await page.evaluate(tt => window.__seek(tt), t);
  const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 60 === 0 || f === FRAMES - 1) {
    const pct = ((f + 1) / FRAMES * 100).toFixed(1);
    const el = (Date.now() - t0) / 1000;
    process.stderr.write(`\rإطار ${f + 1}/${FRAMES} (${pct}%) — ${el.toFixed(0)}ث  `);
  }
}
ff.stdin.end();
await browser.close();
await done;
process.stderr.write(`\nتم: ${OUT}\n`);
