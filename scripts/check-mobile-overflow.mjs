/**
 * Mobile horizontal-overflow check.
 *
 * Loads the site at several phone/tablet widths and fails if the document can
 * scroll horizontally (document.scrollWidth > viewport). This is the bug class
 * where one element is sized for a wider viewport and pushes the whole page
 * wide on phones.
 *
 * Run locally:  npm i playwright && node scripts/check-mobile-overflow.mjs
 * (CI runs it automatically via .github/workflows/mobile-overflow.yml)
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const ROOT = resolve(process.cwd());
const PORT = 8799;
const WIDTHS = [320, 360, 390, 414, 768]; // iPhone SE → small tablet
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const buf = await readFile(join(ROOT, p));
    res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404); res.end('not found');
  }
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const page = await browser.newPage();
let failed = false;

for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'load' });
  await page.waitForTimeout(400); // let reveals / charts settle

  const r = await page.evaluate(() => {
    const de = document.documentElement;
    const vw = de.clientWidth;
    const overflow = de.scrollWidth - vw;
    // An element only causes PAGE overflow if no ancestor clips/scrolls it.
    const contained = (el) => {
      for (let n = el.parentElement; n; n = n.parentElement) {
        const ox = getComputedStyle(n).overflowX;
        if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') return true;
      }
      return false;
    };
    const offenders = [];
    if (overflow > 1) {
      document.querySelectorAll('body *').forEach((el) => {
        const box = el.getBoundingClientRect();
        if (box.right > vw + 1 && !contained(el)) {
          const id = el.id ? `#${el.id}` : '';
          const cls = el.className && el.className.toString ? '.' + el.className.toString().trim().split(/\s+/).join('.') : '';
          offenders.push(`${el.tagName.toLowerCase()}${id}${cls} (right=${Math.round(box.right)})`);
        }
      });
    }
    return { vw, scrollWidth: de.scrollWidth, overflow, offenders: [...new Set(offenders)].slice(0, 8) };
  });

  if (r.overflow > 1) {
    failed = true;
    console.error(`✗ ${width}px — horizontal overflow of ${r.overflow}px (scrollWidth ${r.scrollWidth} > viewport ${r.vw})`);
    r.offenders.forEach((o) => console.error(`      ↳ ${o}`));
  } else {
    console.log(`✓ ${width}px — no horizontal overflow`);
  }
}

await browser.close();
server.close();

if (failed) {
  console.error('\nMobile horizontal-overflow check FAILED.');
  process.exit(1);
}
console.log('\nMobile horizontal-overflow check passed.');
