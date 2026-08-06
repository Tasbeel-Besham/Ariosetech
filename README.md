# IndexNow — instant indexing for Bing / ChatGPT / Copilot / Perplexity

2 new files. Nothing overwritten. Safe to deploy before setup — with no
`INDEXNOW_KEY` set, everything is a silent no-op.

Verified: `next build` compiles, `tsc` 0 errors, `eslint` 0 errors.

## What this is and isn't

IndexNow pushes a "this URL changed" notification to search engines instead of
waiting for a crawler. Bing, Yandex, Seznam, Naver and Yep support it.

**Google does not**, and hasn't since the protocol launched in 2021. This does
nothing for Google — sitemap and Search Console remain your only levers there.
It is also **not a ranking factor**; it affects discovery speed only.

The reason to bother: Bing's index is what ChatGPT Search and Microsoft Copilot
run on, and a significant source for Perplexity. Your buyers increasingly ask an
assistant for agency shortlists. Being in that index within minutes instead of
weeks is worth fifteen minutes of setup.

## Setup

1. Generate a key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```
2. Create `public/<key>.txt` containing exactly that key, nothing else. It must
   resolve at `https://ariosetech.com/<key>.txt`. A static file in `/public` is
   served ahead of any route, which is why it goes there and not in a handler.
3. Vercel → Settings → Environment Variables → `INDEXNOW_KEY=<key>`
4. Redeploy, then confirm the key file loads in a browser.

## Use

```bash
# everything published
curl -X POST https://ariosetech.com/api/indexnow \
  -H 'Cookie: admin_token=<your session cookie>'

# specific URLs
curl -X POST https://ariosetech.com/api/indexnow \
  -H 'Content-Type: application/json' \
  -H 'Cookie: admin_token=<your session cookie>' \
  -d '{"urls":["/blog/my-new-post"]}'
```

Auth is required — without it anyone could make your site spam the protocol,
which is how a host gets rate-limited.

## Why it isn't wired into every save

The protocol asks you to submit on real changes only. Re-submitting the whole
site every time someone fixes a typo is exactly the behaviour that gets a host
throttled. So this is deliberate: call it after publishing something new or
making a substantive update.

If you'd rather automate it, the right trigger is your publish action with the
single affected URL — not a bulk resubmit. `submitUrlsInBackground(['/blog/x'])`
from `lib/indexnow.ts` does that without delaying the response.

## Errors

- **403** — key file unreachable or contents don't match `INDEXNOW_KEY`
- **422** — a URL was off-host, or the key format was rejected

Both are logged, never thrown. A failed submission can't break an admin save.
