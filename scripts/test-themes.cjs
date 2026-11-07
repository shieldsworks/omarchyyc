const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { palettes } = require('../themes/palettes.json');
const base = process.env.TEST_URL || 'http://127.0.0.1:8765';
const pages = ['index', 'join', 'members', 'photos', 'merch', 'meetups'];

async function inspect(page) {
  return page.evaluate(() => {
    const css = getComputedStyle(document.documentElement);
    const value = name => css.getPropertyValue('--' + name).trim();
    const luminance = color => {
      const rgb = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16) / 255);
      return rgb.map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
        .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
    };
    const ratio = (a, b) => {
      const [dark, light] = [luminance(a), luminance(b)].sort((a, b) => a - b);
      return (light + .05) / (dark + .05);
    };
    const failures = [];
    for (const fg of ['text', 'text-secondary', 'text-muted', 'brand', 'brand-hover']) {
      for (const bg of ['bg', 'bg-deep', 'surface', 'surface-2']) {
        if (ratio(value(fg), value(bg)) < 4.5) failures.push([fg, bg]);
      }
    }
    for (const bg of ['brand', 'brand-hover']) {
      if (ratio(value('brand-ink'), value(bg)) < 4.5) failures.push(['brand-ink', bg]);
    }
    if (ratio(value('photo-credit-text'), value('photo-credit-bg')) < 4.5) failures.push(['photo credit']);
    return { failures, scheme: css.colorScheme, bg: value('bg'),
      theme: document.documentElement.dataset.theme,
      overflow: document.documentElement.scrollWidth > innerWidth };
  });
}

(async () => {
  const browser = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), headless: true });
  try {
    const context = await browser.newContext({ colorScheme: 'dark' });
    await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let combinations = 0;
    for (const width of [1280, 375]) {
      await page.setViewportSize({ width, height: 900 });
      for (const name of pages) {
        await page.goto(`${base}/${name}.html`);
        const select = page.getByRole('combobox', { name: 'Theme', exact: true });
        assert.equal(await select.count(), 1);
        assert.equal(await select.locator('option').count(), Object.keys(palettes).length + 1);
        for (const theme of ['auto', ...Object.keys(palettes)]) {
          await select.selectOption(theme);
          if (theme === 'auto') {
            for (const colorScheme of ['light', 'dark']) {
              await page.emulateMedia({ colorScheme });
              const automatic = await inspect(page);
              assert.equal(automatic.scheme, colorScheme);
              assert.deepEqual(automatic.failures, [], `${name}/auto-${colorScheme}/${width} contrast`);
            }
          }
          const result = await inspect(page);
          assert.deepEqual(result.failures, [], `${name}/${theme}/${width} contrast`);
          assert.equal(result.overflow, false, `${name}/${theme}/${width} overflow`);
          if (theme !== 'auto') {
            assert.equal(result.theme, theme);
            assert.equal(result.bg, palettes[theme].background);
            assert.equal(result.scheme, palettes[theme].mode);
          }
          combinations++;
        }
      }
    }
    await page.goto(`${base}/index.html`);
    const select = page.getByRole('combobox', { name: 'Theme', exact: true });
    await select.selectOption('auto');
    assert.equal((await inspect(page)).scheme, 'dark');
    await page.emulateMedia({ colorScheme: 'light' });
    assert.equal((await inspect(page)).scheme, 'light');
    await select.selectOption('gruvbox');
    await page.reload();
    assert.equal(await select.inputValue(), 'gruvbox');
    await page.getByRole('link', { name: 'Members', exact: true }).first().click();
    // A plain Python server needs the HTML extension, unlike Vercel clean URLs.
    if (page.url().endsWith('/members')) await page.goto(`${base}/members.html`);
    assert.equal(await select.inputValue(), 'gruvbox');
    await select.focus();
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    assert.equal(await select.inputValue(), 'catppuccin');
    assert.equal((await inspect(page)).theme, 'catppuccin');
    const second = await context.newPage();
    await second.goto(`${base}/photos.html`);
    await select.selectOption('white');
    await second.waitForFunction(() => document.documentElement.dataset.theme === 'white');
    await second.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('auto');
    await page.waitForFunction(() => !document.documentElement.dataset.theme);
    assert.equal(await page.evaluate(() => localStorage.getItem('oyc-theme')), null);
    await page.evaluate(() => localStorage.setItem('oyc-theme', 'invalid'));
    await page.reload();
    assert.equal((await inspect(page)).theme, undefined);
    await page.evaluate(() => localStorage.setItem('oyc-theme', 'catppuccin-latte'));
    await page.route('**/js/theme.js', route => route.abort());
    await page.reload();
    assert.equal((await inspect(page)).theme, 'catppuccin-latte', 'inline head applies without deferred JS');
    assert.equal((await inspect(page)).scheme, 'light');
    await page.unroute('**/js/theme.js');
    const blocked = await context.newPage();
    await blocked.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });
    });
    await blocked.goto(`${base}/merch.html`);
    await blocked.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('nord');
    assert.equal((await inspect(blocked)).theme, 'nord');
    const noJS = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'light' });
    const fallback = await noJS.newPage();
    await fallback.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    await fallback.goto(`${base}/index.html`);
    assert.equal((await inspect(fallback)).scheme, 'light');
    assert.equal(await fallback.getByRole('combobox', { name: 'Theme', exact: true }).isVisible(), false);
    await page.goto(`${base}/index.html`);
    await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('catppuccin-latte');
    await page.screenshot({ path: process.env.SCREENSHOT || '/tmp/oyc-theme-light-mobile.png', fullPage: true });
    assert.deepEqual(errors, []);
    console.log(`PASS ${combinations} page/theme/viewport combinations; contrast >=4.5:1, no overflow, keyboard, navigation, reload, cross-tab, Auto OS changes, invalid/blocked storage, inline startup, no-JS fallback.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
