import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Stamp the bundle with the code it was built from, so the settings screen can tell an old build
// from the running server. Docker builds have no .git and pass APP_COMMIT / APP_BRANCH instead.
function git(args) {
  try {
    return execFileSync('git', args, { stdio: ['ignore', 'pipe', 'ignore'], timeout: 3000 }).toString().trim();
  } catch (_) {
    return '';
  }
}

function rootVersion() {
  try {
    return JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
  } catch (_) {
    return '?';
  }
}

const appBuild = {
  version: rootVersion(),
  commit: process.env.APP_COMMIT || git(['rev-parse', '--short', 'HEAD']) || 'unknown',
  branch: process.env.APP_BRANCH || git(['rev-parse', '--abbrev-ref', 'HEAD']) || 'unknown',
  builtAt: new Date().toISOString()
};

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_BUILD__: JSON.stringify(appBuild)
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
