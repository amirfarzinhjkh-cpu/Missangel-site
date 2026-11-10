# GODHAND API Worker

Independent API service for GODHAND. The frontend must call this Worker; provider keys must never be exposed to the browser.

## Local setup
Install Wrangler in this directory and run `npx wrangler dev`.

Set secrets with:
```bash
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put OPENROUTER_API_KEY
```

Optional variables are configured in `wrangler.toml`. Do not commit real secrets.

## Routes
- `GET /health` — service status
- `POST /v1/chat` — AI chat with Gemini first and OpenRouter fallback

Conversation history is request-scoped and is not stored by this Worker.
