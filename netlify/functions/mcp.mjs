// mcp.tutoria.lat/mcp → the TutorIA roleplay launcher.
//
// The launcher itself lives in the main TutorIA repo (Supabase edge function
// "roleplay-launcher"): it is public, read-only and stateless. This function
// only gives it an address on a domain TutorIA owns, which the ChatGPT plugin
// directory requires for domain verification. It forwards the request body
// and nothing else: no cookies, no credentials, no secrets live here.
const UPSTREAM = "https://txyjiacchcvnsdsjlroz.supabase.co/functions/v1/roleplay-launcher";
const MAX_BODY_BYTES = 16_000;

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }
  const body = await req.text();
  if (!body || body.length > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Invalid request" } }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body,
    });
    const text = await upstream.text();
    return new Response(text || null, {
      status: upstream.status,
      headers: text ? { "Content-Type": "application/json", "Cache-Control": "no-store" } : {},
    });
  } catch {
    return new Response(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32603, message: "Upstream unavailable" } }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/mcp" };
