// Temporary diagnostic: records one analytics event per request to this site
// (method, path, client name, response status) so we can see what an AI
// assistant's servers actually receive. Never the request body. Uses the
// same public analytics key the TutorIA web app ships to every browser.
const KEY = "phc_mDxB3xvrPobrkszutfdNxDvZQyKSE3XoaapVrLvEBcha";
const HOST = "https://eu.i.posthog.com/capture/";

export default async (request, context) => {
  let status = 0;
  let response;
  try {
    response = await context.next();
    status = response.status;
  } catch (e) {
    status = -1;
    response = new Response("error", { status: 502 });
  }
  const url = new URL(request.url);
  const h = (n) => (request.headers.get(n) || "").slice(0, 120);
  context.waitUntil(
    fetch(HOST, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: KEY,
        event: "mcp_edge_request",
        distinct_id: "mcp-edge-diagnostic",
        properties: {
          method: request.method,
          path: url.pathname,
          status,
          ua: h("user-agent"),
          accept: h("accept"),
          content_type: h("content-type"),
          protocol_version: h("mcp-protocol-version"),
          has_authorization: request.headers.has("authorization"),
          country: context.geo && context.geo.country && context.geo.country.code,
          $process_person_profile: false,
        },
      }),
    }).catch(() => {}),
  );
  return response;
};

export const config = { path: "/*" };
