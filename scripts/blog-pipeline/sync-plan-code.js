// Keep every ```js listing in the plan identical to the file it documents.
//
// The plan annotates each block with a `// <path>` first line (run.js puts it
// second, after the shebang). Any block whose annotation names a file that
// exists on disk gets replaced with that file's current contents. Blocks
// without a resolvable annotation are left alone.
const fs = require('node:fs');

const PLAN = 'docs/plans/2026-07-21-monthly-blog-pipeline.md';
const ANNOTATION = /^\/\/ ((?:scripts|src)\/[\w./-]+\.js)/;

const lines = fs.readFileSync(PLAN, 'utf8').split('\n');
const out = [];
let i = 0;
let synced = 0;
let skipped = 0;

while (i < lines.length) {
  if (lines[i] !== '```js') {
    out.push(lines[i]);
    i += 1;
    continue;
  }

  let close = i + 1;
  while (close < lines.length && lines[close] !== '```') close += 1;

  const block = lines.slice(i + 1, close);
  // The annotation is the first line, except in run.js where the shebang
  // must come first for the file to be executable.
  const annotationIndex = block[0] && block[0].startsWith('#!') ? 1 : 0;
  const match = block[annotationIndex] && block[annotationIndex].match(ANNOTATION);

  if (!match || !fs.existsSync(match[1])) {
    skipped += 1;
    out.push(lines[i], ...block, '```');
    i = close + 1;
    continue;
  }

  const annotation = block[annotationIndex];
  const source = fs.readFileSync(match[1], 'utf8').replace(/\n$/, '').split('\n');

  let replacement;
  if (source[0].startsWith('#!')) {
    replacement = [source[0], annotation, ...source.slice(1)];
  } else if (ANNOTATION.test(source[0])) {
    replacement = source; // file carries its own annotation already
  } else {
    replacement = [annotation, ...source];
  }

  synced += 1;
  console.log(`  synced ${match[1]} (${block.length} -> ${replacement.length} lines)`);
  out.push(lines[i], ...replacement, '```');
  i = close + 1;
}

fs.writeFileSync(PLAN, out.join('\n'));
console.log(`\n${synced} listing(s) synced, ${skipped} left alone (no resolvable file annotation)`);
