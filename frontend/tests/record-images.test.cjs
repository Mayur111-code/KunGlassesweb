const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');

// Compile the real TS modules without adding a test runner or runtime dependency.
const cache = new Map();
function load(relativePath) {
  const filename = path.resolve(__dirname, '../src', relativePath);
  if (cache.has(filename)) return cache.get(filename);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  const localRequire = (id) => id.startsWith('@/') ? load(`${id.slice(2)}.ts`) : require(id);
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
  cache.set(filename, module.exports);
  return module.exports;
}
const { getImageUrl } = load('lib/utils.ts');
const { RecordImage } = load('components/ui/RecordImage.tsx');

test('string, object and legacy URLs resolve to the same record-owned image', () => {
  const url = 'https://ik.imagekit.io/kun/windows.jpg';
  for (const image of [url, { url }, { secureUrl: url }, { url: '', secureUrl: url }]) {
    assert.equal(getImageUrl(image), url);
    assert.match(renderToStaticMarkup(React.createElement(RecordImage, { src: image, alt: 'Windows' })), /src="https:\/\/ik.imagekit.io\/kun\/windows.jpg"/);
  }
});
test('external HTTPS URLs are not rewritten or restricted to ImageKit', () => {
  const url = 'https://cdn.example.com/project.jpg';
  assert.equal(getImageUrl({ url }), url);
});
test('ImageKit filePath support is preserved', () => {
  const previous = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/kun/';
  try { assert.equal(getImageUrl({ filePath: '/projects/one.jpg' }), 'https://ik.imagekit.io/kun/projects/one.jpg'); }
  finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    else process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT = previous;
  }
});
test('missing media renders an intentional neutral fallback, never an empty img', () => {
  for (const src of [null, undefined, '', { url: '' }]) {
    const html = renderToStaticMarkup(React.createElement(RecordImage, { src, alt: 'Project' }));
    assert.match(html, /Photography coming soon/);
    assert.doesNotMatch(html, /<img/);
  }
});
test('independent records retain distinct image URLs', () => {
  const images = ['https://example.com/one.jpg', 'https://example.com/two.jpg'];
  images.forEach((url, index) => {
    const html = renderToStaticMarkup(React.createElement(RecordImage, { src: url }));
    assert.ok(html.includes(url));
    assert.ok(!html.includes(images[1 - index]));
  });
});
test('parallax background has explicit absolute positioning, not conflicting utilities', () => {
  const { ParallaxImage } = load('components/motion/ParallaxImage.tsx');
  const html = renderToStaticMarkup(React.createElement(ParallaxImage, {
    src: 'https://example.com/cover.jpg', alt: '', position: 'absolute', className: 'inset-0 h-full w-full',
  }));
  assert.match(html, /style="position:absolute"/);
  assert.doesNotMatch(html, /class="[^"]*relative/);
});
