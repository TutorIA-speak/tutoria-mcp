# tutoria-mcp

Gives the TutorIA roleplay launcher an address on our own domain: `https://mcp.tutoria.lat/mcp`.

- A proxy rule in `netlify.toml` forwards `/mcp` to the launcher (Supabase edge function `roleplay-launcher` in the main TutorIA repo). No secrets, no data.
- `public/.well-known/openai-apps-challenge` holds the domain-verification token from the OpenAI plugin portal (plain text, token only).

Hosted on Netlify (free plan). Each production deploy uses plan credits, so keep pushes to this repo rare.
