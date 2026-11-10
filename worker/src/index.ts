interface Env {
  GEMINI_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  ALLOWED_ORIGIN: string;
  GEMINI_MODEL: string;
  OPENROUTER_MODEL: string;
}

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });

function cors(request: Request, env: Env): Headers {
  const origin = request.headers.get("Origin") ?? "";
  const headers = new Headers({ Vary: "Origin" });
  if (origin && origin === env.ALLOWED_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    headers.set("Access-Control-Max-Age", "86400");
  }
  return headers;
}

async function askGemini(prompt: string, env: Env): Promise<string> {
  if (!env.GEMINI_API_KEY) throw new Error("gemini_unavailable");
  const model = env.GEMINI_MODEL || "gemini-2.5-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: AbortSignal.timeout(25000),
    },
  );
  if (!response.ok) throw new Error("gemini_request_failed");
  const data = await response.json() as any;
  const text = data?.candidates?.[0]?.content?.parts?.map((part: any) => part.text ?? "").join("").trim();
  if (!text) throw new Error("empty_provider_response");
  return text;
}

async function askOpenRouter(prompt: string, env: Env): Promise<string> {
  if (!env.OPENROUTER_API_KEY) throw new Error("openrouter_unavailable");
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.ALLOWED_ORIGIN,
      "X-Title": "GODHAND",
    },
    body: JSON.stringify({ model: env.OPENROUTER_MODEL || "openai/gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.8 }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error("openrouter_request_failed");
  const data = await response.json() as any;
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (typeof text !== "string" || !text) throw new Error("empty_provider_response");
  return text;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = cors(request, env);
    const origin = request.headers.get("Origin");
    if (origin && origin !== env.ALLOWED_ORIGIN) return json({ error: "origin_not_allowed" }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") return json({ status: "ok", service: "godhand-api" }, 200, headers);
    if (request.method !== "POST" || url.pathname !== "/v1/chat") return json({ error: "not_found" }, 404, headers);
    const contentLength = Number(request.headers.get("Content-Length") ?? 0);
    if (contentLength > 12000) return json({ error: "request_too_large" }, 413, headers);
    let body: { message?: unknown };
    try { body = await request.json() as { message?: unknown }; }
    catch { return json({ error: "invalid_json" }, 400, headers); }
    if (typeof body.message !== "string" || !body.message.trim() || body.message.length > 4000) {
      return json({ error: "invalid_message" }, 400, headers);
    }
    const message = body.message.trim();
    try {
      const answer = await askGemini(message, env).catch(() => askOpenRouter(message, env));
      return json({ answer }, 200, headers);
    } catch {
      return json({ error: "providers_unavailable", message: "The AI service is temporarily unavailable." }, 503, headers);
    }
  },
};
