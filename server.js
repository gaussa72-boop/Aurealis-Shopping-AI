const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "public");
const products = [
  {id:"aur-001",name:"Wireless Noise-Cancelling Kopfhörer",brand:"Aurealis Select",category:"Technik",price:89.90,rating:"4,8",emoji:"🎧",description:"Kabelloser Klang für unterwegs"},
  {id:"aur-002",name:"Smartwatch mit Fitness-Tracking",brand:"Nova Tech",category:"Technik",price:119.00,rating:"4,6",emoji:"⌚",description:"Aktivität und Alltag im Blick"},
  {id:"aur-003",name:"Bluetooth Lautsprecher",brand:"SoundPeak",category:"Technik",price:54.90,rating:"4,5",emoji:"🔊",description:"Kompakter Lautsprecher"},
  {id:"aur-004",name:"Minimalistische Schreibtischleuchte",brand:"Luma Home",category:"Wohnen",price:39.90,rating:"4,7",emoji:"💡",description:"Warmweißes Licht für den Arbeitsplatz"},
  {id:"aur-005",name:"Premium Bettwäsche Set",brand:"Casa Forma",category:"Wohnen",price:69.00,rating:"4,4",emoji:"🛏️",description:"Weiche Bettwäsche für erholsame Nächte"},
  {id:"aur-006",name:"Urban Everyday Hoodie",brand:"Northline",category:"Mode",price:49.90,rating:"4,6",emoji:"🧥",description:"Vielseitiger Hoodie für jeden Tag"},
  {id:"aur-007",name:"Trainingsmatte Pro",brand:"Motion Lab",category:"Sport",price:29.90,rating:"4,8",emoji:"🧘",description:"Rutschfeste Trainingsunterlage"},
  {id:"aur-008",name:"Skincare Essentials Set",brand:"Pure Ritual",category:"Beauty",price:34.90,rating:"4,5",emoji:"🧴",description:"Pflege-Set für die tägliche Routine"}
];
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".svg":"image/svg+xml" };
const server = http.createServer((req,res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/health") { res.writeHead(200, {"content-type":"application/json"}); return res.end(JSON.stringify({ok:true,service:"aurealis-shopping-ai",catalog:"demo"})); }
  if (url.pathname === "/api/products" && req.method === "GET") {
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const category = url.searchParams.get("category") || "Alle";
    const result = products.filter(p => (category === "Alle" || p.category === category) && (!q || [p.name,p.brand,p.category,p.description].join(" ").toLowerCase().includes(q)));
    res.writeHead(200, {"content-type":"application/json; charset=utf-8","cache-control":"no-store"});
    return res.end(JSON.stringify(result));
  }
  const requested = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
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
