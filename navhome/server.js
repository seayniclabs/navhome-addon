import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const PORT = Number(process.env.INGRESS_PORT || 8099);
const SUPERVISOR_TOKEN = process.env.SUPERVISOR_TOKEN || '';
const SUPERVISOR_URL = 'http://supervisor';
const STATIC_DIR = join(import.meta.dirname, 'web');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/**
 * Browser URL for this add-on is /app/<id>_<slug> (underscores). Container HOSTNAME is <id>-<slug> (hyphens).
 * SvelteKit emits root-relative /_app/... which resolves to HA origin root → white screen under Ingress.
 */
function getHaAppBasePath() {
  const override = (process.env.NAVHOME_HA_APP_BASE || '').trim().replace(/\/$/, '');
  if (override) return override;
  if (!SUPERVISOR_TOKEN) return '';
  const host = (process.env.HOSTNAME || '').split('.')[0];
  if (!host) return '';
  return `/app/${host.replace(/-/g, '_')}`;
}

function rewriteHtmlForHaIngress(html, basePath) {
  if (!basePath) return html;
  return html
    .replace(/href="\/_app\//g, `href="${basePath}/_app/`)
    .replace(/import\("\/_app\//g, `import("${basePath}/_app/`)
    .replace(/base:\s*""/g, `base: "${basePath}"`);
}

const HA_APP_BASE = getHaAppBasePath();

async function getHaConfig() {
  try {
    const res = await fetch(`${SUPERVISOR_URL}/core/api/config`, {
      headers: { Authorization: `Bearer ${SUPERVISOR_TOKEN}` },
    });
    if (!res.ok) throw new Error(`Supervisor returned ${res.status}`);
    const config = await res.json();

    const tokenRes = await fetch(`${SUPERVISOR_URL}/auth`, {
      headers: { Authorization: `Bearer ${SUPERVISOR_TOKEN}` },
    });

    let accessToken = '';
    if (tokenRes.ok) {
      const tokenData = await tokenRes.json();
      accessToken = tokenData.data?.token || '';
    }

    const haUrl = `http://supervisor/core`;

    return {
      ha_url: haUrl,
      internal_url: config.internal_url || `http://homeassistant.local:8123`,
      access_token: accessToken,
      supervisor_token: SUPERVISOR_TOKEN,
      location_name: config.location_name || 'Home',
      version: config.version || 'unknown',
      addon_mode: true,
    };
  } catch (err) {
    console.error('Failed to get HA config from Supervisor:', err.message);
    return { addon_mode: false, error: err.message };
  }
}

function serveStatic(req, res) {
  let urlPath = new URL(req.url, 'http://localhost').pathname;

  const ingressPath = process.env.INGRESS_PATH || '';
  if (ingressPath && urlPath.startsWith(ingressPath)) {
    urlPath = urlPath.slice(ingressPath.length) || '/';
  }

  if (urlPath === '/') urlPath = '/index.html';

  const filePath = join(STATIC_DIR, urlPath);

  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const sendHtml = (buf) => {
    const raw = buf.toString('utf8');
    const body = rewriteHtmlForHaIngress(raw, HA_APP_BASE);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(body);
  };

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = readFileSync(filePath);
    if (ext === '.html') {
      sendHtml(content);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  } else {
    const indexPath = join(STATIC_DIR, 'index.html');
    if (existsSync(indexPath)) {
      sendHtml(readFileSync(indexPath));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const ingressPath = process.env.INGRESS_PATH || '';
  let pathname = url.pathname;
  if (ingressPath && pathname.startsWith(ingressPath)) {
    pathname = pathname.slice(ingressPath.length) || '/';
  }

  if (pathname === '/api/ha-config') {
    const config = await getHaConfig();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    });
    res.end(JSON.stringify(config));
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`NavHome add-on server running on port ${PORT}`);
  console.log(`Supervisor token: ${SUPERVISOR_TOKEN ? 'present' : 'MISSING'}`);
  console.log(`Ingress path: ${process.env.INGRESS_PATH || '(none)'}`);
  console.log(`HA app base (asset prefix): ${HA_APP_BASE || '(none — standalone)'}`);
});
