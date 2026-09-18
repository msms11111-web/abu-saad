/* لقطات ثابتة لمراجعة التصميم: node preview.mjs 1.4 12.6 ... */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = process.env.PREVIEW_DIR || path.join(here, 'build', 'preview');
mkdirSync(outDir, { recursive: true });
const times = process.argv.slice(2).map(Number);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(here, 'scene.html') + '#static');
await page.evaluate(() => document.fonts.ready);
for (const t of times) {
  await page.evaluate(tt => window.__seek(tt), t);
  const f = path.join(outDir, `t${t.toFixed(2)}.png`);
  await page.screenshot({ path: f });
  console.log(f);
}
await browser.close();
