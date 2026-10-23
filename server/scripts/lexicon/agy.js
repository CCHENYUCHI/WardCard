/**
 * Minimal client for the antigravity MCP server in .mcp.json (Streamable HTTP, JSON-RPC): ask_gemini only.
 * Lets a script hand work to Gemini and keep the answer out of the calling agent's context.
 * Behind an HTTPS proxy, run node with NODE_USE_ENV_PROXY=1 so fetch uses HTTPS_PROXY.
 */
const fs = require('fs');
const path = require('path');

const MCP_CONFIG = path.join(__dirname, '../../../.mcp.json');
const SERVER_NAME = 'antigravity-cloud';

function serverUrl(configPath = MCP_CONFIG) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const server = config.mcpServers?.[SERVER_NAME];
  if (!server?.url) throw new Error(`${configPath} has no "${SERVER_NAME}" server`);
  return server.url;
}

/** JSON-RPC messages in a response body, plain JSON or server-sent events ("data: {...}" lines) */
function parseRpcBody(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return [].concat(JSON.parse(trimmed));
  return trimmed.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5).trim()).filter(Boolean).map(l => JSON.parse(l));
}

class AgyClient {
  constructor({ url = serverUrl(), timeoutMs = 300000 } = {}) {
    this.url = url;
    this.timeoutMs = timeoutMs;
    this.sessionId = null;
    this.nextId = 1;
    this.ready = null;
  }

  async post(message) {
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
    if (this.sessionId) headers['mcp-session-id'] = this.sessionId;
    const res = await fetch(this.url, { method: 'POST', headers, body: JSON.stringify(message), signal: AbortSignal.timeout(this.timeoutMs) });
    const sid = res.headers.get('mcp-session-id');
    if (sid) this.sessionId = sid;
    const text = await res.text();
    if (!res.ok) throw new Error(`MCP HTTP ${res.status}: ${text.slice(0, 200)}`);
    return parseRpcBody(text);
  }

  async request(method, params) {
    const id = this.nextId++;
    const messages = await this.post({ jsonrpc: '2.0', id, method, params });
    const reply = messages.find(m => m.id === id);
    if (!reply) throw new Error(`MCP ${method}: no reply`);
    if (reply.error) throw new Error(`MCP ${method}: ${reply.error.message}`);
    return reply.result;
  }

  init() {
    if (!this.ready) {
      this.ready = (async () => {
        await this.request('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'palabracard-lexicon', version: '1' } });
        await this.post({ jsonrpc: '2.0', method: 'notifications/initialized' });
      })().catch(err => { this.ready = null; throw err; });
    }
    return this.ready;
  }

  /** Gemini's plain-text answer (the server's "— model · time" footer removed) */
  async ask(prompt, { model } = {}) {
    await this.init();
    let result;
    try {
      result = await this.request('tools/call', { name: 'ask_gemini', arguments: model ? { prompt, model } : { prompt } });
    } catch (err) {
      if (/session/i.test(err.message)) { this.sessionId = null; this.ready = null; } // expired session: start over next time
      throw err;
    }
    const text = (result.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n');
    if (result.isError) throw new Error(`ask_gemini: ${text.slice(0, 300)}`);
    return text.replace(/\n+— [^\n]*$/, '');
  }
}

module.exports = { AgyClient, parseRpcBody, serverUrl };

if (require.main === module) {
  const prompt = process.argv.slice(2).join(' ') || 'Say "ok".';
  new AgyClient().ask(prompt).then(t => console.log(t), err => { console.error(err.message); process.exit(1); });
}
