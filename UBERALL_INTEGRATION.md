# Uberall Listings integration

The Partner Hub Listings route reads two optional Vite environment variables:

- `VITE_UBERALL_LISTINGS_URL`: an Uberall-approved cross-origin embed or SSO URL.
- `VITE_UBERALL_LAUNCH_URL`: the external launch URL used by the fallback action.

Only HTTPS URLs are accepted. Do not include credentials, tokens, or private tenant identifiers in either value.

## Framing requirement

The standard Uberall sandbox login currently responds with `X-Frame-Options: SAMEORIGIN`. It therefore cannot be embedded by the GitHub Pages origin. Uberall must provide a supported embedding method or configure an approved URL whose `Content-Security-Policy` `frame-ancestors` directive permits the Partner Hub origin.

Until that configuration is available, the route intentionally displays the focused integration fallback rather than attempting to bypass Uberall's security headers.
