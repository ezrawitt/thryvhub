# Partner platform integrations

Thryv Hub embeds the partner-owned Listings and Advanced Reporting experiences from controlled `hub.thryv.com` subdomains:

- Listings: `https://listings.hub.thryv.com/`
- Advanced Reporting: `https://reports.hub.thryv.com/`

These are the production defaults. They can be overridden per environment with:

- `VITE_LISTINGS_EMBED_URL` and `VITE_LISTINGS_LAUNCH_URL`
- `VITE_REPORTS_EMBED_URL` and `VITE_REPORTS_LAUNCH_URL`

The older `VITE_UBERALL_LISTINGS_*` variables remain supported as a compatibility fallback. Reputation and Social retain their existing Uberall launch variables.

Only HTTPS URLs are accepted. Credentials, reusable tokens, and private tenant identifiers must not be placed in build-time URLs.

## Framing requirements

Each embedded application must allow its Thryv Hub parent origin with a `Content-Security-Policy` `frame-ancestors` directive. During the GitHub Pages prototype, that means allowing `https://ezrawitt.github.io`; in the hosted environment, allow the exact `https://hub.thryv.com` origin. Do not send a conflicting `X-Frame-Options: DENY` or `SAMEORIGIN` header.

Authentication cookies must also be compatible with the embedding context. The Hub always keeps an accessible **Open in new tab** fallback visible in case authentication or browser policy prevents the frame from loading.
