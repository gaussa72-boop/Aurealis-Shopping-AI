const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "public");
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".svg":"image/svg+xml" };
const server = http.createServer((req,res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  if (pathname === "/health") { res.writeHead(200, {"content-type":"application/json"}); return res.end(JSON.stringify({ok:true,service:"aurealis-shopping-ai"})); }
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = path.resolve(root, requested);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file,(err,data) => {
    if (err) { res.writeHead(404, {"content-type":"text/plain"}); return res.end("Not found"); }
    res.writeHead(200, {"content-type":mime[path.extname(file)] || "application/octet-stream"});
    res.end(data);
  });
});
const port = Number(process.env.PORT || 3000);
server.listen(port, "0.0.0.0", () => console.log("Aurealis Shopping AI listening on " + port));
