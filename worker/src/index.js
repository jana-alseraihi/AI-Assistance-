// Cloudflare Worker: keeps the Anthropic API key secret and answers
// questions about the ECM documents using Claude.
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "../../prompt.js";

const MAX_MESSAGES = 12;
const MAX_CHARS = 2000;

// Built once; identical on every request so prompt caching can reuse it.
const SYSTEM_PROMPT = buildSystemPrompt();

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);
    if (!cors["Access-Control-Allow-Origin"]) return json({ error: "Origin not allowed" }, 403, cors);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, cors);
    }

    const messages = sanitize(body?.messages);
    if (!messages) return json({ error: "Invalid messages" }, 400, cors);

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    try {
      const response = await client.beta.messages.create({
        model: "claude-opus-5-5",
        max_tokens: 16000,
        output_config: { effort: "low" }, // short Q&A answers; raise for harder questions
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default", // if the model declines, the API retries on a fallback model
        cache_control: { type: "ephemeral" },
        system: SYSTEM_PROMPT,
        messages,
      });

      if (response.stop_reason === "refusal") {
        return json({ reply: body?.lang === "ar" ? "عذرًا، لا أستطيع المساعدة في هذا الطلب." : "Sorry, I can't help with that request." }, 200, cors);
      }

      const reply = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("")
        .trim();

      return json({ reply }, 200, cors);
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) {
        return json({ error: "Rate limited, try again shortly" }, 429, cors);
      }
      if (error instanceof Anthropic.AuthenticationError) {
        console.error("Invalid ANTHROPIC_API_KEY");
        return json({ error: "Server misconfigured" }, 500, cors);
      }
      if (error instanceof Anthropic.APIError) {
        console.error(`Anthropic API error ${error.status}: ${error.message}`);
        return json({ error: "Upstream error" }, 502, cors);
      }
      console.error(error);
      return json({ error: "Unexpected error" }, 500, cors);
    }
  },
};

// Accept only well-formed, bounded chat history from the browser.
function sanitize(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const clean = messages.slice(-MAX_MESSAGES).map((m) => ({
    role: m?.role === "assistant" ? "assistant" : "user",
    content: String(m?.content ?? "").slice(0, MAX_CHARS),
  }));
  // The conversation must start with a user turn and end with one.
  while (clean.length && clean[0].role !== "user") clean.shift();
  if (!clean.length || clean[clean.length - 1].role !== "user") return null;
  if (clean.some((m) => !m.content.trim())) return null;
  return clean;
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes("*") || allowed.includes(origin);
  return {
    ...(ok ? { "Access-Control-Allow-Origin": allowed.includes("*") ? "*" : origin } : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
  });
}
