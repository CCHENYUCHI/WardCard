// Which code is running: git commit and branch of the server, read once at startup.
// Docker images have no .git, so APP_COMMIT / APP_BRANCH (build args) win when they are set.
const path = require('path');
const { execFileSync } = require('child_process');
const { version } = require('../package.json');

const REPO_ROOT = path.join(__dirname, '..');
const STARTED_AT = new Date().toISOString();

function git(args, cwd = REPO_ROOT) {
  try {
    return execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'ignore'], timeout: 3000 }).toString().trim();
  } catch (_) {
    return '';
  }
}

function readBuildInfo(env = process.env, cwd = REPO_ROOT) {
  return {
    version,
    commit: env.APP_COMMIT || git(['rev-parse', '--short', 'HEAD'], cwd) || 'unknown',
    branch: env.APP_BRANCH || git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd) || 'unknown',
    startedAt: STARTED_AT,
    node: process.version,
    cwd: REPO_ROOT
  };
}

let cached;
const getBuildInfo = () => (cached ||= readBuildInfo());

module.exports = { getBuildInfo, readBuildInfo };
