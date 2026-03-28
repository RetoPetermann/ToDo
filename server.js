const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'todo.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return { persons: [], projects: [], tasks: [], settings: { colorScheme: 'default' } };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON')); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // API routes
  if (pathname.startsWith('/api/')) {
    try {
      // GET /api/data - return all data
      if (pathname === '/api/data' && req.method === 'GET') {
        const data = readData();
        return sendJson(res, 200, data);
      }

      // PUT /api/data - save all data
      if (pathname === '/api/data' && req.method === 'PUT') {
        const newData = await parseBody(req);
        writeData(newData);
        return sendJson(res, 200, { ok: true });
      }

      sendJson(res, 404, { error: 'Not found' });
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
    return;
  }

  // Static files — aber NUR aus dem aktuellen Verzeichnis, keine Pfad-Traversierung
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, filePath);

  // Sicherheit: Nur Dateien im Projektverzeichnis ausliefern
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`✓ ToDo-App läuft auf http://localhost:${PORT}`);
});
