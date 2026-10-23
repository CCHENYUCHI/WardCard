const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { readBuildInfo, getBuildInfo } = require('./buildInfo');

test('APP_COMMIT / APP_BRANCH win over git (Docker images have no .git)', () => {
  const info = readBuildInfo({ APP_COMMIT: 'abc1234', APP_BRANCH: 'main' });
  assert.equal(info.commit, 'abc1234');
  assert.equal(info.branch, 'main');
  assert.match(info.version, /^\d+\.\d+\.\d+/);
  assert.equal(info.node, process.version);
});

test('outside a git checkout the version reads as unknown instead of failing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'no-git-'));
  const info = readBuildInfo({}, dir);
  assert.equal(info.commit, 'unknown');
  assert.equal(info.branch, 'unknown');
});

test('getBuildInfo is read once and reused', () => {
  assert.equal(getBuildInfo(), getBuildInfo());
  assert.ok(getBuildInfo().startedAt);
});
