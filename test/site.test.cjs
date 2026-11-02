const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const read = file => fs.readFileSync(path.join(publicDir, file), 'utf8');
const htmlFiles = fs.readdirSync(publicDir, { recursive: true })
  .filter(file => file.endsWith('.html'));
// This image was already missing before the dependency upgrade. Keep the
// article unchanged and allow only this exact reference until it is restored.
const knownMissingImage = `${path.join('2018', 'zen-of-python', 'index.html')}: /img/1/1.1.png`;

test('all generated pages contain complete HTML rather than render errors', () => {
  assert.ok(htmlFiles.length > 20);
  for (const file of htmlFiles) {
    if (/^(google|baidu)/.test(file)) continue;
    const html = read(file);
    assert.match(html, /<!DOCTYPE html>/i, file);
    assert.match(html, /<\/html>/i, file);
    assert.doesNotMatch(html, /Template render error|template not found/, file);
  }
});

test('theme configuration preserves Pisces, dark mode, copy buttons and search', () => {
  const html = read('index.html');
  const config = JSON.parse(html.match(/<script[^>]*data-name="main"[^>]*>(.*?)<\/script>/s)[1]);
  assert.equal(config.scheme, 'Pisces');
  assert.equal(config.darkmode, true);
  assert.equal(config.codeblock.copy_button.enable, true);
  assert.equal(config.localsearch.enable, true);
  assert.equal(config.path, '/search.xml');
  assert.equal(config.version, require('../themes/next/package.json').version);
});

test('local resources resolve, apart from one documented pre-existing missing image', () => {
  const missing = new Set();
  for (const file of htmlFiles) {
    for (const match of read(file).matchAll(/\b(?:href|src)="([^"<>]+)"/g)) {
      const value = match[1];
      if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) continue;
      const url = new URL(value.replaceAll('&amp;', '&'), `https://blog.jiabh.cn/${file.split(path.sep).join('/')}`);
      const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const target = path.join(publicDir, pathname);
      if (!fs.existsSync(target) || (fs.statSync(target).isDirectory() && !fs.existsSync(path.join(target, 'index.html')))) {
        missing.add(`${file}: ${value}`);
      }
    }
  }
  assert.deepEqual([...missing].filter(item => item !== knownMissingImage), []);
});

test('feeds, search, domain and verification files remain available', () => {
  assert.match(read('atom.xml'), /<feed\b/);
  assert.match(read('search.xml'), /<entry>/);
  assert.match(read('sitemap.xml'), /<urlset\b/);
  assert.equal(read('CNAME').trim(), 'blog.jiabh.cn');
  assert.ok(read('google13a891d3e1707759.html').length);
  assert.ok(read('baidu_verify_code-LGCuzW8sYh.html').length);
});

test('every published article keeps its year/title permalink', () => {
  const posts = fs.readdirSync(path.join(root, 'source', '_posts')).filter(file => file.endsWith('.md'));
  assert.ok(posts.length > 0);
  for (const file of posts) {
    const source = fs.readFileSync(path.join(root, 'source', '_posts', file), 'utf8');
    const year = source.match(/^date:\s*['"]?(\d{4})/m)?.[1];
    assert.ok(year, `Missing date: ${file}`);
    const slug = source.match(/^slug:\s*([^\r\n]+)/m)?.[1].trim() || path.basename(file, '.md');
    const html = read(`${year}/${slug}/index.html`);
    assert.match(html, /class="post-body[\s"]/);
  }
});