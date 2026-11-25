const { timingSafeEqual } = require("node:crypto");

function json(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(payload));
}
function authorized(req) {
  const expected = process.env.ULTIMA_AGENT_SHARED_TOKEN || "";
  const supplied = req.headers["x-ultima-agent-token"] || "";
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(String(supplied));
  return a.length === b.length && timingSafeEqual(a, b);
}
async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk.toString("utf8");
    if (body.length > 12000) throw new Error("payload_too_large");
  }
  return JSON.parse(body || "{}");
}
async function handleAgentBridge(req, res) {
  const url = new URL(req.url, "http://localhost");
  if (!["/api/agent/health", "/api/agent/analyze"].includes(url.pathname)) return false;
  if (!authorized(req)) { json(res, 401, { error: "agent_authentication_required" }); return true; }
  if (url.pathname === "/api/agent/health" && req.method === "GET") {
    const ready = Boolean(process.env.OPENAI_API_KEY);
    json(res, 200, { agent_id: "aurealis_shopping", name: "Aurealis Shopping AI",
      status: ready ? "ready" : "provider_not_configured", provider_configured: ready, actions: "analysis_only" });
    return true;
  }
  if (url.pathname !== "/api/agent/analyze" || req.method !== "POST") {
    json(res, 405, { error: "method_not_allowed" }); return true;
  }
  let data;
  try { data = await readJson(req); }
  catch (error) { json(res, error.message === "payload_too_large" ? 413 : 400, { error: error.message }); return true; }
  const task = typeof data.task === "string" ? data.task.trim() : "";
  if (!task) { json(res, 400, { error: "task_required" }); return true; }
  if (task.length > 8000) { json(res, 413, { error: "task_too_large" }); return true; }
  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) { json(res, 503, { error: "provider_not_configured" }); return true; }
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  try {
    const response = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model, temperature: 0.25, messages: [
        { role: "system", content: "Du bist Aurealis Shopping AI im ULTIMA-Agentennetzwerk. Analysiere Produktvergleich, Einkauf, Preis- und Bestellprozesse transparent. Kennzeichne fehlende Live-Preisdaten. Führe keine Bestellung, Zahlung, Kontobewegung oder sonstige externe Aktion aus." },
        { role: "user", content: task }
      ] }),
      signal: AbortSignal.timeout(40000)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { json(res, 502, { error: "provider_request_failed", provider_status: response.status }); return true; }
    const answer = result?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) { json(res, 502, { error: "provider_empty_response" }); return true; }
    json(res, 200, { agent_id: "aurealis_shopping", name: "Aurealis Shopping AI", answer: answer.slice(0, 9000), model: result.model || model, actions_executed: [] });
  } catch {
    json(res, 502, { error: "agent_provider_unavailable" });
  }
  return true;
}
module.exports = { handleAgentBridge };
