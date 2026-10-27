const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const PORT = 5055;
const DIST_DIR = path.resolve(__dirname, '../frontend/dist');
const OUT_DIR = 'C:/Users/damia/.gemini/antigravity/brain/ab15ca5b-328c-4ee4-8e25-34b50c0cc135/screenshots';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const USER_DATA_DIR = path.join(os.tmpdir(), 'chrome_visual_test_' + Date.now());

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.glb': 'model/gltf-binary',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function capture(tab, outFilename, width, height) {
  const outPath = path.join(OUT_DIR, outFilename);
  const url = `http://127.0.0.1:${PORT}/?tab=${tab}#${tab}`;
  const args = [
    '--headless=new',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${width},${height}`,
    `--screenshot=${outPath}`,
    url
  ];
  console.log(`Capturing ${tab} (${width}x${height}) -> ${outFilename}`);
  try {
    execFileSync(CHROME_PATH, args, { stdio: 'inherit', timeout: 8000 });
    const stat = fs.statSync(outPath);
    console.log(`✓ Generated ${outFilename}: ${stat.size} bytes`);
  } catch (e) {
    console.error(`Failed to capture ${outFilename}: ${e.message}`);
  }
}

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Static server running at http://127.0.0.1:${PORT}`);
  await sleep(500);

  const testCases = [
    // 1. Web View (1280x900) - Centered mobile format in modern web page
    { tab: 'home', width: 1280, height: 900, name: 'web_view_home_centered.png' },
    { tab: 'garage', width: 1280, height: 900, name: 'web_view_garage_2cols.png' },
    { tab: 'fuel', width: 1280, height: 900, name: 'web_view_fuel_uniform_button.png' },
    { tab: 'services', width: 1280, height: 900, name: 'web_view_services_uniform.png' },
    { tab: 'telemetry', width: 1280, height: 900, name: 'web_view_telemetry_uniform.png' },

    // 2. Focused Mobile View (430x932)
    { tab: 'home', width: 430, height: 932, name: 'mobile_home_header.png' },
    { tab: 'garage', width: 430, height: 932, name: 'mobile_garage_cards.png' },
    { tab: 'fuel', width: 430, height: 932, name: 'mobile_fuel_actions.png' },
  ];

  for (const tc of testCases) {
    capture(tc.tab, tc.name, tc.width, tc.height);
    await sleep(200);
  }

  console.log('Visual test capture completed successfully!');
  server.close();
  try {
    fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
  } catch (_) {}
  process.exit(0);
});
