// Live SSE simulator
// Usage: `node live_sse_server.js` then GET http://localhost:8080/stream
const http = require('http'); const fs = require('fs'); const path = require('path');
const DATA_PATH = path.join(__dirname, 'device_stream_20min.jsonl');
const lines = fs.readFileSync(DATA_PATH, 'utf-8').trim().split('\n');
const server = http.createServer((req, res) => {
  if (req.url === '/stream') {
    res.writeHead(200, {'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive','Access-Control-Allow-Origin':'*'});
    let i = 0; const send = () => { res.write(`data: ${lines[i]}\n\n`); i = (i+1)%lines.length; };
    send(); const t = setInterval(send, 1000); req.on('close', () => clearInterval(t));
  } else { res.writeHead(200, {'Content-Type':'text/plain'}); res.end('OK. Use /stream for SSE.'); }
});
server.listen(8080, () => console.log('SSE at http://localhost:8080/stream'));
