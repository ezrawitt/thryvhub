# Uberall Listings integration

The Partner Hub Brand Presence routes use explicit, product-specific integration modes:

- `VITE_UBERALL_LISTINGS_EMBED_URL` and `VITE_UBERALL_LISTINGS_LAUNCH_URL`
- `VITE_UBERALL_REPUTATION_EMBED_URL` and `VITE_UBERALL_REPUTATION_LAUNCH_URL`
- `VITE_UBERALL_SOCIAL_EMBED_URL` and `VITE_UBERALL_SOCIAL_LAUNCH_URL`

An approved embed URL renders the framed integration. A launch URL renders the secure-launch handoff with the active organization and scope. If neither is configured, the route shows an explicit unavailable state.

Only HTTPS URLs are accepted. Do not include credentials, tokens, or private tenant identifiers in these values.

## Framing requirement

The configured Listings, Crossfeed, and Posting URLs redirect unauthenticated sessions to Uberall login. Those responses currently include `X-Frame-Options: SAMEORIGIN`, so Chrome cannot display them inside the GitHub Pages origin. Uberall must provide a supported embedding method or configure an approved URL whose `Content-Security-Policy` `frame-ancestors` directive permits the Partner Hub origin.

Until that configuration is available, the route intentionally displays the focused integration fallback rather than attempting to bypass Uberall's security headers.
